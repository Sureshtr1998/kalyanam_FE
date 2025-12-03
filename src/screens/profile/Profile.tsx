/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import api from "../../utils/api";
import type {
  ImageFile,
  UserDataType,
  UserDetails,
} from "../../utils/interfaces";
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
import { isImageFile } from "../../utils/utils";
import Verify from "../../components/forms/register/steps/Verify";

interface Props {
  user?: UserDetails;
}
const Profile = (props: Props) => {
  const { user } = props;

  const isReadOnly = !!user;
  const { showToast } = useToast();

  const [userData, setUserData] = useState<UserDetails>(formDefaultVals);
  const [allImgs, setAllImgs] = useState<(File | ImageFile)[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerify, setIsVerify] = useState<boolean>(false);

  useEffect(() => {
    if (user) setUserData(user);
    else init();
  }, []);

  useEffect(() => {
    setAllImgs(userData.basic.images);
  }, [userData.basic.images]);

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
      if (!res.data.profile.hasCompleteProfile) {
        showToast(
          "error",
          "Fill mandatory fields",
          "Please fill all mandatory fields to view user profiles"
        );
      }
      setIsLoading(false);
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

    if (!userData.isVerified) setIsVerify(true);
    else saveProfileData();
  };

  const saveProfileData = async () => {
    try {
      setIsLoading(true);

      // 1️⃣ Separate new files and existing image objects
      const newFiles = allImgs.filter((item) => item instanceof File) as File[];
      const existingImages = allImgs
        .filter(isImageFile)
        .map((obj: any) => ({ url: obj.url, fileId: obj.fileId }));

      let uploadedImages: { url: string; fileId: string }[] = [];

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

        uploadedImages = imgRes.data.media.map((obj: ImageFile) => ({
          url: obj.url,
          fileId: obj.fileId,
        }));
      }

      const finalImages = [...existingImages, ...uploadedImages];

      const payload = {
        ...userData,
        basic: {
          ...userData.basic,
          images: finalImages,
        },
      };

      const res = await api.post("/my-profile", payload);
      setUserData(res.data.profile);

      showToast("success", "Success", "Profile updated successfully");
      setIsLoading(false);
    } catch (err: any) {
      showToast(
        "error",
        "Error",
        err.response?.data?.msg || "Something went wrong"
      );
      setIsLoading(false);
    }
  };

  const handleExisting = (file: ImageFile[]) => {
    console.log(file, "file");
    setAllImgs((prev) => {
      const filesOnly = prev.filter((item) => item instanceof File);
      return [...file, ...filesOnly] as (File | ImageFile)[];
    });
  };

  const handleNew = (files: File[]) => {
    setAllImgs((prev: (File | ImageFile)[]) => {
      const existingImgsAndUrls = prev.filter(
        (item) => !(item instanceof File)
      );
      return [...existingImgsAndUrls, ...files];
    });
  };

  return (
    <div className="w-full">
      <Spinner isLoading={isLoading} />
      {isVerify && (
        <Verify
          email={userData.basic.email}
          mobile={userData.basic.mobile}
          onHide={() => setIsVerify(false)}
          success={saveProfileData}
        />
      )}
      <div className="profile-container">
        <form className="profile-form">
          {!userData?.hasCompleteProfile && !isReadOnly && (
            <>
              <Message
                severity="warn"
                text="Please complete all required fields to view user profiles. Fields marked with an asterisk (*) are mandatory."
                className="info-msg warn"
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
