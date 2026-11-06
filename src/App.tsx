import {
  Suspense,
  createElement,
  lazy,
  useEffect,
  useState,
  type ComponentType,
} from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  StaticRouter,
  useLocation,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProtectedRoute from "@/components/misc/ProtectedRoute";
import PublicLayout from "@/components/layout/PublicLayout";
import { OmSpinner } from "@/components/common/Loaders";
import Lander from "@/screens/lander/Lander";
import { PATH_LANGS } from "@/lib/i18n";

// Everything except the landing page is split into its own chunk.
const AppLayout = lazy(() => import("@/components/layout/AppLayout"));
const Home = lazy(() => import("@/screens/home/Home"));
const Profile = lazy(() => import("@/screens/profile/Profile"));
const Accounts = lazy(() => import("@/screens/accounts/Accounts"));
const Activity = lazy(() => import("@/screens/activity/Activity"));
const Astrology = lazy(() => import("@/screens/astrology/Astrology"));
const ReferEarn = lazy(() => import("@/screens/refer/ReferEarn"));
const BrokerProfile = lazy(
  () => import("@/screens/brokerProfile/BrokerProfile"),
);
const AdminPanel = lazy(() => import("@/screens/admin/AdminPanel"));
const PartnerDashboard = lazy(() => import("@/screens/partner/PartnerDashboard"));
// Public pages are prerendered. Hydrating one while its chunk is still loading makes React
// swap the page for the Suspense fallback and back, which jumps the footer (CLS ~0.85 on
// mobile). main.tsx calls preloadRoute() first; a page whose chunk is already loaded then
// renders directly instead of suspending.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Page = ComponentType<any> & { preload: () => Promise<unknown> };
const page = (load: () => Promise<{ default: ComponentType<object> }>): Page => {
  let loaded: ComponentType<object> | undefined;
  const preload = () => load().then((m) => (loaded = m.default));
  const Lazy = lazy(() => load().then((m) => ((loaded = m.default), m)));
  // Decided once per mount, so a page never switches between the two and remounts.
  const Page = (props: object) => {
    const [Eager] = useState(() => loaded);
    return Eager ? createElement(Eager, props) : createElement(Lazy, props);
  };
  return Object.assign(Page, { preload });
};

const AboutUs = page(() => import("@/screens/aboutUs/AboutUs"));
const FaqPage = page(() => import("@/screens/faq/FAQPage"));
const TermsConditions = page(() => import("@/screens/terms/TermsConditions"));
const PrivacyPolicy = page(() => import("@/screens/privacy/PrivacyPolicy"));
const Blog = page(() => import("@/screens/blogs/Blog"));
const BlogPostDetail = page(() => import("@/screens/blogs/BlogPostDetail"));
const ContactUs = page(() => import("@/screens/contactUs/ContactUs"));
const Pricing = page(() => import("@/screens/pricing/Pricing"));
const RefundPolicy = page(() => import("@/screens/refund/Refund"));
const PartnerWithUs = page(() => import("@/screens/partnerWUs/PartnerWithUs"));
const CommunitiesServe = page(() => import("@/screens/communities/Communities"));
const CommunityPage = page(() => import("@/screens/communities/CommunityPage"));
const Cities = page(() => import("@/screens/cities/Cities"));
const CityPage = page(() => import("@/screens/cities/CityPage"));
const NotFound = page(() => import("@/screens/notFound/NotFound"));

// Same table as the public <Route>s below; translated paths (/kn/about-us) drop the prefix.
const PUBLIC_PAGES: [RegExp, Page][] = [
  [/^\/about-us$/, AboutUs],
  [/^\/partner-with-us$/, PartnerWithUs],
  [/^\/faq$/, FaqPage],
  [/^\/terms$/, TermsConditions],
  [/^\/communities$/, CommunitiesServe],
  [/^\/communities\/[^/]+$/, CommunityPage],
  [/^\/blog$/, Blog],
  [/^\/blog\/[^/]+$/, BlogPostDetail],
  [/^\/contact-us$/, ContactUs],
  [/^\/pricing$/, Pricing],
  [/^\/refund-policy$/, RefundPolicy],
  [/^\/privacy$/, PrivacyPolicy],
  [/^\/matrimony$/, Cities],
  [/^\/matrimony\/[^/]+$/, CityPage],
];

/** Loads the chunk of the public page at `path` (if any), so hydration doesn't suspend. */
// eslint-disable-next-line react-refresh/only-export-components
export const preloadRoute = (path: string): Promise<unknown> => {
  const lang = PATH_LANGS.find((l) => path === `/${l}` || path.startsWith(`/${l}/`));
  const bare = lang ? path.slice(lang.length + 1) || "/" : path;
  if (bare === "/") return Promise.resolve();
  const hit = PUBLIC_PAGES.find(([re]) => re.test(bare));
  return (hit ? hit[1] : NotFound).preload();
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
};

const AppRoutes = () => (
  <>
    <ScrollToTop />
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Lander />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/partner-with-us" element={<PartnerWithUs />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/communities" element={<CommunitiesServe />} />
        <Route path="/communities/:slug" element={<CommunityPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPostDetail />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/matrimony" element={<Cities />} />
        <Route path="/matrimony/:slug" element={<CityPage />} />
        {/* Translated pages in their own language, e.g. /kn/about-us (see TRANSLATED_PATHS). */}
        {PATH_LANGS.map((lang) => (
          <Route key={lang} path={`/${lang}`}>
            <Route index element={<Lander />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="partner-with-us" element={<PartnerWithUs />} />
          </Route>
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <Suspense
              fallback={
                <div className="flex min-h-dvh items-center justify-center">
                  <OmSpinner />
                </div>
              }>
              <AppLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/astrology" element={<Astrology />} />
        <Route path="/account" element={<Accounts />} />
        <Route path="/refer" element={<ReferEarn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/matchmaker-profile" element={<BrokerProfile />} />
        <Route path="/partner" element={<PartnerDashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Route>
    </Routes>
  </>
);

/** `location` is set only when prerendering a page at build time (src/prerender.tsx). */
function App({ location }: { location?: string }) {
  return (
    <TooltipProvider delayDuration={200}>
      {location ? (
        <StaticRouter location={location}>
          <AppRoutes />
        </StaticRouter>
      ) : (
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      )}
      <Toaster position="top-center" />
    </TooltipProvider>
  );
}

export default App;
