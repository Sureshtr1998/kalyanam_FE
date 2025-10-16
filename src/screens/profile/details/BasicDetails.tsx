import { Calendar } from "primereact/calendar"
import { Dropdown } from "primereact/dropdown"
import { InputMask } from "primereact/inputmask"
import { InputText } from "primereact/inputtext"
import { maritalOptions, motherTongueOptions, createdByOptions, genderOptions, subCasteOptions } from "../../../utils/constants"
import type { ProfileInfo } from "../../../utils/interfaces"
import { InputTextarea } from "primereact/inputtextarea"
import ImageMedia from "../../../components/imageMedia/ImageMedia"




const BasicDetails = (props: ProfileInfo & { handleExisting: (files: string[]) => void, handleNew: (files: File[]) => void }) => {

    const { userData, handleChange, handleExisting, handleNew } = props

    return <div>
        {userData.images && <ImageMedia initialImages={userData.images} onUrlChange={handleExisting} onChange={handleNew} />}
        <div className="form-row">
            <div className="field-container">
                <label htmlFor="fullName" className="field-label required">
                    Name of {userData.gender === 'Male' ? 'Groom' : 'Bride'}
                </label>
                <InputText
                    id="fullName"
                    name="fullName"
                    value={userData.fullName}
                    onChange={handleChange}
                    className="field-input"
                />
            </div>

            <div className="field-container">
                <label htmlFor="martialStatus" className="field-label required">
                    Marital Status
                </label>
                <Dropdown
                    id="martialStatus"
                    name="martialStatus"
                    value={userData.martialStatus}
                    options={maritalOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />

            </div>
        </div>

        <div className="form-row">
            <div className="field-container">
                <label className="field-label" htmlFor="email">Email</label>

                <InputText disabled type='email'
                    className="field-input" id="email" name="email" value={userData.email} onChange={handleChange} />
            </div>

            <div className="field-container">
                <label htmlFor="gender" className="field-label">Gender</label>

                <Dropdown
                    disabled
                    id="gender"
                    name="gender"
                    value={userData.gender}
                    options={genderOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>
        </div>

        <div className="form-row">
            <div className="field-container">
                <label className="field-label" htmlFor="mobile">Mobile Number</label>
                <InputMask
                    disabled
                    mask="9999999999"
                    className="field-input" id="mobile" name="mobile" value={userData.mobile} onChange={handleChange} />
            </div>
            <div className="field-container">
                <label className="field-label" htmlFor="alternateMob">Alternate Mobile Number</label>
                <InputMask mask="9999999999" className="field-input" id="alternateMob" name="alternateMob" value={userData.alternateMob} onChange={handleChange} />
            </div>
        </div>

        <div className="form-row">
            <div className="field-container">
                <label className="field-label required" htmlFor="motherTongue">Mother Tongue</label>
                <Dropdown
                    id="motherTongue"
                    name="motherTongue"
                    value={userData.motherTongue}
                    options={motherTongueOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>

            <div className="field-container">
                <label className="field-label" htmlFor="dob">Date of Birth</label>
                <Calendar disabled id="dob" className="field-input" name="dob" value={userData.dob ? new Date(userData.dob) : null} onChange={handleChange} showIcon dateFormat="dd/mm/yy" />
            </div>
        </div>

        <div className="form-row">
            <div className="field-container">
                <label className="field-label" htmlFor="profileCreatedBy">Profile Created By</label>
                <Dropdown
                    id="profileCreatedBy"
                    name="profileCreatedBy"
                    value={userData.profileCreatedBy}
                    options={createdByOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>
            <div className="field-container">
                <label htmlFor="gotra" className="field-label">Gotra</label>
                <InputText
                    className="field-input" id="gotra" name="gotra" value={userData.gotra} onChange={handleChange} />

            </div>
        </div>


        <div className="form-row">
            <div className="field-container">
                <label className="field-label required" htmlFor="subCaste">Sub Caste</label>
                <Dropdown
                    id="subCaste"
                    name="subCaste"
                    value={userData.subCaste}
                    options={subCasteOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>
            <div className="field-container">
                <label htmlFor="bNote" className="field-label">Additional Notes</label>
                <InputTextarea
                    id="bNote"
                    name="bNote"
                    value={userData.bNote}
                    onChange={handleChange}
                    className="field-input"
                    rows={3}
                />
            </div>
        </div>
    </div>

}


export default BasicDetails