import { Link } from "react-router-dom";
import {
  ArrowRight,
  Globe,
  Heart,
  IndianRupee,
  Lock,
  Mail,
  ScrollText,
  ShieldCheck,
  Smartphone,
  Users,
  CircleHelp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Lotus, SectionHeading } from "@/components/common/Brand";
import SEO from "@/components/misc/SEO";
import { SEO_URL } from "@/utils/constants";
import { usePublicLang } from "@/lib/i18n";
import { aboutText } from "./lang";
import hanuman from "@/assets/hanuman.webp";

const valueIcons = [<ShieldCheck />, <IndianRupee />, <Users />, <Mail />, <Smartphone />, <Heart />];

const links = [
  { to: "/faq", icon: <CircleHelp /> },
  { to: "/pricing", icon: <IndianRupee /> },
  { to: "/terms", icon: <ScrollText /> },
  { to: "/privacy", icon: <Lock /> },
];

const AboutUs = () => {
  const t = aboutText[usePublicLang()[0]];
  return (
    <>
      <SEO
        title="About Us | Seetha Rama Kalyana"
        description="Learn about Seetha Rama Kalyana, our mission, and our dedicated team serving the Hindu community."
        keywords="hindu matrimony, about us, seetha rama kalyana"
        url={SEO_URL + "/about-us"}
      />

      <section className="bg-sunrise relative overflow-hidden">
        <div className="bg-kolam pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <Lotus className="mx-auto h-7 w-12 text-gold" />
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-6xl">
            {t.heroLead} <span className="text-gradient-gold">{t.heroGold}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground sm:text-lg">
            {t.introBefore} <b className="text-foreground">{t.introBold}</b>
            {t.introAfter}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div className="relative">
          <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-gold/40 to-primary/20 blur-xl" />
          <img
            src={hanuman}
            alt={t.hanumanAlt}
            className="relative aspect-[4/3] w-full rounded-[2rem] border-4 border-card object-cover shadow-xl"
          />
        </div>
        <div>
          <SectionHeading align="left" eyebrow={t.missionEyebrow} title={t.missionTitle} />
          <div className="mt-5 space-y-4 text-muted-foreground">
            <p>{t.mission1}</p>
            <p className="rounded-2xl border border-gold/40 bg-accent p-4 text-sm text-accent-foreground">
              <b>{t.noteBold}</b> {t.noteText}
            </p>
            <p>{t.mission2}</p>
          </div>
        </div>
      </section>

      <section className="bg-kolam border-y border-gold/20 bg-accent/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <SectionHeading eyebrow={t.whyEyebrow} title={t.whyTitle} />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.values.map((v, i) => (
              <div key={i} className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground [&_svg]:size-5">
                  {valueIcons[i]}
                </div>
                <h3 className="mt-4 font-display text-xl font-bold">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading eyebrow={t.resourcesEyebrow} title={t.resourcesTitle} />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((l, i) => (
            <Link key={l.to} to={l.to} className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-md">
              <span className="flex size-10 items-center justify-center rounded-full bg-accent text-primary [&_svg]:size-5">{l.icon}</span>
              <h3 className="mt-3 flex items-center gap-1 font-semibold group-hover:text-primary">
                {t.links[i].title} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.links[i].text}</p>
            </Link>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl bg-primary px-6 py-10 text-center text-primary-foreground">
          <Globe className="size-8 text-gold" />
          <h2 className="font-display text-3xl font-bold">{t.ctaTitle}</h2>
          <p className="opacity-85">{t.ctaText}</p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/">{t.ctaButton}</Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
