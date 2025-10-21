/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog } from "primereact/dialog";
import type { UserDetails } from "../../utils/interfaces"
import "./ViewCard.scss"
import CarouselImages from "../carousel/CarouselImages";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { useRef } from "react";
import { Button } from "primereact/button";
import BasicDetails from "./details/BasicDetails";
import PersonalDetails from "./details/PersonalDetails";
import FamilyDetails from "./details/FamilyDetails";
import PartnerPreferences from "./details/PartnerPreferences";
import { Message } from "primereact/message";

const ViewCard = (props: { user: UserDetails, hide: () => void, isAccept?: boolean }) => {
    const { user, hide, isAccept } = props
    const stepperRef = useRef<{ nextCallback?: () => void, prevCallback?: () => void }>(null);


    return <Dialog draggable={false}
        resizable={false}
        visible={true}
        header={<div className="header-dialog"> {user.fullName} - {user.uniqueId}</div>}
        onHide={hide}
        className="card-dialog"
    >
        <div>
            <div className="mt-4">
                <div className="mb-4 text-center">
                    {!isAccept && <Message
                        severity="info"
                        text="The phone number will be visible under Basic Details only after mutual acceptance."
                        className="info-msg"
                    />
                    }
                </div>
                <div className="view-content">
                    <CarouselImages images={user.images} />
                    <div className="ml-8  w-full card flex justify-content-center">
                        <Stepper ref={stepperRef as any} orientation="vertical" style={{ flexBasis: '50rem' }}>
                            <StepperPanel header="Basic Details">
                                <div className="stepper-container">
                                    <div className="content-data">
                                        <BasicDetails user={user} />
                                    </div>
                                </div>
                                <div className="flex pt-4 justify-content-end">
                                    <Button label="Next" className="next-btn" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current?.nextCallback?.()} />
                                </div>
                            </StepperPanel>
                            <StepperPanel header="Personal Details">
                                <div className="stepper-container">
                                    <div className="content-data">
                                        <PersonalDetails user={user} />
                                    </div>
                                </div>
                                <div className="flex pt-4 justify-content-between justify-between">
                                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current?.prevCallback?.()} />
                                    <Button label="Next" className="next-btn" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current?.nextCallback?.()} />
                                </div>
                            </StepperPanel>
                            <StepperPanel header="Family Details">
                                <div className="stepper-container">
                                    <div className="content-data">
                                        <FamilyDetails user={user} />
                                    </div>
                                </div>
                                <div className="flex pt-4 justify-content-between justify-between">
                                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current?.prevCallback?.()} />
                                    <Button label="Next" className="next-btn" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current?.nextCallback?.()} />
                                </div>
                            </StepperPanel>
                            <StepperPanel header="Partner Preference ">
                                <div className="stepper-container">
                                    <div className="content-data">
                                        <PartnerPreferences user={user} />
                                    </div>
                                </div>
                                <div className="flex pt-4 justify-content-start">
                                    <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current?.prevCallback?.()} />
                                </div>
                            </StepperPanel>
                        </Stepper>
                    </div>
                </div>
            </div>
        </div>
    </Dialog>

}


export default ViewCard