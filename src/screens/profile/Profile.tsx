import { useEffect, useRef, useState } from "react"
import Topbar from "../../components/topbar/Topbar"
import api from "../../utils/api"
import type { UserDetails } from "../../utils/interfaces"
import "./Profile.scss"
import "../register/Register.scss"
import { Toast } from "primereact/toast"
import { Accordion, AccordionTab } from 'primereact/accordion';
import { formDefaultVals } from "../../utils/constants"
import BasicDetails from "./details/BasicDetails"
import PersonalDetails from "./details/PersonalDetails"
import FamilyDetails from "./details/FamilyDetails"
import PartnerPreferences from "./details/PartnerPreferences"
import AccountSettings from "./details/AccountSettings"
import { Button } from "primereact/button"

const Profile = () => {

    const toast = useRef<Toast | null>(null);
    const [userData, setUserData] = useState<UserDetails>(formDefaultVals)

    useEffect(() => {
        init()
    }, [])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (e: any) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };


    const init = async () => {
        const res = await api.get('/my-profile')
        console.log(res.data.profile, "HEY")
        setUserData(res.data.profile)
    }

    return <div className="w-full">

        <Topbar />
        <Toast ref={toast} position="bottom-left" />

        <div className="profile-container">
            <form className="profile-form">
                <Accordion className="accordion-data" multiple activeIndex={[0]}>
                    {/* Basic Details */}
                    <AccordionTab header="Basic Details" >
                        <BasicDetails userData={userData} handleChange={handleChange} />
                    </AccordionTab>


                    {/* Personal Details */}
                    <AccordionTab header="Personal Details">
                        <PersonalDetails userData={userData} handleChange={handleChange} />
                    </AccordionTab>

                    {/* Family Details */}
                    <AccordionTab header="Family Details">
                        <FamilyDetails userData={userData} handleChange={handleChange} />
                    </AccordionTab>

                    {/* Partner Preferences  */}
                    <AccordionTab header="Partner Preferences">
                        <PartnerPreferences userData={userData} handleChange={handleChange} />
                    </AccordionTab>

                    {/* Account Settings  */}
                    <AccordionTab header="Account & Billing">
                        <AccountSettings />
                    </AccordionTab>

                </Accordion>
            </form>
        </div>
        <Button className="profile-btn"> Save </Button>

    </div >
}

export default Profile