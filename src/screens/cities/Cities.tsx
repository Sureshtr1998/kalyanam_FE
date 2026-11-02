import { Link } from "react-router-dom";
import { ChevronRight, MapPin } from "lucide-react";
import { Lotus } from "@/components/common/Brand";
import SEO from "@/components/misc/SEO";
import { SEO_URL } from "@/utils/constants";
import { cities } from "./seoCities";

const label = (c: (typeof cities)[number]) => (c.slug === "nri" ? "NRI Hindu Matrimony" : `${c.name} Matrimony`);

/** Index of the city pages, /matrimony. */
const Cities = () => (
  <>
    <SEO
      title="Hindu Matrimony by City | Mumbai, Delhi, Bengaluru, Chennai & More – Seetha Rama Kalyana"
      description="Hindu matrimony for families in Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad, Jaipur, Lucknow, Kochi and NRI families abroad."
      keywords="hindu matrimony by city, mumbai matrimony, delhi matrimony, bangalore matrimony, hyderabad matrimony, chennai matrimony, nri matrimony"
      url={`${SEO_URL}/matrimony`}
      additionalSchema={[
        {
          "@type": "ItemList",
          itemListElement: cities.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: label(c),
            url: `${SEO_URL}/matrimony/${c.slug}`,
          })),
        },
      ]}
    />

    <section className="bg-sunrise relative overflow-hidden">
      <div className="bg-kolam pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20">
        <Lotus className="mx-auto h-7 w-12 text-gold" />
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-6xl">
          Hindu matrimony <span className="text-gradient-gold">across India</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground sm:text-lg">
          Wherever your family lives, search for a partner from your own community, near you or anywhere in India and
          abroad.
        </p>
      </div>
    </section>

    <section className="mx-auto grid max-w-6xl gap-3 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
      {cities.map((c) => (
        <Link
          key={c.slug}
          to={`/matrimony/${c.slug}`}
          className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:border-gold/60">
          <MapPin className="size-5 shrink-0 text-primary" />
          <span className="flex-1">
            <span className="font-semibold group-hover:text-primary">{label(c)}</span>
            <span className="block text-sm text-muted-foreground">{c.languages.slice(0, 3).join(", ")}</span>
          </span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
      ))}
    </section>
  </>
);

export default Cities;
