import React from "react";
import SEO from "../../components/misc/SEO";
import { LegalPage } from "../../components/common/LegalPage";
import { SEO_URL, updatedDate } from "../../utils/constants";

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
          and Seetha Rama Kalyana, a dedicated Hindu matrimonial service for
          genuine marriage minded individuals. If you do not agree to these
          Terms, you must stop using the Service immediately.
        </p>
        <p className="text-sm italic text-muted-foreground">
          Last Updated: {updatedDate}.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "2. Eligibility and Membership",
    content: (
      <ul className="list-disc ml-6 space-y-2 text-foreground/85">
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
          As a Hindu focused matrimony app, Seetha Rama Kalyana may verify your
          community details to maintain platform authenticity.
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
        <ul className="list-disc ml-6 space-y-2 text-foreground/85">
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
        <ul className="list-disc ml-6 space-y-2 text-foreground/85">
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
        available” basis. While we aim to maintain a safe and verified Hindu
        matrimony environment, we do not guarantee the accuracy of information
        shared by users, the success of matches, or uninterrupted platform
        availability. Users are advised to exercise discretion and verify
        information independently before proceeding with any alliance.
      </p>
    ),
  },
];

const TermsConditions = () => (
  <>
    <SEO
      title="Terms & Conditions | Seetha Rama Kalyana"
      description="Read the terms and conditions for using Seetha Rama Kalyana, a trusted Hindu matrimony platform."
      keywords="terms and conditions, hindu matrimony, seetha rama kalyana"
      pageType="terms"
      url={SEO_URL + "/terms"}
    />
    <LegalPage
      title="Terms & Conditions"
      description="Please read these terms carefully before using our matrimony service."
      effective={updatedDate}
      sections={termsData}
    />
  </>
);

export default TermsConditions;
