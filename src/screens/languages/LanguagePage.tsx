import { Link, useParams } from "react-router-dom";
import { ArrowRight, BadgeCheck, EyeOff, Globe, Languages, MapPin, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Kalasha, Thoranam } from "@/components/common/Ornaments";
import SEO from "@/components/misc/SEO";
import NotFound from "@/screens/notFound/NotFound";
import { SEO_URL } from "@/utils/constants";
import { usePricing } from "@/lib/pricing";
import { communities } from "@/screens/communities/seoComm";
import { cities } from "@/screens/cities/seoCities";
import { languages } from "./seoLanguages";

const SITE_NAMES = { kn: "ಕನ್ನಡ", te: "తెలుగు", ta: "தமிழ்", hi: "हिंदी" } as const;

/** Landing page for one language, e.g. /languages/kannada-matrimony. */
const LanguagePage = () => {
  const { slug } = useParams();
  const pricing = usePricing();
  const page = languages.find((l) => l.slug === slug);
  if (!page) return <NotFound />;

  const { name } = page;
  const url = `${SEO_URL}/languages/${page.slug}`;
  const related = communities.filter((c) => page.communities.includes(c.slug));
  const nearby = cities.filter((c) => page.cities.includes(c.slug));
  const others = languages.filter((l) => l.slug !== page.slug);
  const fee =
    pricing.registrationFee > 0
      ? `Membership is ₹${pricing.registrationFee} a year and includes ${pricing.registrationInterests} credits (1 credit = 1 interest).`
      : `Registration is free right now and includes ${pricing.registrationInterests} credits (1 credit = 1 interest).`;

  const faqs = [
    {
      question: `How do I find ${name} brides and grooms on Seetha Rama Kalyana?`,
      answer: `Register, choose ${name} as your mother tongue and add it to your partner preferences, along with your community. Your matches page then shows ${name}-speaking families whose own preferences include you.`,
    },
    {
      question: `Which ${name} communities can I search?`,
      answer: `All Hindu communities and sub-castes, including ${related.map((c) => c.name).join(", ")}. You can search within your own community or across several.`,
    },
    ...(page.site
      ? [
          {
            question: `Is the site available in ${name}?`,
            answer: `Yes. The full site, including registration, is available in ${name} at seetharamakalyana.in/${page.site}.`,
          },
        ]
      : []),
    {
      question: "How many profiles are there?",
      answer:
        "Seetha Rama Kalyana is newly launched and the community is still growing, so numbers are modest today. Every member's mobile number is verified with a one-time code, and new families join every week.",
    },
    {
      question: `How much does ${name} matrimony cost?`,
      answer: `${fee} The full pricing is on one page, before you register, and there are no sales calls.`,
    },
  ];

  const title = `${name} Matrimony`;

  return (
    <>
      <SEO
        title={`${title} | ${page.native} – Seetha Rama Kalyana`}
        description={`${title}: find ${name}-speaking Hindu brides and grooms from ${related
          .slice(0, 3)
          .map((c) => c.name)
          .join(", ")} and other communities. Verified profiles, two-way privacy and ${
          pricing.registrationFee > 0 ? `membership at ₹${pricing.registrationFee}/year` : "free registration"
        }.`}
        keywords={`${name.toLowerCase()} matrimony, ${name.toLowerCase()} brides, ${name.toLowerCase()} grooms, ${name.toLowerCase()} marriage, ${page.native}, ${related
          .map((c) => `${c.name.toLowerCase()} ${name.toLowerCase()} matrimony`)
          .join(", ")}`}
        url={url}
        pageType="faq"
        faqItems={faqs}
        additionalSchema={[
          {
            "@type": "Service",
            name: title,
            serviceType: "Hindu matrimony",
            provider: { "@id": `${SEO_URL}/#organization` },
            availableLanguage: page.site ? ["English", name] : ["English"],
            url,
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SEO_URL },
              { "@type": "ListItem", position: 2, name: "Matrimony by language", item: `${SEO_URL}/languages` },
              { "@type": "ListItem", position: 3, name: title, item: url },
            ],
          },
        ]}
      />

      <section className="bg-sunrise relative overflow-hidden">
        <div className="bg-kolam pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs font-semibold text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link> /{" "}
            <Link to="/languages" className="hover:text-primary">Matrimony by language</Link> /{" "}
            <span className="text-foreground">{name}</span>
          </nav>
          <div className="flex items-center justify-center gap-3">
            <Kalasha className="size-10" />
            <Thoranam className="h-8" leaves={5} />
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-6xl">
            {name} <span className="text-gradient-gold">Matrimony</span>
          </h1>
          <p lang={page.nativeLang} className="mt-3 text-2xl font-semibold text-primary sm:text-3xl">
            {page.native}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground sm:text-lg">{page.about}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link to={page.site ? `/${page.site}` : "/"}>
                Create your profile <ArrowRight />
              </Link>
            </Button>
            {page.site && (
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to={`/${page.site}`} lang={page.site}>
                  <Globe /> {SITE_NAMES[page.site]}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {[
          { icon: <MapPin />, title: "Where families live", text: page.regions },
          {
            icon: <Languages />,
            title: page.site ? `Site in ${name}` : "Your mother tongue",
            text: page.site
              ? `Register and browse fully in ${name}, or in English.`
              : `Choose ${name} as your mother tongue and search for ${name}-speaking families.`,
          },
          { icon: <BadgeCheck />, title: "Verified families", text: "Every mobile number is confirmed with a one-time code." },
          { icon: <EyeOff />, title: "Two-way privacy", text: "Only members who fit your preferences can see you." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-card p-5">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground [&_svg]:size-5">
              {f.icon}
            </span>
            <h2 className="mt-3 font-semibold">{f.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-14 sm:px-6">
        <div className="rounded-2xl border border-gold/40 bg-accent/40 p-6">
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
            <Sparkles className="size-5 text-gold" /> Common {name} wedding customs
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-foreground/85">
            {page.customs.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            Customs vary from family to family and community to community; this is a general guide.
          </p>
        </div>
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-semibold">Tip for {name} families</h2>
          <p className="mt-1 text-sm text-muted-foreground">{page.tip}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <h2 className="mb-5 text-center font-display text-3xl font-bold">{name} communities</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((c) => (
            <Link
              key={c.slug}
              to={`/communities/${c.slug}`}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:border-gold/60">
              <Users className="size-4 shrink-0 text-primary" />
              <span>
                <span className="font-semibold">{c.name} Matrimony</span>
                <span className="block text-sm text-muted-foreground">{c.sub}</span>
              </span>
            </Link>
          ))}
        </div>
        {nearby.length > 0 && (
          <>
            <h2 className="mb-5 mt-10 text-center font-display text-2xl font-bold">Cities with {name} families</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {nearby.map((c) => (
                <Link
                  key={c.slug}
                  to={`/matrimony/${c.slug}`}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:border-gold/60">
                  <MapPin className="size-4 text-primary" />
                  {c.slug === "nri" ? "NRI Matrimony" : `${c.name} Matrimony`}
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-14 sm:px-6">
        <h2 className="mb-5 text-center font-display text-3xl font-bold">{name} matrimony questions</h2>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f) => (
            <AccordionItem key={f.question} value={f.question} className="rounded-2xl border border-border bg-card px-4 last:border-b">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">{f.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="border-t border-border bg-accent/40">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="mb-5 font-display text-2xl font-bold">Other languages</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((l) => (
              <Link
                key={l.slug}
                to={`/languages/${l.slug}`}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 hover:border-gold/60">
                <Languages className="size-4 text-primary" />
                <span className="font-semibold">{l.name} Matrimony</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default LanguagePage;
