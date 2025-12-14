/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import type { UserDetails } from "../../utils/interfaces";
import "./ProfileCard.scss";
import ViewCard from "../viewCard/ViewCard";
import { calculateAge, fetchLabel } from "../../utils/utils";
import api from "../../utils/api";
import { useToast } from "../toastProvider/ToastProvider";
import { IMAGEKIT_PARAMS, qualificationOptions } from "../../utils/constants";
import { Button } from "primereact/button";
import Spinner from "../spinner/Spinner";

interface ProfileCardProps {
  match: UserDetails;
  hideProfile: (id: string, isInterest?: boolean) => void;
  remainingInterest: number;
  currentUser: UserDetails;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  match,
  hideProfile,
  remainingInterest,
  currentUser,
}) => {
  const { fullName, subCaste, dob, images, gothra, qualification } =
    match.basic;
  const userId = match._id;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [visible, setVisible] = useState(false);
  const { showToast } = useToast();

  const hideUser = async () => {
    try {
      setIsLoading(true);
      const res = await api.post("/hide-profile", { userId });
      showToast(
        "success",
        "Success",
        res.data.msg || "Profile has been hidden successfully"
      );
      setIsLoading(false);
      hideProfile(userId ?? "");
    } catch (err: any) {
      setIsLoading(false);

      showToast(
        "error",
        "Error",
        err.response.data.msg || "Something went wrong"
      );
    }
  };

  const sendInterest = async () => {
    try {
      setIsLoading(true);
      await api.post("/send-interest", { receiverId: userId });
      showToast(
        "success",
        "Success",
        "Interest sent successfully, now you can view the profile under Invitation Status"
      );
      hideProfile(userId ?? "", true);
      setIsLoading(false);
    } catch (err: any) {
      showToast(
        "error",
        "Error",
        err.response.data.msg || "Something went wrong"
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-card">
      {visible && (
        <ViewCard
          user={match}
          hide={() => setVisible(false)}
          currentUser={currentUser}
        />
      )}
      <Spinner hideText isLoading={isLoading} />

      <div className="card-elegant">
        {/* Image Section */}
        <div className="img-section">
          <img
            className="transition-style"
            src={
              images?.[0]?.url ? images[0].url + IMAGEKIT_PARAMS : "/logo.png"
            }
            alt={fullName}
          />
          <div className="profile-id">{match.basic.uniqueId || "SRM-ID"}</div>

          <button className="hide-btn" onClick={hideUser} title="Hide Profile">
            <i className="pi pi-eye-slash"></i>
          </button>
        </div>

        {/* Details Section */}
        <div className="details">
          <h2 className="name">{fullName}</h2>
          <div className="info">
            <div>
              <span className="label">Age:</span> {calculateAge(dob ?? "")} Yrs
            </div>
            <div>
              <span className="label">Sub Caste:</span> {subCaste}
            </div>
            <div>
              <span className="label">Qualification:</span>{" "}
              {fetchLabel(qualificationOptions, qualification)}
            </div>
            <div>
              <span className="label">Gothra:</span> {gothra}
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="actions">
          <Button className="primary-btn" onClick={() => setVisible(true)}>
            View Profile
          </Button>
          <Button
            className="ternary-btn"
            onClick={sendInterest}
            disabled={remainingInterest < 1}
            title={
              remainingInterest < 1
                ? "Purchase interests under Account to send interest."
                : "Send Interest"
            }>
            <i className="pi pi-heart"></i>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
