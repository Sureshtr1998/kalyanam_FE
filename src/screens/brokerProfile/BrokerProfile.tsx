import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useToast } from "../../components/toastProvider/ToastProvider";
import type { BrokerRegistrationForm } from "../../utils/brokerInterface";
import { brokerFormDefaultVals } from "../../utils/constants";
import Spinner from "../../components/spinner/Spinner";
import FormInput from "../../components/fields/FormInput";
import { casteOptions, normalizeToArray } from "../../utils/utils";
import SelectInput from "../../components/fields/SelectInput";
import { TEXT_COLOR } from "../../styles/variables";

const BrokerProfile = () => {
  const { showToast } = useToast();

  const [brokerData, setBrokerData] = useState<BrokerRegistrationForm>(
    brokerFormDefaultVals
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/my-profile");
      setBrokerData(res.data.profile);

      setIsLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showToast(
        "error",
        "Error",
        err.response?.data?.msg || "Unable to load user data"
      );
      setIsLoading(false);
    }
  };
  return (
    <div className="profile-container">
      <form className="profile-form">
        <Spinner isLoading={isLoading} />
        <div className="mb-8 text-center">
          <h2 className={`text-2xl font-bold mb-3 ${TEXT_COLOR}`}>
            Matchmaker Profile
          </h2>

          <p className={`${TEXT_COLOR}`}>
            Track your referrals, manage your agency presence, and watch your
            business grow with Seetha Rama Kalyana.
          </p>
        </div>
        <div className="broker-profile-form">
          <div className="background-style">
            <div className="form-row">
              <FormInput
                name="fullName"
                label="Full Name"
                disabled
                value={brokerData.name}
                icon="pi pi-user"
              />
              <FormInput
                name="email"
                label="Email ID"
                type="email"
                value={brokerData.email}
                disabled
                icon="pi pi-envelope"
              />
            </div>
            <div className="form-row">
              <FormInput
                required
                disabled
                label="Referral ID"
                name="referralId"
                value={brokerData.referralId}
                icon="pi pi-share-alt"
              />
              <FormInput
                required
                disabled
                label="Phone Number"
                name="phone"
                maxLength={10}
                value={brokerData.phone}
                icon="pi pi-whatsapp"
              />
            </div>
            <div className="form-row">
              <FormInput
                name="companyName"
                label="Company Name"
                disabled
                value={brokerData.companyName}
                icon="pi pi-building"
              />
              <FormInput
                name="address"
                label="Address"
                disabled
                value={brokerData.address}
                icon="pi pi-map"
              />
            </div>
            <div className="form-row">
              <SelectInput
                name="caste"
                label="Caste"
                value={normalizeToArray(brokerData.caste)}
                options={casteOptions}
                disabled
                icon="pi pi-book"
                isMultiselect
              />
              <FormInput
                label="Total Users Referred"
                name="reffered"
                disabled
                value={brokerData.usersReferred}
                icon="pi pi-share-alt"
              />
            </div>
            <div className="form-row">
              <FormInput
                isTextArea
                label="Additional Notes"
                name="note"
                disabled
                value={brokerData.note}
                icon="pi pi-pen-to-square"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BrokerProfile;
