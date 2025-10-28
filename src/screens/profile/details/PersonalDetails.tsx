import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { countryOptions, dietOptions, employedInOptions, heightOptions, nakshatraOptions, rashiOptions, residingOptions } from "../../../utils/constants"
import type { PersonalDetailsIn } from "../../../utils/interfaces"
import { InputNumber } from "primereact/inputnumber"

interface Props {
    personalData: PersonalDetailsIn
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleChange: (event: any) => void
}

const PersonalDetails = (props: Props) => {

    const { personalData = {}, handleChange } = props

    return <div>
        <div className="form-row">
            <div className="field-container">
                <label htmlFor="height" className="field-label required">Height</label>
                <Dropdown
                    id="height"
                    name="height"
                    value={personalData.height}
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
                    value={personalData.weight}
                    onValueChange={(e) => handleChange({ target: { name: 'weight', value: e.value } })}
                    className="field-input"
                />
            </div>
        </div>

        <div className="form-row">
            <div className="field-container">
                <label htmlFor="country" className="field-label required">Country</label>
                <Dropdown
                    id="country"
                    filter
                    name="country"
                    value={personalData.country}
                    options={countryOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>
            <div className="field-container">
                <label htmlFor="residingStatus" className="field-label required">Residing Status</label>
                <Dropdown
                    id="residingStatus"
                    name="residingStatus"
                    value={personalData.residingStatus || ''}
                    options={residingOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>
        </div>


        <div className="form-row">
            <div className="field-container">
                <label htmlFor="employedIn" className="field-label required">Employed In</label>
                <Dropdown
                    id="employedIn"
                    name="employedIn"
                    value={personalData.employedIn}
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
                    value={personalData.salary}
                    onValueChange={(e) => handleChange({ target: { name: 'salary', value: e.value } })}
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
                    value={personalData.rashi}
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
                    value={personalData.nakshatra}
                    options={nakshatraOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />

            </div>
        </div>

        <div className="form-row">
            <div className="field-container">
                <label htmlFor="diet" className="field-label required">Diet</label>
                <Dropdown
                    id="diet"
                    name="diet"
                    value={personalData.diet}
                    options={dietOptions}
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
                    value={personalData.address || ''}
                    onChange={handleChange}
                    className="field-input"
                />
            </div>

        </div>

        <div className="form-row">

            <div className="field-container">
                <label htmlFor="workCity" className="field-label">Work City</label>
                <InputText
                    id="workCity"
                    name="workCity"
                    value={personalData.workCity || ''}
                    onChange={handleChange}
                    className="field-input"
                />
            </div>
            <div className="field-container">
                <label htmlFor="note" className="field-label">Additional Notes</label>
                <InputTextarea
                    id="note"
                    name="note"
                    value={personalData.note}
                    onChange={handleChange}
                    className="field-input"
                    rows={3}
                />
            </div>
        </div>



    </div>
}

export default PersonalDetails