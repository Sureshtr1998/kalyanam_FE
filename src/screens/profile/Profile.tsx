import { useEffect, useRef, useState } from "react"
import Topbar from "../../components/topbar/Topbar"
import api from "../../utils/api"
import type { UserDetails } from "../../utils/interfaces"
import "./Profile.scss"
import "../register/Register.scss"
import { Toast } from "primereact/toast"
import { Accordion, AccordionTab } from 'primereact/accordion';
import { formDefaultVals, mandatoryFields } from "../../utils/constants"
import BasicDetails from "./details/BasicDetails"
import PersonalDetails from "./details/PersonalDetails"
import FamilyDetails from "./details/FamilyDetails"
import PartnerPreferences from "./details/PartnerPreferences"
import { Button } from "primereact/button"

const Profile = () => {

    const toast = useRef<Toast | null>(null);
    const [userData, setUserData] = useState<UserDetails>(formDefaultVals)
    const [allImgs, setAllImgs] = useState<File[] | string[]>([])

    useEffect(() => {
        init()

    }, [])

    useEffect(() => {
        setAllImgs(userData.images)
    }, [userData.images])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (e: any) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };


    const init = async () => {
        const res = await api.get('/my-profile')
        setUserData(res.data.profile)
    }

    const saveChanges = async () => {
        const newErrors: string[] = [];


        const isAnyFieldEmpty = mandatoryFields.some((field) => {
            if (!userData[field]) {
                return true
            }
        });

        if (isAnyFieldEmpty) {
            newErrors.push("Please fill all mandatory fields.");
        }

        if (!allImgs.length) newErrors.push("Please upload at least one image.");


        if (newErrors.length > 0) {
            newErrors.forEach((msg) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Validation Error',
                    detail: msg,
                    life: 3000,
                });
            });
            return;
        }
        try {
            const formData = new FormData();

            // Append all userData fields
            Object.entries(userData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });

            // Append images
            allImgs.forEach((item) => {
                if (item instanceof File) {
                    formData.append("images", item);
                } else if (typeof item === "string") {
                    formData.append("imageUrls", item);
                }
            });

            await api.post('/my-profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });


            toast.current?.show({
                severity: "success",
                summary: "Success",
                detail: "Profile updated successfully",
                life: 3000,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: err.message || "Something went wrong",
                life: 3000,
            });
        }
    }

    const handleExisting = (file: string[]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAllImgs((prev: any) => {
            const filesOnly = prev.filter((item: File | string) => item instanceof File);
            return [...file, ...filesOnly];
        });
    };


    const handleNew = (files: File[]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAllImgs((prev: any) => {
            const stringsOnly = prev.filter((item: File | string) => typeof item === "string");
            return [...stringsOnly, ...files];
        });
    };

    return <div className="w-full">

        <Topbar />
        <Toast ref={toast} position="bottom-left" />

        <div className="profile-container">
            <form className="profile-form">
                <Accordion className="accordion-data" multiple activeIndex={[0]}>
                    {/* Basic Details */}
                    <AccordionTab header="Basic Details" >
                        <BasicDetails handleExisting={handleExisting} handleNew={handleNew} userData={userData} handleChange={handleChange} />
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


                </Accordion>
            </form>
        </div>
        <Button onClick={saveChanges} className="profile-btn"> Save </Button>

    </div >
}

export default Profile