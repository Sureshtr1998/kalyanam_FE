import type { StepsType } from "../../../../utils/interfaces"
import FormInput from "../../../fields/FormInput"
import ImageUpload from "../../../imageMedia/ImageUpload"


const Profile = (props: StepsType) => {
    const { handleChange, handleBack, formData, setImages } = props
    const { mobile, alternateMob } = formData



    return <div className="w-full max-w-sm">
        <h3 className='heading'>Step 3: Profile & Contact</h3>

        <FormInput type="tel" name='mobile' placeholder="Mobile Number" value={mobile} onChange={handleChange} icon='pi pi-mobile' />
        <FormInput type="tel" name='alternateMob' placeholder="Alternate Mobile Number (Optional)" value={alternateMob} onChange={handleChange} icon='pi pi-phone' />


        <ImageUpload onChange={setImages} />


        <div className="flex justify-between gap-4 mt-6">
            <button onClick={handleBack} className={`w-1/2 py-3 font-bold text-gray-700 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition`}>Back</button>
            <button
                className='update-btn'
            >
                COMPLETE REGISTRATION
            </button>
        </div>
    </div>
}



export default Profile