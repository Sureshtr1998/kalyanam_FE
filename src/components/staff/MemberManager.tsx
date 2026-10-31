import { useCallback, useEffect, useState } from "react";
import { BadgeCheck, ChevronLeft, ChevronRight, EyeOff, Search, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SelectField } from "@/components/fields/SelectField";
import { ProfilePlaceholder } from "@/components/common/ProfilePlaceholder";
import api from "@/utils/api";
import { imageUrl } from "@/utils/constants";
import { fetchLabel, motherTongueOptions } from "@/utils/utils";
import { ageFromFloating, formatInstant } from "@/lib/dates";
import { errorMessage } from "@/lib/errors";
import { MemberSheet } from "./MemberSheet";
import type { MemberRow, StaffKind } from "./staffTypes";

const STATUS = [
  { label: "All members", value: "all" },
  { label: "Not verified", value: "unverified" },
  { label: "Verified", value: "verified" },
  { label: "Incomplete profile", value: "incomplete" },
  { label: "Complete profile", value: "complete" },
  { label: "Hidden", value: "hidden" },
];
const ADMIN_STATUS = [
  ...STATUS,
  { label: "Referred by a partner", value: "referred" },
  { label: "Commission due", value: "commissionDue" },
  { label: "Admins", value: "admin" },
];
const GENDER = [
  { label: "Any gender", value: "all" },
  { label: "Brides", value: "Female" },
  { label: "Grooms", value: "Male" },
];
const SORT = [
  { label: "Newest first", value: "newest" },
  { label: "Recently active", value: "active" },
  { label: "Name A–Z", value: "name" },
];

interface Props {
  kind: StaffKind;
  /** Admin only: pre-filter by a partner's referral ID. */
  referralId?: string;
  onChanged?: () => void;
}

export const MemberManager = ({ kind, referralId, onChanged }: Props) => {
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [gender, setGender] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ rows: MemberRow[]; total: number; totalPages: number } | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  // Debounce typing.
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(q.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  const load = useCallback(() => {
    api
      .get("/manage/users", {
        params: {
          q: query || undefined,
          status: status === "all" ? undefined : status,
          gender: gender === "all" ? undefined : gender,
          sort,
          page,
          referralId,
        },
      })
      .then((res) => setData(res.data))
      .catch((err) => toast.error("Couldn't load members", { description: errorMessage(err) }));
  }, [query, status, gender, sort, page, referralId]);

  useEffect(load, [load]);

  const changed = useCallback(() => {
    load();
    onChanged?.();
  }, [load, onChanged]);
  const close = useCallback(() => setOpenId(null), []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, Profile ID, email, phone or referral ID"
            className="h-10 bg-card pl-9"
          />
        </div>
        <div className="grid grid-cols-3 gap-2 lg:flex">
          <SelectField
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={kind === "admin" ? ADMIN_STATUS : STATUS}
            className="lg:w-48"
          />
          <SelectField
            value={gender}
            onChange={(v) => {
              setGender(v);
              setPage(1);
            }}
            options={GENDER}
            className="lg:w-36"
          />
          <SelectField value={sort} onChange={setSort} options={SORT} className="lg:w-40" />
        </div>
      </div>

      {!data ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : data.rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          {kind === "broker" && !query && status === "all"
            ? "No members have registered with your referral ID yet."
            : "No members match these filters."}
        </p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {data.rows.map((m) => {
            const age = ageFromFloating(m.basic.dob);
            return (
              <li key={m._id}>
                <button
                  type="button"
                  onClick={() => setOpenId(m._id)}
                  className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-accent/50 sm:gap-4 sm:px-4">
                  <div className="size-12 shrink-0 overflow-hidden rounded-xl ring-1 ring-border">
                    {m.photo ? (
                      <img src={imageUrl(m.photo, "thumb")} alt="" loading="lazy" className="size-full object-cover" />
                    ) : (
                      <ProfilePlaceholder name={m.basic.fullName} seed={m._id} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-1.5 font-semibold">
                      <span className="truncate">{m.basic.fullName}</span>
                      {m.isVerified && <BadgeCheck className="size-4 shrink-0 text-success" aria-label="Verified" />}
                      {m.isAdmin && <ShieldCheck className="size-4 shrink-0 text-primary" aria-label="Admin" />}
                      {m.isHidden && <EyeOff className="size-4 shrink-0 text-muted-foreground" aria-label="Hidden" />}
                      {!m.hasCompleteProfile && (
                        <Badge variant="outline" className="border-gold/60 px-1.5 py-0 text-[10px]">
                          Incomplete
                        </Badge>
                      )}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      <span className="font-mono">{m.basic.uniqueId}</span>
                      {" · "}
                      {[m.basic.gender, age !== null ? `${age} yrs` : null, fetchLabel(motherTongueOptions, m.basic.motherTongue)]
                        .filter((x) => x && x !== "-")
                        .join(" · ")}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {m.basic.mobile ? `+91 ${m.basic.mobile}` : ""} {m.basic.email ? `· ${m.basic.email}` : ""}
                    </p>
                  </div>
                  <div className="hidden shrink-0 text-right text-xs text-muted-foreground sm:block">
                    <p>Joined {formatInstant(m.createdAt)}</p>
                    <p>{m.credits} credits · {m.accepted} matched</p>
                    {kind === "admin" && m.basic.referralId && (
                      <p className="font-mono">
                        {m.basic.referralId}
                        {m.commissionPaidAt ? " · paid" : ""}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {data.total} members · page {page} of {data.totalPages}
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
      {data && data.totalPages <= 1 && data.total > 0 && (
        <p className="text-sm text-muted-foreground">{data.total} members</p>
      )}

      <MemberSheet id={openId} kind={kind} onClose={close} onChanged={changed} />
    </div>
  );
};
