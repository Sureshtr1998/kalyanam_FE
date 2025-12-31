import React from "react";
import SEO from "../../components/misc/SEO";
import {
  ACCENT_COLOR,
  TEXT_COLOR,
  BG_COLOR,
  BORDER_COLOR,
  CARD_BG,
} from "../../styles/variables";
import {
  INITIAL_NO_INTEREST,
  PURCHASE_INTEREST_FEE,
  PURCHASE_INTEREST_FEE_2,
  PURCHASE_NO_INTEREST,
  PURCHASE_NO_INTEREST_2,
  REGISTRATION_FEE,
} from "../../utils/constants";
import { useNavigate } from "react-router-dom";

// Main Pricing Component
const Pricing = () => {
  const canonicalUrl = "https://www.seetharamakalyana.in/pricing";

  return (
    <>
      {/* SEO */}
      <SEO
        title="Pricing Plans | Seetha Rama Kalyana"
        description="Explore Seetha Rama Kalyana's registration and interest purchase plans. Start your journey with a one-time registration fee and buy interest credits to connect with your ideal match."
        keywords="hindu matrimony, matrimony, registration fee, interest pack, pricing plans, Seetha Rama Kalyana"
        url={canonicalUrl}
      />

      {/* Main Content */}
      <div className={`min-h-screen  py-24 px-4 ${BG_COLOR} font-[Inter]`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="text-center mb-16">
            <h1 className={`text-5xl font-extrabold mb-4 ${TEXT_COLOR}`}>
              Registration & Interest Plans
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start your journey with a yearly registration fee, then purchase
              interest credits to connect with other users on Seetha Rama
              Kalyana, the trusted Hindu matrimony platform.
            </p>
          </header>

          {/* 1. Registration Fee */}
          <RegistrationFeeCard />

          <h2 className={`text-4xl font-bold text-center mb-10 ${TEXT_COLOR}`}>
            Interest Purchase Options
          </h2>

          {/* 2. Interest Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <InterestPlanCard
              title="Basic Interest Pack"
              price={PURCHASE_INTEREST_FEE}
              interestCount={PURCHASE_NO_INTEREST}
              iconClass="pi pi-star"
              isHighlighted={false}
            />
            <InterestPlanCard
              title="Premium Interest Pack"
              price={PURCHASE_INTEREST_FEE_2}
              interestCount={PURCHASE_NO_INTEREST_2}
              iconClass="pi pi-bolt"
              isHighlighted={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};

// Registration Fee Card
const RegistrationFeeCard = () => {
  const navigate = useNavigate();

  return (
    <div
      className={`w-full max-w-2xl mx-auto p-8 rounded-xl shadow-2xl ${CARD_BG} border-4 ${BORDER_COLOR} mb-12 text-center`}>
      <div className="flex justify-center mb-4">
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-full ${ACCENT_COLOR} text-white shadow-lg`}>
          <i className="pi pi-user-plus text-xl" />
        </div>
      </div>
      <h2 className={`text-3xl font-bold mb-2 ${TEXT_COLOR}`}>
        Annual Registration Fee
      </h2>
      <p className="text-gray-600 mb-6">
        A yearly fee is required to activate your account and maintain continued
        access to the platform.
      </p>
      <p className={`text-6xl font-extrabold ${TEXT_COLOR} mb-4`}>
        {REGISTRATION_FEE}
      </p>
      <p className="text-xl font-medium text-gray-600">
        for <span className="font-bold">{INITIAL_NO_INTEREST}</span> Interests
      </p>
      <button
        onClick={() => navigate("/")}
        className={`w-full md:w-1/2 mt-2 py-3 cursor-pointer px-6 rounded-lg text-white font-semibold transition duration-300 ease-in-out shadow-md ${ACCENT_COLOR} ${ACCENT_COLOR}`}>
        Register Now
      </button>
    </div>
  );
};

// Interest Plan Card
interface InterestPlanCardProps {
  title: string;
  price: number;
  interestCount: number;
  iconClass: string; // PrimeReact icon class
  isHighlighted: boolean;
}

const InterestPlanCard: React.FC<InterestPlanCardProps> = ({
  title,
  price,
  interestCount,
  iconClass,
  isHighlighted,
}) => (
  <div
    className={`flex flex-col p-8 rounded-xl shadow-xl transition-transform duration-300 hover:scale-[1.05] ${CARD_BG} ${
      isHighlighted
        ? `border-4 ${BORDER_COLOR} shadow-2xl`
        : `border ${BORDER_COLOR}`
    } relative`}>
    {isHighlighted && (
      <div
        className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 text-xs font-bold uppercase rounded-full text-white ${ACCENT_COLOR}`}>
        Best Value
      </div>
    )}

    <div className="flex justify-center mb-4">
      <i className={`${iconClass} text-3xl ${TEXT_COLOR}`} />
    </div>

    <h3 className={`text-2xl font-bold mb-1 text-center ${TEXT_COLOR}`}>
      {title}
    </h3>
    <p className="text-center text-gray-500 mb-6">
      Purchase credits to express interest.
    </p>

    <div className="flex flex-col items-center mb-8 flex-grow">
      <p className={`text-5xl font-extrabold ${TEXT_COLOR}`}>₹{price}</p>
      <p className="text-xl font-medium text-gray-600">
        for <span className="font-bold">{interestCount}</span> Interests
      </p>
      <p className="text-sm text-gray-400 mt-1">
        (₹{(price / interestCount).toFixed(2)} per interest)
      </p>
    </div>
  </div>
);

export default Pricing;
