import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  HeartHandshake,
  IndianRupee,
  Lock,
  ShieldCheck,
  Sparkles,
  UserRoundPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Lotus, SectionHeading } from "@/components/common/Brand";
import { OmSpinner } from "@/components/common/Loaders";
import LoginForm from "@/components/forms/LoginForm";
import SEO from "@/components/misc/SEO";
import type { FormType } from "@/utils/interfaces";
import { feeLabel, fillPrices, usePricing } from "@/lib/pricing";
import { isLoggedIn } from "@/lib/session";
import { usePublicLang } from "@/lib/i18n";
import { seoText } from "@/lib/seoText";
import { cn } from "@/lib/utils";
import { landerText } from "./lang";

// Only the login form is needed on first paint; the rest load when opened.
const RegistrationForm = lazy(() => import("@/components/forms/register/RegistrationForm"));
const ForgotPasswordForm = lazy(() => import("@/components/forms/ForgotPasswordForm"));
const LatestPosts = lazy(() => import("./LatestPosts"));

const stepIcons = [<UserRoundPlus />, <Users />, <HeartHandshake />];
const valueIcons = [<ShieldCheck />, <Lock />, <IndianRupee />, <Bell />, <Sparkles />, <BadgeCheck />];
const heroIcons = [<ShieldCheck />, <Lock />, <IndianRupee />, <BadgeCheck />];

// A sideways swipe row on phones (the next card peeks in), a grid from sm up.
const swipeRow =
  "-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0";

