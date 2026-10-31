import { Link } from "react-router-dom";
import { Check, Heart, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lotus, SectionHeading } from "@/components/common/Brand";
import SEO from "@/components/misc/SEO";
import {
  ASTRO_FEES,
  INITIAL_NO_INTEREST,
  INTEREST_PACKS,
  REGISTRATION_FEE,
  REGISTRATION_FEE_ORIGINAL,
  SEO_URL,
} from "@/utils/constants";

const membershipPerks = [
  `${INITIAL_NO_INTEREST} credits included (1 credit = 1 interest)`,
  "Browse verified profiles from your community",
  "Email alerts for every interest sent & accepted",
  "Contact details shared on mutual acceptance",
  "Hide or delete your profile any time",
];

const Pricing = () => (
  <>
    <SEO
      title="Pricing Plans | Seetha Rama Kalyana"
      description="Explore Seetha Rama Kalyana's registration and interest purchase plans. Start your journey with a one-time registration fee and buy interest credits to connect with your ideal match."
      keywords="hindu matrimony, matrimony, registration fee, interest pack, pricing plans, Seetha Rama Kalyana"
      url={SEO_URL + "/pricing"}
    />
    <div className="bg-kolam">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="mb-12 text-center">
          <Lotus className="mx-auto h-6 w-10 text-gold" />
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Simple, honest pricing</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground sm:text-lg">
            One yearly membership, then top up credits only if you need more. No sales calls, no hidden charges.
          </p>
        </header>

        <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border-2 border-primary bg-card shadow-xl">
          <div className="grid md:grid-cols-[1fr_1.1fr]">
            <div className="flex flex-col justify-center bg-primary p-8 text-primary-foreground">
              <Badge className="mb-3 w-fit bg-gold text-gold-foreground">53% off · launch offer</Badge>
              <p className="text-sm uppercase tracking-wide opacity-80">Annual membership</p>
              <p className="mt-1 font-display text-6xl font-bold">₹{REGISTRATION_FEE}</p>
              <p className="opacity-70">
                <span className="line-through">₹{REGISTRATION_FEE_ORIGINAL}</span> per year
              </p>
              <Button asChild size="lg" variant="secondary" className="mt-6">
                <Link to="/">Register now</Link>
              </Button>
            </div>
            <ul className="space-y-3 p-8">
              {membershipPerks.map((p) => (
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

        <SectionHeading className="mt-16" eyebrow="Top-ups" title="Credit packs" description="1 credit sends one interest, and contact details are shared free if they accept. Want a contact straight away? That uses 5 credits." />
        <div className="mx-auto mt-8 grid max-w-3xl gap-5 sm:grid-cols-2">
          {(Object.keys(INTEREST_PACKS) as (keyof typeof INTEREST_PACKS)[]).map((key) => {
            const p = INTEREST_PACKS[key];
            const best = key === "premium";
            return (
              <div key={key} className={`relative rounded-3xl border bg-card p-6 shadow-sm ${best ? "border-primary shadow-lg" : "border-border"}`}>
                {best && <Badge className="absolute -top-2.5 left-6 bg-gold text-gold-foreground">Best value</Badge>}
                <div className="flex items-center gap-2 font-semibold text-muted-foreground">
                  {best ? <Zap className="size-4 text-primary" /> : <Heart className="size-4 text-primary" />}
                  {p.title}
                </div>
                <p className="mt-2 font-display text-5xl font-bold">₹{p.amount}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {p.interests} credits · ≈ ₹{(p.amount / p.interests).toFixed(1)} each
                </p>
                <p className="mt-4 text-xs text-muted-foreground">Available from Account after you register.</p>
              </div>
            );
          })}
        </div>

        <SectionHeading className="mt-16" eyebrow="Optional" title="Vedic astrology readings" />
        <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-3">
          {(Object.keys(ASTRO_FEES) as (keyof typeof ASTRO_FEES)[]).map((k) => (
            <div key={k} className="rounded-2xl border border-border bg-card p-5 text-center">
              <Sparkles className="mx-auto size-5 text-gold" />
              <p className="mt-2 font-semibold">{k}</p>
              <p className="font-display text-3xl font-bold text-primary">₹{ASTRO_FEES[k]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default Pricing;
