import { Dropdown } from "primereact/dropdown"
import { InputTextarea } from "primereact/inputtextarea"
import { ageOptions, countryOptions, employedInOptions, heightOptions, maritalOptions, qualificationOptions, subCasteOptions } from "../../../utils/constants"
import type { ProfileInfo } from "../../../utils/interfaces"
import { MultiSelect } from "primereact/multiselect"
import { normalizeToArray } from "../../../utils/utils"

const PartnerPreferences = (props: ProfileInfo) => {

    const { userData, handleChange } = props

    return <div>

        <div className="form-row">
            <div className="field-container">
                <label htmlFor="ageFrom" className="field-label required">Age From</label>
                <Dropdown
                    id="ageFrom"
                    name="ageFrom"
                    value={userData.ageFrom}
                    options={ageOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />

            </div>
            <div className="field-container">
                <label htmlFor="ageTo" className="field-label required">Age To</label>
                <Dropdown
                    id="ageTo"
                    name="ageTo"
                    value={userData.ageTo}
                    options={ageOptions}
                    onChange={handleChange}
                    placeholder="Select"
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
                    value={normalizeToArray(userData.pSubCaste)}
                    placeholder="Select"
                    maxSelectedLabels={1}
                    className="field-input" />

            </div>
            <div className="field-container">
                <label htmlFor="pEmployedIn" className="field-label required">Employed In</label>
                <MultiSelect
                    id="pEmployedIn"
                    name="pEmployedIn"
                    options={employedInOptions}
                    onChange={handleChange}
                    value={normalizeToArray(userData.pEmployedIn)}
                    placeholder="Select"
                    maxSelectedLabels={1}
                    className="field-input" />
            </div>
        </div>

        <div className="form-row">
            <div className="field-container">
                <label className="field-label required" htmlFor="pQualification">Qualification</label>
                <MultiSelect
                    id="pQualification"
                    name="pQualification"
                    value={normalizeToArray(userData.pQualification)}
                    options={qualificationOptions}
                    onChange={handleChange}
                    maxSelectedLabels={1}
                    placeholder="Select"
                    className="field-input"
                />
            </div>
            <div className="field-container">
                <label htmlFor="pCountry" className="field-label">Country</label>
                <MultiSelect
                    id="pCountry"
                    filter
                    name="pCountry"
                    value={normalizeToArray(userData.pCountry)}
                    options={countryOptions}
                    onChange={handleChange}
                    maxSelectedLabels={1}
                    placeholder="Select"
                    className="field-input"
                />
            </div>
        </div>

        <div className="form-row">
            <div className="field-container">
                <label htmlFor="pMartialStatus" className="field-label">Martial Status</label>

                <MultiSelect
                    id="pMartialStatus"
                    name="pMartialStatus"
                    value={normalizeToArray(userData.pMartialStatus)}
                    options={maritalOptions}
                    onChange={handleChange}
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