import { AlertTriangle, Clock, Gift, Minus, Plus, ScrollText } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/PageHeader";
import type { AstrologyIn } from "@/utils/interfaces";
import { parseGptResponse } from "@/utils/utils";
import { formatFloating, formatInstant } from "@/lib/dates";
import { SUPPORT_EMAIL } from "@/utils/constants";
import { cn } from "@/lib/utils";

const StatusBadge = ({ status }: { status?: string }) => {
  const s = (status ?? "pending").toLowerCase();
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        s === "completed" && "border-success/30 bg-success/10 text-success",
        s === "pending" && "border-gold/40 bg-gold/15 text-accent-foreground",
        s === "failed" && "border-destructive/30 bg-destructive/10 text-destructive"
      )}>
      {s === "pending" ? "In review" : s}
    </Badge>
  );
};

const Person = ({ title, name, dob, place, gender }: { title: string; name?: string; dob?: Date | string; place?: string; gender?: string }) => (
  <div className="rounded-xl bg-muted/70 p-3 text-sm">
    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">{title}</p>
    <p className="font-semibold">{name}</p>
    <p className="text-muted-foreground">
      {gender} · {formatFloating(dob, true)}
    </p>
    <p className="text-muted-foreground">{place}</p>
  </div>
);

const List = ({ items, icon, tone }: { items?: string[]; icon: React.ReactNode; tone: "good" | "bad" | "plain" }) =>
  items?.length ? (
    <ul className="space-y-2">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
          <span
            className={cn(
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full [&_svg]:size-3",
              tone === "good" && "bg-success/15 text-success",
              tone === "bad" && "bg-destructive/10 text-destructive",
              tone === "plain" && "bg-gold/20 text-accent-foreground"
            )}>
            {icon}
          </span>
          {t}
        </li>
      ))}
    </ul>
  ) : null;

const Reading = ({ astro }: { astro: AstrologyIn }) => {
  const status = astro.status?.toLowerCase();
  if (status === "failed") {
    return (
      <div className="flex gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
        <AlertTriangle className="size-5 shrink-0 text-destructive" />
        <div>
          <p className="font-semibold">We couldn't prepare this reading.</p>
          <p className="text-muted-foreground">
            {astro.aiResponse} Our team has been notified. Please email{" "}
            <a className="font-semibold text-primary" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> and we'll
            sort it out.
          </p>
        </div>
      </div>
    );
  }
  if (status !== "completed") {
    return (
      <div className="flex gap-3 rounded-xl border border-gold/40 bg-accent p-4 text-sm">
        <Clock className="size-5 shrink-0 text-accent-foreground" />
        <div>
          <p className="font-semibold">Our astrologer is reviewing your chart</p>
          <p className="text-muted-foreground">We'll email you as soon as the reading is ready, and it will appear right here.</p>
        </div>
      </div>
    );
  }

  const r = parseGptResponse(astro.aiResponse ?? "");
  if (typeof r === "string") return <p className="whitespace-pre-line text-sm">{r}</p>;

  if (astro.consultationMode === "Kundli Matching") {
    const score = Number(r.score);
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-gradient-to-r from-accent to-card p-4">
          <div className="relative flex size-20 items-center justify-center rounded-full border-4 border-gold bg-card">
            <span className="font-display text-2xl font-bold text-primary">{Number.isFinite(score) ? score : "-"}</span>
            <span className="absolute -bottom-2 rounded-full bg-gold px-1.5 text-[10px] font-bold text-gold-foreground">/{r.out_of ?? 100}</span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {r.out_of === 36 ? "Guna Milan verdict" : "Verdict"}
            </p>
            <p className="font-display text-2xl font-bold">{r.verdict}</p>
          </div>
        </div>
        {r.kootas?.length ? (
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {r.kootas.map((k) => (
              <li key={k.name} className="rounded-xl border border-border bg-card px-3 py-2 text-sm">
                <p className="text-xs text-muted-foreground">{k.name}</p>
                <p className={cn("font-semibold", k.score === 0 && "text-destructive")}>
                  {k.score ?? "-"} / {k.out_of ?? "-"}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="text-sm leading-relaxed">{r.compatibility_summary}</p>
      </div>
    );
  }

  if (astro.consultationMode === "Personalized") {
    return (
      <div className="space-y-4">
        <List items={r.answer} icon={<ScrollText />} tone="plain" />
        <div className="grid gap-3 sm:grid-cols-2">
          {r.easy_remedy && (
            <div className="rounded-xl border border-success/30 bg-success/5 p-3 text-sm">
              <p className="mb-1 flex items-center gap-1.5 font-semibold text-success"><Gift className="size-4" /> Simple remedy</p>
              {r.easy_remedy}
            </div>
          )}
          {r.costly_remedy && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm">
              <p className="mb-1 flex items-center gap-1.5 font-semibold text-primary"><Gift className="size-4" /> Elaborate remedy</p>
              {r.costly_remedy}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {r.personality_summary && <p className="text-sm leading-relaxed">{r.personality_summary}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-success">Strengths</p>
          <List items={r.positive_traits} icon={<Plus />} tone="good" />
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-destructive">Watch-outs</p>
          <List items={r.negative_traits} icon={<Minus />} tone="bad" />
        </div>
      </div>
    </div>
  );
};

const Consultations = ({ items }: { items: AstrologyIn[] }) => {
  if (!items.length) {
    return (
      <EmptyState
        icon={<ScrollText />}
        title="No readings yet"
        description="Your consultations will appear here. We recommend starting with an Overview."
      />
    );
  }
  return (
    <Accordion type="single" collapsible defaultValue={items[0].uId} className="space-y-3">
      {items.map((a) => (
        <AccordionItem
          key={a.uId}
          value={a.uId}
          className="overflow-hidden rounded-2xl border border-border bg-card px-4 last:border-b">
          <AccordionTrigger className="gap-3 py-4 hover:no-underline">
            <div className="flex min-w-0 flex-1 flex-col gap-1 text-left sm:flex-row sm:items-center sm:gap-3">
              <span className="font-display text-lg font-bold">{a.consultationMode}</span>
              <span className="truncate text-xs text-muted-foreground">
                {a.mName ? `${a.name} & ${a.mName}` : a.name} · {formatInstant(a.generatedAt)}
              </span>
            </div>
            <StatusBadge status={a.status} />
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-5">
            <div className={cn("grid gap-3", a.mName && "sm:grid-cols-2")}>
              <Person title="Birth details" name={a.name} dob={a.dob} place={a.place} gender={a.gender} />
              {a.mName && <Person title="Match profile" name={a.mName} dob={a.mDob} place={a.mPlace} gender={a.mGender} />}
            </div>
            {a.query && (
              <div className="rounded-xl border-l-4 border-gold bg-accent/60 px-4 py-3 text-sm italic">“{a.query}”</div>
            )}
            <Reading astro={a} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default Consultations;
