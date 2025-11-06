import {
  maritalOptions,
  motherTongueOptions,
  createdByOptions,
  genderOptions,
  subCasteOptions,
  qualificationOptions,
} from "../../../utils/constants";
import type { BasicDetailsIn } from "../../../utils/interfaces";
import FormInput from "../../../components/fields/FormInput";
import SelectInput from "../../../components/fields/SelectInput";

interface Props {
  basicData: BasicDetailsIn;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange: (event: any) => void;
  isReadOnly: boolean;
}

const BasicDetails = (props: Props) => {
  const { basicData, handleChange, isReadOnly } = props;

  return (
    <div>
      <div className="form-row">
        <FormInput
          name="fullName"
          label="Full Name"
          disabled
          value={basicData.fullName}
          placeholder={`Name of ${
            basicData.gender === "Male" ? "Groom" : "Bride"
          }`}
          onChange={handleChange}
          icon="pi pi-user"
        />
        <FormInput
          name="profileId"
          label="Profile ID"
          value={basicData.uniqueId ?? ""}
          disabled
          onChange={handleChange}
          icon="pi pi-id-card"
        />
      </div>

      <div className="form-row">
        <FormInput
          name="email"
          label="Email ID"
          value={basicData.email}
          disabled
          onChange={handleChange}
          icon="pi pi-envelope"
        />
        <FormInput
          required
          disabled={isReadOnly}
          label="Gothra"
          name="gothra"
          value={basicData.gothra}
          icon="pi pi-sitemap"
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <FormInput
          disabled
          label="WhatsApp Number"
          name="mobile"
          maxLength={10}
          value={basicData.mobile}
          icon="pi pi-whatsapp"
        />

        <FormInput
          type="number"
          disabled={isReadOnly}
          maxLength={10}
          label="Alternate Contact"
          name="alternateMob"
          value={basicData.alternateMob}
          icon="pi pi-phone"
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <SelectInput
          name="motherTongue"
          required
          disabled={isReadOnly}
          label="Mother Tongue"
          value={basicData.motherTongue}
          onChange={handleChange}
          options={motherTongueOptions}
          icon="pi pi-language"
        />

        <SelectInput
          name="martialStatus"
          label="Marital Status"
          value={basicData.martialStatus}
          onChange={handleChange}
          options={maritalOptions}
          icon="pi pi-heart"
          required
          disabled={isReadOnly}
        />
      </div>

      <div className="form-row">
        <SelectInput
          name="profileCreatedBy"
          label="Profile Created By"
          disabled={isReadOnly}
          value={basicData.profileCreatedBy}
          onChange={handleChange}
          options={createdByOptions}
          icon="pi pi-user-plus"
        />

        <SelectInput
          name="gender"
          label="Gender"
          value={basicData.gender}
          onChange={handleChange}
          options={genderOptions}
          icon="pi pi-mars"
          disabled
        />
      </div>

      <div className="form-row">
        <SelectInput
          name="qualification"
          label="Qualification"
          disabled={isReadOnly}
          value={basicData.qualification}
          onChange={handleChange}
          options={qualificationOptions}
          icon="pi pi-graduation-cap"
          required
        />

        <SelectInput
          name="subCaste"
          label="Sub Caste"
          required
          value={basicData.subCaste}
          onChange={handleChange}
          options={subCasteOptions}
          icon="pi pi-book"
          disabled
        />
      </div>

      <div className="form-row">
        <FormInput
          disabled
          label="Date of Birth"
          name="dob"
          value={basicData.dob ? new Date(basicData.dob) : ""}
          icon="pi pi-phone"
          type="date"
        />

        <FormInput
          isTextArea
          label="Additional Notes"
          name="note"
          disabled={isReadOnly}
          value={basicData.note}
          icon="pi pi-pen-to-square"
        />
      </div>
    </div>
  );
};

export default BasicDetails;
