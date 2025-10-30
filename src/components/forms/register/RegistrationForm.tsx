import { useState } from "react";
import { ACCENT_COLOR, TEXT_COLOR } from "../../../styles/variables";
import type { BasicDetailsIn, FormType } from "../../../utils/interfaces";
import { formDefaultVals } from "../../../utils/constants";
import Identity from "./steps/Identity";
import Background from "./steps/Background";
import Profile from "./steps/Profile";

interface Props {
    setCurrentForm: (val: FormType) => void
}

const RegistrationForm = (props: Props) => {
    const { setCurrentForm } = props
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const [formData, setFormData] = useState<BasicDetailsIn>(formDefaultVals.basic);
    const [images, setImages] = useState<File[]>([]);



    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- Utility Functions ---
    const errorMsg = "Please fill in all the fields."

    const validateStep = (currentStep: 1 | 2 | 3): boolean => {
        // return true
        setMessage(null);
        if (currentStep === 1) {
            if (!formData.fullName || !formData.email || !formData.gender || !formData.dob) {
                setMessage({ text: errorMsg, type: 'error' });
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setMessage({ text: "Password and Confirm Password must match.", type: 'error' });
                return false;
            }
            if (formData.password.length < 6) {
                setMessage({ text: "Password should be atleast 6 characters.", type: 'error' });
                return false;
            }
        }

        if (currentStep === 2) {
            if (!formData.martialStatus || !formData.motherTongue || !formData.qualification || !formData.gothra || !formData.subCaste || !formData.profileCreatedBy) {
                setMessage({ text: errorMsg, type: 'error' });
                return false;
            }

        }

        // Step 3 validation is only for final submission, allowing them to proceed if 'note' is filled
        if (currentStep === 3) {
            if (!images.length) {
                setMessage({ text: 'Please upload atleast one image', type: 'error' });
                return false;
            }
            if (formData.mobile.length < 10) {
                setMessage({ text: "Please enter a valid Mobile Number.", type: 'error' });
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(prev => (Math.min(3, prev + 1) as 1 | 2 | 3));
        }
    };

    const handleBack = () => {
        setStep(prev => (Math.max(1, prev - 1) as 1 | 2 | 3));
    };



    // --- Step Components ---

    const StepIndicator = () => (
        <div className="flex justify-between items-center mb-10 w-full max-w-sm relative">
            {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 text-center">
                    <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${s <= step ? ACCENT_COLOR : 'bg-gray-200 text-gray-500'}`}>
                        {s}
                    </div>
                    <p className={`text-xs mt-1 transition-colors duration-300 ${s <= step ? TEXT_COLOR : 'text-gray-500'}`}>
                        {s === 1 ? 'Identity' : s === 2 ? 'Background' : 'Profile'}
                    </p>
                </div>
            ))}
            <div className={`absolute left-0 right-0 top-[18px] z-[-1] mx-auto w-1/2`}>
                <div className={`h-1 bg-gray-200 rounded-full`}>
                    <div className={`${ACCENT_COLOR} h-1 rounded-full transition-all duration-500`} style={{ width: `${(step - 1) / 2 * 100}%` }}></div>
                </div>
            </div>
        </div>
    );



    return (
        <div className="flex flex-col items-center w-full">

            <StepIndicator />
            {message && (
                <div className={`p-3 mb-4 rounded-lg text-sm w-full max-w-sm ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="w-full max-w-sm">
                {step === 1 && <Identity handleChange={handleChange} setCurrentForm={setCurrentForm} handleNext={handleNext} formData={formData} />}
                {step === 2 && <Background handleChange={handleChange} handleNext={handleNext} handleBack={handleBack} formData={formData} />}
                {step === 3 && <Profile handleChange={handleChange} setImages={setImages} handleBack={handleBack} formData={formData} />}

            </div>
        </div>
    );
};

export default RegistrationForm