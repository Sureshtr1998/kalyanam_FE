import { Suspense, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Download, Mail, Menu, RefreshCw, Sparkles } from "lucide-react";
import { Brand, BrandMark, Lotus } from "@/components/common/Brand";
import { OmSpinner } from "@/components/common/Loaders";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { usePWA } from "@/components/misc/usePWA";
import { isLoggedIn } from "@/lib/session";
import { cn } from "@/lib/utils";
import { REGISTRATION_FEE, REGISTRATION_FEE_ORIGINAL, SUPPORT_EMAIL } from "@/utils/constants";

const links = [
  { to: "/about-us", label: "About" },
  { to: "/communities", label: "Communities" },
  { to: "/pricing", label: "Pricing" },
  { to: "/blog", label: "Blog" },
  { to: "/partner-with-us", label: "Partner With Us" },
];

const footerGroups = [
  {
    title: "Seetha Rama Kalyana",
    links: [
      { to: "/about-us", label: "About us" },
      { to: "/communities", label: "Our communities" },
      { to: "/partner-with-us", label: "Partner with us" },
      { to: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Help",
    links: [
      { to: "/faq", label: "FAQs" },
      { to: "/pricing", label: "Pricing" },
      { to: "/contact-us", label: "Contact us" },
    ],
  },
  {
    title: "Policies",
    links: [
      { to: "/terms", label: "Terms & conditions" },
      { to: "/privacy", label: "Privacy policy" },
      { to: "/refund-policy", label: "Refund policy" },
    ],
  },
];

const OfferBar = () => (
  <div className="bg-primary text-primary-foreground">
    <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-semibold sm:text-sm">
      <Sparkles className="size-4 shrink-0 text-gold" />
      <span>
        Launch offer: annual membership{" "}
        <span className="line-through opacity-70">₹{REGISTRATION_FEE_ORIGINAL}</span>{" "}
        <span className="rounded bg-gold px-1.5 py-0.5 font-bold text-gold-foreground">
          ₹{REGISTRATION_FEE}
        </span>{" "}
        <span className="hidden sm:inline">· 53% off for a limited time</span>
      </span>
    </div>
  </div>
);

const PublicLayout = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const loggedIn = isLoggedIn();
  const { showInstallButton, handleInstallClick, updateAvailable, reloadApp } = usePWA();

  useEffect(() => setOpen(false), [location.pathname]);

  const cta = loggedIn ? (
    <Button asChild>
      <Link to="/home">My matches</Link>
    </Button>
  ) : location.pathname === "/" ? (
    <Button asChild>
      <a href="#join">Login / Register</a>
    </Button>
  ) : (
    <Button asChild>
      <Link to="/">Login / Register</Link>
    </Button>
  );

  return (
    <div className="flex min-h-dvh flex-col">
      {location.pathname === "/" && <OfferBar />}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Brand />
          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary",
                    isActive && "text-primary"
                  )
                }>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 lg:ml-2">
            {showInstallButton && (
              <Button variant="outline" size="sm" onClick={handleInstallClick}>
                <Download />
                Install
              </Button>
            )}
            <div className="hidden sm:block">{cta}</div>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-sm bg-background">
                <SheetHeader>
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <Brand />
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4">
                  {[{ to: "/", label: "Home" }, ...links, { to: "/faq", label: "FAQs" }, { to: "/contact-us", label: "Contact" }].map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      end
                      className={({ isActive }) =>
                        cn(
                          "rounded-lg px-3 py-3 text-base font-semibold text-foreground/80 hover:bg-accent",
                          isActive && "bg-primary/8 text-primary"
                        )
                      }>
                      {l.label}
                    </NavLink>
                  ))}
                </nav>
                <div className="mt-auto p-4 [&_a]:w-full [&_button]:w-full">{cta}</div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex min-h-[50dvh] items-center justify-center">
              <OmSpinner />
            </div>
          }>
          <Outlet />
        </Suspense>
      </main>

      <footer className="relative mt-auto overflow-hidden border-t border-gold/30 bg-deep text-deep-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <BrandMark className="size-12 shrink-0" />
              <div>
                <p className="font-display text-2xl font-bold text-white">Seetha Rama Kalyana</p>
                <p className="text-xs uppercase tracking-[0.25em] text-gold">Hindu Matrimony</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed opacity-80">
              A trusted, community-first matrimony platform helping Hindu families find
              life partners rooted in dharma, tradition and respect.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold hover:underline">
              <Mail className="size-4" />
              {SUPPORT_EMAIL}
            </a>
          </div>
          {footerGroups.map((g) => (
            <div key={g.title}>
              <p className="text-sm font-bold uppercase tracking-wider text-white">{g.title}</p>
              <ul className="mt-4 space-y-2.5">
                {g.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm opacity-80 hover:text-gold hover:opacity-100">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs opacity-70 sm:flex-row sm:px-6">
            <p>© {new Date().getFullYear()} Seetha Rama Kalyana. All rights reserved.</p>
            <p className="flex items-center gap-2">
              <Lotus className="h-3 w-5 text-gold" /> Secure payments by Razorpay
            </p>
          </div>
        </div>
      </footer>

      {updateAvailable && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-primary px-4 py-3 text-sm text-primary-foreground shadow-xl">
          <span>A new version is available</span>
          <Button size="sm" variant="secondary" onClick={reloadApp}>
            <RefreshCw />
            Update
          </Button>
        </div>
      )}
    </div>
  );
};

export default PublicLayout;
