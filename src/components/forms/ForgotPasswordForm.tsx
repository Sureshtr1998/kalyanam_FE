/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useToast } from "../toastProvider/ToastProvider";
import api from "../../utils/api";
import FormInput from "../fields/FormInput";
import type { FormType } from "../../utils/interfaces";
import { TEXT_COLOR } from "../../styles/variables";
import { Button } from "primereact/button";

interface Props {
  setCurrentForm: (val: FormType) => void;
}
const ForgotPasswordForm = (props: Props) => {
  const { setCurrentForm } = props;
  const [step, setStep] = useState<"sendEmail" | "enterOtp" | "setPassword">(
    "sendEmail"
  );
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleRequestOtp = async () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast(
        "error",
        "Invalid Email",
        "Please enter a valid email address."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/request-reset", {
        email: email.toLowerCase(),
      });
      setStep("enterOtp");
      showToast("success", "OTP Sent", res.data.msg);
    } catch (err: any) {
      showToast("error", "Error", err.response?.data?.msg || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6 || isNaN(Number(otp))) {
      showToast("error", "Invalid OTP", "Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/verify-otp", { email, otp });
      setStep("setPassword");
      showToast("success", "OTP Verified", res.data.msg);
    } catch (err: any) {
      showToast("error", "Error", err.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      showToast(
        "error",
        "Error",
        "New password must be at least 6 characters."
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("error", "Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/reset-password", { email, newPassword });
      window.location.href = "/lander";
      setTimeout(() => {
        showToast("success", "Password Reset", res.data.msg);
      }, 500);
    } catch (err: any) {
      showToast("error", "Error", err.response?.data?.msg || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-amber-700 mb-6">
        Reset Your Password
      </h2>

      {step === "sendEmail" && (
        <>
          <p className="text-center text-gray-600 mb-6">
            Enter your registered email to receive an OTP for password reset.
          </p>

          <FormInput
            type="email"
            name="email"
            placeholder="Registered Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon="pi pi-envelope"
          />

          <Button
            onClick={handleRequestOtp}
            disabled={loading || !/\S+@\S+\.\S+/.test(email)}
            className="update-btn">
            SEND OTP
          </Button>
        </>
      )}

      {step === "enterOtp" && (
        <>
          <p className="text-center text-gray-600 mb-6 font-medium">
            OTP sent to{" "}
            <span className="font-bold text-amber-700">{email}</span>.
          </p>

          <FormInput
            type="tel"
            name="otp"
            placeholder="Enter 6-Digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            icon="pi pi-key"
          />

          <Button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="update-btn">
            VERIFY OTP
          </Button>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => setStep("sendEmail")}
              className="text-sm cursor-pointer text-gray-600 hover:underline flex items-center">
              <i className="pi pi-sync mr-1" /> Resend OTP
            </button>
          </div>
        </>
      )}

      {step === "setPassword" && (
        <>
          <FormInput
            type="password"
            name="password"
            placeholder="New Password (Min 6 Chars)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            icon="pi pi-lock"
          />

          <FormInput
            type="password"
            name="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon="pi pi-lock"
          />

          <Button
            onClick={handleResetPassword}
            disabled={loading}
            className="update-btn">
            RESET PASSWORD
          </Button>
        </>
      )}

      <p className="text-center mt-8 text-gray-600">
        <button
          onClick={() => setCurrentForm("login")}
          className={`font-semibold ${TEXT_COLOR} cursor-pointer hover:underline focus:outline-none`}>
          Back to Login
        </button>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
