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
import Overview from "./details/Overview";

interface Props {
  user?: UserDetails;
}
const Profile = (props: Props) => {
  const { user } = props;

  const isReadOnly = !!user;
  const { showToast } = useToast();

  const [userData, setUserData] = useState<UserDetails>(formDefaultVals);
  const [allImgs, setAllImgs] = useState<File[] | string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) setUserData(user);
    else init();
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

    if (isBasicEmpty) {
      newErrors.push("Please fill all mandatory Basic Details fields.");
    }

    if (isPersonalEmpty) {
      newErrors.push("Please fill all mandatory Personal Details fields.");
    }

    if (isFamilyEmpty) {
      newErrors.push("Please fill all mandatory Family Details fields.");
    }

    if (isPartnerEmpty) {
      newErrors.push("Please fill all mandatory Partner Details fields.");
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
        uploadedUrls = imgRes.data.urls.map(
          (obj: { fileId: string; url: string }) => obj.url
        );
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
          {!userData?.hasCompleteProfile && !isReadOnly && (
            <>
              <Message
                severity="warn"
                text="Please complete all required fields to view user profiles. Fields marked with an asterisk (*) are mandatory."
                className="info-msg"
              />
              <div className="mb-4" />
            </>
          )}

          <Overview
            isReadOnly={isReadOnly}
            handleExisting={handleExisting}
            handleNew={handleNew}
            basicData={userData.basic}
          />
          <Accordion className="accordion-data">
            {/* Basic Details */}
            <AccordionTab
              header={
                <span className="flex align-items-center gap-2 w-full">
                  <span className="my-custom-icon">
                    <i className="pi pi-user"></i>
                  </span>
                  <span className="ml-4 acc-header">Basic Details</span>
                </span>
              }
              className="accordion-tab">
              <BasicDetails
                isReadOnly={isReadOnly}
                basicData={userData.basic}
                handleChange={(e) => handleChange(e, "basic")}
              />
            </AccordionTab>

            {/* Personal Details */}
            <AccordionTab
              header={
                <span className="flex align-items-center gap-2 w-full">
                  <span className="my-custom-icon">
                    <i className="pi pi-heart"></i>
                  </span>
                  <span className="ml-4 acc-header">Personal Details</span>
                </span>
              }
              className="accordion-tab">
              <PersonalDetails
                isReadOnly={isReadOnly}
                personalData={userData.personal}
                handleChange={(e) => handleChange(e, "personal")}
              />
            </AccordionTab>

            {/* Family Details */}
            <AccordionTab
              header={
                <span className="flex align-items-center gap-2 w-full">
                  <span className="my-custom-icon">
                    <i className="pi pi-users"></i>
                  </span>
                  <span className="ml-4 acc-header">Family Details</span>
                </span>
              }
              className="accordion-tab">
              <FamilyDetails
                isReadOnly={isReadOnly}
                familyData={userData.family}
                handleChange={(e) => handleChange(e, "family")}
              />
            </AccordionTab>

            {/* Partner Preferences  */}
            <AccordionTab
              className="accordion-tab"
              header={
                <span className="flex align-items-center gap-2 w-full">
                  <span className="my-custom-icon">
                    <i className="pi pi-filter"></i>
                  </span>
                  <span className="ml-4 acc-header">Partner Preferences</span>
                </span>
              }>
              <PartnerPreferences
                isReadOnly={isReadOnly}
                partnerData={userData.partner}
                handleChange={(e) => handleChange(e, "partner")}
              />
            </AccordionTab>
          </Accordion>
        </form>
        {!isReadOnly && (
          <div className="pb-6 w-[20rem] justify-self-center">
            <Button onClick={saveChanges} className="update-btn">
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
