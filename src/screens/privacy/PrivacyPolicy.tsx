import React from "react";
import {
  TEXT_COLOR,
  BG_COLOR,
  CARD_BG,
  BORDER_COLOR,
} from "../../styles/variables";
import { SEO_URL, SUPPORT_EMAIL, updatedDate } from "../../utils/constants";
import SEO from "../../components/misc/SEO";

interface PolicySection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const policyData: PolicySection[] = [
  {
    id: "data_collection",
    title: "1. Information We Collect",
    content: (
      <>
        <p className="mb-4">
          We collect personal information that you voluntarily provide while
          creating an account, updating your profile, using paid features, or
          contacting us. This helps us match you with relevant profiles on the
          platform.
        </p>

        <h4 className={`text-xl font-semibold mt-4 mb-2 ${TEXT_COLOR}`}>
          Types of Data Collected:
        </h4>

        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li>
            <strong>Profile Information:</strong> Name, age, gender, date of
            birth, location, contact details, religion, caste, sub-caste,
            education, profession, lifestyle details, and preferences.
          </li>
          <li>
            <strong>Sensitive Personal Data:</strong> Photos, height, physical
            characteristics, horoscope details, and marital status (e.g.,
            unmarried, divorced, widowed).
          </li>
          <li>
            <strong>Usage & Device Data:</strong> IP address, device type,
            browser details, app actions (likes, views, interests sent), crash
            logs, and analytics information for improving the platform.
          </li>
          <li>
            <strong>Payment Data:</strong> While purchasing “Interests,” our
            payment partners (Razorpay etc.) securely handle payment details. We
            do not store credit/debit card information.
          </li>
        </ul>
      </>
    ),
  },

  {
    id: "data_use",
    title: "2. How We Use Your Information",
    content: (
      <>
        <p className="mb-4">
          We use your personal data to run the platform safely and effectively.
        </p>

        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li>
            To match you with compatible profiles based on your preferences.
          </li>
          <li>
            To verify user identity, detect fake profiles, and maintain a safe
            environment.
          </li>
          <li>
            To send important communication related to account security,
            updates, and support.
          </li>
          <li>
            To understand usage behavior and enhance our algorithm and features.
          </li>
          <li>
            To process payments securely through trusted third-party gateways.
          </li>
        </ul>
      </>
    ),
  },

  {
    id: "data_sharing",
    title: "3. Sharing Your Personal Data",
    content: (
      <>
        <p className="mb-4">
          We do not sell your personal information. We only share it under the
          following conditions:
        </p>

        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li>
            <strong>With Other Members:</strong> Your basic profile is visible
            to registered users. Contact details are shown only when you choose
            to reveal or when a paid feature allows it.
          </li>
          <li>
            <strong>Service Providers:</strong> Hosting providers, analytics
            tools, and payment gateways who assist with platform operations.
          </li>
          <li>
            <strong>Legal Compliance:</strong> When required by law enforcement,
            court orders, or government authorities.
          </li>
          <li>
            <strong>Business Transfers:</strong> In case of merger, acquisition,
            or reorganization, data may be transferred while maintaining privacy
            protection.
          </li>
        </ul>
      </>
    ),
  },

  {
    id: "privacy_controls",
    title: "4. Your Privacy Controls & Choices",
    content: (
      <>
        <p className="mb-4">
          You have complete control over your personal information and how it is
          displayed on the platform.
        </p>

        <ul className="list-disc ml-6 space-y-2 text-gray-700">
          <li>
            <strong>Profile Visibility Controls:</strong> Hide profile, hide
            photos, or block certain users.
          </li>
          <li>
            <strong>Data Access & Edit:</strong> Update your details anytime
            under the Account section.
          </li>
          <li>
            <strong>Delete Account:</strong> You may delete your profile
            anytime. Most data is erased except logs retained for legal
            purposes.
          </li>
          <li>
            <strong>Communication Control:</strong> You may turn off certain
            email or notification types.
          </li>
        </ul>
      </>
    ),
  },

  {
    id: "security",
    title: "5. Data Security",
    content: (
      <p>
        We use industry-standard encryption, secure servers, and regular safety
        audits to protect your personal data. While we take strong measures, no
        online service is 100% secure. We cannot guarantee prevention of all
        unauthorized access, but we continuously improve our systems to keep
        your information safe.
      </p>
    ),
  },

  {
    id: "children",
    title: "6. Use by Minors",
    content: (
      <p>
        Our service is strictly for adults aged 18 and above. We do not
        knowingly collect information from minors. If we discover underage
        accounts, they will be removed immediately.
      </p>
    ),
  },

  {
    id: "changes",
    title: "7. Updates to This Privacy Policy",
    content: (
      <p>
        We may update this Privacy Policy periodically. The updated version will
        be posted on this page with a revised “Last Updated” date. We encourage
        you to review the policy regularly.
      </p>
    ),
  },

  {
    id: "contact",
    title: "8. Contact Us",
    content: (
      <p>
        For questions or concerns about this Privacy Policy, you can reach us at{" "}
        <span className="font-semibold">{SUPPORT_EMAIL}</span>. We are happy to
        assist you.
      </p>
    ),
  },
];

const PolicySectionComponent: React.FC<{ section: PolicySection }> = ({
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

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy">
      <SEO
        title="Privacy Policy | Seetha Rama Kalyana"
        description="Read the Privacy Policy of Seetha Rama Kalyana, a trusted Hindu matrimony platform committed to protecting your personal data, privacy, and security."
        keywords="privacy policy, data protection, seetha rama kalyana, hindu matrimony privacy, hindu matrimony policy, matrimony data security"
        url={SEO_URL + "/privacy"}
      />

      <div className={`${BG_COLOR} min-h-screen py-24 px-4 font-sans`}>
        <header className="text-center mb-10">
          <h1 className={`text-5xl font-extrabold mb-3 ${TEXT_COLOR}`}>
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600">
            Your privacy is our priority. Learn how we handle and protect your
            personal data.
          </p>
        </header>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          <nav className="lg:col-span-1">
            <div
              className={`p-6 rounded-2xl shadow-xl ${CARD_BG} border ${BORDER_COLOR} sticky top-4`}>
              <h3
                className={`text-2xl font-bold mb-4 border-b pb-2 ${TEXT_COLOR} border-amber-200`}>
                Policy Index
              </h3>
              <ul className="space-y-2">
                {policyData.map((section) => (
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
              <p className="text-gray-600 mb-6 text-sm italic">
                **Effective Date:** {updatedDate}
              </p>
              <div className="space-y-6">
                {policyData.map((section) => (
                  <PolicySectionComponent key={section.id} section={section} />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
