import { Suspense, lazy, useEffect, useState } from "react";
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
import { REGISTRATION_FEE, REGISTRATION_FEE_ORIGINAL, SEO_URL } from "@/utils/constants";
import { isLoggedIn } from "@/lib/session";
import { usePublicLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { landerText } from "./lang";

// Only the login form is needed on first paint; the rest load when opened.
const RegistrationForm = lazy(() => import("@/components/forms/register/RegistrationForm"));
const ForgotPasswordForm = lazy(() => import("@/components/forms/ForgotPasswordForm"));
const LatestPosts = lazy(() => import("./LatestPosts"));

const stepIcons = [<UserRoundPlus />, <Users />, <HeartHandshake />];
const valueIcons = [<ShieldCheck />, <Lock />, <IndianRupee />, <Bell />, <Sparkles />, <BadgeCheck />];
const heroIcons = [<ShieldCheck />, <Lock />, <IndianRupee />, <BadgeCheck />];

const Lander = () => {
  const [form, setForm] = useState<FormType>("login");
  const navigate = useNavigate();
  const t = landerText[usePublicLang()[0]];

  useEffect(() => {
    if (isLoggedIn()) navigate("/home", { replace: true });
    // Ad links use /?join=1 to open registration instead of login. Read after mount so the
    // prerendered (login) markup still hydrates cleanly.
    else if (new URLSearchParams(window.location.search).has("join")) {
      setForm(1);
      document.getElementById("join")?.scrollIntoView({ block: "start" });
    }
  }, [navigate]);

  const changeForm = (f: FormType) => {
    setForm(f);
    document.getElementById("join")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const registering = form === 1 || form === 2 || form === 3;

  return (
    <>
      <SEO
        title="Seetha Rama Kalyana | Hindu Matrimony"
        description="Join Seetha Rama Kalyana, the trusted Hindu matrimony platform, to find your ideal life partner with respect, dharma, and tradition."
        keywords="hindu matrimony, seetha rama kalyana, matchmaking, marriage, kannada matrimony, brahmin matrimony"
        url={SEO_URL}
      />

      {/* Hero */}
      <section className="bg-sunrise relative overflow-hidden">
        <div className="bg-kolam pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          {/* lg: emblem with the copy below it on the left, form on the right.
              Smaller screens stack emblem, form, then copy. */}
          <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr] lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-4">
            {/* The round logo, with a Sanskrit verse (romanised) set on an arc above it and another below. */}
            <div className="lg:col-start-1 lg:row-start-1">
              <h1 className="sr-only">
                <span lang="sa-Latn">tava anveṣaṇaṃ saphalaṃ bhavatu</span> ({t.srMeaning})
              </h1>
              <div className="relative mx-auto size-[21rem] sm:size-96 lg:size-[30rem]">
                <img
                  src="/logo.png"
                  alt={t.emblemAlt}
                  width={512}
                  height={512}
                  loading="eager"
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
                  {form === "login" && <LoginForm setCurrentForm={changeForm} />}
                  <Suspense
                    fallback={
                      <div className="flex min-h-64 items-center justify-center">
                        <OmSpinner className="size-14" />
                      </div>
                    }>
                    {form === "forgotPassword" && <ForgotPasswordForm setCurrentForm={changeForm} />}
                    {registering && <RegistrationForm setCurrentForm={changeForm} />}
                  </Suspense>
                </div>
              </div>
              {form === "login" && (
                <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-primary px-5 py-4 text-primary-foreground shadow-lg">
                  <div>
                    <p className="text-xs uppercase tracking-wide opacity-80">{t.annual}</p>
                    <p className="font-display text-2xl font-bold">
                      ₹{REGISTRATION_FEE} <span className="text-base font-normal opacity-70 line-through">₹{REGISTRATION_FEE_ORIGINAL}</span>
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
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{t.intro1}</p>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">{t.intro2}</p>
            </div>
          </div>

          {/* Key points */}
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {t.heroPoints.map((p, i) => (
              <li key={i} className="flex items-start gap-3 rounded-2xl border border-gold/30 bg-card/80 p-3 shadow-sm backdrop-blur">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary [&_svg]:size-4">
                  {heroIcons[i]}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{p.title}</span>
                  <span className="block text-xs text-muted-foreground">{p.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading eyebrow={t.howEyebrow} title={t.howTitle} />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {t.steps.map((s, i) => (
            <div key={i} className="relative rounded-3xl border border-border bg-card p-6 shadow-sm">
              <span className="absolute right-5 top-4 font-display text-5xl font-bold text-gold/25">{i + 1}</span>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground [&_svg]:size-6">
                {stepIcons[i]}
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-kolam border-y border-gold/20 bg-accent/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading
            eyebrow={t.valuesEyebrow}
            title={t.valuesTitle}
            description={t.valuesDescription}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.values.map((v, i) => (
              <div key={i} className="flex gap-4 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
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
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading align="left" eyebrow={t.blogEyebrow} title={t.blogTitle} />
          <Button asChild variant="outline">
            <Link to="/blog">
              {t.allArticles} <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Suspense fallback={null}>
            <LatestPosts />
          </Suspense>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-primary px-6 py-12 text-center text-primary-foreground shadow-2xl sm:px-12">
          <div className="bg-kolam pointer-events-none absolute inset-0 opacity-30" />
          <Lotus className="relative mx-auto h-8 w-14 text-gold" />
          <h2 className="relative mt-3 font-display text-3xl font-bold sm:text-4xl">
            {t.ctaTitle}
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl opacity-85">{t.ctaText}</p>
          <Button size="lg" variant="secondary" className="relative mt-6" onClick={() => changeForm(1)}>
            {t.ctaButton}
          </Button>
        </div>
      </section>
    </>
  );
};

export default Lander;
