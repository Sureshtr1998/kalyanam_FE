import { useEffect, useState } from "react";
import { DataTable, type DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import Topbar from "../../components/topbar/Topbar";
import api from "../../utils/api";
import "./Invitations.scss";
import type { UserDetails } from "../../utils/interfaces";
import ViewCard from "../../components/viewCard/ViewCard";
import { useToast } from "../../components/toastProvider/ToastProvider";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';



const Invitations = () => {
    const [invitations, setInvitations] = useState<UserDetails[]>([]);
    const [user, setUser] = useState<UserDetails>();
    const [loading, setLoading] = useState<boolean>(false);

    const { showToast } = useToast();


    useEffect(() => {
        init();
    }, []);

    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const globalValue =
        (filters["global"] as { value: string | null })?.value ?? "";


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

    const handleAction = async (id: string | undefined, action: 'accept' | 'decline') => {
        try {
            const res = await api.post('/interest-action', { userId: id, action });

            setInvitations(prev =>
                prev.map(user =>
                    user._id === id
                        ? { ...user, invitationStatus: action }
                        : user
                )
            );

            showToast("success", "Success", res.data.msg || '');

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


    const renderHeader = () => {
        return <div className="flex justify-content-end">
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText value={globalValue} onChange={(e) =>
                    setFilters({
                        ...filters,
                        global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS },
                    })
                }
                    placeholder="Search invitations..."

                />
            </IconField>
        </div>


    }

    return (
        <div>
            <Topbar />
            {user && <ViewCard user={user} hide={() => setUser(undefined)} isAccept={user.invitationStatus === 'accept'} />}

            <div className="invitations-container mt-16">
                <DataTable
                    value={invitations}
                    filters={filters}
                    onFilter={(e) => setFilters(e.filters)}
                    globalFilterFields={[
                        "uniqueId",
                        "fullName",
                        "gotra",
                        "motherTongue",
                        "subCaste",
                    ]}
                    paginator
                    rows={7}
                    loading={loading}
                    emptyMessage="No invitations found"
                    showGridlines
                    tableStyle={{ minWidth: "60rem" }}
                    header={renderHeader()}
                >
                    <Column field="uniqueId" header="ID" />
                    <Column field="fullName" header="Name" />
                    <Column field="age" header="Age" />
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
