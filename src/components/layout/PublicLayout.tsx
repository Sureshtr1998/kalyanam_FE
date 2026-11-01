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
import { localeOf, usePublicLang } from "@/lib/i18n";
import { LanguageSelect } from "@/components/common/LanguageSelect";
import { layoutText } from "./lang";

type Text = (typeof layoutText)["en"];

const navLinks = (t: Text) => [
  { to: "/about-us", label: t.about },
  { to: "/communities", label: t.communities },
  { to: "/pricing", label: t.pricing },
  { to: "/blog", label: t.blog },
  { to: "/partner-with-us", label: t.partner },
];

const footerGroups = (t: Text) => [
  {
    title: "Seetha Rama Kalyana",
    links: [
      { to: "/about-us", label: t.aboutUs },
      { to: "/communities", label: t.ourCommunities },
      { to: "/partner-with-us", label: t.partnerWithUs },
      { to: "/blog", label: t.blog },
    ],
  },
  {
    title: t.help,
    links: [
      { to: "/faq", label: t.faqs },
      { to: "/pricing", label: t.pricing },
      { to: "/contact-us", label: t.contactUs },
    ],
  },
  {
    title: t.policies,
    links: [
      { to: "/terms", label: t.terms },
      { to: "/privacy", label: t.privacy },
      { to: "/refund-policy", label: t.refund },
    ],
  },
];

const OfferBar = ({ t }: { t: Text }) => (
  <div className="bg-primary text-primary-foreground">
    <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-semibold sm:text-sm">
      <Sparkles className="size-4 shrink-0 text-gold" />
      <span>
        {t.offer}{" "}
        <span className="line-through opacity-70">₹{REGISTRATION_FEE_ORIGINAL}</span>{" "}
        <span className="rounded bg-gold px-1.5 py-0.5 font-bold text-gold-foreground">
          ₹{REGISTRATION_FEE}
        </span>{" "}
        <span className="hidden sm:inline">· {t.offerOff}</span>
      </span>
    </div>
  </div>
);

const PublicLayout = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const loggedIn = isLoggedIn();
  const { showInstallButton, handleInstallClick, updateAvailable, reloadApp } = usePWA();
  const [lang, setLang] = usePublicLang();
  const t = layoutText[lang];
  const links = navLinks(t);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    document.documentElement.lang = localeOf(lang);
    return () => {
      document.documentElement.lang = "en";
    };
  }, [lang]);

  const cta = loggedIn ? (
    <Button asChild>
      <Link to="/home">{t.myMatches}</Link>
    </Button>
  ) : location.pathname === "/" ? (
    <Button asChild>
      <a href="#join">{t.loginRegister}</a>
    </Button>
  ) : (
    <Button asChild>
      <Link to="/">{t.loginRegister}</Link>
    </Button>
  );

  return (
    <div className="flex min-h-dvh flex-col">
      {location.pathname === "/" && <OfferBar t={t} />}
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
                    "whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary xl:px-3.5",
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
                {t.install}
              </Button>
            )}
            <LanguageSelect value={lang} onChange={setLang} />
            <div className="hidden sm:block">{cta}</div>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-sm bg-background">
                <SheetHeader>
                  <SheetTitle className="sr-only">{t.menu}</SheetTitle>
                  <Brand />
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4">
                  {[{ to: "/", label: t.home }, ...links, { to: "/faq", label: t.faqs }, { to: "/contact-us", label: t.contact }].map((l) => (
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
            <p className="mt-4 text-sm leading-relaxed opacity-80">{t.tagline}</p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold hover:underline">
              <Mail className="size-4" />
              {SUPPORT_EMAIL}
            </a>
          </div>
          {footerGroups(t).map((g) => (
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
            <p>© {new Date().getFullYear()} Seetha Rama Kalyana. {t.rights}</p>
            <p className="flex items-center gap-2">
              <Lotus className="h-3 w-5 text-gold" /> {t.securePayments}
            </p>
          </div>
        </div>
      </footer>

      {updateAvailable && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-primary px-4 py-3 text-sm text-primary-foreground shadow-xl">
          <span>{t.newVersion}</span>
          <Button size="sm" variant="secondary" onClick={reloadApp}>
            <RefreshCw />
            {t.update}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PublicLayout;
