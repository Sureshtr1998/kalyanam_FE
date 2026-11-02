import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Check, Heart, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lotus, SectionHeading } from "@/components/common/Brand";
import SEO from "@/components/misc/SEO";
import { usePublicLang } from "@/lib/i18n";
import { seoText } from "@/lib/seoText";
import { feeLabel, fillPrices, PACK_TITLES, usePricing, type AstroMode, type PackKey } from "@/lib/pricing";
import { SEO_URL } from "@/utils/constants";
import { pricingText } from "./lang";

const product = (name: string, description: string, price: number) => ({
  "@type": "Product",
  name,
  description,
  brand: { "@id": `${SEO_URL}/#organization` },
  offers: {
    "@type": "Offer",
    price,
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    url: `${SEO_URL}/pricing`,
  },
});

const Pricing = () => {
  const [lang] = usePublicLang();
  const pricing = usePricing();
  const t = useMemo(() => fillPrices(pricingText[lang], pricing, lang), [lang, pricing]);
  const original = pricing.registrationFeeOriginal;
  return (
    <>
      <SEO
        title={seoText.pricing[lang].title}
        description={seoText.pricing[lang].description}
        keywords="hindu matrimony, matrimony, registration fee, interest pack, pricing plans, Seetha Rama Kalyana"
        additionalSchema={[
          product(
            "Seetha Rama Kalyana yearly membership",
            `One year of Hindu matrimony membership with ${pricing.registrationInterests} interest credits (1 credit = 1 interest).`,
            pricing.registrationFee
          ),
          ...(Object.keys(pricing.interestPacks) as PackKey[]).map((key) =>
            product(
              `Seetha Rama Kalyana ${PACK_TITLES[key]}`,
              `${pricing.interestPacks[key].interests} extra interest credits for members.`,
              pricing.interestPacks[key].amount
            )
          ),
        ]}
      />
      <div className="bg-kolam">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <header className="mb-12 text-center">
            <Lotus className="mx-auto h-6 w-10 text-gold" />
            <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{t.title}</h1>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground sm:text-lg">
              {t.subtitle}
            </p>
          </header>

          <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border-2 border-primary bg-card shadow-xl">
            <div className="grid md:grid-cols-[1fr_1.1fr]">
              <div className="flex flex-col justify-center bg-primary p-8 text-primary-foreground">
                {original ? <Badge className="mb-3 w-fit bg-gold text-gold-foreground">{t.offer}</Badge> : null}
                <p className="text-sm uppercase tracking-wide opacity-80">{t.annual}</p>
                <p className="mt-1 font-display text-6xl font-bold">{feeLabel(pricing.registrationFee, lang)}</p>
                {pricing.registrationFee > 0 ? (
                  <p className="opacity-70">
                    {original ? <span className="line-through">₹{original}</span> : null} {t.perYear}
                  </p>
                ) : null}
                <Button asChild size="lg" variant="secondary" className="mt-6">
                  <Link to="/">{t.registerNow}</Link>
                </Button>
              </div>
              <ul className="space-y-3 p-8">
                {t.perks.map((p) => (
                  <li key={p} className="flex gap-3 text-sm">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                      <Check className="size-3.5" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <SectionHeading className="mt-16" eyebrow={t.topUpsEyebrow} title={t.packsTitle} description={t.packsDescription} />
          <div className="mx-auto mt-8 grid max-w-3xl gap-5 sm:grid-cols-2">
            {(Object.keys(pricing.interestPacks) as PackKey[]).map((key) => {
              const p = pricing.interestPacks[key];
              const best = key === "premium";
              return (
                <div key={key} className={`relative rounded-3xl border bg-card p-6 shadow-sm ${best ? "border-primary shadow-lg" : "border-border"}`}>
                  {best && <Badge className="absolute -top-2.5 left-6 bg-gold text-gold-foreground">{t.bestValue}</Badge>}
                  <div className="flex items-center gap-2 font-semibold text-muted-foreground">
                    {best ? <Zap className="size-4 text-primary" /> : <Heart className="size-4 text-primary" />}
                    {t.packs[key]}
                  </div>
                  <p className="mt-2 font-display text-5xl font-bold">₹{p.amount}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t.credits(p.interests, (p.amount / p.interests).toFixed(1))}
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">{t.afterRegister}</p>
                </div>
              );
            })}
          </div>

          <SectionHeading className="mt-16" eyebrow={t.optional} title={t.astroTitle} />
          <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-3">
            {(Object.keys(pricing.astroFees) as AstroMode[]).map((k) => (
              <div key={k} className="rounded-2xl border border-border bg-card p-5 text-center">
                <Sparkles className="mx-auto size-5 text-gold" />
                <p className="mt-2 font-semibold">{t.astro[k]}</p>
                <p className="font-display text-3xl font-bold text-primary">₹{pricing.astroFees[k]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;
