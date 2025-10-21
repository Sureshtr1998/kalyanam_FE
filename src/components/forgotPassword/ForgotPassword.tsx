import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useToast } from '../toastProvider/ToastProvider';
import api from '../../utils/api';
import './ForgotPassword.scss';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { showToast } = useToast();


    const requestOtp = async () => {
        try {
            const res = await api.post('/request-reset', { email });
            setStep(2);
            setTimeout(() => {
                showToast('success', 'OTP Sent', res.data.msg);
            }, 500)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            showToast('error', 'Error', err.response?.data?.msg || 'Server error');
        }
    };

    const verifyOtp = async () => {
        try {
            const res = await api.post('/verify-otp', { email, otp });
            setStep(3);
            setTimeout(() => {
                showToast('success', 'Success', res.data.msg);

            }, 500)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            showToast('error', 'Error', err.response?.data?.msg || 'Invalid OTP');
        }
    };

    const resetPassword = async () => {
        try {
            const res = await api.post('/reset-password', { email, newPassword });
            window.location.href = '/'
            setTimeout(() => {
                showToast('success', 'Done', res.data.msg);
            }, 500)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            showToast('error', 'Error', err.response?.data?.msg || 'Server error');
        }
    };

    return (
        <div className='forgot-pwd'>
            {step === 1 && (
                <div
                    className="grid mt-4"
                >
                    <InputText
                        className="p-field"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className='mt-4'>
                        <Button label="Send OTP" className="login-button" onClick={requestOtp} />
                    </div>
                </div>
            )}

            {step === 2 && (
                <div
                    className="grid mt-4"
                >
                    <InputText
                        className="p-field"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <div className='mt-4'>
                        <Button label="Verify OTP" className="login-button" onClick={verifyOtp} />
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="grid mt-4">
                    <InputText
                        type="password"
                        className="p-field"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <InputText
                        type="password"
                        className="p-field mt-4"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div className="mt-4">
                        <Button
                            label="Reset Password"
                            className="login-button"
                            onClick={() => {
                                if (newPassword !== confirmPassword) {
                                    showToast(
                                        "error",
                                        "Error",
                                        "New Password and Confirm Password must be the same"
                                    );
                                    return;
                                }
                                resetPassword();
                            }}
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

export default ForgotPassword;
