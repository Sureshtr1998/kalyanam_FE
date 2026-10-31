import { Suspense, lazy, useEffect } from "react";
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

// Everything except the landing page is split into its own chunk.
const AppLayout = lazy(() => import("@/components/layout/AppLayout"));
const Home = lazy(() => import("@/screens/home/Home"));
const Profile = lazy(() => import("@/screens/profile/Profile"));
const Accounts = lazy(() => import("@/screens/accounts/Accounts"));
const Activity = lazy(() => import("@/screens/activity/Activity"));
const Astrology = lazy(() => import("@/screens/astrology/Astrology"));
const BrokerProfile = lazy(
  () => import("@/screens/brokerProfile/BrokerProfile"),
);
const AdminPanel = lazy(() => import("@/screens/admin/AdminPanel"));
const PartnerDashboard = lazy(() => import("@/screens/partner/PartnerDashboard"));
const AboutUs = lazy(() => import("@/screens/aboutUs/AboutUs"));
const FaqPage = lazy(() => import("@/screens/faq/FAQPage"));
const TermsConditions = lazy(() => import("@/screens/terms/TermsConditions"));
const PrivacyPolicy = lazy(() => import("@/screens/privacy/PrivacyPolicy"));
const Blog = lazy(() => import("@/screens/blogs/Blog"));
const BlogPostDetail = lazy(() => import("@/screens/blogs/BlogPostDetail"));
const ContactUs = lazy(() => import("@/screens/contactUs/ContactUs"));
const Pricing = lazy(() => import("@/screens/pricing/Pricing"));
const RefundPolicy = lazy(() => import("@/screens/refund/Refund"));
const PartnerWithUs = lazy(() => import("@/screens/partnerWUs/PartnerWithUs"));
const CommunitiesServe = lazy(() => import("@/screens/communities/Communities"));
const CommunityPage = lazy(() => import("@/screens/communities/CommunityPage"));
const NotFound = lazy(() => import("@/screens/notFound/NotFound"));

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
