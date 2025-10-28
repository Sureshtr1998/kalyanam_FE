import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import './Register.scss';
import { maritalOptions, motherTongueOptions, createdByOptions, genderOptions, subCasteOptions, qualificationOptions, emailRegex, formDefaultVals } from '../../utils/constants';
import { Divider } from 'primereact/divider';
import { InputMask } from 'primereact/inputmask';
import type { BasicDetailsIn } from '../../utils/interfaces';
import { Message } from 'primereact/message';
import ImageMedia from '../../components/imageMedia/ImageMedia';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/toastProvider/ToastProvider';
import RegisterModal from '../../components/registerModal/RegisterModal';
import { setItem, user_login_token } from '../../utils/localStore';
import RegisterNote from '../../components/note/RegisterNote';

const Register = () => {
    const [images, setImages] = useState<File[]>([]);
    const [isValidate, setValidate] = useState<boolean>(false)
    const [errorMsgs, setErrorMsgs] = useState<string[]>([]);
    const { showToast } = useToast();

    const navigate = useNavigate();

    const [formData, setFormData] = useState<BasicDetailsIn>(formDefaultVals.basic);


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
                showToast("error", "Validation Error", msg);

            });
            return;
        }
        setValidate(true)
    };

    const registerUser = async () => {
        try {
            let imageUrls: string[] = [];

            // 1️⃣ Upload images first
            if (images.length > 0) {
                const imgFormData = new FormData();
                images.forEach((file) => imgFormData.append("images", file));

                const imgRes = await api.post("/user-register/upload-images", imgFormData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                imageUrls = imgRes.data.urls;
            }

            // 2️⃣ Submit registration data
            const payload = {
                ...formData,
                images: imageUrls,
            };

            const res = await api.post("/user-register", payload);

            setItem(user_login_token, res.data);
            showToast("success", "Registration Successful", "Your details have been submitted successfully!");
            navigate("/home");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            showToast("error", "Registration Failed", err.response?.data?.msg || "Server error");
        }
    };


    const mediaFileHandler = (files: File[]) => {
        setImages(files)
    }
    return (
        <div>
            {isValidate && <RegisterModal onSuccess={registerUser} email={formData.email} mobile={formData.mobile} onHide={() => setValidate(false)} />}
            <div className="register-container">
                <RegisterNote />
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
                            <label htmlFor="martialStatus" className="field-label">
                                Marital Status
                            </label>
                            <Dropdown
                                id="martialStatus"
                                name="martialStatus"
                                value={formData.martialStatus}
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
                            <label className="field-label" htmlFor="alternateMob">Alternate Contact</label>
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
                            <label htmlFor="gothra" className="field-label">Gothra</label>
                            <InputText
                                className="field-input" id="gothra" name="gothra" value={formData.gothra} onChange={handleChange} />

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
