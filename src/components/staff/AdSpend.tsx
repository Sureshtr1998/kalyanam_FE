import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/utils/api";
import { cn } from "@/lib/utils";
import { errorMessage } from "@/lib/errors";
import { formatInstant } from "@/lib/dates";
import { Stat } from "./StaffStats";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AdDay {
  date: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  leads: number;
  registrations: number;
  /** Members who joined that day (from our database). */
  joined?: number;
  /** Joined without a partner referral code: the ones ads can take credit for. */
  direct?: number;
  /** Money earned that day (member payments + partner fees, net of refunds). */
  earned?: number;
}

type AdSpendResponse =
  | { configured: false }
  | {
      configured: true;
      account: { id: string; name: string; currency: string; timezone: string };
      days: AdDay[];
      fetchedAt: string;
      cached?: boolean;
    };

const money = (n: number, currency = "INR") =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: n < 100 ? 2 : 0 }).format(n);

const dayLabel = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const sum = (days: AdDay[], k: keyof Omit<AdDay, "date">) => days.reduce((t, d) => t + (d[k] ?? 0), 0);

/** Spend per registration, or "–" when there were none. */
const perReg = (spend: number, regs: number, cur: string) => (regs ? money(spend / regs, cur) : spend ? "No sign-ups" : "–");

/** Earned minus spent, green when in profit and red when at a loss. */
const Profit = ({ value, cur }: { value: number; cur: string }) => (
  <span className={cn("font-semibold", value > 0 && "text-success", value < 0 && "text-destructive")}>
    {value > 0 ? "+" : value < 0 ? "−" : ""}
    {money(Math.abs(value), cur)}
  </span>
);

