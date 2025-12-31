import { useNavigate } from "react-router-dom";

const PublicFooter = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-amber-100 border-t border-amber-300">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center space-y-4">
        {/* New Navigation Section */}
        <nav className="flex justify-center space-x-6 text-sm">
          <button onClick={() => navigate("/faq")} className="pub-link">
            FAQs
          </button>
          <button onClick={() => navigate("/terms")} className="pub-link">
            Terms & Conditions
          </button>
          <button onClick={() => navigate("/privacy")} className="pub-link">
            Privacy Policy
          </button>
          <button onClick={() => navigate("/blog")} className="pub-link">
            Blog
          </button>
        </nav>
        <nav className="flex justify-center space-x-6 text-sm">
          <button onClick={() => navigate("/contact-us")} className="pub-link">
            Contact US
          </button>
          <button onClick={() => navigate("/pricing")} className="pub-link">
            Pricing
          </button>
          <button
            onClick={() => navigate("/refund-policy")}
            className="pub-link">
            Refund Policy
          </button>
        </nav>

        {/* Copyright Section */}
        <p className="text-center text-base text-amber-800">
          &copy; 2026 Seetha Rama Kalyana. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default PublicFooter;
