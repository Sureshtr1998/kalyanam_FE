import {
  ageOptions,
  countryOptions,
  employedInOptions,
  heightOptions,
  maritalOptions,
  qualificationOptions,
  subCasteOptions,
} from "../../../utils/constants";
import type { PartnerDetailsIn } from "../../../utils/interfaces";
import { normalizeToArray } from "../../../utils/utils";
import SelectInput from "../../../components/fields/SelectInput";
import FormInput from "../../../components/fields/FormInput";

interface Props {
  partnerData: PartnerDetailsIn;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange: (event: any) => void;
  isFilter?: boolean;
  isReadOnly?: boolean;
}
const PartnerPreferences = (props: Props) => {
  const { partnerData = {}, handleChange, isFilter, isReadOnly } = props;

  return (
    <div>
      <div className="form-row">
        <SelectInput
          name="ageFrom"
          label="Age From"
          value={partnerData.ageFrom}
          onChange={handleChange}
          options={ageOptions}
          disabled={isReadOnly}
          icon="pi pi-sort-numeric-up"
          required={!isFilter}
        />

        <SelectInput
          name="ageTo"
          label="Age To"
          required={!isFilter}
          value={partnerData.ageTo}
          onChange={handleChange}
          options={ageOptions}
          disabled={isReadOnly}
          icon="pi pi-sort-numeric-down"
        />
      </div>

      <div className="form-row">
        <SelectInput
          name="heightFrom"
          label="Height From"
          value={partnerData.heightFrom}
          onChange={handleChange}
          options={heightOptions}
          disabled={isReadOnly}
          icon="pi pi-chart-line"
        />

        <SelectInput
          name="heightTo"
          label="Height To"
          value={partnerData.heightTo}
          onChange={handleChange}
          options={heightOptions}
          disabled={isReadOnly}
          icon="pi pi-chart-bar"
        />
      </div>

      <div className="form-row">
        <SelectInput
          name="subCaste"
          label="Sub Caste"
          value={normalizeToArray(partnerData.subCaste)}
          onChange={handleChange}
          options={subCasteOptions}
          disabled={isReadOnly}
          icon="pi pi-book"
          isMultiselect
        />

        <SelectInput
          name="employedIn"
          label="Employed In"
          value={partnerData.employedIn}
          onChange={handleChange}
          options={employedInOptions}
          disabled={isReadOnly}
          icon="pi pi-briefcase"
          isMultiselect
          required={!isFilter}
        />
      </div>

      <div className="form-row">
        <SelectInput
          name="qualification"
          label="Qualification"
          value={partnerData.qualification}
          onChange={handleChange}
          options={qualificationOptions}
          disabled={isReadOnly}
          icon="pi pi-graduation-cap"
          isMultiselect
        />
        <SelectInput
          name="country"
          label="Country"
          value={partnerData.country}
          onChange={handleChange}
          options={countryOptions}
          disabled={isReadOnly}
          icon="pi pi-globe"
          isMultiselect
          filter
        />
      </div>

      <div className="form-row">
        <SelectInput
          name="martialStatus"
          label="Martial Status"
          value={partnerData.martialStatus}
          onChange={handleChange}
          options={maritalOptions}
          disabled={isReadOnly}
          icon="pi pi-heart"
          isMultiselect
        />

        {!isFilter && (
          <FormInput
            isTextArea
            label="Additional Notes"
            name="note"
            value={partnerData.note}
            onChange={handleChange}
            disabled={isReadOnly}
            icon="pi pi-pen-to-square"
          />
        )}
      </div>
    </div>
  );
};

export default PartnerPreferences;
