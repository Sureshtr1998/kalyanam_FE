import {
  countryOptions,
  dietOptions,
  employedInOptions,
  heightOptions,
  nakshatraOptions,
  rashiOptions,
  residingOptions,
} from "../../../utils/constants";
import type { PersonalDetailsIn } from "../../../utils/interfaces";
import SelectInput from "../../../components/fields/SelectInput";
import FormInput from "../../../components/fields/FormInput";

interface Props {
  personalData: PersonalDetailsIn;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange: (event: any) => void;
  isReadOnly: boolean;
}

const PersonalDetails = (props: Props) => {
  const { personalData = {}, handleChange, isReadOnly } = props;

  return (
    <div>
      <div className="form-row">
        <SelectInput
          name="height"
          required
          label="Height"
          disabled={isReadOnly}
          value={personalData.height}
          options={heightOptions}
          onChange={handleChange}
          placeholder="Select"
          icon="pi pi-chart-scatter"
        />

        <FormInput
          type="number"
          name="weight"
          label="Weight"
          disabled={isReadOnly}
          placeholder="In kgs"
          value={personalData.weight}
          onChange={handleChange}
          icon="pi pi-chart-scatter"
        />
      </div>

      <div className="form-row">
        <SelectInput
          name="country"
          required
          disabled={isReadOnly}
          label="Country"
          value={personalData.country}
          options={countryOptions}
          onChange={handleChange}
          placeholder="Select"
          icon="pi pi-globe"
        />

        <SelectInput
          name="residingStatus"
          required
          label="Residing Status"
          value={personalData.residingStatus}
          options={residingOptions}
          onChange={handleChange}
          placeholder="Select"
          disabled={isReadOnly}
          icon="pi pi-home"
        />
      </div>

      <div className="form-row">
        <SelectInput
          name="employedIn"
          required
          label="Employed In"
          value={personalData.employedIn}
          options={employedInOptions}
          onChange={handleChange}
          placeholder="Select"
          disabled={isReadOnly}
          icon="pi pi-briefcase"
        />
        <SelectInput
          name="diet"
          label="Diet"
          required
          value={personalData.diet}
          options={dietOptions}
          onChange={handleChange}
          placeholder="Select"
          disabled={isReadOnly}
          icon="pi pi-palette"
        />
      </div>

      <div className="form-row">
        <SelectInput
          name="rashi"
          label="Rashi"
          value={personalData.rashi}
          options={rashiOptions}
          onChange={handleChange}
          placeholder="Select"
          disabled={isReadOnly}
          icon="pi pi-moon"
        />

        <SelectInput
          name="nakshatra"
          label="Nakshatra"
          value={personalData.nakshatra}
          options={nakshatraOptions}
          onChange={handleChange}
          placeholder="Select"
          disabled={isReadOnly}
          icon="pi pi-star"
        />
      </div>

      <div className="form-row">
        <FormInput
          type="number"
          name="salary"
          label="Salary"
          placeholder="In LPA"
          suffix="LPA"
          value={personalData.salary}
          onChange={handleChange}
          disabled={isReadOnly}
          icon="pi pi-indian-rupee"
        />

        <FormInput
          name="address"
          label="Address"
          placeholder="Address"
          value={personalData.address}
          onChange={handleChange}
          disabled={isReadOnly}
          icon="pi pi-map-marker"
        />
      </div>

      <div className="form-row">
        <FormInput
          name="workCity"
          label=" Work City"
          placeholder=" Work City"
          value={personalData.workCity}
          onChange={handleChange}
          disabled={isReadOnly}
          icon="pi pi-map"
        />

        <FormInput
          name="note"
          isTextArea
          label="Additional Notes"
          value={personalData.note}
          onChange={handleChange}
          disabled={isReadOnly}
          icon="pi pi-pen-to-square"
        />
      </div>
    </div>
  );
};

export default PersonalDetails;
