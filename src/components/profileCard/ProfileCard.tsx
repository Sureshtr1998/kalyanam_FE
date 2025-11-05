/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import type { UserDetails } from "../../utils/interfaces";
import "./ProfileCard.scss";
import ViewCard from "../viewCard/ViewCard";
import { fetchLabel } from "../../utils/utils";
import api from "../../utils/api";
import { useToast } from "../toastProvider/ToastProvider";
import { qualificationOptions } from "../../utils/constants";
import { Button } from "primereact/button";

interface ProfileCardProps {
  match: UserDetails;
  hideProfile: (id: string) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ match, hideProfile }) => {
  const { fullName, age, subCaste, images, gothra, qualification } =
    match.basic;
  const userId = match._id;

  const [visible, setVisible] = useState(false);
  const { showToast } = useToast();

  const hideUser = async () => {
    try {
      const res = await api.post("/hide-profile", { userId });
      showToast(
        "success",
        "Success",
        res.data.msg || "Profile has been hidden successfully"
      );
      hideProfile(userId ?? "");
    } catch (err: any) {
      showToast(
        "error",
        "Error",
        err.response.data.msg || "Something went wrong"
      );
    }
  };

  const sendInterest = async () => {
    try {
      await api.post("/send-interest", { receiverId: userId });
      showToast("success", "Success", "Interest sent successfully");
      hideProfile(userId ?? "");
    } catch (err: any) {
      showToast(
        "error",
        "Error",
        err.response.data.msg || "Something went wrong"
      );
    }
  };

  return (
    <div className="profile-card">
      {visible && <ViewCard user={match} hide={() => setVisible(false)} />}

      <div className="card-elegant">
        {/* Image Section */}
        <div className="img-section">
          <img src={images[0].url} alt={fullName} />
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
              <span className="label">Age:</span> {age} Yrs
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
            className="icon-btn"
            onClick={sendInterest}
            title="Send Interest">
            <i className="pi pi-heart"></i>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
