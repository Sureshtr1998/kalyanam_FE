import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
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
  const [orderId, setOrderId] = useState("");
  const [link, setLink] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/create-order", {
        userName,
        userEmail,
        userPhone,
        amount,
      });
      setLink(data.paymentLink);
      setOrderId(data.orderId);
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

  // 2️⃣ Poll payment status every 4s
  useEffect(() => {
    if (!orderId) return;
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/check-payment-status/${orderId}`);
        if (data.status === "SUCCESS") {
          clearInterval(interval);
          onSuccess(orderId);
          onHide();
        } else if (data.status === "FAILED") {
          clearInterval(interval);
          showToast(
            "error",
            "Payment Failed",
            "Payment could not be completed. Please try again."
          );
          onHide();
        }
      } catch (err) {
        console.error("Error checking payment status:", err);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <>
      <Dialog
        header="Complete Your Payment"
        visible
        onHide={onHide}
        style={{ width: "450px" }}
        draggable={false}
        resizable={false}>
        {loading && <Spinner isLoading={loading} />}
        {link && !loading && (
          <iframe
            src={link}
            style={{ width: "100%", height: "25rem", border: "none" }}
            title="Cashfree Payment"
          />
        )}
      </Dialog>
    </>
  );
};

export default PaymentModal;
