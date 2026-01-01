import { useState } from "react";
import type { BasicDetailsIn, FormType } from "../../../utils/interfaces";
import {
  formDefaultVals,
  INITIAL_NO_INTEREST,
  REGISTRATION_FEE,
} from "../../../utils/constants";
import Identity from "./steps/Identity";
import Background from "./steps/Background";
import Profile from "./steps/Profile";
import StepIndicator from "./steps/StepIndicator";
import api from "../../../utils/api";
import { setItem, user_login_token } from "../../../utils/localStore";
import { useToast } from "../../toastProvider/ToastProvider";
import { useNavigate } from "react-router-dom";
import PaymentModal from "../../paymentModal/PaymentModal";
import Spinner from "../../spinner/Spinner";
import { getRefferalAmount } from "../../../utils/utils";

interface Props {
  setCurrentForm: (val: FormType) => void;
}

const RegistrationForm = (props: Props) => {
  const { setCurrentForm } = props;
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isPayment, setPayment] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentAmount, setCurrentAmount] = useState<number>(REGISTRATION_FEE);

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
      [e.target.name]: e.target.value,
    });
  };

  const errorMsg = "Please fill in all the fields.";

  const validateStep = (currentStep: 1 | 2 | 3): boolean => {
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
        !formData.caste ||
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
          text: "Please enter a valid WhatsApp Number.",
          type: "error",
        });
        return false;
      }
    }
    return true;
  };

  const handleNext = async (referralId?: string) => {
    if (validateStep(step)) {
      if (step === 2) setImages([]);
      if (step === 3) {
        try {
          const referrAmnt = getRefferalAmount(referralId);
          setCurrentAmount(referrAmnt);
          setIsLoading(true);
          await api.get("/user-validation", {
            params: { email: formData.email, mobile: formData.mobile },
          });
          setIsLoading(false);
          setPayment(true);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          showToast(
            "error",
            "Validation Failed",
            err.response?.data?.msg || "Server error"
          );
          setIsLoading(false);
        }
      }
      setStep((prev) => Math.min(3, prev + 1) as 1 | 2 | 3);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1) as 1 | 2 | 3);
  };

  const registerUser = async (orderId: string, paymentId: string) => {
    try {
      setIsLoading(true);
      let imageUrls: string[] = [];

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

        imageUrls = imgRes.data.media;
      }

      const payload = {
        ...formData,
        orderId,
        paymentId,
        amountPaid: currentAmount,
        totalNoOfInterest: INITIAL_NO_INTEREST,
        note: "Registration",
        images: imageUrls,
      };

      const res = await api.post("/user-register", payload);

      setItem(user_login_token, res.data);
      showToast(
        "success",
        "Registration Successful",
        "Your details have been submitted successfully!"
      );
      setIsLoading(false);

      navigate("/home");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showToast(
        "error",
        "Registration Failed",
        err.response?.data?.msg || "Server error"
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <Spinner hideText isLoading={isLoading} />

      {isPayment && (
        <PaymentModal
          onSuccess={registerUser}
          onHide={() => setPayment(false)}
          payload={{
            ...formData,
            amountPaid: currentAmount,
            totalNoOfInterest: INITIAL_NO_INTEREST,
            note: "Registration",
            endpoint: "user-register",
          }}
          role="USER"
          userName={formData.fullName}
          userEmail={formData.email}
          userPhone={formData.mobile}
          amount={currentAmount}
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
      </div>
    </div>
  );
};

export default RegistrationForm;
