import { Button } from "primereact/button";
import type { StepsType } from "../../../../utils/interfaces";
import FormInput from "../../../fields/FormInput";
import ImageUpload from "../../../imageMedia/ImageUpload";

const Profile = (props: StepsType) => {
  const { handleChange, handleBack, formData, setImages, handleNext } = props;
  const { mobile, alternateMob } = formData;

  return (
    <div className="w-full max-w-sm">
      <h3 className="heading">Step 3: Profile & Contact</h3>

      <FormInput
        type="number"
        name="mobile"
        placeholder="Mobile Number"
        value={mobile}
        onChange={handleChange}
        icon="pi pi-mobile"
      />
      <FormInput
        type="number"
        name="alternateMob"
        placeholder="Alternate Mobile Number (Optional)"
        value={alternateMob}
        onChange={handleChange}
        icon="pi pi-phone"
      />

      <ImageUpload onChange={setImages} />

      <div className="flex justify-between gap-4 mt-6">
        <Button onClick={handleBack} className="secondary-btn">
          Back
        </Button>
        <Button onClick={handleNext} className="update-btn">
          COMPLETE REGISTRATION
        </Button>
      </div>
    </div>
  );
};

export default Profile;
