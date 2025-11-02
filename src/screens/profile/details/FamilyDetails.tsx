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
}

const FamilyDetails = (props: Props) => {
  const { familyData = {}, handleChange } = props;

  return (
    <div>
      <div className="form-row">
        <FormInput
          type="number"
          label="No. Elder Brothers"
          name="elderBro"
          value={familyData.elderBro}
          icon="pi pi-arrow-up"
          onChange={handleChange}
        />
        <FormInput
          type="number"
          label="No.  Elder Brothers Married"
          name="elderBroMar"
          value={familyData.elderBroMar}
          icon="pi pi-link"
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
          onChange={handleChange}
        />
        <FormInput
          type="number"
          label="No. Younger Brothers Married"
          name="youngerBroMar"
          value={familyData.youngerBroMar}
          icon="pi pi-link"
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
          onChange={handleChange}
        />
        <FormInput
          type="number"
          label="No. Elder Sisters Married"
          name="elderSisMar"
          value={familyData.elderSisMar}
          icon="pi pi-link"
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
          onChange={handleChange}
        />
        <FormInput
          type="number"
          label="No. Younger Sisters Married"
          name="youngerSisMar"
          value={familyData.youngerSisMar}
          icon="pi pi-link"
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <FormInput
          required
          label="Father's Name"
          name="fatherName"
          value={familyData.fatherName}
          icon="pi pi-user"
        />

        <FormInput
          required
          label=" Mother's Name"
          name="motherName"
          value={familyData.motherName}
          icon="pi pi-user"
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <SelectInput
          name="fatherStatus"
          label="Father's Living Status"
          value={familyData.fatherStatus}
          onChange={handleChange}
          options={parentStatus}
          icon="pi pi-sun"
        />

        <SelectInput
          name="motherStatus"
          label="Mother's Living Status"
          value={familyData.motherStatus}
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
          onChange={handleChange}
          options={employedInOptions}
          icon="pi pi-briefcase"
        />

        <SelectInput
          name="motherOccup"
          label="Mother's Occupation"
          value={familyData.motherOccup}
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
          onChange={handleChange}
          options={familyStatus}
          icon="pi pi-sitemap"
        />

        <FormInput
          isTextArea
          label="Additional Notes"
          name="note"
          value={familyData.note}
          icon="pi pi-pen-to-square"
        />
      </div>
    </div>
  );
};

export default FamilyDetails;
