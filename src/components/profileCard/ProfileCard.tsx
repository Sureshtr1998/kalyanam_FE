import React, { useState } from "react";
import type { UserDetails } from "../../utils/interfaces";
import { Card } from 'primereact/card';
import "./ProfileCard.scss"
import { Image } from 'primereact/image';
import { Button } from "primereact/button";
import { qualificationOptions } from "../../utils/constants";
import ViewCard from "../viewCard/ViewCard";
import { fetchLabel } from "../../utils/utils";
import api from "../../utils/api";
import { useToast } from "../toastProvider/ToastProvider";


interface ProfileCardProps {
    match: UserDetails;
    hideProfile: (id: string) => void
}



const ProfileCard: React.FC<ProfileCardProps> = ({ match, hideProfile }) => {
    const { fullName, age, subCaste, motherTongue, images, gothra, qualification } = match.basic
    const userId = match._id

    const [visible, setVisible] = useState(false);
    const { showToast } = useToast();


    const hideUser = async () => {
        try {
            const res = await api.post('/hide-profile', { userId: userId });
            showToast("success", "Success", res.data.msg || "Profile has been hidden successfully");
            hideProfile(userId ?? '')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            showToast("error", "Error", err.response.data.msg || "Something went wrong");
        }
    }

    const sendInterest = async () => {
        try {
            await api.post('/send-interest', { receiverId: userId });
            showToast("success", "Success", "Interest sent successfully");
            hideProfile(userId ?? '')

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            showToast("error", "Error", err.response.data.msg || "Something went wrong");
        }
    }

    return (
        <div className="profile-card">

            {visible && <ViewCard user={match} hide={() => setVisible(false)} />}
            <Card className="card-comp" title={
                <div className="card-title">
                    <span>{fullName}</span>
                    <i onClick={hideUser} title="Hide user profile" className="title-icon pi pi-eye-slash" style={{ fontSize: '1rem' }}></i>
                </div>
            }>
                <div className="flex">
                    <Image className="img-user" src={images[0]} />
                    <div className="content-info">
                        <div className="content-div">
                            <p className="content-label">Age:  </p>
                            &nbsp; {age}
                        </div>
                        <div className="content-div">
                            <p className="content-label">Sub Caste:  </p>
                            &nbsp;{subCaste}
                        </div>
                        <div className="content-div">
                            <p className="content-label">Qualification:  </p>
                            &nbsp;{fetchLabel(qualificationOptions, qualification)}
                        </div>
                        <div className="content-div">

                            <p className="content-label">Mother Tongue:</p>
                            &nbsp;{motherTongue}
                        </div>
                        <div className="content-div">

                            <p className="content-label">Gothra:</p>
                            &nbsp;{gothra}
                        </div>
                    </div>
                </div>
                <div className="action-items">
                    <Button className="action-btn" onClick={() => setVisible(true)}>View Profile</Button>
                    <Button onClick={sendInterest} className="action-btn">Send Interest</Button>
                </div>
            </Card>

        </div>
    );
};

export default ProfileCard;
