import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import './Login.scss';
import { Link } from 'react-router-dom'
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';

import { Image } from 'primereact/image';
import bgImage from '../../assets/rama-seetha.png'



const Login = () => {
    return (
        <div className="auth-page-container">

            <div className="auth-content">
                <Card className='login_card'>
                    <Image src={bgImage} width="350" />
                    <div className='grid mt-4'>

                        <InputText className='p-field' placeholder="Mail Id" />
                        <div className='mt-4 w-full' />
                        <InputText className='p-field' type="password" placeholder="Password" />

                        <div className='mt-8'>
                            <Button label="Login" className="login-button" />
                        </div>

                        <Divider />
                        <p style={{ placeSelf: 'center' }}>
                            <b>New User?</b> <Link to="/register"
                            ><span className='underline'> Sign Up here </span></Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;
