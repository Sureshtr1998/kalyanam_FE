import { useCallback, useEffect, useState } from "react";
import { Check, Clock, Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/misc/SEO";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MemberManager } from "@/components/staff/MemberManager";
import { SignupBars, Stat } from "@/components/staff/StaffStats";
import { inr, type Summary } from "@/components/staff/staffTypes";
import api from "@/utils/api";
import { SEO_URL } from "@/utils/constants";
import { usePricing, type Pricing } from "@/lib/pricing";
import { errorMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";
import {
  LANGUAGES,
  localeOf,
  localePath,
  useMemberLang,
  type Lang,
} from "@/lib/i18n";
import {
  copyShareMessage,
  shareViaApps,
  type ShareParts,
} from "@/lib/shareCopy";

type Offer = { code: string; fee: number; full: number };

/**
 * The partner's invite message in each language, in a matchmaker's voice.
 * First-person verbs are kept gender-neutral (Hindi especially).
 */
const MESSAGES: Record<
  Lang,
  {
    intro: (who: string) => string;
    offer: (o: Offer) => string;
    free: (code: string) => string;
    link: string;
  }
> = {
  en: {
    intro: (who) =>
      `Namaste! This is ${who}. Looking for the right match for your son or daughter? Register on Seetha Rama Kalyana: verified profiles from our community, and it's easy to use. 🙏`,
    offer: (o) =>
      `Use my referral code ${o.code} and pay just ₹${o.fee} instead of ₹${o.full}.`,
    free: (code) => `Register free with my referral code ${code}.`,
    link: "👉 Register here",
  },
  kn: {
    intro: (who) =>
      `ನಮಸ್ಕಾರ! ನಾನು ${who}. ನಿಮ್ಮ ಮಗ ಅಥವಾ ಮಗಳಿಗೆ ಸರಿಯಾದ ಸಂಬಂಧ ಹುಡುಕುತ್ತಿದ್ದೀರಾ? ಸೀತಾ ರಾಮ ಕಲ್ಯಾಣದಲ್ಲಿ ನೋಂದಾಯಿಸಿ: ನಮ್ಮ ಸಮುದಾಯದ ಪರಿಶೀಲಿತ ಪ್ರೊಫೈಲ್‌ಗಳು, ಬಳಸಲು ಸುಲಭ. 🙏`,
    offer: (o) =>
      `ನನ್ನ ರೆಫರಲ್ ಕೋಡ್ ${o.code} ಬಳಸಿ, ₹${o.full} ಬದಲು ಕೇವಲ ₹${o.fee} ಪಾವತಿಸಿ.`,
    free: (code) => `ನನ್ನ ರೆಫರಲ್ ಕೋಡ್ ${code} ಬಳಸಿ ಉಚಿತವಾಗಿ ನೋಂದಾಯಿಸಿ.`,
    link: "👉 ಇಲ್ಲಿ ನೋಂದಾಯಿಸಿ",
  },
  hi: {
    intro: (who) =>
      `नमस्ते! मैं ${who}। क्या आप अपने बेटे या बेटी के लिए सही रिश्ता ढूँढ रहे हैं? सीता राम कल्याण पर रजिस्टर करें: हमारे समुदाय के सत्यापित प्रोफ़ाइल, और इस्तेमाल करना आसान। 🙏`,
    offer: (o) =>
      `मेरे रेफ़रल कोड ${o.code} का इस्तेमाल करें और ₹${o.full} की जगह सिर्फ़ ₹${o.fee} दें।`,
    free: (code) => `मेरे रेफ़रल कोड ${code} से मुफ़्त रजिस्टर करें।`,
    link: "👉 यहाँ रजिस्टर करें",
  },
  te: {
    intro: (who) =>
      `నమస్కారం! నేను ${who}. మీ అబ్బాయి లేదా అమ్మాయికి సరైన సంబంధం వెతుకుతున్నారా? సీతా రామ కళ్యాణలో నమోదు చేసుకోండి: మన సమాజానికి చెందిన ధృవీకరించిన ప్రొఫైల్స్, ఉపయోగించడం సులభం. 🙏`,
    offer: (o) =>
      `నా రిఫరల్ కోడ్ ${o.code} ఉపయోగించి, ₹${o.full} బదులు కేవలం ₹${o.fee} చెల్లించండి.`,
    free: (code) => `నా రిఫరల్ కోడ్ ${code} తో ఉచితంగా నమోదు చేసుకోండి.`,
    link: "👉 ఇక్కడ నమోదు చేసుకోండి",
  },
  ta: {
    intro: (who) =>
      `வணக்கம்! நான் ${who}. உங்கள் மகன் அல்லது மகளுக்கு சரியான வரன் தேடுகிறீர்களா? சீதா ராம கல்யாணாவில் பதிவு செய்யுங்கள்: நம் சமூகத்தின் சரிபார்க்கப்பட்ட சுயவிவரங்கள், பயன்படுத்த எளிது. 🙏`,
    offer: (o) =>
      `என் பரிந்துரை குறியீடு ${o.code} பயன்படுத்தி, ₹${o.full}க்கு பதிலாக ₹${o.fee} மட்டும் செலுத்துங்கள்.`,
    free: (code) =>
      `என் பரிந்துரை குறியீடு ${code} மூலம் இலவசமாகப் பதிவு செய்யுங்கள்.`,
    link: "👉 இங்கே பதிவு செய்யுங்கள்",
  },
};

/** Opens registration with the code filled in, on the landing page in the message's language. */
const inviteLink = (code: string, lang: Lang) =>
  `${SEO_URL}${localePath("/", lang)}?join=1&ref=${encodeURIComponent(code)}`;

const inviteParts = (
  broker: { name: string; companyName?: string },
  code: string,
  pricing: Pricing,
  lang: Lang,
): ShareParts => {
  const m = MESSAGES[lang];
  const who = broker.companyName
    ? `${broker.name}, ${broker.companyName}`
    : broker.name;
  return {
    intro: m.intro(who),
    offer:
      pricing.registrationFee > 0
        ? m.offer({
            code,
            fee: pricing.referralFee,
            full: pricing.registrationFee,
          })
        : m.free(code),
    label: m.link,
    url: inviteLink(code, lang),
  };
};

/** A partner's home: their referral ID, invite message, commission and the members they brought in. */
const PartnerDashboard = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [copied, setCopied] = useState<"message" | "code" | "link" | null>(
    null,
  );
  const pricing = usePricing();
  const broker = summary?.broker;
  // Starts in the first mother tongue the partner serves; their pick is remembered.
  const [lang, setLang] = useMemberLang(broker?.motherTongue?.[0]);

  const load = useCallback(() => {
    api
      .get<Summary>("/manage/summary")
      .then((res) => setSummary(res.data))
      .catch((err) =>
        toast.error("Couldn't load your dashboard", {
          description: errorMessage(err),
        }),
      );
  }, []);
  useEffect(load, [load]);

  const code = broker?.referralId;
  const parts =
    broker && code ? inviteParts(broker, code, pricing, lang) : null;

  const copy = async (what: "message" | "code" | "link") => {
    if (!parts || !code) return;
    try {
      if (what === "message") await copyShareMessage(parts);
      else
        await navigator.clipboard.writeText(what === "code" ? code : parts.url);
      setCopied(what);
      toast.success(
        what === "code"
          ? "Referral ID copied"
          : what === "link"
            ? "Link copied"
            : "Message copied",
        {
          description:
            what === "message"
              ? "Paste it in WhatsApp, Facebook, Instagram or anywhere."
              : undefined,
        },
      );
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("Couldn't copy", {
        description: "Please select the text and copy it yourself.",
      });
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <SEO
        title="Partner dashboard | Seetha Rama Kalyana"
        description="Partner dashboard."
        noindex
      />
      <PageHeader
        title={
          broker ? `Namaste, ${broker.name.split(" ")[0]}` : "Partner dashboard"
        }
        description="Share your invite, and see the members who registered with your referral ID and what you've earned."
      />

      {!summary ? (
        <Skeleton className="h-64 w-full rounded-3xl" />
      ) : !code ? (
        <Alert className="mb-6 border-gold/50 bg-accent">
          <Clock />
          <AlertTitle>Your account is awaiting approval</AlertTitle>
          <AlertDescription>
            Our team verifies every partner within 24–48 hours. Once approved,
            your referral ID appears here and members who use it are listed
            below.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="mb-8 space-y-4">
          {/* Referral ID */}
          <div className="flex flex-col gap-4 rounded-3xl border border-gold/30 bg-gradient-to-r from-primary/10 via-accent to-gold/20 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Your referral ID
              </p>
              <p className="font-mono text-4xl font-bold tracking-wider text-primary">
                {code}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {pricing.registrationFee > 0 ? (
                  <>
                    Members pay {inr(pricing.referralFee)} instead of{" "}
                    {inr(pricing.registrationFee)}; you earn{" "}
                    {inr(pricing.brokerCommission)} for each.
                  </>
                ) : (
                  "Registration is free right now, so new referrals don't earn a commission. Members still appear in your list."
                )}
              </p>
            </div>
            <Button variant="outline" onClick={() => void copy("code")}>
              {copied === "code" ? <Check /> : <Copy />} Copy ID
            </Button>
          </div>

          {/* Invite message */}
          {parts && (
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
              <p className="font-display text-2xl font-bold">Invite families</p>
              <p className="mt-1 text-sm text-muted-foreground">
                A ready-made message with your referral link. Pick a language,
                copy it and send it on WhatsApp, Facebook, Instagram or
                anywhere. The link fills in your referral ID by itself.
              </p>
              <div
                className="my-4 flex flex-wrap gap-2"
                role="radiogroup"
                aria-label="Message language">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.value}
                    type="button"
                    role="radio"
                    aria-checked={lang === l.value}
                    lang={l.locale}
                    onClick={() => setLang(l.value)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
                      lang === l.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}>
                    {l.label}
                  </button>
                ))}
              </div>
              <p
                lang={localeOf(lang)}
                className="whitespace-pre-line break-words rounded-xl border border-border bg-muted/40 p-4 text-sm leading-relaxed">
                {parts.intro}
                {"\n\n"}
                {parts.offer}
                {"\n\n"}
                <a
                  href={parts.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={parts.url}
                  className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80">
                  {parts.label}
                </a>
              </p>
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2">
                <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
                  {parts.url}
                </span>
                <button
                  type="button"
                  onClick={() => void copy("link")}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-primary hover:bg-primary/10">
                  {copied === "link" ? (
                    <Check className="size-3.5" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  {copied === "link" ? "Copied" : "Copy link"}
                </button>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button
                  className="sm:flex-1"
                  onClick={() => void copy("message")}>
                  {copied === "message" ? <Check /> : <Copy />}
                  Copy message & link
                </Button>
                <Button
                  className="sm:flex-1"
                  variant="outline"
                  onClick={() => void shareViaApps(parts)}>
                  <Share2 /> Share
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {/* Commission counts everyone who registered with the code, even members removed from the list. */}
            <Stat
              label="Members referred"
              value={summary.commission.referred}
              hint={
                summary.commission.referred !== summary.members.total
                  ? `${summary.members.total} on your list · ${summary.members.new30} in the last 30 days`
                  : `${summary.members.new30} in the last 30 days`
              }
              accent
            />
            <Stat
              label="Earned"
              value={inr(summary.commission.earned)}
              hint={`${inr(summary.commission.perMember)} per member`}
            />
            <Stat label="Paid to you" value={inr(summary.commission.paid)} />
            <Stat
              label="Due to you"
              value={inr(summary.commission.due)}
              hint="Paid out by our team"
            />
            <Stat
              label="Complete profiles"
              value={summary.members.complete}
              hint={`${summary.members.incomplete} still incomplete`}
            />
            <Stat
              label="Verified"
              value={summary.members.verified}
              hint={`${summary.members.total - summary.members.verified} not verified`}
            />
            <Stat label="Active this week" value={summary.members.active7} />
            <Stat label="Hidden" value={summary.members.hidden} />
          </div>

          <SignupBars signups={summary.signups} />
        </div>
      )}

      {code && (
        <section>
          <h2 className="mb-3 font-display text-2xl font-bold">Your members</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Tap a member to verify them, hide or show their profile, or update
            their details. You can't delete accounts, but you can remove a
            member from your list.
          </p>
          <MemberManager kind="broker" onChanged={load} />
        </section>
      )}
    </div>
  );
};

export default PartnerDashboard;
