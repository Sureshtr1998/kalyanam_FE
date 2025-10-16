import React from "react";
import type { UserDetails } from "../../utils/interfaces";
import { Card } from 'primereact/card';
import "./ProfileCard.scss"
import { Image } from 'primereact/image';
import { Button } from "primereact/button";
import { qualificationOptions } from "../../utils/constants";


interface ProfileCardProps {
    match: UserDetails;
}



const ProfileCard: React.FC<ProfileCardProps> = ({ match }) => {
    const { fullName, age, subCaste, qualification, motherTongue, images, gotra } = match;

    return (
        <div className="profile-card">
            <Card className="card-comp" title={
                <div className="card-title">
                    <span>{fullName}</span>
                    <i title="Hide user profile" className="title-icon pi pi-eye-slash" style={{ fontSize: '1rem' }}></i>
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
                            &nbsp;{qualificationOptions.find(option => option.value === qualification)?.label || ''}
                        </div>
                        <div className="content-div">

                            <p className="content-label">Mother Tongue:</p>
                            &nbsp;{motherTongue}
                        </div>
                        <div className="content-div">

                            <p className="content-label">Gotra:</p>
                            &nbsp;{gotra}
                        </div>
                    </div>
                </div>
                <div className="action-items">
                    <Button className="action-btn">View Profile</Button>
                    <Button className="action-btn">Send Interest</Button>
                </div>
            </Card>

        </div>
    );
};

export default ProfileCard;
