import { Clock, Mail, MessageCircle } from "lucide-react";
import { Lotus } from "@/components/common/Brand";
import SEO from "@/components/misc/SEO";
import { SEO_URL, SUPPORT_EMAIL } from "@/utils/constants";

const ContactUs = () => (
  <>
    <SEO
      title="Contact Us | Seetha Rama Kalyana"
      description="Get in touch with Seetha Rama Kalyana, the trusted Hindu matrimony platform. Reach us via email and we will get back to you promptly."
      keywords="contact, support, hindu matrimony, seetha rama kalyana"
      url={SEO_URL + "/contact-us"}
    />
    <section className="bg-sunrise">
      <div className="mx-auto flex min-h-[60dvh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
        <Lotus className="h-6 w-10 text-gold" />
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Get in touch</h1>
        <p className="mt-3 text-muted-foreground">
          Questions about your profile, payments or anything else? We're happy to help.
        </p>
        <div className="mt-8 w-full space-y-3">
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="flex items-center gap-4 rounded-2xl border border-gold/40 bg-card p-5 text-left shadow-sm transition hover:shadow-md">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Mail className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-muted-foreground">Email us</span>
              <span className="block break-all font-semibold text-primary">{SUPPORT_EMAIL}</span>
            </span>
          </a>
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Clock className="size-5" />
            </span>
            <span className="text-sm text-muted-foreground">We reply within 24 hours. For payment issues, please include your payment ID.</span>
          </div>
          <p className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
            <MessageCircle className="size-3.5" /> Include your registered email and WhatsApp number so we can find your account.
          </p>
        </div>
      </div>
    </section>
  </>
);

export default ContactUs;
