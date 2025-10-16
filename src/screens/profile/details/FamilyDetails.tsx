import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import type { ProfileInfo } from "../../../utils/interfaces"
import { familyStatus, noSiblingOptions, parentStatus } from "../../../utils/constants"

const FamilyDetails = (props: ProfileInfo) => {

    const { userData, handleChange } = props

    return <div>

        <div className="form-row">
            <div className="field-container">
                <label htmlFor="elderBro" className="field-label">Elder Brothers</label>
                <Dropdown
                    id="elderBro"
                    name="elderBro"
                    value={userData.elderBro}
                    options={noSiblingOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />

            </div>
            <div className="field-container">
                <label htmlFor="elderBroMar" className="field-label">Elder Brothers Married</label>
                <Dropdown
                    id="elderBroMar"
                    name="elderBroMar"
                    value={userData.elderBroMar}
                    options={noSiblingOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>


        </div>


        <div className="form-row">

            <div className="field-container">
                <label htmlFor="youngerBro" className="field-label">Younger Brothers</label>
                <Dropdown
                    id="youngerBro"
                    name="youngerBro"
                    value={userData.youngerBro}
                    options={noSiblingOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>

            <div className="field-container">
                <label htmlFor="youngerBroMar" className="field-label">Younger Brothers Married</label>
                <Dropdown
                    id="youngerBroMar"
                    name="youngerBroMar"
                    value={userData.youngerBroMar}
                    options={noSiblingOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>

        </div>

        <div className="form-row">
            <div className="field-container">
                <label htmlFor="elderSis" className="field-label">Elder Sisters</label>
                <Dropdown
                    id="elderSis"
                    name="elderSis"
                    value={userData.elderSis}
                    options={noSiblingOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>
            <div className="field-container">
                <label htmlFor="elderSisMar" className="field-label">Elder Sisters Married</label>
                <Dropdown
                    id="elderSisMar"
                    name="elderSisMar"
                    value={userData.elderSisMar}
                    options={noSiblingOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>

        </div>

        <div className="form-row">

            <div className="field-container">
                <label htmlFor="youngerSis" className="field-label">Younger Sisters</label>
                <Dropdown
                    id="youngerSis"
                    name="youngerSis"
                    value={userData.youngerSis}
                    options={noSiblingOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>

            <div className="field-container">
                <label htmlFor="youngerSisMar" className="field-label">Younger Sisters Married</label>
                <Dropdown
                    id="youngerSisMar"
                    name="youngerSisMar"
                    value={userData.youngerSisMar}
                    options={noSiblingOptions}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>
        </div>

        <div className="form-row">
            <div className="field-container">
                <label htmlFor="fatherName" className="field-label required">Father's Name</label>
                <InputText
                    id="fatherName"
                    name="fatherName"
                    value={userData.fatherName}
                    onChange={handleChange}
                    className="field-input"
                />
            </div>
            <div className="field-container">
                <label htmlFor="fatherStatus" className="field-label">Father's Living Status</label>
                <Dropdown
                    id="fatherStatus"
                    name="fatherStatus"
                    value={userData.fatherStatus}
                    options={parentStatus}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>
        </div>


        <div className="form-row">
            <div className="field-container">
                <label htmlFor="motherName" className="field-label required">Mother's Name</label>
                <InputText
                    id="motherName"
                    name="motherName"
                    value={userData.motherName}
                    onChange={handleChange}
                    className="field-input"
                />
            </div>
            <div className="field-container">
                <label htmlFor="motherStatus" className="field-label">Mother's Living Status</label>
                <Dropdown
                    id="motherStatus"
                    name="motherStatus"
                    value={userData.motherStatus}
                    options={parentStatus}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>
        </div>

        <div className="form-row">
            <div className="field-container">
                <label htmlFor="fatherOccup" className="field-label">Father's Occupation</label>
                <InputText
                    id="fatherOccup"
                    name="fatherOccup"
                    value={userData.fatherOccup}
                    onChange={handleChange}
                    className="field-input"
                />
            </div>
            <div className="field-container">
                <label htmlFor="motherOccup" className="field-label">Mother's Occupation</label>
                <InputText
                    id="motherOccup"
                    name="motherOccup"
                    value={userData.motherOccup}
                    onChange={handleChange}
                    className="field-input"
                />
            </div>
        </div>

        <div className="form-row">
            <div className="field-container">
                <label htmlFor="familyStatus" className="field-label">Family Status</label>
                <Dropdown
                    id="familyStatus"
                    name="familyStatus"
                    value={userData.familyStatus}
                    options={familyStatus}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>
            <div className="field-container">
                <label htmlFor="fNote" className="field-label">Additional Notes</label>
                <InputTextarea
                    id="fNote"
                    name="fNote"
                    value={userData.fNote}
                    onChange={handleChange}
                    className="field-input"
                    rows={3}
                />
            </div>
        </div>

    </div>
}



export default FamilyDetails