import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Mail, MessageCircle, Search, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SelectField } from "@/components/fields/SelectField";
import api from "@/utils/api";
import { cn } from "@/lib/utils";
import { formatInstant } from "@/lib/dates";
import { errorMessage } from "@/lib/errors";
import { ConfirmButton } from "./MemberSheet";
import { Stat } from "./StaffStats";

/*
 * People who reached Razorpay from the register form but didn't pay, with a
 * "complete your registration" email (MSG91 template) to win them back.
 * The server enforces the send rules; the reasons here just explain them.
 */

type Status = "not_attempted" | "failed" | "paid";

interface AbandonedRow {
  id: string;
  name: string;
  email: string;
  mobile: string;
  profileCreatedBy?: string;
  amount?: number;
  attempts: number;
  createdAt: string;
  lastAttemptAt: string;
  status: Status;
  failureReason?: string;
  emailCount: number;
  lastEmailedAt?: string;
  lastEmailedBy?: string;
  convertedAt?: string;
  convertedAfterEmail: boolean;
}

interface AbandonedData {
  rows: AbandonedRow[];
  total: number;
  totalPages: number;
  limits: { perPerson: number; gapHours: number };
  summary: { total: number; emailed: number; converted: number; convertedAfterEmail: number; emailConversionRate: number };
}

interface SendResult {
  id: string;
  ok: boolean;
  msg: string;
}

const STATUS_FILTER = [
  { label: "Any status", value: "all" },
  { label: "Not attempted", value: "not_attempted" },
  { label: "Failed", value: "failed" },
  { label: "Paid", value: "paid" },
];
const CONVERTED_FILTER = [
  { label: "Not joined", value: "no" },
  { label: "Joined", value: "yes" },
  { label: "Joined or not", value: "all" },
];
const EMAILED_FILTER = [
  { label: "Emailed or not", value: "all" },
  { label: "Never emailed", value: "never" },
  { label: "Emailed 1+ times", value: "yes" },
];

const STATUS_BADGE: Record<Status, { label: string; className: string }> = {
  not_attempted: { label: "Not attempted", className: "border-border text-muted-foreground" },
  failed: { label: "Failed", className: "border-destructive/40 text-destructive" },
  paid: { label: "Paid", className: "border-success/40 text-success" },
};

// www: the bare domain was forwarded by GoDaddy, which dropped ?join=1 on the way.
const JOIN_LINK = "https://www.seetharamakalyana.in/?join=1";

