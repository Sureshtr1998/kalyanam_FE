import { Accordion, AccordionTab } from "primereact/accordion";
import SEO from "../../components/misc/SEO";
import {
  BORDER_COLOR,
  CARD_BG,
  TEXT_COLOR,
  BG_COLOR,
} from "../../styles/variables";
import {
  INITIAL_NO_INTEREST,
  PURCHASE_INTEREST_FEE,
  PURCHASE_INTEREST_FEE_2,
  PURCHASE_NO_INTEREST,
  PURCHASE_NO_INTEREST_2,
  SUPPORT_EMAIL,
} from "../../utils/constants";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: string;
}

const faqItems: FAQItem[] = [
  {
    id: "faq-1",
    question: "Is Seetha Rama Kalyana exclusive to Hindus?",
    answer:
      "Yes, our platform is dedicated exclusively to the Hindu community, ensuring culturally relevant matches and meaningful connections.",
    icon: "pi pi-users",
  },
  {
    id: "faq-2",
    question: "How can I trust this matrimony application?",
    answer:
      "Seetha Rama Kalyana uses Razorpay for secure payments, advanced data encryption, performs thorough background verification, and is a Meta-verified business, ensuring trust and reliability.",
    icon: "pi pi-shield",
  },
  {
    id: "faq-13",
    question: "How does sending an interest work?",
    answer:
      "When you send an interest, 1 interest is deducted from your account. The other user is notified by email, and you’ll be notified if they accept. You can track the status under Activity.",
    icon: "pi pi-shield",
  },
  {
    id: "faq-14",
    question: "Who can view my profile?",
    answer:
      "Only users whose caste and mother tongue match your partner preferences can view your profile.",
    icon: "pi pi-shield",
  },
  {
    id: "faq-15",
    question: "Can users from other castes or mother tongues view my profile?",
    answer:
      "No. They can view your profile only if you explicitly mention that you are open to them in your Partner Preferences.",
    icon: "pi pi-shield",
  },
  {
    id: "faq-12",
    question:
      "Why choose Seetha Rama Kalyana over other branded matrimony platforms?",
    answer:
      "Even with competitive pricing aside, we maintain transparency and integrity. We prefer showing accurate profiles and honest availability rather than inflating numbers or misrepresenting users.",
    icon: "pi pi-star",
  },
  {
    id: "faq-3",
    question: "How many interests can I send?",
    answer: `Upon registration, you receive ${INITIAL_NO_INTEREST} interests by default. Additional interests can be purchased under your account as needed.`,
    icon: "pi pi-envelope",
  },
  {
    id: "faq-4",
    question: "Can I view a user's contact directly?",
    answer:
      "Yes, You can view a user’s contact for free if both accept each other’s interest or it'd cost 5 interests.",
    icon: "pi pi-phone",
  },
  {
    id: "faq-5",
    question: "What are the pricing plans for purchasing interests?",
    answer: `We offer two plans: ${PURCHASE_NO_INTEREST} interests for ₹${PURCHASE_INTEREST_FEE} and ${PURCHASE_NO_INTEREST_2} interests for ₹${PURCHASE_INTEREST_FEE_2}.`,
    icon: "pi pi-wallet",
  },
  {
    id: "faq-6",
    question: "Why can't I find more profiles on the platform?",
    answer:
      "Seetha Rama Kalyana is newly launched. We are actively onboarding verified members, so please check back as our community grows.",
    icon: "pi pi-search",
  },
  {
    id: "faq-7",
    question: "Can I hide my profile from certain users?",
    answer:
      "Yes, you can hide your profile from specific users. You can also view the list of users from whom your profile is hidden under your account settings.",
    icon: "pi pi-eye-slash",
  },
  {
    id: "faq-8",
    question: "Is it easy to delete or hide my profile?",
    answer:
      "Yes, you can manage profile visibility or delete your profile directly from the account settings.",
    icon: "pi pi-cog",
  },
  {
    id: "faq-10",
    question:
      "Why is Seetha Rama Kalyana priced lower than other matrimony apps?",
    answer:
      "We are focused on community service rather than profit. Pricing is kept minimal and transparent, ensuring fair access for all users.",
    icon: "pi pi-tags",
  },
];

const FAQPage = () => {
  return (
    <div className="faq">
      <SEO
        title="FAQ | Seetha Rama Kalyana"
        description="Frequently Asked Questions about Seetha Rama Kalyana matrimony services."
        keywords="faq, hindu matrimony, seetha rama kalyana"
        pageType="faq"
        faqItems={faqItems}
        url="https://www.seetharamakalyana.in/faq"
      />

      <div className={`${BG_COLOR} min-h-screen py-24 px-4 font-sans`}>
        <div className="text-center mb-10">
          <h1 className={`text-5xl font-extrabold mb-3 ${TEXT_COLOR}`}>
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find quick answers to the most common questions about our platform.
          </p>
        </div>
        <div>
          <Accordion className="accordion-data">
            {faqItems.map((faq) => {
              return (
                <AccordionTab
                  key={faq.id}
                  header={
                    <span className="flex align-items-center gap-2 w-full">
                      <span className="my-custom-icon">
                        <i className={`${faq.icon}`}></i>
                      </span>
                      <span className="ml-4 acc-header">{faq.question}</span>
                    </span>
                  }
                  className="accordion-tab">
                  {faq.answer}
                </AccordionTab>
              );
            })}
          </Accordion>
        </div>
        <div
          className={`mt-12 text-center max-w-4xl mx-auto p-6 rounded-2xl shadow-2xl ${CARD_BG} border ${BORDER_COLOR}`}>
          <h3 className={`text-3xl font-bold mb-3 ${TEXT_COLOR}`}>
            Can't find your answer?
          </h3>
          <p className="text-lg text-gray-700 mb-6">
            Our dedicated support team is available 24/7 to assist you with any
            questions or concerns.
          </p>
          <p className="text-lg text-gray-700">Email Support:</p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-[#e07b00] text-sm font-medium hover:underline">
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
