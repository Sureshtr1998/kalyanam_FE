import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import Topbar from "../../components/topbar/Topbar";
import api from "../../utils/api";
import "./Invitations.scss";
import type { UserDetails } from "../../utils/interfaces";
import ViewCard from "../../components/viewCard/ViewCard";
import { useToast } from "../../components/toastProvider/ToastProvider";



const Invitations = () => {
    const [invitations, setInvitations] = useState<UserDetails[]>([]);
    const [user, setUser] = useState<UserDetails>();
    const [loading, setLoading] = useState<boolean>(false);

    const { showToast } = useToast();


    useEffect(() => {
        init();
    }, []);


    const init = async () => {
        try {
            setLoading(true);
            const res = await api.get("/fetch-invitation-status");
            if (res.data?.invitations) {
                setInvitations(res.data.invitations);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string | undefined, action: string) => {
        try {
            await api.post('/interest-action', { userId: id, action });
            await init()
            showToast("success", "Success", "Interest sent successfully");

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            showToast("error", "Error", err.response.data.msg || "Something went wrong");
        }
    };




    const statusTemplate = (rowData: UserDetails) => {
        let colorClass = "";
        let label = "";

        if (rowData.invitationStatus !== 'received') {
            switch (rowData.invitationStatus) {
                case "accept":
                    colorClass = "text-green-700";
                    label = "Accepted";
                    break;
                case "decline":
                    colorClass = "text-red-700";
                    label = "Declined";
                    break;
                case "sent":
                    colorClass = "text-orange-500";
                    label = "Pending";
                    break;
                default:
                    colorClass = "text-gray-500";
                    label = "Unknown";
            }

            return <span className={`font-semibold ${colorClass}`}>{label}</span>;
        }


        return (
            <div className="flex gap-2">
                <Button
                    label="Accept"
                    icon="pi pi-check"
                    rounded
                    className="p-button-success p-button-sm"
                    onClick={() => handleAction(rowData._id, 'accept')}
                />
                <Button
                    label="Decline"
                    icon="pi pi-times"
                    rounded
                    className="p-button-danger p-button-sm"
                    onClick={() => handleAction(rowData._id, 'decline')}
                />
            </div>
        );
    };

    const viewProfileTemplate = (rowData: UserDetails) => (
        <Button
            label="View"
            icon="pi pi-user"
            className="p-button-sm"
            rounded
            style={{ backgroundColor: "#f8cb8e", borderColor: "orange" }}
            onClick={() => setUser(rowData)}
        />
    );




    return (
        <div>
            <Topbar />
            {user && <ViewCard user={user} hide={() => setUser(undefined)} />}

            <div className="invitations-container mt-16">

                <DataTable
                    value={invitations}
                    loading={loading}
                    showGridlines
                    tableStyle={{ minWidth: "60rem" }}
                    paginator
                    rows={7}
                    emptyMessage="No invitations found"
                >
                    <Column field="fullName" header="Name" />
                    <Column field="age" header="Age" />
                    <Column field="martialStatus" header="Martial Status" />
                    <Column field="gotra" header="Gotra" />
                    <Column field="motherTongue" header="Mother Tongue" />
                    <Column field="subCaste" header="Sub Caste" />
                    <Column header="Profile" body={viewProfileTemplate} />
                    <Column header="Status" body={statusTemplate} />

                </DataTable>
            </div>
        </div>
    );
};

export default Invitations;