const Lander = () => {
  const [form, setForm] = useState<FormType>("login");
  // Login and forgot-password share it, so a partner's reset stays on the partner account.
  const [isPartner, setIsPartner] = useState(false);
  const navigate = useNavigate();
  const [lang] = usePublicLang();
  const pricing = usePricing();
  const t = useMemo(() => fillPrices(landerText[lang], pricing, lang), [lang, pricing]);

  useEffect(() => {
    if (isLoggedIn()) navigate("/home", { replace: true });
    // Ad links use /?join=1 (and refer & earn links ?ref=CODE) to open registration instead of login. Read after mount so the
    // prerendered (login) markup still hydrates cleanly.
    else if (["join", "ref"].some((k) => new URLSearchParams(window.location.search).has(k))) {
      setForm(1);
      document.getElementById("join")?.scrollIntoView({ block: "start" });
    }
  }, [navigate]);

  const changeForm = (f: FormType) => {
    setForm(f);
    if (f === 1) setIsPartner(false);
    document.getElementById("join")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const registering = form === 1 || form === 2 || form === 3;

  // Phones: once the form has scrolled away above, a slim bar keeps "Register" a thumb away.
  // It hides again at the closing CTA, which offers the same button.
  const [showBar, setShowBar] = useState(false);
  useEffect(() => {
    const join = document.getElementById("join");
    const cta = document.getElementById("closing-cta");
    if (!join || !cta) return;
    const seen = new Map<Element, IntersectionObserverEntry>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => seen.set(e.target, e));
      const j = seen.get(join);
      const c = seen.get(cta);
      setShowBar(!!j && !j.isIntersecting && j.boundingClientRect.top < 0 && !c?.isIntersecting);
    });
    io.observe(join);
    io.observe(cta);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <SEO
        title={seoText.home[lang].title}
        description={seoText.home[lang].description}
        keywords="hindu matrimony, hindu matrimony india, hindu brides, hindu grooms, matrimony site, kundli matching, brahmin matrimony, seetha rama kalyana"
      />

      {/* Hero */}
      <section className="bg-sunrise relative overflow-hidden">
        <div className="bg-kolam pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-4 sm:px-6 sm:py-10">
          {/* lg: emblem with the copy below it on the left, form on the right.
              Smaller screens stack emblem, form, then copy. */}
          <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-[1.1fr_1fr] lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-4">
            {/* The round logo, with a Sanskrit verse (romanised) set on an arc above it and another below. */}
            <div className="lg:col-start-1 lg:row-start-1">
              <h1 className="sr-only">
                <span lang="sa-Latn">tava anveṣaṇaṃ saphalaṃ bhavatu</span> ({t.srMeaning})
              </h1>
              <div className="relative mx-auto size-[18.5rem] sm:size-96 lg:size-[30rem]">
                <img
                  // The page's largest image (LCP). Kept in step with the preload in index.html.
                  src="/logo-512.webp"
                  srcSet="/logo-384.webp 384w, /logo-512.webp 512w"
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 288px, 222px"
                  alt={t.emblemAlt}
                  width={512}
                  height={512}
                  loading="eager"
                  fetchPriority="high"
                  className="absolute inset-[12.5%] size-3/4 rounded-full shadow-xl shadow-primary/20 ring-4 ring-gold/30"
                />
                <svg viewBox="0 0 400 400" aria-hidden className="absolute inset-0 size-full overflow-visible">
                  <defs>
                    {/* Full circle starting at the bottom, drawn clockwise, so its midpoint is the top. */}
                    <path id="hero-arc" d="M200,366 A166,166 0 1,1 200,34 A166,166 0 1,1 200,366" />
                    {/* Lower half, left to right, so that text reads upright. Its letters hang
                        inward from the line, hence the larger radius to clear the image. */}
                    <path id="hero-arc-bottom" d="M20,200 A180,180 0 0,0 380,200" />
                    <linearGradient id="hero-gold" x1="0" x2="1">
                      <stop offset="0" stopColor="var(--saffron-700)" />
                      <stop offset="1" stopColor="var(--marigold)" />
                    </linearGradient>
                  </defs>
                  {/* textLength spreads each verse over nearly its half of the circle (πr, less a
                      small gap at each side), so together the two lines ring the emblem. */}
                  <text lang="sa-Latn" className="font-display text-[36px] font-bold" fill="var(--foreground)">
                    <textPath href="#hero-arc" startOffset="50%" textAnchor="middle" textLength={500} lengthAdjust="spacing">
                      tava anveṣaṇaṃ <tspan fill="url(#hero-gold)">saphalaṃ bhavatu</tspan>
                    </textPath>
                  </text>
                  <text lang="sa-Latn" className="font-display text-[25px] font-bold italic" fill="var(--foreground)">
                    <textPath href="#hero-arc-bottom" startOffset="50%" textAnchor="middle" textLength={545} lengthAdjust="spacing">
                      <tspan fill="url(#hero-gold)">śrī-rāmacandra-caraṇau</tspan> śaraṇaṃ prapadye
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>

            <div id="join" className="w-full scroll-mt-24 lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <div className="auth-form rounded-[1.75rem] bg-card p-2 shadow-2xl shadow-primary/15 ring-1 ring-gold/40">
                {(form === "login" || registering) && (
                  <div className="mb-2 grid grid-cols-2 gap-1 rounded-[1.4rem] bg-muted p-1">
                    {(
                      [
                        { key: "login", label: t.login, active: form === "login", go: "login" },
                        { key: "register", label: t.register, active: registering, go: 1 },
                      ] as const
                    ).map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => !t.active && changeForm(t.go)}
                        aria-pressed={t.active}
                        className={cn(
                          "rounded-[1.1rem] py-2.5 text-sm font-bold transition",
                          t.active ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                )}
                <div className="p-3 sm:p-6">
                  {form === "login" && <LoginForm setCurrentForm={changeForm} isPartner={isPartner} setIsPartner={setIsPartner} />}
                  <Suspense
                    fallback={
                      <div className="flex min-h-64 items-center justify-center">
                        <OmSpinner className="size-14" />
                      </div>
                    }>
                    {form === "forgotPassword" && <ForgotPasswordForm setCurrentForm={changeForm} isPartner={isPartner} />}
                    {registering && <RegistrationForm setCurrentForm={changeForm} />}
                  </Suspense>
                </div>
              </div>
              {form === "login" && (
                <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-primary px-5 py-4 text-primary-foreground shadow-lg">
                  <div>
                    <p className="text-xs uppercase tracking-wide opacity-80">{t.annual}</p>
                    <p className="font-display text-2xl font-bold">
                      {feeLabel(pricing.registrationFee, lang)}{" "}
                      {pricing.registrationFeeOriginal ? (
                        <span className="text-base font-normal opacity-70 line-through">₹{pricing.registrationFeeOriginal}</span>
                      ) : null}
                    </p>
                  </div>
                  <Button variant="secondary" onClick={() => changeForm(1)}>
                    {t.register}
                    <ArrowRight />
                  </Button>
                </div>
              )}
            </div>

            {/* Below lg this drops under the form as plain full-width lines. */}
            <div className="mx-auto max-w-2xl text-center lg:col-start-1 lg:row-start-2">
              <Lotus className="mx-auto mb-3 h-4 w-8 text-gold lg:hidden" />
              <p className="text-[15px] leading-relaxed text-foreground/80 sm:text-lg sm:text-muted-foreground">{t.intro1}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground sm:text-lg">{t.intro2}</p>
            </div>
          </div>

          {/* Key points */}
          <ul className="mt-8 grid grid-cols-2 gap-2.5 sm:mt-10 sm:gap-3 lg:grid-cols-4">
            {t.heroPoints.map((p, i) => (
              <li
                key={i}
                className="flex flex-col items-center gap-2 rounded-2xl border border-gold/30 bg-card/85 p-3 text-center shadow-sm backdrop-blur sm:flex-row sm:items-start sm:gap-3 sm:text-left">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-saffron-100 to-accent text-primary ring-1 ring-gold/30 sm:size-9 sm:rounded-xl [&_svg]:size-4">
                  {heroIcons[i]}
                </span>
                <span>
                  <span className="block text-[13px] font-bold leading-snug sm:text-sm sm:font-semibold">{p.title}</span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground sm:text-xs">{p.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <SectionHeading eyebrow={t.howEyebrow} title={t.howTitle} />
        {/* Phones: a vertical timeline, the icons joined by a gold thread. md+: three cards. */}
        <ol className="relative mt-8 grid gap-4 sm:mt-10 md:grid-cols-3 md:gap-5">
          <span
            aria-hidden
            className="absolute bottom-10 left-[2.75rem] top-10 w-0.5 bg-gradient-to-b from-primary via-gold to-primary/30 md:hidden"
          />
          {t.steps.map((s, i) => (
            <li key={i} className="relative flex gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm md:block md:p-6">
              <span className="absolute right-5 top-3 font-display text-4xl font-bold text-gold/25 md:top-4 md:text-5xl">{i + 1}</span>
              <div className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/25 [&_svg]:size-6">
                {stepIcons[i]}
              </div>
              <div className="min-w-0 pr-6 md:pr-0">
                <h3 className="font-display text-xl font-bold leading-tight md:mt-4 md:text-2xl">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground md:mt-2">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Values */}
      <section className="bg-kolam border-y border-gold/20 bg-accent/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
          <SectionHeading
            eyebrow={t.valuesEyebrow}
            title={t.valuesTitle}
            description={t.valuesDescription}
          />
          <div className={cn(swipeRow, "mt-8 sm:mt-10 lg:grid-cols-3")}>
            {t.values.map((v, i) => (
              <div
                key={i}
                className="flex w-[78%] shrink-0 snap-center flex-col gap-3 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border sm:w-auto sm:flex-row sm:gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary [&_svg]:size-5">
                  {valueIcons[i]}
                </div>
                <div>
                  <h3 className="font-semibold">{v.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog teaser */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading align="left" eyebrow={t.blogEyebrow} title={t.blogTitle} />
          <Button asChild variant="outline">
            <Link to="/blog">
              {t.allArticles} <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className={cn(swipeRow, "mt-6 sm:mt-8 sm:gap-5 lg:grid-cols-3")}>
          <Suspense fallback={null}>
            <LatestPosts />
          </Suspense>
        </div>
      </section>

      {/* CTA */}
      <section id="closing-cta" className="px-4 pb-12 sm:px-6 sm:pb-20">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-primary px-6 py-10 sm:py-12 text-center text-primary-foreground shadow-2xl sm:px-12">
          <div className="bg-kolam pointer-events-none absolute inset-0 opacity-30" />
          <Lotus className="relative mx-auto h-8 w-14 text-gold" />
          <h2 className="relative mt-3 font-display text-3xl font-bold sm:text-4xl">
            {t.ctaTitle}
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl opacity-85">{t.ctaText}</p>
          <Button size="lg" variant="secondary" className="relative mt-6 h-12 w-full max-w-sm sm:w-auto" onClick={() => changeForm(1)}>
            {t.ctaButton}
          </Button>
        </div>
      </section>

      {/* Phones only; see showBar above. */}
      <div
        aria-hidden={!showBar}
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-gold/30 bg-background/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_-12px_rgb(0_0_0/0.25)] backdrop-blur-md transition-transform duration-300 sm:hidden",
          showBar ? "translate-y-0" : "pointer-events-none translate-y-full"
        )}>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{t.annual}</p>
            <p className="font-display text-xl font-bold leading-none text-primary">
              {feeLabel(pricing.registrationFee, lang)}{" "}
              {pricing.registrationFeeOriginal ? (
                <span className="text-sm font-normal text-muted-foreground line-through">₹{pricing.registrationFeeOriginal}</span>
              ) : null}
            </p>
          </div>
          <Button size="lg" className="h-11 shrink-0 px-5" tabIndex={showBar ? 0 : -1} onClick={() => changeForm(1)}>
            {t.register}
            <ArrowRight />
          </Button>
        </div>
      </div>
    </>
  );
};

export default Lander;
