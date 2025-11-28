import React from "react";
import SEO from "../../components/misc/SEO";
import {
  ACCENT_COLOR,
  TEXT_COLOR,
  BG_COLOR,
  BORDER_COLOR,
  CARD_BG,
} from "../../styles/variables";
import { updatedDate } from "../../utils/constants";

// Policy Section Component
interface PolicySectionProps {
  iconClass: string; // PrimeReact icon class
  title: string;
  children: React.ReactNode;
}

const PolicySection: React.FC<PolicySectionProps> = ({
  iconClass,
  title,
  children,
}) => (
  <div
    className={`flex flex-col md:flex-row mb-10 p-5 rounded-xl border ${BORDER_COLOR} bg-gray-50`}>
    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 flex items-start">
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-full ${ACCENT_COLOR} text-white shadow-lg`}>
        <i className={`${iconClass} text-xl`} />
      </div>
    </div>
    <div className="flex-grow">
      <h2 className={`text-2xl font-bold mb-3 ${TEXT_COLOR}`}>{title}</h2>
      <div className="text-gray-700 leading-relaxed text-base space-y-3">
        {children}
      </div>
    </div>
  </div>
);

// Main Refund Policy Component
const RefundPolicy: React.FC = () => {
  const canonicalUrl = "https://www.seetharamakalyana.in/refund-policy";

  return (
    <>
      {/* SEO */}
      <SEO
        title="Refund Policy | Seetha Rama Kalyana"
        description="Seetha Rama Kalyana refund policy: Amount will be refunded only if user registration fails but payment is deducted. All other payments are non-refundable."
        keywords="brahmin matrimony, kannada matrimony, refund policy, payment refund, Seetha Rama Kalyana"
        url={canonicalUrl}
      />

      {/* Main Content */}
      <div className={`min-h-screen py-24 ${BG_COLOR} font-[Inter]`}>
        <div
          className={`max-w-4xl mx-auto rounded-2xl shadow-2xl p-8 md:p-12 ${CARD_BG}`}>
          <header className="text-center mb-16">
            <h1 className={`text-4xl font-extrabold mb-4 ${TEXT_COLOR}`}>
              Refund Policy
            </h1>
            <p className="text-lg text-gray-600">
              Please read the policy carefully to understand the conditions
              under which refunds are provided.
            </p>
          </header>

          <PolicySection
            iconClass="pi pi-credit-card"
            title="Refund Conditions">
            <p>
              If a user's registration fails but the payment is deducted, the
              amount will be refunded in full.
            </p>
            <p>
              <strong>Important:</strong> In all other cases, including
              successful registrations, payments are{" "}
              <strong>non-refundable</strong>.
            </p>
          </PolicySection>

          <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>
              Last updated: {updatedDate}. Policy subject to change without
              notice.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default RefundPolicy;
