import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import api from "../../utils/api";
import { useToast } from "../toastProvider/ToastProvider";

interface Props {
    onHide: () => void;
    onSuccess: () => void;
    email: string
    mobile: string
}

const RegisterModal = (props: Props) => {
    const { onHide, email, mobile, onSuccess } = props
    const { showToast } = useToast();


    const [emailOtp, setEmailOtp] = useState("");
    const [mobileOtp, setMobileOtp] = useState("");


    useEffect(() => {
        sendOtp()
    }, [])

    const sendOtp = async () => {
        try {
            const res = await api.post('send-otp', { email, mobile })
            showToast("success", "Sent", res.data.msg || 'OTP sent to email and phone!');


            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            showToast("error", "Failed", err.response?.data?.msg || 'Failed to send OTP');
            onHide()
        }
    }


    const handleVerifyOtp = async () => {
        try {
            const res = await api.post('verify-otp-registration', { email, emailOtp, mobileOtp })
            showToast("success", "Verified", res.data.msg || 'Verification successful!');
            onSuccess()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            showToast("error", "Failed", err.response?.data?.msg || "Invalid OTP");

        }
    };

    const footer = (
        <div className="p-d-flex p-jc-between">
            <Button label="Verify OTP" style={{ backgroundColor: 'orange' }} icon="pi pi-check" onClick={handleVerifyOtp} />
            <Button label="Cancel" className="p-button-secondary" onClick={onHide} />
        </div>
    );

    return (
        <Dialog draggable={false} resizable={false} header="Enter OTP for email & phone" visible style={{ width: "400px" }} onHide={onHide} footer={footer}>

            <div className="grid mt-4">
                <label htmlFor="emailOtp" className="field-label">
                    Email OTP
                </label>
                <InputText id="emailOtp" placeholder="Enter OTP sent to your mail..." value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)} />
            </div>

            <div className="grid mt-4">
                <label htmlFor="mobileOtp" className="field-label">
                    Mobile OTP
                </label>
                <InputText id="mobileOtp" placeholder="Enter OTP sent to your phone..." value={mobileOtp} onChange={(e) => setMobileOtp(e.target.value)} />
            </div>
        </Dialog >
    );
};

export default RegisterModal;
