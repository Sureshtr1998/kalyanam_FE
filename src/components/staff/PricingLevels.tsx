import { useCallback, useEffect, useState } from "react";
import { CircleCheck, Radio } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmButton } from "@/components/staff/MemberSheet";
import { inr } from "@/components/staff/staffTypes";
import api from "@/utils/api";
import { cn } from "@/lib/utils";
import { formatInstant } from "@/lib/dates";
import { errorMessage } from "@/lib/errors";
import { refreshPricing, type Pricing } from "@/lib/pricing";

type Level = Omit<Pricing, "level">;

interface PricingSettings {
  level: number;
  updatedBy: string | null;
  updatedAt: string | null;
  levels: Record<string, Level>;
}

const rows = (p: Level): [string, string][] => [
  ["Registration", p.registrationFee > 0 ? inr(p.registrationFee) : "Free"],
  ["Shown as \"was\"", p.registrationFeeOriginal ? inr(p.registrationFeeOriginal) : "-"],
  ["Credits on joining", String(p.registrationInterests)],
  ["With referral ID", p.registrationFee > 0 ? inr(p.referralFee) : "Free"],
  ["Partner commission", inr(p.brokerCommission)],
  ["Member refer & earn reward", p.memberReferralReward > 0 ? inr(p.memberReferralReward) : "-"],
  [`Basic pack (${p.interestPacks.basic.interests})`, inr(p.interestPacks.basic.amount)],
  [`Premium pack (${p.interestPacks.premium.interests})`, inr(p.interestPacks.premium.amount)],
  ["Astro: Overview", inr(p.astroFees.Overview)],
  ["Astro: Kundli matching", inr(p.astroFees["Kundli Matching"])],
  ["Astro: Personalized", inr(p.astroFees.Personalized)],
  ["Partner sign-up", inr(p.brokerRegistrationFee)],
];

/** Admin: pick which pricing level the whole site runs at. */
export const PricingLevels = ({ onChanged }: { onChanged: () => void }) => {
  const [data, setData] = useState<PricingSettings | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api
      .get<PricingSettings>("/manage/pricing")
      .then((res) => setData(res.data))
      .catch((err) => toast.error("Couldn't load pricing", { description: errorMessage(err) }));
  }, []);
  useEffect(load, [load]);

  const choose = async (level: number) => {
    setBusy(true);
    try {
      const res = await api.post<PricingSettings & { msg: string }>("/manage/pricing", { level });
      setData(res.data);
      toast.success(res.data.msg);
      void refreshPricing(true);
      onChanged();
    } catch (err) {
      toast.error("Couldn't change pricing", { description: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  if (!data) return <Skeleton className="h-64 w-full rounded-3xl" />;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        The live level sets every price new visitors see and pay. Payments already started keep their price, and
        existing members keep their credits.
        {data.updatedAt && (
          <> Last changed {formatInstant(data.updatedAt, true)}{data.updatedBy ? ` by ${data.updatedBy}` : ""}.</>
        )}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(data.levels).map(([key, p]) => {
          const level = Number(key);
          const live = level === data.level;
          const free = p.registrationFee <= 0;
          return (
            <div
              key={key}
              className={cn(
                "flex flex-col rounded-2xl border bg-card p-4",
                live ? "border-primary shadow-md ring-2 ring-primary/20" : "border-border"
              )}>
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="font-display text-xl font-bold">Level {level}</p>
                {live ? (
                  <Badge className="gap-1 bg-success text-success-foreground"><Radio /> Live</Badge>
                ) : free ? (
                  <Badge variant="outline">Free sign-up</Badge>
                ) : null}
              </div>
              <dl className="flex-1 space-y-1.5 text-sm">
                {rows(p).map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-semibold tabular-nums">{value}</dd>
                  </div>
                ))}
              </dl>
              {live ? (
                <p className="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-success">
                  <CircleCheck className="size-4" /> Current pricing
                </p>
              ) : (
                <ConfirmButton
                  icon={<Radio />}
                  label={`Switch to level ${level}`}
                  disabled={busy}
                  className="mt-4 w-full"
                  title={`Make level ${level} live?`}
                  description={
                    free
                      ? "Registration becomes free for everyone straight away, with no payment. Credit packs and astrology stay paid, and new referrals earn partners no commission."
                      : `New registrations will cost ${inr(p.registrationFee)} (${inr(p.referralFee)} with a referral ID), and every other price on this card applies from now on.`
                  }
                  confirm={`Switch to level ${level}`}
                  onConfirm={() => void choose(level)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
