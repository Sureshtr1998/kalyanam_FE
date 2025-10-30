import FormInput from "../../../fields/FormInput"
import type { StepsType } from "../../../../utils/interfaces"
import SelectInput from "../../../fields/SelectInput"
import { genderOptions } from "../../../../utils/constants";
import { Button } from "primereact/button";


const Identity = (props: StepsType) => {
    const { handleChange, setCurrentForm, handleNext, formData } = props
    const { fullName, email, password, confirmPassword, gender, dob } = formData
    return <div className="w-full max-w-sm">
        <h3 className='heading'>Step 1: Account & Identity</h3>

        <FormInput type="text" placeholder="Full Name" name="fullName" value={fullName} onChange={handleChange} icon="pi pi-user" />
        <FormInput type="email" placeholder="Email Address" name="email" value={email} onChange={handleChange} icon="pi pi-envelope" />

        <FormInput type="password" placeholder="Password (Min 6 Chars)" name="password" value={password} onChange={handleChange} icon="pi pi-lock" />
        <FormInput type="password" placeholder="Confirm Password" name="confirmPassword" value={confirmPassword} onChange={handleChange} icon="pi pi-key" />

        <div className="grid grid-cols-2 gap-4">
            <SelectInput
                placeholder="Select Gender"
                name="gender"
                value={gender}
                onChange={handleChange}
                options={genderOptions}
                icon="pi pi-envelope"

            />
            <FormInput name="dob" type="date" placeholder="Date of Birth (DOB)" value={dob ?? ''} onChange={handleChange} icon="pi pi-envelope" />
        </div>


        <Button onClick={handleNext} className="update-btn">Continue to Background</Button>
        <div className="mt-4 text-center">
            <button onClick={() => setCurrentForm?.('login')} className={`text-sm cursor-pointer font-semibold text-gray-600 hover:underline`}>
                Back to Login
            </button>
        </div>
    </div>

}

export default Identity