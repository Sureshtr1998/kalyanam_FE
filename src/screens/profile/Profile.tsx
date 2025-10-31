import { useEffect, useState } from "react";
import api from "../../utils/api";
import type { UserDataType, UserDetails } from "../../utils/interfaces";
import "./Profile.scss";
import { Accordion, AccordionTab } from "primereact/accordion";
import {
  formDefaultVals,
  mandatoryBasicFields,
  mandatoryFamilyFields,
  mandatoryPartnerFields,
  mandatoryPersonalFields,
} from "../../utils/constants";
import BasicDetails from "./details/BasicDetails";
import PersonalDetails from "./details/PersonalDetails";
import FamilyDetails from "./details/FamilyDetails";
import PartnerPreferences from "./details/PartnerPreferences";
import { Button } from "primereact/button";
import { useToast } from "../../components/toastProvider/ToastProvider";
import { Message } from "primereact/message";
import Spinner from "../../components/spinner/Spinner";

const Profile = () => {
  const { showToast } = useToast();

  const [userData, setUserData] = useState<UserDetails>(formDefaultVals);
  const [allImgs, setAllImgs] = useState<File[] | string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    setAllImgs(userData.basic.images);
  }, [userData.basic.images]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any, section: UserDataType) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [section]: {
        ...userData[section],
        [name]: value,
      },
    });
  };

  const init = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/my-profile");
      setUserData(res.data.profile);
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

  const hasEmptyFields = <T extends object>(
    obj: T,
    fields: (keyof T)[]
  ): boolean => {
    return fields.some((field) => !obj?.[field]);
  };

  const saveChanges = async () => {
    const newErrors: string[] = [];

    const isBasicEmpty = hasEmptyFields(userData.basic, mandatoryBasicFields);
    const isPersonalEmpty = hasEmptyFields(
      userData.personal,
      mandatoryPersonalFields
    );
    const isFamilyEmpty = hasEmptyFields(
      userData.family,
      mandatoryFamilyFields
    );
    const isPartnerEmpty = hasEmptyFields(
      userData.partner,
      mandatoryPartnerFields
    );

    if (isBasicEmpty || isPersonalEmpty || isFamilyEmpty || isPartnerEmpty) {
      newErrors.push("Please fill all mandatory fields.");
    }

    if (!allImgs.length) newErrors.push("Please upload at least one image.");

    if (newErrors.length > 0) {
      newErrors.forEach((msg) => {
        showToast("error", "Validation Error", msg);
      });
      return;
    }

    try {
      setIsLoading(true);
      let uploadedUrls: string[] = [];

      const newFiles = allImgs.filter((item) => item instanceof File);
      const existingUrls = allImgs.filter((item) => typeof item === "string");

      if (newFiles.length > 0) {
        const imgFormData = new FormData();
        newFiles.forEach((file) => imgFormData.append("images", file));

        const imgRes = await api.post(
          "/my-profile/upload-images",
          imgFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        uploadedUrls = imgRes.data.urls;
      }

      // 2️⃣ Combine existing and new URLs
      const finalUrls = [...existingUrls, ...uploadedUrls];

      // 3️⃣ Send updated profile JSON
      const payload = {
        ...userData,
        basic: {
          ...userData.basic,
          images: finalUrls,
        },
        hasCompleteProfile: true,
      };

      await api.post("/my-profile", payload);

      showToast("success", "Success", "Profile updated successfully");
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

  const handleExisting = (file: string[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setAllImgs((prev: any) => {
      const filesOnly = prev.filter(
        (item: File | string) => item instanceof File
      );
      return [...file, ...filesOnly];
    });
  };

  const handleNew = (files: File[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setAllImgs((prev: any) => {
      const stringsOnly = prev.filter(
        (item: File | string) => typeof item === "string"
      );
      return [...stringsOnly, ...files];
    });
  };

  return (
    <div className="w-full">
      <Spinner isLoading={isLoading} />

      <div className="profile-container">
        <form className="profile-form">
          {!userData?.hasCompleteProfile && (
            <Message
              severity="info"
              text="Please complete all required fields to view user profiles. Fields marked with an asterisk (*) are mandatory."
              className="info-msg"
            />
          )}
          <Accordion className="accordion-data" multiple activeIndex={[0]}>
            {/* Basic Details */}
            <AccordionTab header="Basic Details">
              <BasicDetails
                handleExisting={handleExisting}
                handleNew={handleNew}
                basicData={userData.basic}
                handleChange={(e) => handleChange(e, "basic")}
              />
            </AccordionTab>

            {/* Personal Details */}
            <AccordionTab header="Personal Details">
              <PersonalDetails
                personalData={userData.personal}
                handleChange={(e) => handleChange(e, "personal")}
              />
            </AccordionTab>

            {/* Family Details */}
            <AccordionTab header="Family Details">
              <FamilyDetails
                familyData={userData.family}
                handleChange={(e) => handleChange(e, "family")}
              />
            </AccordionTab>

            {/* Partner Preferences  */}
            <AccordionTab header="Partner Preferences">
              <PartnerPreferences
                partnerData={userData.partner}
                handleChange={(e) => handleChange(e, "partner")}
              />
            </AccordionTab>
          </Accordion>
        </form>
      </div>
      <Button onClick={saveChanges} className="profile-btn">
        {" "}
        Save{" "}
      </Button>
    </div>
  );
};

export default Profile;
