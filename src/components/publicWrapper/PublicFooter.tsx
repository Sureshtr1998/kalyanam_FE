import { useNavigate } from "react-router-dom";
import { SUPPORT_EMAIL } from "../../utils/constants";

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

        {/* Contact Email Section */}
        <p className="text-base text-amber-800">
          Contact us:{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-medium text-amber-900 hover:text-amber-700">
            {SUPPORT_EMAIL}
          </a>
        </p>

        {/* Copyright Section */}
        <p className="text-center text-base text-amber-800">
          &copy; 2025 Seetha Rama Kalyana. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default PublicFooter;
