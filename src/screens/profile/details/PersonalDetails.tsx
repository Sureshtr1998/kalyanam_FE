import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { countryOptions, dietOptions, employedInOptions, heightOptions, nakshatraOptions, qualificationOptions, rashiOptions, residingOptions } from "../../../utils/constants"
import type { ProfileInfo } from "../../../utils/interfaces"
import { InputNumber } from "primereact/inputnumber"

const PersonalDetails = (props: ProfileInfo) => {

    const { userData, handleChange } = props

    return <div>


        <div className="form-row">
            <div className="field-container">
                <label htmlFor="height" className="field-label">Height</label>
                <Dropdown
                    id="height"
                    name="height"
                    value={userData.height}
                    options={heightOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />

            </div>
            <div className="field-container">
                <label htmlFor="weight" className="field-label">Weight</label>
                <InputNumber
                    id="weight"
                    name="weight"
                    placeholder="In kgs"
                    suffix=" kg"
                    value={userData.weight}
                    onChange={handleChange}
                    className="field-input"
                />
            </div>
        </div>

        <div className="form-row">
            <div className="field-container">
                <label htmlFor="country" className="field-label">Country</label>
                <Dropdown
                    id="country"
                    filter
                    name="country"
                    value={userData.country}
                    options={countryOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>
            <div className="field-container">
                <label htmlFor="residingStatus" className="field-label">Residing Status</label>
                <Dropdown
                    id="residingStatus"
                    name="residingStatus"
                    value={userData.residingStatus || ''}
                    options={residingOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>
        </div>



        <div className="form-row">
            <div className="field-container">
                <label className="field-label" htmlFor="qualification">Qualification</label>
                <Dropdown
                    id="qualification"
                    name="qualification"
                    value={userData.qualification}
                    options={qualificationOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>

            <div className="field-container">
                <label htmlFor="address" className="field-label">Address</label>
                <InputText
                    id="address"
                    name="address"
                    value={userData.address || ''}
                    onChange={handleChange}
                    className="field-input"
                />
            </div>
        </div>

        <div className="form-row">
            <div className="field-container">
                <label htmlFor="employedIn" className="field-label">Employed In</label>
                <Dropdown
                    id="employedIn"
                    name="employedIn"
                    value={userData.employedIn}
                    options={employedInOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>
            <div className="field-container">
                <label htmlFor="salary" className="field-label">Salary</label>
                <InputNumber
                    id="salary"
                    name="salary"
                    placeholder="In LPA"
                    suffix=" LPA"
                    value={userData.salary}
                    onChange={handleChange}
                    className="field-input"
                />
            </div>
        </div>

        <div className="form-row">
            <div className="field-container">
                <label htmlFor="rashi" className="field-label">Rashi</label>
                <Dropdown
                    id="rashi"
                    name="rashi"
                    value={userData.rashi}
                    options={rashiOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />

            </div>
            <div className="field-container">
                <label htmlFor="nakshatra" className="field-label">Nakshatra</label>
                <Dropdown
                    id="nakshatra"
                    name="nakshatra"
                    value={userData.nakshatra}
                    options={nakshatraOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />

            </div>
        </div>

        <div className="form-row">
            <div className="field-container">
                <label htmlFor="diet" className="field-label">Diet</label>
                <Dropdown
                    id="diet"
                    name="diet"
                    value={userData.diet}
                    options={dietOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>
            <div className="field-container">
                <label htmlFor="mNote" className="field-label">Additional Notes</label>
                <InputTextarea
                    id="mNote"
                    name="mNote"
                    value={userData.mNote}
                    onChange={handleChange}
                    className="field-input"
                    rows={3}
                />
            </div>
        </div>



    </div>
}

export default PersonalDetails