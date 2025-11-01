import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import {
  maritalOptions,
  motherTongueOptions,
  createdByOptions,
  genderOptions,
  subCasteOptions,
  qualificationOptions,
} from "../../../utils/constants";
import type { BasicDetailsIn } from "../../../utils/interfaces";
import { InputTextarea } from "primereact/inputtextarea";

interface Props {
  basicData: BasicDetailsIn;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange: (event: any) => void;
}

const BasicDetails = (props: Props) => {
  const { basicData, handleChange } = props;

  return (
    <div>
      <div className="form-row">
        <div className="field-container">
          <label htmlFor="fullName" className="field-label required">
            Name of {basicData.gender === "Male" ? "Groom" : "Bride"}
          </label>
          <InputText
            id="fullName"
            name="fullName"
            value={basicData.fullName}
            onChange={handleChange}
            className="field-input"
          />
        </div>

        <div className="field-container">
          <label htmlFor="profileId" className="field-label">
            Profile ID
          </label>
          <InputText
            disabled
            type="profileId"
            className="field-input"
            id="profileId"
            name="profileId"
            value={basicData.uniqueId}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="field-container">
          <label className="field-label" htmlFor="email">
            Email
          </label>

          <InputText
            disabled
            type="email"
            className="field-input"
            id="email"
            name="email"
            value={basicData.email}
          />
        </div>

        <div className="field-container">
          <label htmlFor="gender" className="field-label">
            Gender
          </label>

          <Dropdown
            disabled
            id="gender"
            name="gender"
            value={basicData.gender}
            options={genderOptions}
            onChange={handleChange}
            placeholder="Select"
            className="field-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="field-container">
          <label className="field-label" htmlFor="mobile">
            Mobile Number
          </label>
          <InputMask
            disabled
            mask="9999999999"
            className="field-input"
            id="mobile"
            name="mobile"
            value={basicData.mobile}
          />
        </div>
        <div className="field-container">
          <label className="field-label" htmlFor="alternateMob">
            Alternate Contact
          </label>
          <InputMask
            mask="9999999999"
            className="field-input"
            id="alternateMob"
            name="alternateMob"
            value={basicData.alternateMob}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="field-container">
          <label className="field-label required" htmlFor="motherTongue">
            Mother Tongue
          </label>
          <Dropdown
            id="motherTongue"
            name="motherTongue"
            value={basicData.motherTongue}
            options={motherTongueOptions}
            onChange={handleChange}
            placeholder="Select"
            className="field-input"
          />
        </div>

        <div className="field-container">
          <label className="field-label" htmlFor="dob">
            Date of Birth
          </label>
          <Calendar
            disabled
            id="dob"
            className="field-input"
            name="dob"
            value={basicData.dob ? new Date(basicData.dob) : null}
            showIcon
            dateFormat="dd/mm/yy"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="field-container">
          <label className="field-label" htmlFor="profileCreatedBy">
            Profile Created By
          </label>
          <Dropdown
            id="profileCreatedBy"
            name="profileCreatedBy"
            value={basicData.profileCreatedBy}
            options={createdByOptions}
            onChange={handleChange}
            placeholder="Select"
            className="field-input"
          />
        </div>
        <div className="field-container">
          <label htmlFor="gothra" className="field-label">
            Gothra
          </label>
          <InputText
            className="field-input"
            id="gothra"
            name="gothra"
            value={basicData.gothra}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="field-container">
          <label className="field-label required" htmlFor="qualification">
            Qualification
          </label>
          <Dropdown
            id="qualification"
            name="qualification"
            value={basicData.qualification}
            options={qualificationOptions}
            onChange={handleChange}
            placeholder="Select"
            className="field-input"
          />
        </div>

        <div className="field-container">
          <label className="field-label required" htmlFor="subCaste">
            Sub Caste
          </label>
          <Dropdown
            id="subCaste"
            name="subCaste"
            value={basicData.subCaste}
            options={subCasteOptions}
            onChange={handleChange}
            placeholder="Select"
            className="field-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="field-container">
          <label htmlFor="martialStatus" className="field-label required">
            Marital Status
          </label>
          <Dropdown
            id="martialStatus"
            name="martialStatus"
            value={basicData.martialStatus}
            options={maritalOptions}
            onChange={handleChange}
            placeholder="Select"
            className="field-input"
          />
        </div>
        <div className="field-container">
          <label htmlFor="note" className="field-label">
            Additional Notes
          </label>
          <InputTextarea
            id="note"
            name="note"
            value={basicData.note}
            onChange={handleChange}
            className="field-input"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicDetails;
