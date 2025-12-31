import { useEffect, useState } from "react";
import "./Astrology.scss";
import {
  genderOptions,
  KUNDLI_MATCHING_ASTRO_FEE,
  OVERVIEW_ASTRO_FEE,
  PERSONALIZED_ASTRO_FEE,
} from "../../utils/constants";
import { Button } from "primereact/button";
import AstroNote from "./AstroNote";
import FormInput from "../../components/fields/FormInput";
import api from "../../utils/api";
import { SelectButton } from "primereact/selectbutton";
import SelectInput from "../../components/fields/SelectInput";
import { useToast } from "../../components/toastProvider/ToastProvider";
import type {
  AstrologyIn,
  ConsultationMode,
  UserDetails,
} from "../../utils/interfaces";
import Spinner from "../../components/spinner/Spinner";
import Consultations from "./Consultations";
import PaymentModal from "../../components/paymentModal/PaymentModal";

const items = [
  { name: `Overview ₹${OVERVIEW_ASTRO_FEE}`, value: "Overview" },
  { name: `Personalized ₹${PERSONALIZED_ASTRO_FEE}`, value: "Personalized" },
  {
    name: `Kundli Matching  ₹${KUNDLI_MATCHING_ASTRO_FEE}`,
    value: "Kundli Matching",
  },
];
const Astrology = () => {
  const [consultationMode, setConsultationMode] =
    useState<ConsultationMode>("Overview");
  const [astroData, setAstroData] = useState<AstrologyIn[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserDetails>();
  const [isPayment, setPayment] = useState<boolean>(false);

  const [query, setQuery] = useState<string>("");

  // User 1
  const [name, setName] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [place, setPlace] = useState<string>("");
  const [gender, setGender] = useState<string>("Male");
  // User 2
  const [mName, setMName] = useState<string>("");
  const [mDob, setMDob] = useState<string>("");
  const [mPlace, setMPlace] = useState<string>("");
  const [mGender, setMGender] = useState<string>("Male");

  const { showToast } = useToast();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/astro-data");
      if (res.data?.astrology) {
        setAstroData(res.data.astrology);
      }
      setCurrentUser(res.data.currentUser);
      setIsLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showToast(
        "error",
        "Error",
        err.response?.data?.msg || "Unable to load astrology data"
      );
      setIsLoading(false);
    }
  };

  const fetchPayload = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let payload: any = { consultationMode, name, dob, place, gender };

    if (consultationMode === "Personalized") {
      payload = { ...payload, query };
    } else if (consultationMode === "Kundli Matching") {
      payload = { ...payload, mName, mDob, mPlace, mGender };
    }
    return payload;
  };

  const handleSuccess = async (orderId: string, paymentId: string) => {
    try {
      setIsLoading(true);
      const payload = fetchPayload();
      const res = await api.post("/astro-data", {
        ...payload,
        orderId,
        paymentId,
        amount: fetchPayment(),
        note: `Astro_${consultationMode}`,
      });
      await init();
      showToast("success", "Success", res.data.msg || "Action successful");
      setIsLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showToast(
        "error",
        "Error",
        err.response?.data?.msg || "Something went wrong"
      );
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = () => {
    const isBasic = name && dob && place && gender;
    if (consultationMode === "Overview") {
      if (isBasic) return false;
    } else if (consultationMode === "Personalized") {
      if (isBasic && query) return false;
    } else {
      if (isBasic && mName && mDob && mPlace && mGender) return false;
    }
    return true;
  };

  const fetchPayment = () => {
    if (consultationMode === "Overview") return OVERVIEW_ASTRO_FEE;
    else if (consultationMode === "Personalized") return PERSONALIZED_ASTRO_FEE;
    return KUNDLI_MATCHING_ASTRO_FEE;
  };

  return (
    <div className="p-4">
      {isPayment && (
        <PaymentModal
          role="USER"
          onSuccess={handleSuccess}
          onHide={() => setPayment(false)}
          userName={currentUser?.basic.fullName ?? ""}
          payload={{
            ...fetchPayload(),
            amount: fetchPayment(),
            note: `Astro_${consultationMode}`,
            endpoint: "astro-data",
          }}
          userEmail={currentUser?.basic.email ?? ""}
          userPhone={currentUser?.basic.mobile ?? ""}
          amount={fetchPayment()}
        />
      )}

      <Spinner isLoading={isLoading} />

      <div className="astrology-card">
        {/* Note */}
        <AstroNote />

        {/* Buttons */}
        <div className="mode-selector">
          <SelectButton
            value={consultationMode}
            onChange={(e) => setConsultationMode(e.value)}
            optionLabel="name"
            options={items}
            allowEmpty={false}
          />
        </div>

        {/* Profile */}
        <div className="profile-selector">
          <h3 className="astro-label">User Profile</h3>
          <div>
            <div className="form-grid mt-4">
              <div className="form-row">
                <FormInput
                  type="text"
                  name="name"
                  placeholder="Profile Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon="pi pi-user"
                />
                <FormInput
                  type="text"
                  name="place"
                  placeholder="Place (City, State, Country)"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  icon="pi pi-map"
                />
              </div>
              <div className="form-row">
                <SelectInput
                  name="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  options={genderOptions}
                  icon="pi pi-mars"
                />
                <FormInput
                  name="dob"
                  type="date"
                  placeholder="DOB"
                  value={dob ?? ""}
                  onChange={(e) => setDob(e.target.value)}
                  icon="pi pi-envelope"
                  showTime
                  maxDOB={new Date()}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Match Profile */}
        {consultationMode === "Kundli Matching" && (
          <div className="profile-selector">
            <h3 className="astro-label">Match Profile</h3>
            <div>
              <div className="form-grid mt-4">
                <div className="form-row">
                  <FormInput
                    type="text"
                    name="name"
                    placeholder="Profile Name"
                    value={mName}
                    onChange={(e) => setMName(e.target.value)}
                    icon="pi pi-user"
                  />
                  <FormInput
                    type="text"
                    name="place"
                    placeholder="Place (City, State, Country)"
                    value={mPlace}
                    onChange={(e) => setMPlace(e.target.value)}
                    icon="pi pi-map"
                  />
                </div>
                <div className="form-row">
                  <SelectInput
                    name="gender"
                    value={mGender}
                    onChange={(e) => setMGender(e.target.value)}
                    options={genderOptions}
                    icon="pi pi-mars"
                  />
                  <FormInput
                    name="dob"
                    type="date"
                    placeholder="DOB"
                    value={mDob ?? ""}
                    onChange={(e) => setMDob(e.target.value)}
                    icon="pi pi-envelope"
                    showTime
                    maxDOB={new Date()}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Question */}
        {consultationMode === "Personalized" && (
          <div className="astro-query">
            <FormInput
              type="text"
              name="name"
              placeholder="Enter your specific question (e.g., 'Is 2026 an auspicious year for marriage?') – max 108 characters."
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, 108))}
              icon="pi pi-question-circle"
              isTextArea
            />
            <p className="text-red-500 text-right mb-2">{query.length}/108</p>
          </div>
        )}

        <Button
          disabled={isSubmitDisabled()}
          onClick={() => setPayment(true)}
          className="primary-btn w-full">
          Submit & Pay ₹{fetchPayment()} for {consultationMode}
        </Button>

        <Consultations astroData={astroData} />
      </div>
    </div>
  );
};

export default Astrology;
