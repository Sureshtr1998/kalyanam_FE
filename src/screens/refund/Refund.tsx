import SEO from "@/components/misc/SEO";
import { LegalPage } from "@/components/common/LegalPage";
import { SEO_URL, SUPPORT_EMAIL, updatedDate } from "@/utils/constants";

const RefundPolicy = () => (
  <>
    <SEO
      title="Refund Policy | Seetha Rama Kalyana"
      description="Seetha Rama Kalyana refund policy: Amount will be refunded only if user registration fails but payment is deducted. All other payments are non-refundable."
      keywords="hindu matrimony, kannada matrimony, refund policy, payment refund, Seetha Rama Kalyana"
      url={SEO_URL + "/refund-policy"}
    />
    <LegalPage
      title="Refund Policy"
      description="Please read this policy carefully to understand when refunds are provided."
      effective={updatedDate}
      sections={[
        {
          id: "conditions",
          title: "Refund conditions",
          content: (
            <>
              <p>If your registration fails but the payment is deducted, the amount will be refunded in full.</p>
              <p>
                <strong>Important:</strong> in all other cases, including successful registrations, interest
                purchases and astrology readings, payments are <strong>non-refundable</strong>.
              </p>
            </>
          ),
        },
        {
          id: "how",
          title: "How to request a refund",
          content: (
            <p>
              Email <a className="font-semibold text-primary" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with
              your Razorpay payment ID and the email you registered with. This policy is subject to change without
              notice.
            </p>
          ),
        },
      ]}
    />
  </>
);

export default RefundPolicy;
