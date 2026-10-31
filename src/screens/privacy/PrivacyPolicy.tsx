import React from "react";
import { SEO_URL, SUPPORT_EMAIL, updatedDate } from "../../utils/constants";
import SEO from "../../components/misc/SEO";
import { LegalPage } from "../../components/common/LegalPage";

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

        <h4 className="mt-4 mb-2 font-semibold text-lg text-foreground">
          Types of Data Collected:
        </h4>

        <ul className="list-disc ml-6 space-y-2 text-foreground/85">
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

        <ul className="list-disc ml-6 space-y-2 text-foreground/85">
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

        <ul className="list-disc ml-6 space-y-2 text-foreground/85">
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

        <ul className="list-disc ml-6 space-y-2 text-foreground/85">
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

const PrivacyPolicy = () => (
  <>
    <SEO
      title="Privacy Policy | Seetha Rama Kalyana"
      description="Read the Privacy Policy of Seetha Rama Kalyana, a trusted Hindu matrimony platform committed to protecting your personal data, privacy, and security."
      keywords="privacy policy, data protection, seetha rama kalyana, hindu matrimony privacy, matrimony data security"
      url={SEO_URL + "/privacy"}
    />
    <LegalPage
      title="Privacy Policy"
      description="Your privacy is our priority. Learn how we handle and protect your personal data."
      effective={updatedDate}
      sections={policyData}
    />
  </>
);

export default PrivacyPolicy;
