import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Heart, Lock, Search, ShieldCheck, Tags, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lotus, SectionHeading } from "@/components/common/Brand";
import { EmptyState } from "@/components/common/PageHeader";
import SEO from "@/components/misc/SEO";
import { SEO_URL } from "@/utils/constants";
import { communities, generateCommunitiesSchema } from "./seoComm";

const reasons = [
  { icon: <ShieldCheck />, title: "Verified contacts", text: "Every member's email and WhatsApp number is verified with one-time codes." },
  { icon: <Lock />, title: "Total privacy", text: "Contact details are shared only after mutual acceptance or with your consent." },
  { icon: <Tags />, title: "Caste specific", text: "500+ Hindu sub-castes supported, so you find a match who shares your roots." },
  { icon: <Heart />, title: "Sacred matching", text: "Filter by community, mother tongue and values, and add Vedic kundli matching." },
];

const regions = [
  {
    title: "North & Central India",
    body: (
      <>
        A trusted destination for <strong>Brahmin Matrimony</strong> (Kanyakubja, Bhumihar and Tyagi) and for{" "}
        <strong>Rajput</strong> families from Chauhan, Rathore and Thakur lineages. Business families find{" "}
        <strong>Agarwal</strong> and <strong>Baniya</strong> profiles including Gupta, Goyal and Varshney, alongside{" "}
        <strong>Jat</strong>, <strong>Yadav</strong>, <strong>Kayastha</strong> and <strong>Khatri</strong> communities.
      </>
    ),
  },
  {
    title: "South India",
    body: (
      <>
        Serving <strong>Reddy</strong>, <strong>Kamma</strong> (Chowdary) and <strong>Naidu</strong> families,{" "}
        <strong>Nair</strong> (Menon, Pillai) and <strong>Ezhava</strong> communities, and Tamil{" "}
        <strong>Mudaliar</strong>, <strong>Vanniyar</strong>, <strong>Gounder</strong> and <strong>Chettiar</strong>{" "}
        families, plus <strong>Arya Vysya</strong>, <strong>Lingayat</strong> and <strong>Vellalar</strong> traditions.
      </>
    ),
  },
  {
    title: "West & East India",
    body: (
      <>
        <strong>Maratha</strong> families (96 Kuli, Patil), <strong>Patel</strong> Leuva and Kadva Patidars,{" "}
        <strong>Maheshwari</strong>, <strong>Lohana</strong>, <strong>Sindhi</strong> and <strong>Kumbhar</strong>{" "}
        communities, and <strong>Kurmi</strong>, <strong>Mali</strong> and <strong>Sonar</strong> families in the East.
      </>
    ),
  },
  {
    title: "Every Hindu community",
    body: (
      <>
        A dignified space for <strong>Vishwakarma</strong>, <strong>Saini</strong>, <strong>Teli</strong>,{" "}
        <strong>Arora</strong>, <strong>Koli</strong> and <strong>Dhoba</strong> families and many more, because
        sub-caste compatibility matters in <strong>Hindu matrimony</strong>.
      </>
    ),
  },
];

const CommunitiesServe = () => {
  const [term, setTerm] = useState("");

  const filtered = useMemo(() => {
    const q = term.toLowerCase();
    return communities.filter((c) => c.name.toLowerCase().includes(q) || c.sub.toLowerCase().includes(q));
  }, [term]);

  return (
    <>
      <SEO
        title="Hindu Matrimony by Community | Brahmin, Reddy, Patel & More – Seetha Rama Kalyana"
        description="Seetha Rama Kalyana offers trusted Hindu matrimonial services for all communities including Brahmin, Reddy, Patel, Naidu, and 500+ sub-castes. Connect with verified profiles for a sacred and culturally aligned marriage."
        keywords="Hindu Matrimony, Brahmin Matrimony, Reddy Matrimony, Patel Matrimony, Naidu Matrimony, Hindu Marriage by Community, Verified Hindu Matrimony"
        url={SEO_URL + "/communities"}
        additionalSchema={[generateCommunitiesSchema(communities)]}
      />

      <section className="bg-sunrise relative overflow-hidden">
        <div className="bg-kolam pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-accent-foreground">
            <Lotus className="h-3.5 w-6 text-gold" />
            Trusted Hindu matrimony
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-6xl">
            Divine matches for every <span className="text-gradient-gold">Hindu community</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground sm:text-lg">
            Connect with verified families across traditions and castes for a sacred union.
          </p>
          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search your community: Brahmin, Reddy, Patel…"
              className="h-13 rounded-full border-gold/40 bg-card pl-12 text-base shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <SectionHeading align="left" title="Find your community" />
          <span className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
            {communities.length}+ featured communities
          </span>
        </div>
        {filtered.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c) => (
              <Link
                key={c.id}
                to={`/communities/${c.slug}`}
                className="group flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-md">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <Users className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold group-hover:text-primary">{c.name} Matrimony</span>
                  <span className="block truncate text-xs text-muted-foreground">{c.sub}</span>
                </span>
                <ChevronRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Users />}
            title="Don't see your community?"
            description="We support all Hindu sub-castes. You can choose yours during registration."
            action={
              <Button asChild>
                <Link to="/">Create your profile</Link>
              </Button>
            }
          />
        )}
      </section>

      <section className="bg-kolam border-y border-gold/20 bg-accent/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHeading eyebrow="Why Seetha Rama Kalyana" title="Secure, culturally aligned, sincere" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div key={r.title} className="rounded-2xl bg-card p-5 text-center shadow-sm ring-1 ring-border">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground [&_svg]:size-5">
                  {r.icon}
                </div>
                <h3 className="mt-3 font-semibold">{r.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHeading title="Dedicated Hindu matrimonial services across India" />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {regions.map((r) => (
            <div key={r.title} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display text-xl font-bold text-primary">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground [&_strong]:text-foreground">{r.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl bg-primary px-6 py-10 text-center text-primary-foreground">
          <h2 className="font-display text-3xl font-bold">A sacred journey for serious seekers</h2>
          <p className="max-w-xl opacity-85">
            Our paid membership keeps the community safe and sincere, you meet only verified families committed to
            Hindu marriage traditions.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Button asChild variant="secondary">
              <Link to="/">Create your profile</Link>
            </Button>
            <Button asChild variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link to="/pricing">Membership plans</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default CommunitiesServe;
