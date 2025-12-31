import type { StepsType } from "../../../../utils/interfaces";
import SelectInput from "../../../fields/SelectInput";
import FormInput from "../../../fields/FormInput";
import {
  createdByOptions,
  maritalOptions,
  qualificationOptions,
} from "../../../../utils/constants";
import { Button } from "primereact/button";
import {
  casteOptions,
  motherTongueOptions,
  subCasteOptions,
} from "../../../../utils/utils";

const Background = (props: StepsType) => {
  const { handleChange, handleNext, handleBack, formData } = props;
  const {
    martialStatus,
    profileCreatedBy,
    motherTongue,
    qualification,
    gothra,
    subCaste,
    caste,
  } = formData;

  return (
    <div className="w-full max-w-sm">
      <h3 className="heading">Step 2: Background & Qualification</h3>

      <SelectInput
        placeholder="Marital Status"
        value={martialStatus}
        name="martialStatus"
        onChange={handleChange}
        options={maritalOptions}
        icon="pi pi-heart"
      />

      <SelectInput
        placeholder="Mother Tongue"
        value={motherTongue}
        name="motherTongue"
        onChange={handleChange}
        options={motherTongueOptions}
        icon="pi pi-language"
        filter
      />

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          type="text"
          name="gothra"
          placeholder="Gothra"
          value={gothra}
          onChange={handleChange}
          icon="pi pi-sitemap"
        />
        <SelectInput
          placeholder="Qualification"
          value={qualification}
          name="qualification"
          onChange={handleChange}
          options={qualificationOptions}
          icon="pi pi-graduation-cap"
        />
      </div>
      <SelectInput
        placeholder="Profile Created By"
        value={profileCreatedBy}
        name="profileCreatedBy"
        onChange={handleChange}
        options={createdByOptions}
        icon="pi pi-users"
      />
      <div className="grid grid-cols-2 gap-4">
        <SelectInput
          placeholder="Caste"
          value={caste}
          name="caste"
          onChange={handleChange}
          options={casteOptions}
          icon="pi pi-book"
          filter
        />
        <SelectInput
          placeholder="Sub Caste"
          value={subCaste}
          name="subCaste"
          onChange={handleChange}
          options={subCasteOptions(caste)}
          icon="pi pi-sitemap"
          filter
        />
      </div>

      <div className="flex justify-between gap-4 mt-6">
        <Button onClick={handleBack} className="secondary-btn">
          Back
        </Button>
        <Button onClick={handleNext} className="update-btn">
          Continue to Profile{" "}
        </Button>
      </div>
    </div>
  );
};

export default Background;
