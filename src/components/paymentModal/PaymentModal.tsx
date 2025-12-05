import { useEffect, useState } from "react";
import { useRazorpay, type RazorpayOrderOptions } from "react-razorpay";
import api from "../../utils/api";
import Spinner from "../spinner/Spinner";
import "./PaymentModal.scss";
import { useToast } from "../toastProvider/ToastProvider";

interface Props {
  onHide: () => void;
  onSuccess: (orderId: string, paymentId: string) => void;
  userName: string;
  userEmail: string;
  userPhone: string;
  amount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newUserPayload?: any;
}

const PaymentModal = ({
  onHide,
  onSuccess,
  userName,
  userEmail,
  userPhone,
  amount,
  newUserPayload,
}: Props) => {
  const { Razorpay, isLoading, error } = useRazorpay();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (!isLoading && !error) {
      initPayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, error]);

  const enableBodyScroll = () => {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  };

  const initPayment = async () => {
    setLoading(true);

    try {
      const { data } = await api.post("/create-order", {
        userName,
        userEmail,
        userPhone: `+91${userPhone}`,
        amount,
        newUserPayload,
      });

      const options: RazorpayOrderOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Seetha Rama Kalyana",
        description: "Matrimony subscription",
        order_id: data.orderId,
        image: "https://www.seetharamakalyana.in/logo.png",
        handler: (response) => {
          const { razorpay_payment_id, razorpay_order_id } = response;
          onSuccess(razorpay_order_id, razorpay_payment_id);
          onHide();
        },
        modal: {
          ondismiss: () => {
            showToast(
              "info",
              "Payment Cancelled",
              "You cancelled the payment."
            );
          },
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone,
        },
        theme: {
          color: "#f59e0b",
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment Error:", err);
      showToast(
        "error",
        "Payment Error",
        "Unable to initiate payment. Please try again."
      );
    } finally {
      enableBodyScroll();
      setLoading(false);
    }
  };

  return <>{loading && <Spinner isLoading={loading} />}</>;
};

export default PaymentModal;
