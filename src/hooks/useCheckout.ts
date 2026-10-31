import { useCallback, useState } from "react";
import { useRazorpay, type RazorpayOrderOptions } from "react-razorpay";
import { toast } from "sonner";
import api from "@/utils/api";
import { env } from "@/config/env";
import { BRAND_COLOR, SEO_URL, SITE_NAME } from "@/utils/constants";
import { errorMessage } from "@/lib/errors";
import { trackPixel, type PixelEvent } from "@/lib/pixel";

const pixelEvents: Record<CheckoutRequest["purpose"], PixelEvent> = {
  registration: "CompleteRegistration",
  interest: "Purchase",
  astro: "Purchase",
  broker: "SubmitApplication",
};

export interface PaidOrder {
  orderId: string;
  paymentId: string;
  signature: string;
}

/**
 * What is being bought. The server prices it, the client never sends an amount.
 */
export type CheckoutRequest =
  | { purpose: "registration"; registration: Record<string, unknown> }
  | { purpose: "interest"; pack: "basic" | "premium" }
  | { purpose: "astro"; astro: Record<string, unknown> }
  | { purpose: "broker"; broker: Record<string, unknown> };

interface Options {
  description: string;
  /** Called with the verified-by-Razorpay ids; post them to the fulfilment endpoint. */
  onPaid: (order: PaidOrder) => Promise<void> | void;
}

export const useCheckout = ({ description, onPaid }: Options) => {
  const { Razorpay, isLoading: scriptLoading, error: scriptError } = useRazorpay();
  const [isStarting, setIsStarting] = useState(false);

  const start = useCallback(
    async (request: CheckoutRequest) => {
      if (scriptLoading) {
        toast.info("Payment is still loading", { description: "Please try again in a moment." });
        return false;
      }
      // react-razorpay's wrapper class always exists; the checkout script may not.
      if (scriptError || !("Razorpay" in window)) {
        toast.error("Payment unavailable", {
          description: "Couldn't load Razorpay. Check your connection and try again.",
        });
        return false;
      }
      setIsStarting(true);
      try {
        const { data } = await api.post("/create-order", request);

        await new Promise<void>((resolve) => {
          const options: RazorpayOrderOptions = {
            key: env.razorpayKeyId,
            amount: data.amount,
            currency: data.currency,
            name: SITE_NAME,
            description,
            order_id: data.orderId,
            image: `${SEO_URL}/logo.png`,
            handler: (response) => {
              resolve();
              // Razorpay amounts are in paise.
              trackPixel(pixelEvents[request.purpose], {
                value: data.amount / 100,
                currency: data.currency,
                content_name: description,
              });
              void onPaid({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              });
            },
            modal: {
              ondismiss: () => {
                resolve();
                toast.info("Payment cancelled", {
                  description: "No money was taken. You can try again any time.",
                });
              },
            },
            prefill: {
              name: data.userName,
              email: data.userEmail,
              contact: data.userPhone ? `+91${data.userPhone}` : undefined,
            },
            theme: { color: BRAND_COLOR },
          };

          const rzp = new Razorpay(options);
          rzp.on("payment.failed", (resp) => {
            toast.error("Payment failed", {
              description:
                resp?.error?.description ||
                "Your bank declined the payment. Any amount debited will be auto-refunded.",
            });
          });
          rzp.open();
        });
        return true;
      } catch (err) {
        toast.error("Couldn't start payment", { description: errorMessage(err) });
        return false;
      } finally {
        setIsStarting(false);
      }
    },
    [Razorpay, scriptLoading, scriptError, description, onPaid]
  );

  return { start, isStarting, isReady: !scriptLoading && !scriptError };
};
