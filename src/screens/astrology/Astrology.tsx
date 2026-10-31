import { useCallback, useEffect, useState } from "react";
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

const MODES: { value: ConsultationMode; title: string; blurb: string; icon: React.ReactNode }[] = [
  {
    value: "Overview",
    title: "Overview",
    blurb: "7 key traits of your personality from your birth chart. A great place to start.",
    icon: <SunMoon />,
  },
  {
    value: "Personalized",
    title: "Personal question",
    blurb: "Ask one question about marriage, career or children, with timing and remedies.",
    icon: <MessageCircleQuestion />,
  },
  {
    value: "Kundli Matching",
    title: "Kundli matching",
    blurb: "Guna Milan compatibility for two charts, with a score and verdict.",
    icon: <HeartHandshake />,
  },
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
}: {
  title: string;
  value: Birth;
  onChange: (b: Birth) => void;
  idPrefix: string;
}) => {
  const set = (k: keyof Birth, v: string) => onChange({ ...value, [k]: v });
  return (
    <fieldset className="rounded-2xl border border-border bg-background/60 p-4">
      <legend className="px-1 font-display text-lg font-bold text-primary">{title}</legend>
      <FieldGrid>
        <Field label="Full name" htmlFor={`${idPrefix}-name`} required>
          <Input id={`${idPrefix}-name`} value={value.name} onChange={(e) => set("name", e.target.value)} className="h-10 bg-card" />
        </Field>
        <Field label="Gender" required>
          <SelectField value={value.gender} onChange={(v) => set("gender", v)} options={genderOptions} />
        </Field>
        <Field label="Date of birth" required>
          <DateField value={value.date} onChange={(v) => set("date", v)} />
        </Field>
        <Field label="Time of birth" required hint="As on the birth certificate / horoscope (local time at birthplace).">
          <TimeField value={value.time} onChange={(v) => set("time", v)} />
        </Field>
        <Field
          label="Place of birth"
          htmlFor={`${idPrefix}-place`}
          required
          hint="Anywhere in the world. Pick from the list; if your village isn't listed, choose the nearest town."
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

  const load = async () => {
    try {
      const res = await api.get("/astro-data");
      setHistory(res.data?.astrology ?? []);
    } catch (err) {
      toast.error("Couldn't load your readings", { description: errorMessage(err) });
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
      toast.success("Request received", { description: res.data.msg });
      setQuery("");
      document.getElementById("readings")?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      toast.error("Payment received, request still processing", {
        description: `${errorMessage(err)} It will appear here within a few minutes. Payment ID: ${order.paymentId}`,
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
      <BlockingLoader show={submitting} message="Sending your chart to our astrologer…" />
      <PageHeader
        title={
          <span className="flex items-center gap-2">
            Vedic astrology <Sparkles className="size-7 text-gold" />
          </span>
        }
        description="Readings prepared by our Karnataka-based jyotishi, translated from Kannada to English."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <Card className="border-gold/30">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Request a reading</CardTitle>
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
                    <span className="block font-semibold">{m.title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{m.blurb}</span>
                  </span>
                  <span className="shrink-0 font-display text-xl font-bold text-primary sm:mt-auto sm:text-2xl">₹{ASTRO_FEES[m.value]}</span>
                </label>
              ))}
            </RadioGroup>

            <BirthForm title={mode === "Kundli Matching" ? "First person" : "Your birth details"} value={me} onChange={setMe} idPrefix="p1" />
            {mode === "Kundli Matching" && (
              <BirthForm title="Match profile" value={match} onChange={setMatch} idPrefix="p2" />
            )}
            {mode === "Personalized" && (
              <Field label="Your question" required hint={`${query.length}/108 characters`}>
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value.slice(0, 108))}
                  placeholder="e.g. Is 2027 an auspicious year for my marriage?"
                  className="min-h-20 bg-card"
                />
              </Field>
            )}

            <Button size="lg" className="w-full" disabled={!ready || isStarting} onClick={submit}>
              <Sparkles />
              {isStarting ? "Opening checkout…" : `Pay ₹${ASTRO_FEES[mode]} & submit`}
            </Button>
          </CardContent>
        </Card>

        <aside className="space-y-4">
          <Alert className="border-gold/40 bg-accent">
            <Info />
            <AlertTitle>How it works</AlertTitle>
            <AlertDescription className="space-y-2 text-sm">
              <p>
                Our astrologer is available <b>9 AM – 9 PM</b>. Requests outside these hours are answered the next
                morning. We'll email you once your reading is ready.
              </p>
              <p>
                Start with the <b>Overview</b>: if 5 or more of the 7 traits feel accurate, a personal question will
                give you a deeper reading.
              </p>
            </AlertDescription>
          </Alert>
          <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
            Astrology offers guidance, not certainty. For follow-up questions write to{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-primary hover:underline">
              {SUPPORT_EMAIL}
            </a>
            .
          </div>
        </aside>
      </div>

      <section id="readings" className="mt-10 scroll-mt-24">
        <h2 className="mb-4 font-display text-2xl font-bold sm:text-3xl">Your readings</h2>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
          </div>
        ) : (
          <Consultations items={history} />
        )}
      </section>
    </div>
  );
};

export default Astrology;
