import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail } from "lucide-react";
import { Lotus } from "@/components/common/Brand";
import SEO from "../../components/misc/SEO";
import {
  INITIAL_NO_INTEREST,
  PURCHASE_INTEREST_FEE,
  PURCHASE_INTEREST_FEE_2,
  PURCHASE_NO_INTEREST,
  PURCHASE_NO_INTEREST_2,
  SEO_URL,
  SUPPORT_EMAIL,
} from "../../utils/constants";

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
      "Members see profiles that fit their own partner-preference filters (age, caste, mother tongue and more). You can hide your profile from anyone at any time.",
    icon: "pi pi-shield",
  },
  {
    id: "faq-15",
    question: "Can users from other castes or mother tongues view my profile?",
    answer:
      "Profiles are filtered by each member's partner preferences, so you mostly appear to families looking for someone like you. To block a specific member, use the hide option on their profile.",
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
    answer: `Membership includes ${INITIAL_NO_INTEREST} credits. Each interest you send uses 1 credit, so you can send ${INITIAL_NO_INTEREST} interests. More credits can be bought under Account whenever you need them.`,
    icon: "pi pi-envelope",
  },
  {
    id: "faq-4",
    question: "Can I view a user's contact directly?",
    answer:
      "Yes. When the other person accepts your interest, both of you see each other's phone and email at no extra cost. If you don't want to wait for a reply, you can see a contact straight away for 5 credits.",
    icon: "pi pi-phone",
  },
  {
    id: "faq-5",
    question: "What are the pricing plans for buying more credits?",
    answer: `We offer two plans: ${PURCHASE_NO_INTEREST} credits for ₹${PURCHASE_INTEREST_FEE} and ${PURCHASE_NO_INTEREST_2} credits for ₹${PURCHASE_INTEREST_FEE_2}.`,
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

const FAQPage = () => (
  <>
    <SEO
      title="FAQ | Seetha Rama Kalyana"
      description="Frequently Asked Questions about Seetha Rama Kalyana matrimony services."
      keywords="faq, hindu matrimony, seetha rama kalyana"
      pageType="faq"
      faqItems={faqItems}
      url={SEO_URL + "/faq"}
    />
    <div className="bg-kolam">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="mb-10 text-center">
          <Lotus className="mx-auto h-6 w-10 text-gold" />
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Frequently asked questions</h1>
          <p className="mt-3 text-muted-foreground">Quick answers to the most common questions about our platform.</p>
        </header>
        <Accordion type="single" collapsible className="space-y-3">
          {faqItems.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="rounded-2xl border border-border bg-card px-4 shadow-sm last:border-b">
              <AccordionTrigger className="gap-3 text-left text-base font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-10 rounded-3xl border border-gold/40 bg-accent p-6 text-center">
          <h2 className="font-display text-2xl font-bold">Can't find your answer?</h2>
          <p className="mt-1 text-sm text-muted-foreground">Write to us. We reply within 24 hours.</p>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="mt-3 inline-flex items-center gap-2 font-semibold text-primary hover:underline">
            <Mail className="size-4" />
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>
    </div>
  </>
);

export default FAQPage;
