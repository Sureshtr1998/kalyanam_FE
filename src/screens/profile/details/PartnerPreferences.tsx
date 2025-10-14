import { Dropdown } from "primereact/dropdown"
import { InputTextarea } from "primereact/inputtextarea"
import { employedInOptions, heightOptions, maritalOptions, subCasteOptions } from "../../../utils/constants"
import type { ProfileInfo } from "../../../utils/interfaces"
import { InputNumber } from "primereact/inputnumber"
import { MultiSelect } from "primereact/multiselect"

const PartnerPreferences = (props: ProfileInfo) => {

    const { userData, handleChange } = props

    return <div>

        <div className="form-row">
            <div className="field-container">
                <label htmlFor="ageFrom" className="field-label">Age From</label>
                <InputNumber
                    id="ageFrom"
                    min={18}
                    name="ageFrom"
                    type="number"
                    value={userData.ageFrom}
                    onChange={handleChange}
                    className="field-input"
                />
            </div>
            <div className="field-container">
                <label htmlFor="ageTo" className="field-label">Age To</label>
                <InputNumber
                    id="ageTo"
                    min={18}
                    name="ageTo"
                    type="number"
                    value={userData.ageTo}
                    onChange={handleChange}
                    className="field-input"
                />
            </div>
        </div>


        <div className="form-row">
            <div className="field-container">
                <label htmlFor="heightFrom" className="field-label">Height From</label>
                <Dropdown
                    id="heightFrom"
                    name="heightFrom"
                    value={userData.heightFrom}
                    options={heightOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>
            <div className="field-container">
                <label htmlFor="heightTo" className="field-label">Height To</label>
                <Dropdown
                    id="heightTo"
                    name="heightTo"
                    value={userData.heightTo}
                    options={heightOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>
        </div>

        <div className="form-row">
            <div className="field-container">
                <label htmlFor="pSubCaste" className="field-label">Sub Caste</label>

                <MultiSelect
                    id="pSubCaste"
                    name="pSubCaste"
                    options={subCasteOptions}
                    onChange={handleChange}
                    value={userData.pSubCaste}
                    placeholder="Select"
                    maxSelectedLabels={1}
                    className="field-input" />

            </div>
            <div className="field-container">
                <label htmlFor="pEmployedIn" className="field-label">Employed In</label>
                <MultiSelect
                    id="pEmployedIn"
                    name="pEmployedIn"
                    options={employedInOptions}
                    onChange={handleChange}
                    value={userData.pEmployedIn}
                    placeholder="Select"
                    maxSelectedLabels={1}
                    className="field-input" />
            </div>
        </div>

        <div className="form-row">
            <div className="field-container">
                <label htmlFor="prelationshipStatus" className="field-label">Relationship Status</label>

                <MultiSelect
                    id="prelationshipStatus"
                    name="prelationshipStatus"
                    options={maritalOptions}
                    onChange={handleChange}
                    value={userData.prelationshipStatus}
                    placeholder="Select"
                    maxSelectedLabels={1}
                    className="field-input" />


            </div>
            <div className="field-container">
                <label htmlFor="pNote" className="field-label">Additional Notes</label>
                <InputTextarea
                    id="pNote"
                    name="pNote"
                    value={userData.pNote || ''}
                    onChange={handleChange}
                    className="field-input"
                    rows={3}
                />
            </div>
        </div>

    </div>
}

export default PartnerPreferences