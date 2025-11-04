import { useState } from "react";
import type { BasicDetailsIn, FormType } from "../../../utils/interfaces";
import { formDefaultVals } from "../../../utils/constants";
import Identity from "./steps/Identity";
import Background from "./steps/Background";
import Profile from "./steps/Profile";
import StepIndicator from "./steps/StepIndicator";
import api from "../../../utils/api";
import { setItem, user_login_token } from "../../../utils/localStore";
import { useToast } from "../../toastProvider/ToastProvider";
import { useNavigate } from "react-router-dom";
import Verify from "./steps/Verify";
import PaymentModal from "../../paymentModal/PaymentModal";

interface Props {
  setCurrentForm: (val: FormType) => void;
}

const RegistrationForm = (props: Props) => {
  const { setCurrentForm } = props;
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isPayment, setPayment] = useState<boolean>(false);

  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const [formData, setFormData] = useState<BasicDetailsIn>(
    formDefaultVals.basic
  );
  const [images, setImages] = useState<File[]>([]);

  const { showToast } = useToast();
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "email"
          ? e.target.value.toLowerCase()
          : e.target.value,
    });
  };

  const errorMsg = "Please fill in all the fields.";

  const validateStep = (currentStep: 1 | 2 | 3 | 4): boolean => {
    setMessage(null);
    if (currentStep === 1) {
      if (
        !formData.fullName ||
        !formData.email ||
        !formData.gender ||
        !formData.dob
      ) {
        setMessage({ text: errorMsg, type: "error" });
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setMessage({
          text: "Password and Confirm Password must match.",
          type: "error",
        });
        return false;
      }
      if (formData.password.length < 6) {
        setMessage({
          text: "Password should be atleast 6 characters.",
          type: "error",
        });
        return false;
      }
    }

    if (currentStep === 2) {
      if (
        !formData.martialStatus ||
        !formData.motherTongue ||
        !formData.qualification ||
        !formData.gothra ||
        !formData.subCaste ||
        !formData.profileCreatedBy
      ) {
        setMessage({ text: errorMsg, type: "error" });
        return false;
      }
    }

    if (currentStep === 3) {
      if (!images.length) {
        setMessage({ text: "Please upload atleast one image", type: "error" });
        return false;
      }
      if (formData.mobile.length !== 10) {
        setMessage({
          text: "Please enter a valid Mobile Number.",
          type: "error",
        });
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step === 4) setPayment(true);
      setStep((prev) => Math.min(4, prev + 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1) as 1 | 2 | 3 | 4);
  };

  const registerUser = async () => {
    try {
      let imageUrls: string[] = [];

      // 1️⃣ Upload images first
      if (images.length > 0) {
        const imgFormData = new FormData();
        images.forEach((file) => imgFormData.append("images", file));

        const imgRes = await api.post(
          "/user-register/upload-images",
          imgFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        imageUrls = imgRes.data.urls;
      }

      const payload = {
        ...formData,
        images: imageUrls,
      };

      const res = await api.post("/user-register", payload);

      setItem(user_login_token, res.data);
      showToast(
        "success",
        "Registration Successful",
        "Your details have been submitted successfully!"
      );
      navigate("/home");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showToast(
        "error",
        "Registration Failed",
        err.response?.data?.msg || "Server error"
      );
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {isPayment && (
        <PaymentModal
          onSuccess={registerUser}
          onHide={() => setPayment(false)}
        />
      )}

      <StepIndicator step={step} />

      {message && (
        <div
          className={`p-3 mb-4 rounded-lg text-sm w-full max-w-sm ${
            message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}>
          {message.text}
        </div>
      )}

      <div className="w-full max-w-sm">
        {step === 1 && (
          <Identity
            handleChange={handleChange}
            setCurrentForm={setCurrentForm}
            handleNext={handleNext}
            formData={formData}
          />
        )}
        {step === 2 && (
          <Background
            handleChange={handleChange}
            handleNext={handleNext}
            handleBack={handleBack}
            formData={formData}
          />
        )}
        {step === 3 && (
          <Profile
            handleNext={handleNext}
            handleChange={handleChange}
            setImages={setImages}
            handleBack={handleBack}
            formData={formData}
          />
        )}
        {step === 4 && (
          <Verify
            handleBack={handleBack}
            handleNext={handleNext}
            email={formData.email}
            mobile={formData.mobile}
          />
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;
