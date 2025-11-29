/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "primereact/button";
import FormInput from "../../../fields/FormInput";
import { useEffect, useState } from "react";
import api from "../../../../utils/api";
import { useToast } from "../../../toastProvider/ToastProvider";

interface Props {
  handleNext: () => void;
  handleBack: () => void;
  email: string;
  mobile: string;
}

const Verify = (props: Props) => {
  const { handleBack, handleNext, email, mobile } = props;

  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    sendOtp();
    setTimer(60);
  }, []);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const sendOtp = async () => {
    if (timer > 0) return; // prevent multiple clicks

    try {
      const res = await api.post("send-otp", { email, mobile });
      showToast(
        "success",
        "Sent",
        res.data.msg || "OTP sent to email & phone!"
      );

      setTimer(60);
    } catch (err: any) {
      showToast(
        "error",
        "Failed",
        err.response?.data?.msg || "Failed to send OTP"
      );
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await api.post("verify-otp-registration", {
        email,
        emailOtp,
        mobileOtp,
      });

      showToast(
        "success",
        "Verified",
        res.data.msg || "Verification successful!"
      );
      handleNext();
    } catch (err: any) {
      showToast("error", "Failed", err.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h3 className="heading">Step 4: Account Verification</h3>

      <p className="text-gray-700 mb-4 mt-2 text-sm">
        Please enter the 6-digit verification codes sent to your email and
        mobile number.
      </p>

      <div className="mb-4">
        <FormInput
          name="emailOtp"
          type="number"
          placeholder="Email OTP"
          value={emailOtp}
          onChange={(e) => setEmailOtp(e.target.value.slice(0, 6))}
          icon="pi pi-envelope"
        />
      </div>

      <div className="mb-6">
        <FormInput
          name="mobileOtp"
          type="number"
          placeholder="WhatsApp OTP"
          value={mobileOtp}
          onChange={(e) => setMobileOtp(e.target.value.slice(0, 6))}
          icon="pi pi-whatsapp"
        />
      </div>

      <div className="flex justify-between gap-4 mt-6">
        <Button onClick={handleBack} className="secondary-btn">
          Back
        </Button>

        <Button
          disabled={loading || emailOtp.length !== 6 || mobileOtp.length !== 6}
          onClick={handleVerifyOtp}
          className="update-btn">
          Verify & Proceed
        </Button>
      </div>

      <div className="text-center mt-4">
        <p className="text-xs text-gray-500 mb-4">
          Didn't receive the OTP? Please check your <b>Spam</b> folder.
        </p>

        <button
          onClick={sendOtp}
          disabled={loading || timer > 0}
          className={`text-sm  flex items-center justify-center mx-auto 
            ${
              timer > 0
                ? "text-gray-400"
                : "text-gray-600 cursor-pointer hover:underline"
            }`}>
          <i className="w-4 h-4 mr-1 pi pi-sync" />
          {timer > 0 ? `Resend OTPs in ${timer}s` : "Resend OTPs"}
        </button>
      </div>
    </div>
  );
};

export default Verify;
