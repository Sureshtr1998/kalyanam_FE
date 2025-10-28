import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import type { FamilyDetailsIn } from "../../../utils/interfaces"
import { familyStatus, noSiblingOptions, parentStatus } from "../../../utils/constants"


interface Props {
    familyData: FamilyDetailsIn
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleChange: (event: any) => void
}

const FamilyDetails = (props: Props) => {

    const { familyData = {}, handleChange } = props

    return <div>

        <div className="form-row">
            <div className="field-container">
                <label htmlFor="elderBro" className="field-label">Elder Brothers</label>
                <Dropdown
                    id="elderBro"
                    name="elderBro"
                    value={familyData.elderBro}
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
                    value={familyData.elderBroMar}
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
                    value={familyData.youngerBro}
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
                    value={familyData.youngerBroMar}
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
                    value={familyData.elderSis}
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
                    value={familyData.elderSisMar}
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
                    value={familyData.youngerSis}
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
                    value={familyData.youngerSisMar}
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
                    value={familyData.fatherName}
                    onChange={handleChange}
                    className="field-input"
                />
            </div>
            <div className="field-container">
                <label htmlFor="fatherStatus" className="field-label">Father's Living Status</label>
                <Dropdown
                    id="fatherStatus"
                    name="fatherStatus"
                    value={familyData.fatherStatus}
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
                    value={familyData.motherName}
                    onChange={handleChange}
                    className="field-input"
                />
            </div>
            <div className="field-container">
                <label htmlFor="motherStatus" className="field-label">Mother's Living Status</label>
                <Dropdown
                    id="motherStatus"
                    name="motherStatus"
                    value={familyData.motherStatus}
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
                    value={familyData.fatherOccup}
                    onChange={handleChange}
                    className="field-input"
                />
            </div>
            <div className="field-container">
                <label htmlFor="motherOccup" className="field-label">Mother's Occupation</label>
                <InputText
                    id="motherOccup"
                    name="motherOccup"
                    value={familyData.motherOccup}
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
                    value={familyData.familyStatus}
                    options={familyStatus}
                    onChange={handleChange}
                    placeholder="Select"
                    className="field-input"
                />
            </div>
            <div className="field-container">
                <label htmlFor="note" className="field-label">Additional Notes</label>
                <InputTextarea
                    id="note"
                    name="note"
                    value={familyData.note}
                    onChange={handleChange}
                    className="field-input"
                    rows={3}
                />
            </div>
        </div>

    </div>
}



export default FamilyDetails