import { Button } from "primereact/button";
import type { StepsType } from "../../../../utils/interfaces";
import FormInput from "../../../fields/FormInput";
import ImageUpload from "../../../imageMedia/ImageUpload";
import { useState } from "react";
import RegisterNote from "../../../note/RegisterNote";

const Profile = (props: StepsType) => {
  const { handleChange, handleBack, formData, setImages, handleNext } = props;
  const { mobile, alternateMob } = formData;
  const [isNote, SetNote] = useState(false);

  return (
    <div className="w-full max-w-sm">
      {isNote && handleNext && (
        <RegisterNote onAccept={handleNext} onHide={() => SetNote(false)} />
      )}
      <h3 className="heading">Step 3: Profile & Contact</h3>

      <FormInput
        type="number"
        name="mobile"
        placeholder="Mobile Number"
        value={mobile}
        maxLength={10}
        onChange={handleChange}
        icon="pi pi-mobile"
      />
      <FormInput
        type="number"
        name="alternateMob"
        placeholder="Alternate Mobile Number (Optional)"
        value={alternateMob}
        maxLength={10}
        onChange={handleChange}
        icon="pi pi-phone"
      />

      <ImageUpload onChange={setImages} />

      <div className="flex justify-between gap-4 mt-6">
        <Button onClick={handleBack} className="secondary-btn">
          Back
        </Button>
        <Button onClick={() => SetNote(true)} className="update-btn">
          Continue to Verification
        </Button>
      </div>
    </div>
  );
};

export default Profile;
