import { useEffect, useState } from "react";
import { Check, Copy, Gift, IndianRupee, Share2, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/misc/SEO";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/utils/api";
import { SEO_URL } from "@/utils/constants";
import { errorMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";
import { LANGUAGES, localeOf, localePath, useMemberLang, type Lang } from "@/lib/i18n";
import { useUser } from "@/context/UserContext";

/** GET /referral (kalyanam_BE/src/routes/auth/referrals.js). */
interface ReferralInfo {
  code: string;
  level: number;
  reward: number;
  discount: number;
  friendFee: number;
  registrationFee: number;
  rewards: {
    friendName: string;
    amount: number;
    status: "processing" | "paid" | "pending";
    createdAt: string;
    paidAt: string | null;
  }[];
  totals: { joined: number; paid: number; pending: number };
}

type Offer = { code: string; discount: number; fee: number; full: number };

/** The share message in each language. Hindi and the others avoid gendered first-person verbs. */
const MESSAGES: Record<Lang, { intro: string; offer: (o: Offer) => string; plain: (code: string) => string; link: string }> = {
  en: {
    intro: "I'm using Seetha Rama Kalyana to find a life partner. Verified profiles from our community, and it's easy to use. 🙏",
    offer: (o) => `Register with my referral code ${o.code} and get ₹${o.discount} off (₹${o.fee} instead of ₹${o.full}).`,
    plain: (code) => `Register with my referral code ${code}.`,
    link: "👉 Register here",
  },
  kn: {
    intro: "ಜೀವನ ಸಂಗಾತಿಯನ್ನು ಹುಡುಕಲು ನಾನು ಸೀತಾ ರಾಮ ಕಲ್ಯಾಣ ಬಳಸುತ್ತಿದ್ದೇನೆ. ನಮ್ಮ ಸಮುದಾಯದ ಪರಿಶೀಲಿತ ಪ್ರೊಫೈಲ್‌ಗಳು, ಬಳಸಲು ಸುಲಭ. 🙏",
    offer: (o) => `ನನ್ನ ರೆಫರಲ್ ಕೋಡ್ ${o.code} ಬಳಸಿ ನೋಂದಾಯಿಸಿ ಮತ್ತು ₹${o.discount} ರಿಯಾಯಿತಿ ಪಡೆಯಿರಿ (₹${o.full} ಬದಲು ₹${o.fee}).`,
    plain: (code) => `ನನ್ನ ರೆಫರಲ್ ಕೋಡ್ ${code} ಬಳಸಿ ನೋಂದಾಯಿಸಿ.`,
    link: "👉 ಇಲ್ಲಿ ನೋಂದಾಯಿಸಿ",
  },
  hi: {
    intro: "जीवनसाथी खोजने के लिए सीता राम कल्याण आज़माइए। हमारे समुदाय के सत्यापित प्रोफ़ाइल, और इस्तेमाल करना आसान है। 🙏",
    offer: (o) => `मेरे रेफ़रल कोड ${o.code} से रजिस्टर करें और ₹${o.discount} की छूट पाएँ (₹${o.full} की जगह ₹${o.fee})।`,
    plain: (code) => `मेरे रेफ़रल कोड ${code} से रजिस्टर करें।`,
    link: "👉 यहाँ रजिस्टर करें",
  },
  te: {
    intro: "జీవిత భాగస్వామిని వెతకడానికి సీతా రామ కళ్యాణ ప్రయత్నించండి. మన సమాజానికి చెందిన ధృవీకరించిన ప్రొఫైల్స్, ఉపయోగించడం సులభం. 🙏",
    offer: (o) => `నా రిఫరల్ కోడ్ ${o.code} తో నమోదు చేసుకోండి, ₹${o.discount} తగ్గింపు పొందండి (₹${o.full} బదులు ₹${o.fee}).`,
    plain: (code) => `నా రిఫరల్ కోడ్ ${code} తో నమోదు చేసుకోండి.`,
    link: "👉 ఇక్కడ నమోదు చేసుకోండి",
  },
  ta: {
    intro: "வாழ்க்கைத் துணையைத் தேட சீதா ராம கல்யாணாவை முயற்சி செய்யுங்கள். நம் சமூகத்தின் சரிபார்க்கப்பட்ட சுயவிவரங்கள், பயன்படுத்த எளிது. 🙏",
    offer: (o) => `என் பரிந்துரை குறியீடு ${o.code} மூலம் பதிவு செய்து ₹${o.discount} தள்ளுபடி பெறுங்கள் (₹${o.full}க்கு பதிலாக ₹${o.fee}).`,
    plain: (code) => `என் பரிந்துரை குறியீடு ${code} மூலம் பதிவு செய்யுங்கள்.`,
    link: "👉 இங்கே பதிவு செய்யுங்கள்",
  },
};

/** Opens registration with the code filled in, on the landing page in the message's language. */
const shareLink = (code: string, lang: Lang) =>
  `${SEO_URL}${localePath("/", lang)}?join=1&ref=${encodeURIComponent(code)}`;

/** The message's parts: the link is shown (and copied as rich text) behind its label. */
const shareParts = (info: ReferralInfo, lang: Lang) => {
  const m = MESSAGES[lang];
  const offer =
    info.discount > 0
      ? m.offer({ code: info.code, discount: info.discount, fee: info.friendFee, full: info.registrationFee })
      : m.plain(info.code);
  return { intro: m.intro, offer, label: m.link, url: shareLink(info.code, lang) };
};

/** Plain text, for apps that can't hide a link behind words (WhatsApp, Instagram, SMS). */
const shareMessage = (info: ReferralInfo, lang: Lang) => {
  const p = shareParts(info, lang);
  return `${p.intro}

${p.offer}

${p.label}: ${p.url}`;
};

const escapeHtml = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Rich text: "Register here" is the link. Used where pasting keeps formatting (Gmail, Docs, Facebook on desktop). */
const shareHtml = (info: ReferralInfo, lang: Lang) => {
  const p = shareParts(info, lang);
  return `<p>${escapeHtml(p.intro)}</p><p>${escapeHtml(p.offer)}</p><p><a href="${escapeHtml(p.url)}">${escapeHtml(p.label)}</a></p>`;
};

const STATUS: Record<ReferralInfo["rewards"][number]["status"], { label: string; className: string }> = {
  paid: { label: "Sent", className: "bg-emerald-600 text-white" },
  processing: { label: "Processing", className: "bg-gold text-gold-foreground" },
  pending: { label: "On its way", className: "bg-gold text-gold-foreground" },
};

const date = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

const ReferEarn = () => {
  const [info, setInfo] = useState<ReferralInfo | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<"message" | "code" | null>(null);
  const { user } = useUser();
  // Starts in the member's language (shared with the rest of the member pages).
  const [lang, setLang] = useMemberLang(user.basic?.motherTongue);

  useEffect(() => {
    api
      .get<ReferralInfo>("/referral")
      .then((res) => setInfo(res.data))
      .catch((err) => setError(errorMessage(err)));
  }, []);

  const copy = async (what: "message" | "code") => {
    if (!info) return;
    try {
      if (what === "code") {
        await navigator.clipboard.writeText(info.code);
      } else if (typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
        // Both forms: apps that keep formatting get the "Register here" link, the rest the plain URL.
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/plain": new Blob([shareMessage(info, lang)], { type: "text/plain" }),
            "text/html": new Blob([shareHtml(info, lang)], { type: "text/html" }),
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(shareMessage(info, lang));
      }
      setCopied(what);
      toast.success(what === "code" ? "Code copied" : "Message copied", {
        description: what === "message" ? "Paste it in WhatsApp, Facebook, Instagram or anywhere." : undefined,
      });
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("Couldn't copy", { description: "Please select the text and copy it yourself." });
    }
  };

  const share = async () => {
    if (!info) return;
    const text = shareMessage(info, lang);
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        // Closed the share sheet: nothing to do.
        return;
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  const rewardsOn = !!info && info.reward > 0;

  return (
    <div className="mx-auto max-w-5xl">
      <SEO title="Refer & Earn | Seetha Rama Kalyana" description="Invite friends and earn." noindex />
      <PageHeader
        title="Refer & Earn"
        description={
          rewardsOn
            ? `Invite friends and family. They save ₹${info.discount}, you get ₹${info.reward} back for every friend who joins.`
            : "Invite friends and family to find their match here."
        }
      />

      {error && (
        <Card className="mb-6 border-destructive/40">
          <CardContent className="py-6 text-sm text-destructive">Couldn't load your referral code: {error}</CardContent>
        </Card>
      )}

      {/* Code + message */}
      <Card className="mb-6 overflow-hidden border-gold/40">
        <div className="bg-gradient-to-br from-primary to-primary/80 p-5 text-primary-foreground sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-foreground/75">Your referral code</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {info ? (
              <span className="font-mono text-3xl font-bold tracking-[0.2em] sm:text-4xl">{info.code}</span>
            ) : (
              <Skeleton className="h-10 w-48 bg-primary-foreground/20" />
            )}
            <Button
              size="sm"
              variant="secondary"
              disabled={!info}
              onClick={() => copy("code")}
              aria-label="Copy referral code">
              {copied === "code" ? <Check /> : <Copy />}
              {copied === "code" ? "Copied" : "Copy code"}
            </Button>
          </div>
        </div>
        <CardContent className="space-y-4 p-5 sm:p-6">
          <div>
            <p className="mb-2 text-sm font-semibold">Message language</p>
            <div className="mb-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Message language">
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
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}>
                  {l.label}
                </button>
              ))}
            </div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">Message to share</p>
              <button
                type="button"
                disabled={!info}
                onClick={() => copy("message")}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-semibold text-primary hover:bg-primary/10 disabled:opacity-50"
                aria-label="Copy message with your link and code">
                {copied === "message" ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied === "message" ? "Copied" : "Copy"}
              </button>
            </div>
            {info ? (
              <p
                lang={localeOf(lang)}
                className="whitespace-pre-line break-words rounded-xl border border-border bg-muted/40 p-4 text-sm leading-relaxed">
                {(() => {
                  const p = shareParts(info, lang);
                  return (
                    <>
                      {p.intro}
                      {"\n\n"}
                      {p.offer}
                      {"\n\n"}
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={p.url}
                        className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80">
                        {p.label}
                      </a>
                    </>
                  );
                })()}
              </p>
            ) : (
              <Skeleton className="h-32 w-full rounded-xl" />
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button className="sm:flex-1" disabled={!info} onClick={() => copy("message")}>
              {copied === "message" ? <Check /> : <Copy />}
              Copy message & link
            </Button>
            <Button className="sm:flex-1" variant="outline" disabled={!info} onClick={share}>
              <Share2 />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* How it works */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-display text-2xl">How it works</CardTitle>
          {info && !rewardsOn && (
            <CardDescription>
              Registration is free right now, so there's no discount or reward. Rewards come back when paid registration returns.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <ol className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Share2,
                title: "Share your code",
                text: "Copy the message above and post it on WhatsApp, Facebook, Instagram or send it to family.",
              },
              {
                icon: UserPlus,
                title: rewardsOn ? `Your friend saves ₹${info.discount}` : "Your friend registers",
                text: rewardsOn
                  ? `They register with your code (it fills in by itself from your link) and pay ₹${info.friendFee} instead of ₹${info.registrationFee}.`
                  : "They register with your code. It fills in by itself when they open your link.",
              },
              {
                icon: IndianRupee,
                title: rewardsOn ? `You get ₹${info.reward}` : "You get rewarded",
                text: rewardsOn
                  ? `As soon as your friend joins, we email you to let you know and send ₹${info.reward} back to the card, UPI or bank account you paid us with. Banks usually show it in 5–7 working days.`
                  : "When paid registration is on, you get money back for every friend who joins.",
              },
            ].map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                    {i + 1}
                  </span>
                  <s.icon className="size-4 text-primary" />
                </div>
                <p className="mt-3 font-semibold">{s.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            The reward is a partial refund of one of your own payments made in the last 6 months. If we can't refund
            (for example you joined free or paid long ago), our team pays it to you directly. No limit on friends.
          </p>
        </CardContent>
      </Card>

      {/* Earnings */}
      <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Friends joined", value: info ? String(info.totals.joined) : "–", icon: Users, accent: true },
          { label: "Earned", value: info ? `₹${info.totals.paid}` : "–", icon: Gift },
          { label: "On its way", value: info ? `₹${info.totals.pending}` : "–", icon: IndianRupee },
        ].map((s) => (
          <div
            key={s.label}
            className={cn(
              "rounded-2xl border p-4 sm:p-5",
              s.accent ? "border-primary/20 bg-primary text-primary-foreground" : "border-border bg-card"
            )}>
            <p
              className={cn(
                "text-xs font-semibold uppercase tracking-wide",
                s.accent ? "text-primary-foreground/75" : "text-muted-foreground"
              )}>
              {s.label}
            </p>
            <p className="mt-1 font-display text-2xl font-bold sm:text-4xl">{s.value}</p>
          </div>
        ))}
      </div>

      {info && info.rewards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">Your rewards</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {info.rewards.map((r, i) => (
              <div key={i} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{r.friendName} joined</p>
                  <p className="text-xs text-muted-foreground">
                    {date(r.createdAt)}
                    {r.paidAt ? ` · sent ${date(r.paidAt)}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="font-bold">₹{r.amount}</span>
                  <Badge className={STATUS[r.status].className}>{STATUS[r.status].label}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReferEarn;
