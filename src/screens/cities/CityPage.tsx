import { Link, useParams } from "react-router-dom";
import { ArrowRight, BadgeCheck, EyeOff, Languages, MapPin, Sparkles, Users } from "lucide-react";
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
import { cities } from "./seoCities";

/** Landing page for one city, e.g. /matrimony/mumbai. */
const CityPage = () => {
  const { slug } = useParams();
  const pricing = usePricing();
  const city = cities.find((c) => c.slug === slug);
  if (!city) return <NotFound />;

  const { name, region, languages } = city;
  const isNri = city.slug === "nri";
  const place = isNri ? "abroad" : `in ${name}`;
  const url = `${SEO_URL}/matrimony/${city.slug}`;
  const local = communities.filter((c) => city.communities.includes(c.slug));
  const others = cities.filter((c) => c.slug !== city.slug);
  const fee =
    pricing.registrationFee > 0
      ? `Membership is ₹${pricing.registrationFee} a year and includes ${pricing.registrationInterests} credits (1 credit = 1 interest).`
      : `Registration is free right now and includes ${pricing.registrationInterests} credits (1 credit = 1 interest).`;

  const faqs = [
    {
      question: `How do I find Hindu brides and grooms ${place}?`,
      answer: `Register, set your caste, mother tongue and location, and add ${isNri ? "the countries" : name} to your partner preferences. Your matches page then shows families whose own preferences include you.`,
    },
    {
      question: `Which communities can I search ${place}?`,
      answer: `All major Hindu communities and over 500 sub-castes, including ${local.map((c) => c.name).join(", ")}. You can search within your own community or across several.`,
    },
    {
      question: "How many profiles are there?",
      answer:
        "Seetha Rama Kalyana is newly launched and the community is still growing, so numbers are modest today. Every member's email and WhatsApp number is verified, and new families join every week.",
    },
    {
      question: "Who can see my profile?",
      answer:
        "Only members who fit your partner preferences can find or view your profile. You can also block anyone by their Profile ID.",
    },
    {
      question: "How much does it cost?",
      answer: `${fee} There are no sales calls or hidden charges.`,
    },
  ];

  const title = isNri ? "NRI Hindu Matrimony" : `Hindu Matrimony in ${name}`;

  return (
    <>
      <SEO
        title={`${title} | Brides & Grooms | Seetha Rama Kalyana`}
        description={`${title}: find ${languages.slice(0, 3).join(", ")} speaking Hindu brides and grooms from ${local
          .slice(0, 3)
          .map((c) => c.name)
          .join(", ")} and other communities. Verified profiles, two-way privacy and kundli matching.`}
        keywords={`${isNri ? "nri matrimony, nri hindu matrimony" : `${name} matrimony, hindu matrimony ${name}, ${name} brides, ${name} grooms`}, ${local
          .map((c) => `${c.name} matrimony ${isNri ? "nri" : name}`)
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
            areaServed: isNri ? "Worldwide" : { "@type": "City", name, containedInPlace: region },
            availableLanguage: languages,
            url,
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SEO_URL },
              { "@type": "ListItem", position: 2, name: "Matrimony by city", item: `${SEO_URL}/matrimony` },
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
            <Link to="/matrimony" className="hover:text-primary">Matrimony by city</Link> /{" "}
            <span className="text-foreground">{name}</span>
          </nav>
          <div className="flex items-center justify-center gap-3">
            <Kalasha className="size-10" />
            <Thoranam className="h-8" leaves={5} />
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-6xl">
            {isNri ? (
              <>
                NRI Hindu <span className="text-gradient-gold">Matrimony</span>
              </>
            ) : (
              <>
                Hindu Matrimony in <span className="text-gradient-gold">{name}</span>
              </>
            )}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground sm:text-lg">{city.intro}</p>
          <Button asChild size="lg" className="mt-8 rounded-full">
            <Link to="/">
              Create your profile <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {[
          { icon: <MapPin />, title: region, text: isNri ? "Families abroad and in India, in one place." : `Search near ${name} or across India.` },
          { icon: <Languages />, title: "Your language", text: languages.join(", ") },
          { icon: <BadgeCheck />, title: "Verified families", text: "Email and WhatsApp numbers are confirmed with one-time codes." },
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
            <Sparkles className="size-5 text-gold" /> {isNri ? "NRI weddings" : `Weddings in ${name}`}
          </h2>
          <p className="mt-3 leading-7 text-foreground/85">{city.customs}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <h2 className="mb-5 text-center font-display text-3xl font-bold">
          Communities {isNri ? "NRI families" : `families in ${name}`} search for
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {local.map((c) => (
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
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-14 sm:px-6">
        <h2 className="mb-5 text-center font-display text-3xl font-bold">
          {isNri ? "NRI matrimony questions" : `${name} matrimony questions`}
        </h2>
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
          <h2 className="mb-5 font-display text-2xl font-bold">Other cities</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((c) => (
              <Link
                key={c.slug}
                to={`/matrimony/${c.slug}`}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 hover:border-gold/60">
                <MapPin className="size-4 text-primary" />
                <span className="font-semibold">{c.slug === "nri" ? "NRI Matrimony" : `${c.name} Matrimony`}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default CityPage;
