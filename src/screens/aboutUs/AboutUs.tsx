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
import { REGISTRATION_FEE, SEO_URL } from "@/utils/constants";
import hanuman from "@/assets/hanuman.webp";

const values = [
  { icon: <ShieldCheck />, title: "Security & trust", text: "Encrypted connections, Razorpay-secured payments and OTP-verified members keep your data protected." },
  { icon: <IndianRupee />, title: `Minimal pricing · ₹${REGISTRATION_FEE}/year`, text: "Our goal is to serve the community, not to profit. We keep pricing minimal so everyone can participate." },
  { icon: <Users />, title: "Serving the Hindu community", text: "Strictly focused on Hindu families, so every match is relevant to our traditions." },
  { icon: <Mail />, title: "Active & engaged", text: "Instant email notifications when someone sends you an interest or accepts yours." },
  { icon: <Smartphone />, title: "Every device", text: "Designed for phones first, and just as comfortable on tablets and desktops." },
  { icon: <Heart />, title: "Sacred vows, modern tech", text: "Traditional values with a modern, easy-to-use platform to find your life partner." },
];

const links = [
  { to: "/faq", icon: <CircleHelp />, title: "FAQs", text: "Answers to common questions about the platform." },
  { to: "/pricing", icon: <IndianRupee />, title: "Pricing", text: "Registration fee and interest plans." },
  { to: "/terms", icon: <ScrollText />, title: "Terms & conditions", text: "The rules for using Seetha Rama Kalyana safely." },
  { to: "/privacy", icon: <Lock />, title: "Privacy policy", text: "How we handle and protect your personal data." },
];

const AboutUs = () => (
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
          Connecting Hindu families, <span className="text-gradient-gold">fostering sacred bonds</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground sm:text-lg">
          Seetha Rama Kalyana is a trusted, secure matrimony platform dedicated exclusively to the{" "}
          <b className="text-foreground">Hindu community</b>, fostering stable bonds rooted in tradition and trust.
        </p>
      </div>
    </section>

    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
      <div className="relative">
        <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-gold/40 to-primary/20 blur-xl" />
        <img
          src={hanuman}
          alt="Lord Hanuman, symbol of devotion and service"
          className="relative aspect-[4/3] w-full rounded-[2rem] border-4 border-card object-cover shadow-xl"
        />
      </div>
      <div>
        <SectionHeading align="left" eyebrow="Our mission" title="Service, in the spirit of Hanuman" />
        <div className="mt-5 space-y-4 text-muted-foreground">
          <p>
            Seetha Rama Kalyana was born from a simple desire: a trusted and accessible platform for Hindu families
            to find their perfect match, honouring community and tradition.
          </p>
          <p className="rounded-2xl border border-gold/40 bg-accent p-4 text-sm text-accent-foreground">
            <b>A note on growth:</b> we are a young platform, actively building our community. The number of
            profiles may be smaller at first. Thank you for your patience as we grow.
          </p>
          <p>
            We are not a profit-oriented business; we are a service to our community. That principle lets us offer
            everything for a minimal fee, so everyone has the opportunity to find happiness.
          </p>
        </div>
      </div>
    </section>

    <section className="bg-kolam border-y border-gold/20 bg-accent/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading eyebrow="Why choose us" title="Our commitment to you" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground [&_svg]:size-5">
                {v.icon}
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{v.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading eyebrow="Resources" title="Quick links" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-md">
            <span className="flex size-10 items-center justify-center rounded-full bg-accent text-primary [&_svg]:size-5">{l.icon}</span>
            <h3 className="mt-3 flex items-center gap-1 font-semibold group-hover:text-primary">
              {l.title} <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{l.text}</p>
          </Link>
        ))}
      </div>
      <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl bg-primary px-6 py-10 text-center text-primary-foreground">
        <Globe className="size-8 text-gold" />
        <h2 className="font-display text-3xl font-bold">Ready to start your journey?</h2>
        <p className="opacity-85">Join our growing community and find your ideal partner.</p>
        <Button asChild size="lg" variant="secondary">
          <Link to="/">Register now · ₹{REGISTRATION_FEE}/year</Link>
        </Button>
      </div>
    </section>
  </>
);

export default AboutUs;
