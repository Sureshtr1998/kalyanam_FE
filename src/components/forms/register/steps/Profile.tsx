import { Button } from "primereact/button";
import type { StepsType } from "../../../../utils/interfaces";
import FormInput from "../../../fields/FormInput";
import ImageUpload from "../../../imageMedia/ImageUpload";
import { useEffect, useState } from "react";
import RegisterNote from "../../../note/RegisterNote";
import api from "../../../../utils/api";
import Spinner from "../../../spinner/Spinner";

const Profile = (props: StepsType) => {
  const { handleChange, handleBack, formData, setImages, handleNext } = props;
  const { mobile, alternateMob, referralId } = formData;
  const [isNote, SetNote] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    isValidRefferId();
  }, [referralId]);

  const isValidRefferId = async () => {
    if (!referralId) setIsDisabled(false);
    else {
      if (referralId.length === 7) {
        try {
          setIsLoading(true);
          const res = await api.get(`/validate-referral/${referralId}`);
          setIsDisabled(!res.data.valid);
          setIsLoading(false);
        } catch {
          setIsDisabled(true);
          setIsLoading(false);
        }
      } else {
        setIsDisabled(true);
      }
    }
  };

  return (
    <div className="w-full max-w-sm">
      <Spinner hideText isLoading={isLoading} />

      {isNote && handleNext && (
        <RegisterNote
          onAccept={() => {
            handleNext(referralId ? true : false);
            SetNote(false);
          }}
          onHide={() => SetNote(false)}
        />
      )}
      <h3 className="heading">Step 3: Profile & Contact</h3>

      <FormInput
        type="number"
        name="mobile"
        placeholder="WhatsApp Number"
        value={mobile}
        maxLength={10}
        onChange={handleChange}
        icon="pi pi-whatsapp"
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
      <div className="mt-4">
        <FormInput
          type="text"
          name="referralId"
          placeholder="Refferal ID (Optional)"
          value={referralId}
          onChange={handleChange}
          icon="pi pi-share-alt"
          maxLength={7}
        />
      </div>

      <div className="flex justify-between gap-4 mt-6">
        <Button onClick={handleBack} className="secondary-btn">
          Back
        </Button>
        <Button
          onClick={() => SetNote(true)}
          disabled={isDisabled}
          className="update-btn">
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};

export default Profile;
