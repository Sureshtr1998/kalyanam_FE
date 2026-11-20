import { Link } from "react-router-dom";
import { ChevronRight, Languages as LanguagesIcon } from "lucide-react";
import { Lotus } from "@/components/common/Brand";
import SEO from "@/components/misc/SEO";
import { SEO_URL } from "@/utils/constants";
import { languages } from "./seoLanguages";

/** Index of the language pages, /languages. */
const Languages = () => (
  <>
    <SEO
      title="Hindu Matrimony by Language | Kannada, Telugu, Tamil, Hindi, Marathi & More – Seetha Rama Kalyana"
      description={`Hindu matrimony for ${languages.map((l) => l.name).join(", ")} speaking families. Find brides and grooms who share your mother tongue, from your own community.`}
      keywords={languages.map((l) => `${l.name.toLowerCase()} matrimony`).join(", ")}
      url={`${SEO_URL}/languages`}
      additionalSchema={[
        {
          "@type": "ItemList",
          itemListElement: languages.map((l, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${l.name} Matrimony`,
            url: `${SEO_URL}/languages/${l.slug}`,
          })),
        },
      ]}
    />

    <section className="bg-sunrise relative overflow-hidden">
      <div className="bg-kolam pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20">
        <Lotus className="mx-auto h-7 w-12 text-gold" />
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-6xl">
          Hindu matrimony <span className="text-gradient-gold">in your language</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground sm:text-lg">
          Find a partner who shares your mother tongue, your community and your family's traditions. The full site is
          also available in Kannada, Telugu, Tamil and Hindi.
        </p>
      </div>
    </section>

    <section className="mx-auto grid max-w-6xl gap-3 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
      {languages.map((l) => (
        <Link
          key={l.slug}
          to={`/languages/${l.slug}`}
          className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:border-gold/60">
          <LanguagesIcon className="size-5 shrink-0 text-primary" />
          <span className="flex-1">
            <span className="font-semibold group-hover:text-primary">{l.name} Matrimony</span>
            <span lang={l.nativeLang} className="block text-sm text-muted-foreground">
              {l.native}
            </span>
          </span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
      ))}
    </section>
  </>
);

export default Languages;
