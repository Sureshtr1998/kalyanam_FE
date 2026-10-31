import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  BadgeCheck,
  Ban,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  FileImage,
  HandCoins,
  IndianRupee,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/misc/SEO";
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MemberManager } from "@/components/staff/MemberManager";
import { ConfirmButton } from "@/components/staff/MemberSheet";
import { inr, type BrokerInfo, type Summary } from "@/components/staff/staffTypes";
import { SignupBars, Stat } from "@/components/staff/StaffStats";
import { useUser } from "@/context/UserContext";
import api from "@/utils/api";
import { formatInstant } from "@/lib/dates";
import { errorMessage } from "@/lib/errors";

const Overview = ({ summary }: { summary: Summary | null }) => {
  if (!summary) return <Skeleton className="h-96 w-full rounded-3xl" />;
  const { members: m, revenue, interests, brokers, commission } = summary;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Members" value={m.total} hint={`${m.female} brides · ${m.male} grooms`} accent />
        <Stat label="New this week" value={m.new7} hint={`${m.new30} in 30 days`} />
        <Stat label="Active this week" value={m.active7} hint={`${m.hidden} hidden`} />
        <Stat label="Verified" value={m.verified} hint={`${m.total - m.verified} waiting`} />
        <Stat label="Complete profiles" value={m.complete} hint={`${m.incomplete} incomplete`} />
        <Stat label="Interests sent" value={interests?.sent ?? 0} hint={`${interests?.accepted ?? 0} accepted · ${interests?.contacts ?? 0} contacts unlocked`} />
        <Stat label="Revenue" value={inr(revenue?.total)} hint={`${inr(revenue?.last30)} in 30 days`} />
        <Stat label="Partner commission" value={inr(commission.due)} hint={`due · ${inr(commission.paid)} paid · ${commission.referred} referred`} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <SignupBars signups={summary.signups} />
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="mb-3 text-sm font-semibold">Revenue by type</p>
          <ul className="space-y-2 text-sm">
            {Object.entries(revenue?.byType ?? {}).map(([type, r]) => (
              <li key={type} className="flex items-center justify-between gap-3">
                <span className="capitalize">{type}</span>
                <span className="text-muted-foreground">{r.count} payments</span>
                <span className="font-semibold">{inr(r.total)}</span>
              </li>
            ))}
            {!Object.keys(revenue?.byType ?? {}).length && <li className="text-muted-foreground">No payments yet.</li>}
          </ul>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center text-xs">
            <div><p className="font-display text-xl font-bold">{brokers?.approved ?? 0}</p>Active partners</div>
            <div><p className="font-display text-xl font-bold text-gold-foreground">{brokers?.pending ?? 0}</p>Awaiting approval</div>
            <div><p className="font-display text-xl font-bold">{m.admins ?? 0}</p>Admins</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const statusBadge = (s: BrokerInfo["status"]) =>
  s === "approved" ? (
    <Badge className="bg-success text-white">Active</Badge>
  ) : s === "suspended" ? (
    <Badge variant="destructive">Suspended</Badge>
  ) : (
    <Badge variant="outline" className="border-gold text-gold-foreground">Awaiting approval</Badge>
  );

const Partners = ({ onShowMembers, onChanged }: { onShowMembers: (code: string) => void; onChanged: () => void }) => {
  const [brokers, setBrokers] = useState<BrokerInfo[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(() => {
    api
      .get<{ brokers: BrokerInfo[] }>("/manage/brokers")
      .then((res) => setBrokers(res.data.brokers))
      .catch((err) => toast.error("Couldn't load partners", { description: errorMessage(err) }));
  }, []);
  useEffect(load, [load]);

  const act = async (id: string, path: string, body?: object) => {
    setBusy(id + path);
    try {
      const res = await api.post(`/manage/brokers/${id}/${path}`, body);
      toast.success(res.data.msg);
      load();
      onChanged();
    } catch (err) {
      toast.error("Couldn't update partner", { description: errorMessage(err) });
    } finally {
      setBusy(null);
    }
  };

  if (!brokers) return <Skeleton className="h-64 w-full rounded-3xl" />;
  if (!brokers.length) return <p className="py-12 text-center text-sm text-muted-foreground">No partners have registered yet.</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {brokers.map((b) => (
        <div key={b._id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-display text-xl font-bold">{b.name}</p>
              <p className="truncate text-sm text-muted-foreground">{b.companyName}</p>
            </div>
            {statusBadge(b.status)}
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
            <span className="text-muted-foreground">Referral ID</span>
            <span className="font-mono font-bold text-primary">{b.referralId ?? "-"}</span>
            <span className="text-muted-foreground">Contact</span>
            <span className="truncate">+91 {b.phone}</span>
            <span className="text-muted-foreground">Email</span>
            <span className="truncate">{b.email}</span>
            <span className="text-muted-foreground">Joined</span>
            <span>{formatInstant(b.createdAt)} · paid {inr(b.paidFee)}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-muted p-2">
              <p className="font-display text-xl font-bold">{b.referred ?? 0}</p>
              <p className="text-[11px] text-muted-foreground">Referred</p>
            </div>
            <div className="rounded-xl bg-muted p-2">
              <p className="font-display text-xl font-bold text-primary">{inr(b.commissionDue)}</p>
              <p className="text-[11px] text-muted-foreground">Commission due</p>
            </div>
            <div className="rounded-xl bg-muted p-2">
              <p className="font-display text-xl font-bold">{inr(b.commissionPaid)}</p>
              <p className="text-[11px] text-muted-foreground">Paid out</p>
            </div>
          </div>
          {!!b.idProofs?.length && (
            <div className="flex flex-wrap gap-2 text-xs">
              {b.idProofs.map((p, i) => (
                <a key={p.fileId} href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-medium hover:text-primary">
                  <FileImage className="size-3.5" /> ID proof {i + 1}
                </a>
              ))}
            </div>
          )}
          <div className="mt-auto flex flex-wrap gap-2">
            {b.status !== "approved" && (
              <Button size="sm" disabled={!!busy} onClick={() => act(b._id, "status", { status: "approved" })}>
                <CircleCheck /> {b.status === "suspended" ? "Reactivate" : "Approve"}
              </Button>
            )}
            {b.referralId && (
              <Button size="sm" variant="outline" onClick={() => onShowMembers(b.referralId!)}>
                <Users /> Members
              </Button>
            )}
            {!!b.commissionDue && (
              <ConfirmButton
                icon={<HandCoins />}
                label={`Mark ${inr(b.commissionDue)} paid`}
                disabled={!!busy}
                title={`Mark ${inr(b.commissionDue)} as paid to ${b.name}?`}
                description="Only do this after the money has been sent. Their due commission resets to zero and the payout is recorded."
                confirm="Mark as paid"
                onConfirm={() => act(b._id, "settle")}
              />
            )}
            {b.status !== "suspended" && (
              <ConfirmButton
                icon={<Ban />}
                label="Suspend"
                destructive
                disabled={!!busy}
                title={`Suspend ${b.name}?`}
                description="They will be signed out and can't log in until you reactivate them. Members they referred are not affected."
                confirm="Suspend"
                onConfirm={() => act(b._id, "status", { status: "suspended" })}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

interface PaymentRow {
  userId: string;
  name: string;
  uniqueId: string;
  referralId?: string;
  date: string;
  note: string;
  amount: number;
  credits?: number;
  paymentId?: string;
  orderId?: string;
}

const Payments = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ rows: PaymentRow[]; total: number; totalPages: number } | null>(null);
  useEffect(() => {
    api
      .get("/manage/payments", { params: { page } })
      .then((res) => setData(res.data))
      .catch((err) => toast.error("Couldn't load payments", { description: errorMessage(err) }));
  }, [page]);
  if (!data) return <Skeleton className="h-64 w-full rounded-3xl" />;
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Credits</TableHead>
              <TableHead>Payment ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.map((r, i) => (
              <TableRow key={`${r.orderId}-${i}`}>
                <TableCell className="whitespace-nowrap">{formatInstant(r.date, true)}</TableCell>
                <TableCell>
                  <p className="font-medium">{r.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {r.uniqueId}
                    {r.referralId ? ` · ${r.referralId}` : ""}
                  </p>
                </TableCell>
                <TableCell className="max-w-56 truncate">{r.note?.replace("Astro_", "Astrology · ")}</TableCell>
                <TableCell className="text-right font-semibold">{inr(r.amount)}</TableCell>
                <TableCell className="text-right">{r.credits ? (r.credits > 0 ? `+${r.credits}` : r.credits) : "-"}</TableCell>
                <TableCell className="max-w-40 truncate font-mono text-xs">{r.paymentId || "-"}</TableCell>
              </TableRow>
            ))}
            {!data.rows.length && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No payments yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{data.total} payments · page {page} of {data.totalPages}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft /> Previous</Button>
            <Button size="sm" variant="outline" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>Next <ChevronRight /></Button>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminPanel = () => {
  const { user, loaded } = useUser();
  const [tab, setTab] = useState("overview");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [referralFilter, setReferralFilter] = useState<string | undefined>();

  const loadSummary = useCallback(() => {
    api
      .get<Summary>("/manage/summary")
      .then((res) => setSummary(res.data))
      .catch((err) => toast.error("Couldn't load the dashboard", { description: errorMessage(err) }));
  }, []);

  useEffect(() => {
    if (user.isAdmin) loadSummary();
  }, [user.isAdmin, loadSummary]);

  if (loaded && user._id && !user.isAdmin) return <Navigate to="/home" replace />;

  return (
    <div className="mx-auto max-w-6xl">
      <SEO title="Admin | Seetha Rama Kalyana" description="Admin panel." noindex />
      <PageHeader
        title="Admin panel"
        description="Members, partners and payments across Seetha Rama Kalyana."
        actions={
          summary && (
            <div className="flex gap-2 text-sm">
              <Badge variant="outline" className="gap-1 py-1"><BadgeCheck className="text-success" /> {summary.members.total - summary.members.verified} to verify</Badge>
              <Badge variant="outline" className="gap-1 py-1"><IndianRupee className="text-gold" /> {inr(summary.commission.due)} commission due</Badge>
            </div>
          )
        }
      />
      <Tabs value={tab} onValueChange={(v) => { setTab(v); if (v !== "members") setReferralFilter(undefined); }}>
        <TabsList className="mb-4 h-auto w-full flex-wrap justify-start bg-card p-1 shadow-sm ring-1 ring-border sm:w-fit">
          {[
            ["overview", "Overview"],
            ["members", "Members"],
            ["partners", `Partners${summary?.brokers?.pending ? ` (${summary.brokers.pending} new)` : ""}`],
            ["payments", "Payments"],
          ].map(([v, label]) => (
            <TabsTrigger key={v} value={v} className="px-4 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="overview">
          <Overview summary={summary} />
        </TabsContent>
        <TabsContent value="members">
          {referralFilter && (
            <div className="mb-3 flex items-center gap-2 text-sm">
              Showing members referred by <span className="font-mono font-bold text-primary">{referralFilter}</span>
              <Button size="xs" variant="ghost" onClick={() => setReferralFilter(undefined)}>Show everyone</Button>
            </div>
          )}
          <MemberManager kind="admin" referralId={referralFilter} onChanged={loadSummary} />
        </TabsContent>
        <TabsContent value="partners">
          <Partners
            onChanged={loadSummary}
            onShowMembers={(code) => {
              setReferralFilter(code);
              setTab("members");
            }}
          />
        </TabsContent>
        <TabsContent value="payments">
          <Payments />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
