import { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Image } from 'primereact/image';
import bgImage from '../../assets/rama-seetha.png';
import api from '../../utils/api';
import './Login.scss';
import { user_login_token } from '../../utils/constants';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token_val = localStorage.getItem(user_login_token); // read here

        if (token_val) {
            navigate('/home');
        }
    }, []);


    const loginUser = async () => {
        if (!email || !password) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Please enter email and password', life: 3000 });
            return;
        }

        try {
            const res = await api.post('/login', { email, password });
            const { token } = res.data;

            // Save token and user
            localStorage.setItem(user_login_token, token);

            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Logged in successfully', life: 3000 });

            navigate('/home');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            toast.current?.show({
                severity: 'error',
                summary: 'Login Failed',
                detail: err.response?.data?.msg || 'Server error',
                life: 3000,
            });
        }
    };

    return (
        <div className="auth-page-container">
            <Toast ref={toast} position="bottom-left" />
            <div className="auth-content">
                <Card className="login_card">
                    <Image src={bgImage} width="350" />
                    <div className="grid mt-4">
                        <InputText
                            className="p-field"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="mt-4 w-full" />
                        <InputText
                            className="p-field"
                            type="password"
                            placeholder="Password"
                            value={password}
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
