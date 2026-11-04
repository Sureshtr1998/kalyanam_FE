import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Stat } from "@/components/staff/StaffStats";
import { MemberSheet } from "@/components/staff/MemberSheet";
import { inr } from "@/components/staff/staffTypes";
import api from "@/utils/api";
import { formatInstant } from "@/lib/dates";
import { errorMessage } from "@/lib/errors";

/** GET /manage/member-referrals (kalyanam_BE/src/routes/auth/manage.js). */
interface ReferralRow {
  _id: string;
  name: string;
  uniqueId: string;
  joinedAt: string;
  paid: number;
  code?: string;
  referrer: { _id: string; name: string; uniqueId: string } | null;
  reward: { amount: number; status: "processing" | "paid" | "pending"; paidAt: string | null; note: string | null } | null;
}

interface ReferralPage {
  rows: ReferralRow[];
  total: number;
  totalPages: number;
  totals: { joined: number; paid: number; due: number };
}

const REWARD: Record<NonNullable<ReferralRow["reward"]>["status"], { label: string; className: string }> = {
  paid: { label: "Paid", className: "border-success/40 text-success" },
  processing: { label: "Refund in progress", className: "border-gold/60 text-gold-foreground" },
  pending: { label: "Due · pay by hand", className: "border-destructive/40 text-destructive" },
};

const Person = ({ name, uniqueId, onOpen }: { name?: string; uniqueId?: string; onOpen: () => void }) => (
  <button type="button" onClick={onOpen} className="text-left hover:text-primary">
    <p className="font-medium underline-offset-2 hover:underline">{name || "-"}</p>
    <p className="font-mono text-xs text-muted-foreground">{uniqueId}</p>
  </button>
);

/** Admin: who joined with a member's refer & earn code, and who referred them. */
export const MemberReferrals = ({ onChanged }: { onChanged?: () => void }) => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [q, setQ] = useState("");
  const [data, setData] = useState<ReferralPage | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(() => {
    api
      .get<ReferralPage>("/manage/member-referrals", { params: { page, q: q || undefined } })
      .then((res) => setData(res.data))
      .catch((err) => toast.error("Couldn't load referrals", { description: errorMessage(err) }));
  }, [page, q]);

  useEffect(load, [load]);

  // Search as the admin types, without a request per key.
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setQ(query.trim());
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  if (!data) return <Skeleton className="h-64 w-full rounded-3xl" />;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Joined with a member's code" value={data.totals.joined} />
        <Stat label="Rewards paid" value={inr(data.totals.paid)} />
        <Stat label="Rewards due" value={inr(data.totals.due)} />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search new member or referrer: name, Profile ID or code"
          className="h-10 bg-card pl-9"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Joined</TableHead>
              <TableHead>New member</TableHead>
              <TableHead />
              <TableHead>Referred by</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="text-right">Paid</TableHead>
              <TableHead className="text-right">Reward</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.map((r) => (
              <TableRow key={r._id}>
                <TableCell className="whitespace-nowrap">{formatInstant(r.joinedAt, true)}</TableCell>
                <TableCell>
                  <Person name={r.name} uniqueId={r.uniqueId} onOpen={() => setOpenId(r._id)} />
                </TableCell>
                <TableCell className="px-0 text-muted-foreground">
                  <ArrowRight className="size-4 rotate-180" aria-label="referred by" />
                </TableCell>
                <TableCell>
                  {r.referrer ? (
                    <Person name={r.referrer.name} uniqueId={r.referrer.uniqueId} onOpen={() => setOpenId(r.referrer!._id)} />
                  ) : (
                    <span className="text-xs text-muted-foreground">Member deleted</span>
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs">{r.code || "-"}</TableCell>
                <TableCell className="text-right">{r.paid ? inr(r.paid) : "Free"}</TableCell>
                <TableCell className="text-right">
                  {r.reward ? (
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-semibold">{inr(r.reward.amount)}</span>
                      <Badge variant="outline" className={REWARD[r.reward.status].className} title={r.reward.note ?? undefined}>
                        {REWARD[r.reward.status].label}
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No reward</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {!data.rows.length && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  {q ? "No referrals match your search." : "No one has joined with a member's referral code yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {data.total} referrals · page {page} of {data.totalPages}
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft /> Previous
            </Button>
            <Button size="sm" variant="outline" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
              Next <ChevronRight />
            </Button>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Click a name to open the member. A referrer's rewards can be marked paid from their Payments tab.
      </p>

      <MemberSheet
        id={openId}
        kind="admin"
        onClose={() => setOpenId(null)}
        onChanged={() => {
          load();
          onChanged?.();
        }}
      />
    </div>
  );
};
