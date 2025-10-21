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
import { user_login_token } from '../../utils/constants';
import { useToast } from '../../components/toastProvider/ToastProvider';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { showToast } = useToast();

    const navigate = useNavigate();

    useEffect(() => {
        const token_val = localStorage.getItem(user_login_token);

        if (token_val) {
            navigate('/home');
        }
    }, []);


    const loginUser = async () => {
        if (!email || !password) {
            showToast("error", "Error", "Please enter email and password");
            return;
        }

        try {
            const res = await api.post('/login', { email, password });
            const { token } = res.data;

            // Save token and user
            localStorage.setItem(user_login_token, token);
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
                    <Image src={bgImage} width="350" />
                    <div className="grid mt-4">
                        <InputText
                            className="p-field"
                            placeholder="Email"
                            value={email}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    loginUser();
                                }
                            }}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="mt-4 w-full" />
                        <InputText
                            className="p-field"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    loginUser();
                                }
                            }}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="mt-8">
                            <Button onClick={loginUser} label="Login" className="login-button" />
                        </div>

                        <Divider />
                        <p style={{ placeSelf: 'center' }}>
                            <b>New User?</b>{' '}
                            <Link to="/register">
                                <span className="underline"> Sign Up here </span>
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;
