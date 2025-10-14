import React, { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import './Register.scss';
import { maritalOptions, motherTongueOptions, createdByOptions, genderOptions, subCasteOptions, qualificationOptions, emailRegex, user_login_token, formDefaultVals } from '../../utils/constants';
import { Divider } from 'primereact/divider';
import { InputMask } from 'primereact/inputmask';
import type { UserDetails } from '../../utils/interfaces';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import ImageMedia from '../../components/imageMedia/ImageMedia';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [images, setImages] = useState<File[]>([]);
    const [errorMsgs, setErrorMsgs] = useState<string[]>([]);
    const toast = useRef<Toast | null>(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState<UserDetails>(formDefaultVals);



    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if all fields are filled
        const allFieldsFilled = Object.values(formData).every(
            (val) => val !== "" && val !== null && val !== undefined
        );

        const hasImages = images.length > 0;
        setErrorMsgs([]);

        const newErrors: string[] = [];
        if (!emailRegex.test(formData.email)) newErrors.push("Invalid Email.");
        if (formData.password !== formData.confirmPassword) {
            newErrors.push("The confirmation password must match your password.");
        }
        if (formData.password.length < 5) {
            newErrors.push("The password is too short");
        }
        if (!hasImages) {
            newErrors.push("Please upload at least one image.");
        }
        if (!allFieldsFilled) {
            newErrors.push("Please fill all required fields.");
        }

        if (newErrors.length > 0) {
            newErrors.forEach((msg) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Validation Error',
                    detail: msg,
                    life: 3000, // 5 seconds
                });
            });
            return;
        }
        try {
            const formPayload = new FormData();

            // Append all fields
            Object.entries(formData).forEach(([key, value]) => {
                formPayload.append(key, value as string);
            });

            // Append images
            images.forEach((file) => {
                formPayload.append('images', file);
            });

            // Send request to backend
            const res = await api.post('/user-register', formPayload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            localStorage.setItem(user_login_token, res.data.token);
            toast.current?.show({
                severity: 'success',
                summary: 'Registration Successful',
                detail: 'Your details have been submitted successfully!',
                life: 3000,
            });
            navigate('/home');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            toast.current?.show({
                severity: 'error',
                summary: 'Registration Failed',
                detail: err.response?.data?.msg || 'Server error',
                life: 3000,
            });
        }


    };
    const mediaFileHandler = (files: File[]) => {
        setImages(files)
    }
    return (
        <div>
            <Toast ref={toast} position="bottom-left" />
            <div className="register-container">
                <ImageMedia onChange={mediaFileHandler} />
                <form className="register-form">
                    <div className="form-row">
                        <div className="field-container">
                            <label htmlFor="fullName" className="field-label">
                                Name of Bride / Groom
                            </label>
                            <InputText
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="field-input"
                            />
                        </div>

                        <div className="field-container">
                            <label htmlFor="relationshipStatus" className="field-label">
                                Marital Status
                            </label>
                            <Dropdown
                                id="relationshipStatus"
                                name="relationshipStatus"
                                value={formData.relationshipStatus}
                                options={maritalOptions}
                                onChange={handleChange}
                                placeholder="Select"
                                className="field-input"
                            />

                        </div>
                    </div>

                    <div className="form-row">
                        <div className="field-container">
                            <label className="field-label" htmlFor="password">Password</label>
                            <Password maxLength={15} className="field-input" id="password" name="password" value={formData.password} onChange={handleChange} toggleMask feedback={false} />
                        </div>
                        <div className="field-container">
                            <label className="field-label" htmlFor="confirmpassword">Confirm Password</label>
                            <Password style={{ borderColor: 'red' }} maxLength={15} className="field-input" id="confirm-password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} toggleMask feedback={false} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="field-container">
                            <label className="field-label" htmlFor="email">Email</label>

                            <InputText type='email'
                                className="field-input" id="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="field-container">
                            <label className="field-label" htmlFor="qualification">Qualification</label>
                            <Dropdown
                                id="qualification"
                                name="qualification"
                                value={formData.qualification}
                                options={qualificationOptions}
                                onChange={handleChange}
                                placeholder="Select"
                                className="field-input"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="field-container">
                            <label className="field-label" htmlFor="mobile">Mobile Number</label>
                            <InputMask
                                mask="9999999999"
                                className="field-input" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} />
                        </div>
                        <div className="field-container">
                            <label className="field-label" htmlFor="alternateMob">Alternate Mobile Number</label>
                            <InputMask mask="9999999999" className="field-input" id="alternateMob" name="alternateMob" value={formData.alternateMob} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="field-container">
                            <label className="field-label" htmlFor="motherTongue">Mother Tongue</label>
                            <Dropdown
                                id="motherTongue"
                                name="motherTongue"
                                value={formData.motherTongue}
                                options={motherTongueOptions}
                                onChange={handleChange}
                                placeholder="Select"
                                className="field-input"
                            />
                        </div>

                        <div className="field-container">
                            <label className="field-label" htmlFor="dob">Date of Birth</label>
                            <Calendar id="dob" className="field-input" name="dob" value={formData.dob} onChange={handleChange} showIcon dateFormat="dd/mm/yy" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="field-container">
                            <label className="field-label" htmlFor="profileCreatedBy">Profile Created By</label>
                            <Dropdown
                                id="profileCreatedBy"
                                name="profileCreatedBy"
                                value={formData.profileCreatedBy}
                                options={createdByOptions}
                                onChange={handleChange}
                                placeholder="Select"
                                className="field-input"
                            />
                        </div>
                        <div className="field-container">
                            <label htmlFor="gotra" className="field-label">Gotra</label>
                            <InputText
                                className="field-input" id="gotra" name="gotra" value={formData.gotra} onChange={handleChange} />

                        </div>
                    </div>


                    <div className="form-row">
                        <div className="field-container">
                            <label htmlFor="gender" className="field-label">Gender</label>

                            <Dropdown
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                options={genderOptions}
                                onChange={handleChange}
                                placeholder="Select"
                                className="field-input"
                            />
                        </div>
                        <div className="field-container">
                            <label className="field-label" htmlFor="subCaste">Sub Caste</label>
                            <Dropdown
                                id="subCaste"
                                name="subCaste"
                                value={formData.subCaste}
                                options={subCasteOptions}
                                onChange={handleChange}
                                placeholder="Select"
                                className="field-input"
                            />
                        </div>
                    </div>
                    <Divider />
                </form>

            </div>
            <div className='action-form'>
                {errorMsgs.length > 0 && errorMsgs.map(msg =>
                    <Message key={msg} severity="error" text={msg} className="error-msg" />
                )}
                <Button onClick={handleSubmit} label="Register" type="submit" className="register-button" />
            </div>
        </div>
    );
};

export default Register;
