import React from "react";
import SEO from "../../components/misc/SEO";
import {
  ACCENT_COLOR,
  TEXT_COLOR,
  BG_COLOR,
  BORDER_COLOR,
  CARD_BG,
} from "../../styles/variables";
import { SUPPORT_EMAIL } from "../../utils/constants";

const ContactUs: React.FC = () => {
  const canonicalUrl = "https://www.seetharamakalyana.in/contact-us";

  return (
    <>
      {/* SEO */}
      <SEO
        title="Contact Us | Seetha Rama Kalyana"
        description="Get in touch with Seetha Rama Kalyana, the trusted Brahmin matrimony platform. Reach us via email and we will get back to you promptly."
        keywords="contact, support, brahmin matrimony, seetha rama kalyana"
        url={canonicalUrl}
      />

      {/* Main Content */}
      <section
        className={`min-h-screen flex items-center justify-center p-6 sm:p-10 ${BG_COLOR} font-[Inter]`}>
        <main
          className={`w-full max-w-xl rounded-2xl shadow-2xl p-8 md:p-12 ${CARD_BG}`}>
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className={`text-4xl font-extrabold mb-4 ${TEXT_COLOR}`}>
              Get In Touch
            </h1>
            <p className="text-lg text-gray-600">
              We at <strong>Seetha Rama Kalyana</strong>, a trusted Brahmin
              matrimony platform, are happy to answer your questions. Please
              contact us via email, and we will get back to you as soon as
              possible.
            </p>
          </header>

          {/* Contact Details */}
          <div className="mt-10 mx-auto max-w-sm">
            <ContactDetail title="Email Us" />
          </div>
        </main>
      </section>
    </>
  );
};

interface ContactDetailProps {
  title: string;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ title }) => (
  <div
    className={`flex items-start p-4 rounded-xl border ${BORDER_COLOR} bg-opacity-70`}>
    <div
      className={`w-10 h-10 flex items-center justify-center rounded-full ${ACCENT_COLOR} text-white shadow-md flex-shrink-0`}>
      <i className="pi pi-envelope" />
    </div>

    <div className="ml-4 text-left">
      <h3 className={`text-lg font-bold ${TEXT_COLOR} mb-0.5`}>{title}</h3>

      <p className="text-base text-amber-800">
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="font-medium text-amber-900 hover:text-amber-700">
          {SUPPORT_EMAIL}
        </a>
      </p>
    </div>
  </div>
);

export default ContactUs;
