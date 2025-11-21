/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { DataTable, type DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Avatar } from "primereact/avatar";
import api from "../../utils/api";
import "./Invitations.scss";
import type { UserDetails } from "../../utils/interfaces";
import ViewCard from "../../components/viewCard/ViewCard";
import { useToast } from "../../components/toastProvider/ToastProvider";
import { FilterMatchMode } from "primereact/api";
import FormInput from "../../components/fields/FormInput";
import { getInitials } from "../../utils/utils";

const Invitations = () => {
  const [invitations, setInvitations] = useState<UserDetails[]>([]);
  const [user, setUser] = useState<UserDetails>();
  const [currentUser, setCurrentUser] = useState<UserDetails>();
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
        setCurrentUser(res.data.currentUser);
      }
      setLoading(false);
    } catch (err: any) {
      showToast(
        "error",
        "Error",
        err.response?.data?.msg || "Unable to load invitations"
      );
      setLoading(false);
    }
  };

  const handleAction = async (
    id: string | undefined,
    action: "accept" | "decline"
  ) => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await api.post("/interest-action", { userId: id, action });

      setInvitations((prev) =>
        prev.map((user) =>
          user._id === id
            ? {
                ...user,
                interests: { ...user.interests, invitationStatus: action },
              }
            : user
        )
      );

      showToast("success", "Success", res.data.msg || "Action successful");
      setLoading(false);
    } catch (err: any) {
      showToast(
        "error",
        "Error",
        err.response?.data?.msg || "Something went wrong"
      );
      setLoading(false);
    }
  };

  type InvitationStatus = "received" | "accept" | "decline" | "sent";

  const getStatusSeverity = (status: InvitationStatus) => {
    switch (status) {
      case "accept":
        return "success";
      case "decline":
        return "danger";
      case "sent":
        return "warning";
      case "received":
        return "info";
      default:
        return "info";
    }
  };

  const getStatusLabel = (status: InvitationStatus) => {
    switch (status) {
      case "accept":
        return "Accepted";
      case "decline":
        return "Declined";
      case "sent":
        return "Pending";
      case "received":
        return "Action Required";
      default:
        return "Unknown";
    }
  };

  const profileBodyTemplate = (rowData: UserDetails) => {
    const name = rowData.basic?.fullName || "N/A";
    const id = rowData.basic?.uniqueId || "...";
    const initials = getInitials(name);

    return (
      <div className="profile-cell">
        <Avatar label={initials} shape="circle" />
        <div>
          <strong className="profile-name">{name}</strong>
          <br />
          <small className="profile-id">{id}</small>
        </div>
      </div>
    );
  };

  const statusAndActionTemplate = (rowData: UserDetails) => {
    const status = rowData.interests?.invitationStatus as InvitationStatus;

    if (status === "received") {
      return (
        <div className="flex gap-2">
          <Button
            label="Accept"
            icon="pi pi-check"
            className="p-button-success p-button-sm"
            onClick={() => handleAction(rowData._id, "accept")}
            loading={loading}
          />
          <Button
            label="Decline"
            icon="pi pi-times"
            className="p-button-danger p-button-sm mr-4"
            onClick={() => handleAction(rowData._id, "decline")}
            loading={loading}
          />
        </div>
      );
    }

    return (
      <Tag
        value={getStatusLabel(status)}
        severity={getStatusSeverity(status)}
      />
    );
  };

  const viewProfileTemplate = (rowData: UserDetails) => (
    <Button
      label="View Profile"
      icon="pi pi-user"
      className="normal-btn"
      onClick={() => setUser(rowData)}
    />
  );

  return (
    <div>
      {user && (
        <ViewCard
          user={user}
          hide={() => setUser(undefined)}
          isAccept={user.interests?.invitationStatus === "accept"}
          currentUser={currentUser}
        />
      )}
      <div className="filter-field">
        <FormInput
          name="search"
          placeholder="Search by Name or ID..."
          value={globalValue}
          onChange={(e) =>
            setFilters({
              ...filters,
              global: {
                value: e.target.value,
                matchMode: FilterMatchMode.CONTAINS,
              },
            })
          }
          icon="pi pi-search"
        />
      </div>
      <div className="profiles-container">
        <DataTable
          value={invitations}
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          globalFilterFields={["basic.uniqueId", "basic.fullName"]}
          paginator
          rows={7}
          loading={loading}
          emptyMessage="No invitations found"
          dataKey="_id"
          className="p-datatable-srk">
          <Column
            header="Profile"
            body={profileBodyTemplate}
            style={{ minWidth: "200px" }}
          />

          <Column
            header="View"
            body={viewProfileTemplate}
            style={{ width: "160px" }}
          />

          <Column
            header="Status / Action"
            body={statusAndActionTemplate}
            style={{ width: "280px" }}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default Invitations;
