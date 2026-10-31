import { Link, useParams } from "react-router-dom";
import { ArrowRight, BadgeCheck, EyeOff, Heart, Sparkles, Users } from "lucide-react";
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
import { INITIAL_NO_INTEREST, REGISTRATION_FEE, SEO_URL } from "@/utils/constants";
import { communities } from "./seoComm";

/** Landing page for one community, e.g. /communities/brahmin-matrimony. */
const CommunityPage = () => {
  const { slug } = useParams();
  const community = communities.find((c) => c.slug === slug);
  if (!community) return <NotFound />;

  const { name, sub } = community;
  const subs = sub.split(",").map((s) => s.trim()).filter(Boolean);
  const url = `${SEO_URL}/communities/${community.slug}`;
  const related = communities.filter((c) => c.slug !== community.slug).slice(0, 8);

  const faqs = [
    {
      question: `How do I find ${name} brides and grooms on Seetha Rama Kalyana?`,
      answer: `Register, choose ${name} as your caste and add the communities you are open to in your partner preferences. Your matches page then shows ${name} families whose own preferences include you.`,
    },
    {
      question: `Can I choose a specific ${name} sub-caste?`,
      answer: `Yes. Sub-castes such as ${subs.join(", ")} can be selected on your profile and used as filters while you search.`,
    },
    {
      question: "Who can see my profile?",
      answer:
        "Only members who fit your partner preferences can find or view your profile. You can also block anyone by their Profile ID.",
    },
    {
      question: `How much does ${name} matrimony cost?`,
      answer: `Membership is ₹${REGISTRATION_FEE} a year and includes ${INITIAL_NO_INTEREST} credits (1 credit = 1 interest). There are no sales calls or hidden charges.`,
    },
  ];

  return (
    <>
      <SEO
        title={`${name} Matrimony | ${subs.slice(0, 3).join(", ")} Brides & Grooms | Seetha Rama Kalyana`}
        description={`Find ${name} brides and grooms (${sub}) on Seetha Rama Kalyana. Verified Hindu profiles, two-way privacy controls and membership at ₹${REGISTRATION_FEE}/year.`}
        keywords={`${name} matrimony, ${subs.map((s) => `${s} matrimony`).join(", ")}, ${name} brides, ${name} grooms, hindu matrimony`}
        url={url}
        pageType="faq"
        faqItems={faqs}
        additionalSchema={[
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SEO_URL },
              { "@type": "ListItem", position: 2, name: "Communities", item: `${SEO_URL}/communities` },
              { "@type": "ListItem", position: 3, name: `${name} Matrimony`, item: url },
            ],
          },
        ]}
      />

      <section className="bg-sunrise relative overflow-hidden">
        <div className="bg-kolam pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs font-semibold text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link> /{" "}
            <Link to="/communities" className="hover:text-primary">Communities</Link> /{" "}
            <span className="text-foreground">{name}</span>
          </nav>
          <div className="flex items-center justify-center gap-3">
            <Kalasha className="size-10" />
            <Thoranam className="h-8" leaves={5} />
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-6xl">
            {name} <span className="text-gradient-gold">Matrimony</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground sm:text-lg">
            Meet verified {name} families, including {sub}, looking for a life partner rooted in shared traditions.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {subs.map((s) => (
              <span key={s} className="rounded-full border border-gold/40 bg-card px-3 py-1 text-sm font-semibold">
                {s}
              </span>
            ))}
          </div>
          <Button asChild size="lg" className="mt-8 rounded-full">
            <Link to="/">
              Create your {name} profile <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {[
          { icon: <BadgeCheck />, title: "Verified families", text: "Email and WhatsApp numbers are confirmed with one-time codes." },
          { icon: <EyeOff />, title: "Two-way privacy", text: "Only members who fit your preferences can see you." },
          { icon: <Heart />, title: "Sub-caste filters", text: `Search within ${subs[0] ?? name} or across all ${name} families.` },
          { icon: <Sparkles />, title: "Kundli matching", text: "Optional Guna Milan readings by our jyotishi." },
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
          <h2 className="mb-5 font-display text-2xl font-bold">Other communities</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((c) => (
              <Link
                key={c.slug}
                to={`/communities/${c.slug}`}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 hover:border-gold/60">
                <Users className="size-4 text-primary" />
                <span className="font-semibold">{c.name} Matrimony</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default CommunityPage;