/** Meta ad spend for the last 14 days, read by the backend from the Marketing API. */
export const AdSpend = () => {
  const [data, setData] = useState<AdSpendResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback((refresh = false) => {
    setLoading(true);
    setError(null);
    api
      .get<AdSpendResponse>("/manage/ad-spend", { params: refresh ? { refresh: 1 } : {} })
      .then((res) => setData(res.data))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => load(), [load]);

  const header = (sub?: string) => (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold">Meta ads · spend</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
      {data?.configured && (
        <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={() => load(true)} disabled={loading}>
          <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
          Refresh
        </Button>
      )}
    </div>
  );

  if (error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4">
        {header()}
        <p className="text-sm text-destructive">{error}</p>
        <Button size="sm" variant="outline" className="mt-3" onClick={() => load(true)}>Try again</Button>
      </div>
    );
  }
  if (!data) return <Skeleton className="h-56 w-full rounded-2xl" />;
  if (!data.configured) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-4">
        {header()}
        <p className="text-sm text-muted-foreground">
          Not connected. Add <code className="text-xs">META_ADS_TOKEN</code> (a system-user token with ads_read) and{" "}
          <code className="text-xs">META_AD_ACCOUNT_ID</code> to the backend environment.
        </p>
      </div>
    );
  }

  const { days, account } = data;
  const cur = account.currency || "INR";
  const today = days[days.length - 1];
  const yesterday = days[days.length - 2];
  const last7 = days.slice(-7);
  const spend7 = sum(last7, "spend");
  const regs7 = sum(last7, "registrations");
  const leads7 = sum(last7, "leads");
  const clicks7 = sum(last7, "clicks");
  const direct7 = sum(last7, "direct");
  const spend14 = sum(days, "spend");
  const direct14 = sum(days, "direct");
  const hasJoins = days.some((d) => d.joined !== undefined);
  const hasEarned = days.some((d) => d.earned !== undefined);
  const earned14 = sum(days, "earned");
  const max = Math.max(1, ...days.map((d) => d.spend));

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      {header(`${account.name} · updated ${formatInstant(data.fetchedAt, true)}`)}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat
          label="Spent today"
          value={money(today.spend, cur)}
          hint={hasJoins ? `${today.direct} sign-ups · ${perReg(today.spend, today.direct ?? 0, cur)} each` : `${today.clicks} clicks · ${today.leads} leads`}
          accent
        />
        <Stat
          label="Yesterday"
          value={money(yesterday.spend, cur)}
          hint={hasJoins ? `${yesterday.direct} sign-ups · ${perReg(yesterday.spend, yesterday.direct ?? 0, cur)} each` : `${yesterday.clicks} clicks`}
        />
        <Stat label="Last 7 days" value={money(spend7, cur)} hint={`${clicks7} clicks · CPC ${clicks7 ? money(spend7 / clicks7, cur) : "–"}`} />
        <Stat
          label="Cost / registration"
          value={hasJoins ? perReg(spend7, direct7, cur) : perReg(spend7, regs7, cur)}
          hint={
            hasJoins
              ? `7 days · ${direct7} sign-ups · Meta-tracked: ${perReg(spend7, regs7, cur)} (${regs7})`
              : `7 days · ${regs7} registrations · ${leads7} leads`
          }
        />
      </div>
      <div className="mt-4 flex h-28 items-end gap-1">
        {days.map((d) => (
          <div
            key={d.date}
            className="group flex h-full flex-1 flex-col items-center justify-end gap-1"
            title={`${dayLabel(d.date)}: ${money(d.spend, cur)} · ${d.clicks} clicks · ${d.registrations} registrations`}
          >
            <span className="text-[10px] font-semibold text-muted-foreground opacity-0 group-hover:opacity-100">
              {Math.round(d.spend)}
            </span>
            <div className="w-full rounded-t-md bg-primary/80" style={{ height: `${(d.spend / max) * 80}%`, minHeight: d.spend ? 4 : 1 }} />
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>{dayLabel(days[0].date)}</span>
        <span>Today</span>
      </div>
      {hasJoins && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold">
            Cost per registration · by day
            <span className="ml-2 font-normal text-muted-foreground">14 days: {perReg(spend14, direct14, cur)} ({direct14} sign-ups)</span>
            {hasEarned && (
              <span className="ml-2 font-normal text-muted-foreground">
                · spent {money(spend14, cur)} · earned {money(earned14, cur)} · profit <Profit value={earned14 - spend14} cur={cur} />
              </span>
            )}
          </p>
          <div className="max-h-80 overflow-auto rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead className="text-right">Spend</TableHead>
                  {hasEarned && <TableHead className="text-right">Earned</TableHead>}
                  {hasEarned && <TableHead className="text-right">Profit</TableHead>}
                  <TableHead className="text-right">Sign-ups</TableHead>
                  <TableHead className="text-right">Cost / sign-up</TableHead>
                  <TableHead className="hidden text-right sm:table-cell">Meta-tracked</TableHead>
                  <TableHead className="hidden text-right sm:table-cell">Clicks · leads</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...days].reverse().map((d) => (
                  <TableRow key={d.date}>
                    <TableCell className="whitespace-nowrap">{d === today ? "Today" : dayLabel(d.date)}</TableCell>
                    <TableCell className="text-right">{money(d.spend, cur)}</TableCell>
                    {hasEarned && <TableCell className="text-right">{money(d.earned ?? 0, cur)}</TableCell>}
                    {hasEarned && (
                      <TableCell className="text-right whitespace-nowrap">
                        <Profit value={(d.earned ?? 0) - d.spend} cur={cur} />
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      {d.direct}
                      {!!d.joined && d.joined !== d.direct && (
                        <span className="text-xs text-muted-foreground"> (+{d.joined - (d.direct ?? 0)} partner)</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold">{perReg(d.spend, d.direct ?? 0, cur)}</TableCell>
                    <TableCell className="hidden text-right sm:table-cell">
                      {d.registrations ? `${d.registrations} · ${money(d.spend / d.registrations, cur)}` : "–"}
                    </TableCell>
                    <TableCell className="hidden text-right text-muted-foreground sm:table-cell">
                      {d.clicks} · {d.leads}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      <p className="mt-2 text-[11px] text-muted-foreground">
        Earned is all money received that day (member payments and partner fees, minus refunds); profit is earned minus ad
        spend, before partner commission. Sign-ups are members who joined that day without a partner code, so their cost is spend ÷ all direct sign-ups (some may
        not have come from ads). Meta-tracked counts are registrations the pixel credited to ads. Today's Meta numbers can lag by a
        few hours.
      </p>
    </div>
  );
};
