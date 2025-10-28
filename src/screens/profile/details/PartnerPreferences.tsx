import { Dropdown } from "primereact/dropdown"
import { InputTextarea } from "primereact/inputtextarea"
import { ageOptions, countryOptions, employedInOptions, heightOptions, maritalOptions, qualificationOptions, subCasteOptions } from "../../../utils/constants"
import type { PartnerDetailsIn } from "../../../utils/interfaces"
import { MultiSelect } from "primereact/multiselect"
import { normalizeToArray } from "../../../utils/utils"

interface Props {
    partnerData: PartnerDetailsIn
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleChange: (event: any) => void
    isFilter?: boolean
}
const PartnerPreferences = (props: Props) => {

    const { partnerData = {}, handleChange, isFilter } = props

    return <div>

        <div className="form-row">
            <div className="field-container">
                <label htmlFor="ageFrom" className="field-label required">Age From</label>
                <Dropdown
                    id="ageFrom"
                    name="ageFrom"
                    value={partnerData.ageFrom}
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
                    value={partnerData.ageTo}
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
                    value={partnerData.heightFrom}
                    options={heightOptions}
                    onChange={handleChange}
                    placeholder="Any"
                    className="field-input"
                />
            </div>
            <div className="field-container">
                <label htmlFor="heightTo" className="field-label">Height To</label>
                <Dropdown
                    id="heightTo"
                    name="heightTo"
                    value={partnerData.heightTo}
                    options={heightOptions}
                    onChange={handleChange}
                    placeholder="Any"
                    className="field-input"
                />
            </div>
        </div>

        <div className="form-row">
            <div className="field-container">
                <label htmlFor="subCaste" className="field-label">Sub Caste</label>

                <MultiSelect
                    id="subCaste"
                    name="subCaste"
                    options={subCasteOptions}
                    onChange={handleChange}
                    value={normalizeToArray(partnerData.subCaste)}
                    placeholder="Any"
                    maxSelectedLabels={1}
                    className="field-input" />

            </div>
            <div className="field-container">
                <label htmlFor="employedIn" className="field-label">Employed In</label>
                <MultiSelect
                    id="employedIn"
                    name="employedIn"
                    options={employedInOptions}
                    onChange={handleChange}
                    value={normalizeToArray(partnerData.employedIn)}
                    placeholder="Any"
                    maxSelectedLabels={1}
                    className="field-input" />
            </div>
        </div>

        <div className="form-row">
            <div className="field-container">
                <label className="field-label" htmlFor="qualification">Qualification</label>
                <MultiSelect
                    id="qualification"
                    name="qualification"
                    value={normalizeToArray(partnerData.qualification)}
                    options={qualificationOptions}
                    onChange={handleChange}
                    maxSelectedLabels={1}
                    placeholder="Any"
                    className="field-input"
                />
            </div>
            <div className="field-container">
                <label htmlFor="country" className="field-label">Country</label>
                <MultiSelect
                    id="country"
                    filter
                    name="country"
                    value={normalizeToArray(partnerData.country)}
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
                <label htmlFor="martialStatus" className="field-label">Martial Status</label>

                <MultiSelect
                    id="martialStatus"
                    name="martialStatus"
                    value={normalizeToArray(partnerData.martialStatus)}
                    options={maritalOptions}
                    onChange={handleChange}
                    placeholder="Any"
                    maxSelectedLabels={1}
                    className="field-input" />


            </div>
            {!isFilter && <div className="field-container">
                <label htmlFor="note" className="field-label">Additional Notes</label>
                <InputTextarea
                    id="note"
                    name="note"
                    value={partnerData.note || ''}
                    onChange={handleChange}
                    className="field-input"
                    rows={3}
                />
            </div>
            }
        </div>

    </div>
}

export default PartnerPreferences