const whatsappLink = (r: AbandonedRow) =>
  `https://wa.me/91${r.mobile}?text=${encodeURIComponent(
    `Namaskara ${r.name}, this is Seetha Rama Kalyana. Your registration wasn't completed. You can finish it in about 2 minutes here: ${JOIN_LINK}\nReply here if you need any help.`
  )}`;

/** Why this row can't be emailed right now, or null if it can. */
const blockedReason = (r: AbandonedRow, limits: AbandonedData["limits"]) => {
  if (r.convertedAt) return "Already joined";
  if (r.emailCount >= limits.perPerson) return `Emailed ${limits.perPerson} times`;
  if (r.lastEmailedAt && Date.now() - new Date(r.lastEmailedAt).getTime() < limits.gapHours * 3600000) {
    return "Emailed in the last 24 hours";
  }
  return null;
};

const StatusCell = ({ r }: { r: AbandonedRow }) => (
  <div className="space-y-1">
    <Badge variant="outline" className={STATUS_BADGE[r.status].className}>
      {STATUS_BADGE[r.status].label}
    </Badge>
    {r.failureReason && <p className="text-xs text-muted-foreground">{r.failureReason}</p>}
  </div>
);

const JoinedBadge = ({ r }: { r: AbandonedRow }) =>
  r.convertedAt ? (
    <Badge className="gap-1 bg-success text-white">
      <UserCheck />
      Joined {formatInstant(r.convertedAt)}
      {r.convertedAfterEmail && " · after email"}
    </Badge>
  ) : null;

const EmailedCell = ({ r }: { r: AbandonedRow }) => (
  <span className="text-sm">
    {r.emailCount ? (
      <>
        <span className="font-semibold">{r.emailCount}×</span>{" "}
        <span className="text-muted-foreground">last {formatInstant(r.lastEmailedAt, true)}</span>
      </>
    ) : (
      <span className="text-muted-foreground">Never</span>
    )}
  </span>
);

const RowActions = ({
  r,
  blocked,
  busy,
  onSend,
}: {
  r: AbandonedRow;
  blocked: string | null;
  busy: boolean;
  onSend: (ids: string[]) => void;
}) => (
  <div className="flex flex-wrap items-center gap-2">
    <ConfirmButton
      icon={<Mail />}
      label="Send mail"
      disabled={!!blocked || busy}
      title={`Email ${r.name}?`}
      description={`Sends the "complete your registration" email to ${r.email}.${r.emailCount ? ` They have had ${r.emailCount} already.` : ""}`}
      confirm="Send email"
      onConfirm={() => onSend([r.id])}
    />
    {!r.convertedAt && r.mobile && (
      <Button size="sm" variant="outline" asChild>
        <a href={whatsappLink(r)} target="_blank" rel="noreferrer">
          <MessageCircle />
          WhatsApp
        </a>
      </Button>
    )}
    {blocked && !r.convertedAt && <span className="text-xs text-muted-foreground">{blocked}</span>}
  </div>
);

export const AbandonedCheckouts = () => {
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [converted, setConverted] = useState("no");
  const [emailed, setEmailed] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<AbandonedData | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

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
      .get<AbandonedData>("/manage/abandoned", {
        params: {
          q: query || undefined,
          status: status === "all" ? undefined : status,
          converted: converted === "all" ? undefined : converted,
          emailed: emailed === "all" ? undefined : emailed,
          from: from || undefined,
          to: to || undefined,
          page,
        },
      })
      .then((res) => {
        setData(res.data);
        setSelected(new Set());
      })
      .catch((err) => toast.error("Couldn't load abandoned payments", { description: errorMessage(err) }));
  }, [query, status, converted, emailed, from, to, page]);

  useEffect(load, [load]);

  const filter = (set: (v: string) => void) => (v: string) => {
    set(v);
    setPage(1);
  };

  const send = async (ids: string[]) => {
    setBusy(true);
    try {
      const { data: res } = await api.post<{ results: SendResult[]; sent: number }>("/manage/abandoned/email", { ids });
      const failed = res.results.filter((r) => !r.ok);
      if (res.sent) toast.success(res.sent === 1 ? "Email sent" : `${res.sent} emails sent`);
      if (failed.length) {
        toast.error(`${failed.length} not sent`, {
          description: [...new Set(failed.map((f) => f.msg))].join(", "),
        });
      }
      load();
    } catch (err) {
      toast.error("Couldn't send the email", { description: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  const sendable = data ? data.rows.filter((r) => !blockedReason(r, data.limits)) : [];
  const allSelected = sendable.length > 0 && sendable.every((r) => selected.has(r.id));
  const toggle = (id: string, on: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  const toggleAll = (on: boolean) => setSelected(on ? new Set(sendable.map((r) => r.id)) : new Set());

  const s = data?.summary;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Abandoned" value={s?.total ?? "–"} hint="Reached Razorpay" />
        <Stat label="Emailed" value={s?.emailed ?? "–"} hint="At least once" />
        <Stat label="Joined" value={s?.converted ?? "–"} hint={s ? `${s.convertedAfterEmail} after an email` : undefined} />
        <Stat
          label="After email"
          value={s ? `${Math.round(s.emailConversionRate * 100)}%` : "–"}
          hint="Of emailed people who joined"
          accent
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email or phone"
            aria-label="Search abandoned payments"
            className="h-10 bg-card pl-9"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          <SelectField value={status} onChange={filter(setStatus)} options={STATUS_FILTER} />
          <SelectField value={converted} onChange={filter(setConverted)} options={CONVERTED_FILTER} />
          <SelectField value={emailed} onChange={filter(setEmailed)} options={EMAILED_FILTER} />
          <Input type="date" value={from} onChange={(e) => filter(setFrom)(e.target.value)} aria-label="From date" className="h-10 bg-card" />
          <Input type="date" value={to} onChange={(e) => filter(setTo)(e.target.value)} aria-label="To date" className="h-10 bg-card" />
        </div>
      </div>

      {!data ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : data.rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          No abandoned payments match these filters.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={allSelected} disabled={!sendable.length} onCheckedChange={(v) => toggleAll(v === true)} aria-label="Select all that can be emailed" />
              Select all that can be emailed
            </label>
            <ConfirmButton
              icon={<Mail />}
              label={`Email selected (${selected.size})`}
              disabled={!selected.size || busy}
              className="ml-auto"
              title={`Email ${selected.size} ${selected.size === 1 ? "person" : "people"}?`}
              description={`Sends the "complete your registration" email to everyone selected. Anyone who has joined or was emailed in the last 24 hours is skipped.`}
              confirm="Send emails"
              onConfirm={() => send([...selected])}
            />
          </div>

          {/* Phones: one card per person. */}
          <ul className="space-y-2 md:hidden" aria-label="Abandoned payments">
            {data.rows.map((r) => {
              const blocked = blockedReason(r, data.limits);
              return (
                <li key={r.id} className={cn("space-y-2 rounded-2xl border border-border bg-card p-3", r.convertedAt && "opacity-80")}>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      className="mt-1"
                      checked={selected.has(r.id)}
                      disabled={!!blocked}
                      onCheckedChange={(v) => toggle(r.id, v === true)}
                      aria-label={`Select ${r.name}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{r.name}</p>
                      <p className="truncate text-sm text-muted-foreground">{r.email}</p>
                      <p className="text-sm text-muted-foreground">{r.mobile}{r.profileCreatedBy && ` · by ${r.profileCreatedBy}`}</p>
                    </div>
                    <StatusCell r={r} />
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>{formatInstant(r.lastAttemptAt, true)}{r.attempts > 1 && ` · ${r.attempts} tries`}</span>
                    <span>Emailed: <EmailedCell r={r} /></span>
                  </div>
                  <JoinedBadge r={r} />
                  <RowActions r={r} blocked={blocked} busy={busy} onSend={send} />
                </li>
              );
            })}
          </ul>

          {/* Tablets and up: a table. */}
          <div className="hidden overflow-x-auto rounded-2xl border border-border bg-card md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead>Person</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Emailed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.rows.map((r) => {
                  const blocked = blockedReason(r, data.limits);
                  return (
                    <TableRow key={r.id}>
                      <TableCell>
                        <Checkbox
                          checked={selected.has(r.id)}
                          disabled={!!blocked}
                          onCheckedChange={(v) => toggle(r.id, v === true)}
                          aria-label={`Select ${r.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.email}</p>
                        <p className="text-xs text-muted-foreground">{r.mobile}{r.profileCreatedBy && ` · by ${r.profileCreatedBy}`}</p>
                        <JoinedBadge r={r} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {formatInstant(r.lastAttemptAt, true)}
                        {r.attempts > 1 && <p className="text-xs text-muted-foreground">{r.attempts} tries, first {formatInstant(r.createdAt)}</p>}
                      </TableCell>
                      <TableCell><StatusCell r={r} /></TableCell>
                      <TableCell>
                        <EmailedCell r={r} />
                        {r.lastEmailedBy && <p className="text-xs text-muted-foreground">by {r.lastEmailedBy}</p>}
                      </TableCell>
                      <TableCell><RowActions r={r} blocked={blocked} busy={busy} onSend={send} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {data.totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{data.total} people · page {page} of {data.totalPages}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft /> Previous</Button>
                <Button size="sm" variant="outline" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>Next <ChevronRight /></Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
