import React from "react";
import {
  TEXT_COLOR,
  BG_COLOR,
  CARD_BG,
  BORDER_COLOR,
} from "../../styles/variables";
import SEO from "../../components/misc/SEO";

interface TermSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const termsData: TermSection[] = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: (
      <>
        <p className="mb-4">
          By registering or using the Seetha Rama Kalyana Matrimony Platform
          (“Service”), you agree to comply with these Terms and Conditions
          (“Terms”). These Terms form a legally binding agreement between you
          and Seetha Rama Kalyana, a dedicated Brahmin matrimonial service for
          genuine marriage minded individuals. If you do not agree to these
          Terms, you must stop using the Service immediately.
        </p>
        <p className="text-sm italic text-gray-500">
          Last Updated: November 20, 2025.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "2. Eligibility and Membership",
    content: (
      <ul className="list-disc ml-6 space-y-2 text-gray-700">
        <li>
          You must be legally eligible for marriage as per the laws of your
          country or state.
        </li>
        <li>Minimum required age: 18 years for women and 21 years for men.</li>
        <li>
          This platform is strictly for matrimonial purposes only. Casual
          dating, friendship-only intent, or commercial activity is not allowed.
        </li>
        <li>
          As a Brahmin focused matrimony app, Seetha Rama Kalyana may verify
          your community details to maintain platform authenticity.
        </li>
        <li>
          We reserve the right to suspend or terminate accounts that contain
          false, misleading, or inappropriate information.
        </li>
      </ul>
    ),
  },
  {
    id: "profile_conduct",
    title: "3. Profile Information and User Conduct",
    content: (
      <>
        <p className="mb-4">
          All information you publish on the Seetha Rama Kalyana Matrimony App
          must be truthful, respectful, and relevant for finding a suitable life
          partner.
        </p>
        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li>Only genuine photos and details should be uploaded.</li>
          <li>
            You must not post or share abusive, offensive, misleading, or
            inappropriate content.
          </li>
          <li>
            Soliciting money, sharing spam messages, or engaging in fraudulent
            behavior is strictly prohibited.
          </li>
          <li>
            We may review or monitor user content to ensure safety and platform
            integrity.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "fees",
    title: "4. Subscription Fees, Interests & Refund Policy",
    content: (
      <>
        <p className="mb-4">
          Some features such as viewing direct contact details require the use
          of “interests” or a paid upgrade.
        </p>
        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li>
            Purchases of interest packages are non-refundable unless required by
            governing law.
          </li>
          <li>
            Failure to complete payment or misuse of features may result in the
            suspension of premium benefits.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "disclaimer",
    title: "5. Disclaimer of Warranties",
    content: (
      <p>
        Seetha Rama Kalyana provides the Service on an “as is” and “as
        available” basis. While we aim to maintain a safe and verified Brahmin
        matrimony environment, we do not guarantee the accuracy of information
        shared by users, the success of matches, or uninterrupted platform
        availability. Users are advised to exercise discretion and verify
        information independently before proceeding with any alliance.
      </p>
    ),
  },
];

const TermSectionComponent: React.FC<{ section: TermSection }> = ({
  section,
}) => {
  return (
    <div
      id={section.id}
      className="pt-2 pb-4 border-b border-amber-100 last:border-b-0 scroll-mt-20">
      <h2 className={`text-3xl font-bold mb-4 ${TEXT_COLOR}`}>
        {section.title}
      </h2>
      <div className="text-gray-700 text-lg leading-relaxed">
        {section.content}
      </div>
    </div>
  );
};

const TermsConditions = () => {
  return (
    <div className="terms-conditions">
      <SEO
        title="Privacy Policy | Seetha Rama Kalyana"
        description="Read the privacy policy of Seetha Rama Kalyana, protecting your data and trust."
        keywords="privacy policy, brahmin matrimony, seetha rama kalyana"
        pageType="privacy"
        url="https://www.seetharamakalyana.in/terms"
      />

      <div className={`${BG_COLOR} min-h-screen py-24 px-4 font-sans`}>
        <header className="text-center mb-10">
          <h1 className={`text-5xl font-extrabold mb-3 ${TEXT_COLOR}`}>
            Terms and Conditions
          </h1>
          <p className="text-xl text-gray-600">
            Please read these terms carefully before using our Matrimony
            service.
          </p>
        </header>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4  gap-8">
          <nav className="lg:col-span-1">
            <div
              className={`p-6 rounded-2xl shadow-xl ${CARD_BG} border ${BORDER_COLOR} sticky top-4`}>
              <h3
                className={`text-2xl font-bold mb-4 border-b pb-2 ${TEXT_COLOR} border-amber-200`}>
                Table of Contents
              </h3>
              <ul className="space-y-2">
                {termsData.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={`block p-2 rounded-lg text-lg ${TEXT_COLOR} hover:bg-amber-100 transition-colors duration-200`}>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <main className="lg:col-span-3">
            <div
              className={`p-8 rounded-2xl shadow-2xl ${CARD_BG} border ${BORDER_COLOR}`}>
              <div className="space-y-6">
                {termsData.map((section) => (
                  <TermSectionComponent key={section.id} section={section} />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
