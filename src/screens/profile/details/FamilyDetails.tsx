import type { FamilyDetailsIn } from "../../../utils/interfaces";
import {
  employedInOptions,
  familyStatus,
  parentStatus,
} from "../../../utils/constants";
import FormInput from "../../../components/fields/FormInput";
import SelectInput from "../../../components/fields/SelectInput";

interface Props {
  familyData: FamilyDetailsIn;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange: (event: any) => void;
  isReadOnly: boolean;
}

const FamilyDetails = (props: Props) => {
  const { familyData = {}, handleChange, isReadOnly } = props;

  return (
    <div>
      <div className="form-row">
        <FormInput
          type="number"
          label="No. Elder Brothers"
          name="elderBro"
          value={familyData.elderBro}
          icon="pi pi-arrow-up"
          disabled={isReadOnly}
          onChange={handleChange}
        />
        <FormInput
          type="number"
          label="No.  Elder Brothers Married"
          name="elderBroMar"
          value={familyData.elderBroMar}
          icon="pi pi-link"
          disabled={isReadOnly}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <FormInput
          type="number"
          label="No. Younger Brothers"
          name="youngerBro"
          value={familyData.youngerBro}
          icon="pi pi-arrow-down"
          disabled={isReadOnly}
          onChange={handleChange}
        />
        <FormInput
          type="number"
          label="No. Younger Brothers Married"
          name="youngerBroMar"
          value={familyData.youngerBroMar}
          icon="pi pi-link"
          disabled={isReadOnly}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <FormInput
          type="number"
          label="No. Elder Sisters"
          name="elderSis"
          value={familyData.elderSis}
          icon="pi pi-arrow-up"
          disabled={isReadOnly}
          onChange={handleChange}
        />
        <FormInput
          type="number"
          label="No. Elder Sisters Married"
          name="elderSisMar"
          value={familyData.elderSisMar}
          icon="pi pi-link"
          disabled={isReadOnly}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <FormInput
          type="number"
          label="No. Younger Sisters"
          name="youngerSis"
          value={familyData.youngerSis}
          icon="pi pi-arrow-down"
          disabled={isReadOnly}
          onChange={handleChange}
        />
        <FormInput
          type="number"
          label="No. Younger Sisters Married"
          name="youngerSisMar"
          value={familyData.youngerSisMar}
          icon="pi pi-link"
          disabled={isReadOnly}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <FormInput
          required
          label="Father's Name / Guardian's Name"
          name="fatherName"
          value={familyData.fatherName}
          icon="pi pi-user"
          disabled={isReadOnly}
          onChange={handleChange}
        />

        <FormInput
          required
          label=" Mother's Name / Guardian's Name"
          name="motherName"
          value={familyData.motherName}
          icon="pi pi-user"
          disabled={isReadOnly}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <SelectInput
          name="fatherStatus"
          label="Father's Living Status"
          value={familyData.fatherStatus}
          disabled={isReadOnly}
          onChange={handleChange}
          options={parentStatus}
          icon="pi pi-sun"
        />

        <SelectInput
          name="motherStatus"
          label="Mother's Living Status"
          value={familyData.motherStatus}
          disabled={isReadOnly}
          onChange={handleChange}
          options={parentStatus}
          icon="pi pi-moon"
        />
      </div>

      <div className="form-row">
        <SelectInput
          name="fatherOccup"
          label="Father's Occupation"
          value={familyData.fatherOccup}
          disabled={isReadOnly}
          onChange={handleChange}
          options={employedInOptions}
          icon="pi pi-briefcase"
        />

        <SelectInput
          name="motherOccup"
          label="Mother's Occupation"
          value={familyData.motherOccup}
          disabled={isReadOnly}
          onChange={handleChange}
          options={employedInOptions}
          icon="pi pi-briefcase"
        />
      </div>

      <div className="form-row">
        <SelectInput
          name="familyStatus"
          label="Family Status"
          value={familyData.familyStatus}
          disabled={isReadOnly}
          onChange={handleChange}
          options={familyStatus}
          icon="pi pi-sitemap"
        />

        <FormInput
          isTextArea
          label="Additional Notes"
          name="note"
          disabled={isReadOnly}
          value={familyData.note}
          onChange={handleChange}
          icon="pi pi-pen-to-square"
        />
      </div>
    </div>
  );
};

export default FamilyDetails;
