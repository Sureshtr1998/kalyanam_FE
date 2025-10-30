import type { StepsType } from "../../../../utils/interfaces"
import SelectInput from "../../../fields/SelectInput"
import FormInput from "../../../fields/FormInput"
import { createdByOptions, maritalOptions, motherTongueOptions, qualificationOptions, subCasteOptions } from "../../../../utils/constants"


const Background = (props: StepsType) => {
    const { handleChange, handleNext, handleBack, formData } = props
    const { martialStatus, profileCreatedBy, motherTongue, qualification, gothra, subCaste } = formData

    return <div className="w-full max-w-sm">
        <h3 className='heading'>Step 2: Background & Qualification</h3>

        <SelectInput
            placeholder="Marital Status"
            value={martialStatus}
            name="martialStatus"
            onChange={handleChange}
            options={maritalOptions}
            icon="pi pi-heart"
        />

        <SelectInput
            placeholder="Mother Tongue"
            value={motherTongue}
            name='motherTongue'
            onChange={handleChange}
            options={motherTongueOptions}
            icon="pi pi-language"
        />


        <SelectInput
            placeholder="Profile Created By"
            value={profileCreatedBy}
            name="profileCreatedBy"
            onChange={handleChange}
            options={createdByOptions}
            icon="pi pi-users"

        />
        <FormInput type="text" name='gothra' placeholder="Gothra" value={gothra} onChange={handleChange} icon="pi pi-sitemap" />

        <div className="grid grid-cols-2 gap-4">
            <SelectInput
                placeholder="Qualification"
                value={qualification}
                name='qualification'
                onChange={handleChange}
                options={qualificationOptions}
                icon="pi pi-graduation-cap"
            />
            <SelectInput
                placeholder="Sub Caste"
                value={subCaste}
                name='subCaste'
                onChange={handleChange}
                options={subCasteOptions}
                icon="pi pi-book"

            />
        </div>


        <div className="flex justify-between gap-4 mt-6">
            <button onClick={handleBack} className={`w-1/2 py-3 font-bold text-gray-700 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition`}>Back</button>
            <button onClick={handleNext} className='update-btn'>Continue to Profile </button>
        </div>
    </div>
}



export default Background