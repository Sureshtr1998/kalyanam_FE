import { useCallback, useEffect, useRef, useState } from "react";
import { HeartHandshake, Info, MessageCircleQuestion, Sparkles, SunMoon } from "lucide-react";
import SEO from "@/components/misc/SEO";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Field, FieldGrid } from "@/components/fields/Field";
import { DateField, TimeField } from "@/components/fields/DateField";
import { SelectField } from "@/components/fields/SelectField";
import { PlaceField } from "@/components/fields/PlaceField";
import { PageHeader } from "@/components/common/PageHeader";
import { BlockingLoader } from "@/components/common/Loaders";
import { useCheckout, type PaidOrder } from "@/hooks/useCheckout";
import Consultations from "./Consultations";
import api from "@/utils/api";
import { ASTRO_FEES, SUPPORT_EMAIL, genderOptions } from "@/utils/constants";
import type { AstrologyIn, ConsultationMode } from "@/utils/interfaces";
import { toFloatingString } from "@/lib/dates";
import { errorMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";
import { useMemberLang } from "@/lib/i18n";
import { LanguageSelect } from "@/components/common/LanguageSelect";
import { useUser } from "@/context/UserContext";
import { astroText, type AstroText } from "./lang";

const MODES: { value: ConsultationMode; icon: React.ReactNode }[] = [
  { value: "Overview", icon: <SunMoon /> },
  { value: "Personalized", icon: <MessageCircleQuestion /> },
  { value: "Kundli Matching", icon: <HeartHandshake /> },
];

interface Birth {
  name: string;
  gender: string;
  date: string;
  time: string;
  place: string;
  lat?: number;
  lng?: number;
}

const emptyBirth = (gender = "Male"): Birth => ({ name: "", gender, date: "", time: "", place: "" });

/** Birthplace fields for the order ("mPlace", "mLat"… for the match); coordinates spare the server a lookup. */
const placePayload = (b: Birth, prefix: "" | "m" = "") => {
  const key = (k: string) => (prefix ? prefix + k[0].toUpperCase() + k.slice(1) : k);
  return {
    [key("place")]: b.place.trim(),
    ...(b.lat !== undefined && b.lng !== undefined ? { [key("lat")]: b.lat, [key("lng")]: b.lng } : {}),
  };
};

const BirthForm = ({
  title,
  value,
  onChange,
  idPrefix,
  t,
}: {
  title: string;
  value: Birth;
  onChange: (b: Birth) => void;
  idPrefix: string;
  t: AstroText;
}) => {
  const set = (k: keyof Birth, v: string) => onChange({ ...value, [k]: v });
  return (
    <fieldset className="rounded-2xl border border-border bg-background/60 p-4">
      <legend className="px-1 font-display text-lg font-bold text-primary">{title}</legend>
      <FieldGrid>
        <Field label={t.fullName} htmlFor={`${idPrefix}-name`} required>
          <Input id={`${idPrefix}-name`} value={value.name} onChange={(e) => set("name", e.target.value)} className="h-10 bg-card" />
        </Field>
        <Field label={t.genderLabel} required>
          <SelectField
            value={value.gender}
            onChange={(v) => set("gender", v)}
            options={genderOptions.map((o) => ({ ...o, label: t.gender[o.value] ?? o.label }))}
          />
        </Field>
        <Field label={t.dob} required>
          <DateField value={value.date} onChange={(v) => set("date", v)} />
        </Field>
        <Field label={t.tob} required hint={t.tobHint}>
          <TimeField value={value.time} onChange={(v) => set("time", v)} />
        </Field>
        <Field
          label={t.pob}
          htmlFor={`${idPrefix}-place`}
          required
          hint={t.pobHint}
          className="sm:col-span-2">
          <PlaceField
            id={`${idPrefix}-place`}
            value={value.place}
            onChange={(p) => onChange({ ...value, place: p?.label ?? "", lat: p?.lat, lng: p?.lng })}
          />
        </Field>
      </FieldGrid>
    </fieldset>
  );
};

const POLL_MS = 5000;
const FRESH_WINDOW_MS = 3 * 60 * 1000;

const complete = (b: Birth) => !!(b.name.trim() && b.gender && b.date && b.time && b.place.trim());

const Astrology = () => {
  const [mode, setMode] = useState<ConsultationMode>("Overview");
  const [me, setMe] = useState<Birth>(emptyBirth());
  const [match, setMatch] = useState<Birth>(emptyBirth("Female"));
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<AstrologyIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lang, setLang] = useMemberLang(useUser().user.basic?.motherTongue);
  const t = astroText[lang];
  // Toasts fire from callbacks created before a language change.
  const tRef = useRef(t);
  tRef.current = t;

  const load = async () => {
    try {
      const res = await api.get("/astro-data");
      setHistory(res.data?.astrology ?? []);
    } catch (err) {
      toast.error(tRef.current.loadFailed, { description: errorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  // Admin/test readings are generated within seconds: keep refreshing while a
  // just-submitted one is pending so it shows up without a manual reload.
  const awaitingFresh = history.some(
    (h) => h.status === "pending" && h.generatedAt && Date.now() - new Date(h.generatedAt).getTime() < FRESH_WINDOW_MS,
  );
  useEffect(() => {
    if (!awaitingFresh) return;
    const id = setInterval(() => void load(), POLL_MS);
    return () => clearInterval(id);
  }, [awaitingFresh]);

  const onPaid = useCallback(async (order: PaidOrder) => {
    setSubmitting(true);
    try {
      const res = await api.post("/astro-data", order);
      setHistory(res.data?.data?.astrology ?? []);
      toast.success(tRef.current.received, { description: res.data.msg });
      setQuery("");
      document.getElementById("readings")?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      toast.error(tRef.current.stillProcessing, {
        description: `${errorMessage(err)} ${tRef.current.appearSoon} Payment ID: ${order.paymentId}`,
        duration: 15000,
      });
    } finally {
      setSubmitting(false);
    }
  }, []);

  const { start, isStarting } = useCheckout({ description: `Vedic astrology · ${mode}`, onPaid });

  const ready =
    complete(me) &&
    (mode !== "Personalized" || query.trim().length > 0) &&
    (mode !== "Kundli Matching" || complete(match));

  const submit = () =>
    start({
      purpose: "astro",
      astro: {
        consultationMode: mode,
        name: me.name.trim(),
        gender: me.gender,
        dob: toFloatingString(me.date, me.time),
        ...placePayload(me),
        ...(mode === "Personalized" ? { query: query.trim() } : {}),
        ...(mode === "Kundli Matching"
          ? {
              mName: match.name.trim(),
              mGender: match.gender,
              mDob: toFloatingString(match.date, match.time),
              ...placePayload(match, "m"),
            }
          : {}),
      },
    });

  return (
    <div className="mx-auto max-w-5xl">
      <SEO title="Vedic astrology | Seetha Rama Kalyana" description="Vedic astrology" noindex />
      <BlockingLoader show={submitting} message={t.sending} />
      <PageHeader
        title={
          <span className="flex items-center gap-2">
            {t.title} <Sparkles className="size-7 text-gold" />
          </span>
        }
        description={t.description}
        actions={<LanguageSelect value={lang} onChange={setLang} />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <Card className="border-gold/30">
          <CardHeader>
            <CardTitle className="font-display text-2xl">{t.requestTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={mode}
              onValueChange={(v) => setMode(v as ConsultationMode)}
              className="grid gap-3 sm:grid-cols-3">
              {MODES.map((m) => (
                <label
                  key={m.value}
                  className={cn(
                    "relative flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-3 transition-colors sm:flex-col sm:gap-2 sm:p-4",
                    mode === m.value ? "border-primary bg-primary/5" : "border-border hover:border-gold/60"
                  )}>
                  <RadioGroupItem value={m.value} className="absolute right-3 top-3 max-sm:sr-only" />
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary [&_svg]:size-5">
                    {m.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{t.modes[m.value].title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{t.modes[m.value].blurb}</span>
                  </span>
                  <span className="shrink-0 font-display text-xl font-bold text-primary sm:mt-auto sm:text-2xl">₹{ASTRO_FEES[m.value]}</span>
                </label>
              ))}
            </RadioGroup>

            <BirthForm title={mode === "Kundli Matching" ? t.firstPerson : t.yourBirth} value={me} onChange={setMe} idPrefix="p1" t={t} />
            {mode === "Kundli Matching" && (
              <BirthForm title={t.matchProfile} value={match} onChange={setMatch} idPrefix="p2" t={t} />
            )}
            {mode === "Personalized" && (
              <Field label={t.question} required hint={t.questionHint(query.length)}>
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value.slice(0, 108))}
                  placeholder={t.questionPlaceholder}
                  className="min-h-20 bg-card"
                />
              </Field>
            )}

            <Button size="lg" className="w-full" disabled={!ready || isStarting} onClick={submit}>
              <Sparkles />
              {isStarting ? t.opening : t.pay(ASTRO_FEES[mode])}
            </Button>
          </CardContent>
        </Card>

        <aside className="space-y-4">
          <Alert className="border-gold/40 bg-accent">
            <Info />
            <AlertTitle>{t.howTitle}</AlertTitle>
            <AlertDescription className="space-y-2 text-sm">
              <p>
                {t.hoursBefore} <b>{t.hours}</b>
                {t.hoursAfter}
              </p>
              <p>
                {t.startBefore && `${t.startBefore} `}
                <b>{t.startBold}</b>
                {t.startAfter}
              </p>
            </AlertDescription>
          </Alert>
          <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
            {t.disclaimer}{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-primary hover:underline">
              {SUPPORT_EMAIL}
            </a>
            .
          </div>
        </aside>
      </div>

      <section id="readings" className="mt-10 scroll-mt-24">
        <h2 className="mb-4 font-display text-2xl font-bold sm:text-3xl">{t.readings}</h2>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
          </div>
        ) : (
          <Consultations items={history} t={t} />
        )}
      </section>
    </div>
  );
};

export default Astrology;
