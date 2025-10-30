import { useState } from "react";
import { TEXT_COLOR } from "../../styles/variables";
import FormInput from "../fields/FormInput";
import type { FormType } from "../../utils/interfaces";
import './Form.scss'
import { Button } from "primereact/button";

interface Props {
    setCurrentForm: (val: FormType) => void
}
const LoginForm = (props: Props) => {
    const { setCurrentForm } = props
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');


    return (
        <div className="w-full max-w-sm">
            <h2 className='heading'>
                Log In to Find Your Match
            </h2>

            <FormInput name="email" type="mail" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} icon="pi pi-envelope" />

            <FormInput name="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} icon="pi pi-lock" />

            <div className="flex justify-end mb-8">
                <a href="#" className={`text-sm ${TEXT_COLOR} hover:underline font-medium`}>Forgot Password?</a>
            </div>

            <Button className="update-btn" >
                Login
            </Button>

            <p className="text-center mt-8 text-gray-600">
                New to Seetha Rama Kalyana?{' '}
                <button onClick={() => setCurrentForm(1)} className={`font-semibold ${TEXT_COLOR} cursor-pointer hover:underline focus:outline-none`}>
                    Register Now
                </button>
            </p>
        </div>
    );
};

export default LoginForm