import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Image } from 'primereact/image';
import bgImage from '../../assets/rama-seetha.png';
import api from '../../utils/api';
import './Login.scss';
import { useToast } from '../../components/toastProvider/ToastProvider';
import ForgotPassword from '../../components/forgotPassword/ForgotPassword';
import ContactUs from '../../components/contactUs/ContactUs';
import { getItem, setItem, user_login_token } from '../../utils/localStore';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isForgotPwd, setIsForgotPwd] = useState<boolean>(false)
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const token_val = getItem(user_login_token)?.token
        if (token_val) navigate('/home');
    }, []);

    const loginUser = async () => {
        if (!email || !password) {
            showToast("error", "Error", "Please enter email and password");
            return;
        }

        try {
            const res = await api.post('/login', { email, password });
            setItem(user_login_token, res.data)
            showToast("success", "Success", "Logged in successfully");
            navigate('/home');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            showToast("error", "Login Failed", err.response?.data?.msg || 'Server error');
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-content">
                <Card className="login_card">
                    <ContactUs />
                    <Image src={bgImage} width="350" />
                    {isForgotPwd ?
                        <ForgotPassword />
                        :
                        <form
                            className="grid mt-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                loginUser();
                            }}
                        >
                            <InputText
                                className="p-field"
                                placeholder="Email"
                                value={email}
                                autoComplete="username"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div className="mt-4 w-full" />
                            <InputText
                                className="p-field"
                                type="password"
                                placeholder="Password"
                                value={password}
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="mt-8">
                                <Button type="submit" label="Login" className="login-button" />
                            </div>

                            <Divider />
                            <p style={{ placeSelf: 'center' }}>
                                <b>New User?</b>{' '}
                                <Link to="/register">
                                    <span className="underline"> Sign Up here </span>
                                </Link>
                            </p>
                            <p className='mt-2' style={{ placeSelf: 'center' }}>
                                <b>Forgot Password? </b>{' '}
                                <span onClick={() => setIsForgotPwd(true)} className="cursor-pointer underline">Click here to reset </span>
                            </p>

                        </form>
                    }
                </Card>
            </div>
        </div>
    );
};

export default Login;
