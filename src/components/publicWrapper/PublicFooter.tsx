import { SUPPORT_EMAIL } from "../../utils/constants";

const PublicFooter = () => {
  return (
    <div className="bg-amber-100 border-t border-amber-300">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <p className="text-base text-amber-800">
          Contact us:{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-medium text-amber-900 hover:text-amber-700">
            {SUPPORT_EMAIL}
          </a>
        </p>
        <p className="text-center text-base text-amber-800">
          &copy; 2025 Seetha Rama Kalyana. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default PublicFooter;
