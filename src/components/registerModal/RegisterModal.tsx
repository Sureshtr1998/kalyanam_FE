/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import api from "../../utils/api";
import { useToast } from "../toastProvider/ToastProvider";
import FormInput from "../fields/FormInput";

interface Props {
  onHide: () => void;
  onSuccess: () => void;
  email: string;
  mobile: string;
}

const RegisterModal = ({ onHide, onSuccess, email, mobile }: Props) => {
  const { showToast } = useToast();

  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sendOtp();
  }, []);

  const sendOtp = async () => {
    try {
      const res = await api.post("send-otp", { email, mobile });

      showToast(
        "success",
        "Sent",
        res.data.msg || "OTP sent to email and phone!"
      );
    } catch (err: any) {
      showToast(
        "error",
        "Failed",
        err.response?.data?.msg || "Failed to send OTP"
      );
      onHide();
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
      onSuccess();
    } catch (err: any) {
      showToast("error", "Failed", err.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      header={
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <i className="pi pi-user mr-4" />
            <span className="text-lg font-bold">Account Verification</span>
          </div>
        </div>
      }
      visible
      onHide={onHide}
      draggable={false}
      resizable={false}
      style={{ width: "400px" }}>
      <p className="text-gray-700 mb-4 mt-2 text-sm">
        Please enter the 6-digit verification codes sent to your email and
        mobile number to proceed.
      </p>

      <div className="mb-4">
        <FormInput
          name="emailOtp"
          type="number"
          placeholder="Email OTP (Demo: 123456)"
          value={emailOtp}
          onChange={(e) => setEmailOtp(e.target.value.slice(0, 6))}
          icon="pi pi-envelope"
        />
      </div>

      <div className="mb-6">
        <FormInput
          name="mobileOtp"
          type="number"
          placeholder="Mobile OTP (Demo: 123456)"
          value={mobileOtp}
          onChange={(e) => setMobileOtp(e.target.value.slice(0, 6))}
          icon="pi pi-mobile"
        />
      </div>

      <Button
        label="VERIFY & PROCEED"
        onClick={handleVerifyOtp}
        className="update-btn"
        disabled={loading || emailOtp.length !== 6 || mobileOtp.length !== 6}
      />

      <div className="text-center mt-2">
        <button
          onClick={sendOtp}
          disabled={loading}
          className="text-sm cursor-pointer text-gray-600 hover:underline flex items-center justify-center mx-auto">
          <i className="w-4 h-4 mr-1 pi pi-sync" /> Resend OTPs
        </button>
      </div>
    </Dialog>
  );
};

export default RegisterModal;
