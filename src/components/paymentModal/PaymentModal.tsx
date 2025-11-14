// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { load } from "@cashfreepayments/cashfree-js";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import Spinner from "../spinner/Spinner";
import "./PaymentModal.scss";
import { useToast } from "../toastProvider/ToastProvider";

interface Props {
  onHide: () => void;
  onSuccess: (orderId: string) => void;
  userName: string;
  userEmail: string;
  userPhone: string;
  amount: number;
}

const PaymentModal = (props: Props) => {
  const { onHide, onSuccess, userName, userEmail, userPhone, amount } = props;
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cashfree: any;

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    cashfree = await load({
      mode: "sandbox",
    });
    try {
      const { data } = await api.post("/create-order", {
        userName,
        userEmail,
        userPhone,
        amount,
      });

      doPayment(data.orderId, data.cftoken);
    } catch (err) {
      console.error("Error creating order:", err);
      showToast(
        "error",
        "Error",
        "Unable to initiate payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const doPayment = async (orderId: string, cftoken: string) => {
    const checkoutOptions = {
      paymentSessionId: cftoken,
      redirectTarget: "_modal",
    };

    try {
      const result = await cashfree.checkout(checkoutOptions);

      if (result.error) {
        showToast(
          "error",
          "Payment Failed",
          "Payment could not be completed. Please try again."
        );
        onHide();
        return;
      }

      if (result.paymentDetails) {
        onSuccess(orderId);
        onHide();
      }
    } catch (err) {
      console.error("Payment Error:", err);
      showToast(
        "error",
        "Payment Error",
        "Something went wrong while processing the payment."
      );
      onHide();
    }
  };

  return <>{loading && <Spinner isLoading={loading} />}</>;
};

export default PaymentModal;
