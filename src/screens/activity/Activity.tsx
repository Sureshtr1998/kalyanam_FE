/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterMatchMode } from "primereact/api";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { type DataTableFilterMeta, DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { useState, useEffect } from "react";
import FormInput from "../../components/fields/FormInput";
import Spinner from "../../components/spinner/Spinner";
import { useToast } from "../../components/toastProvider/ToastProvider";
import ViewCard from "../../components/viewCard/ViewCard";
import type { UserDetails } from "../../utils/interfaces";
import { getInitials } from "../../utils/utils";
import api from "../../utils/api";
import {
  getStatusLabel,
  getStatusSeverity,
  type InvitationStatus,
} from "./helper";
import { TabView, TabPanel } from "primereact/tabview";
import "./Activity.scss";
import { useLocation } from "react-router-dom";

const Activity = () => {
  const [usersActivity, setUsersActivity] = useState<UserDetails[]>([]);
  const [user, setUser] = useState<UserDetails>();
  const [currentUser, setCurrentUser] = useState<UserDetails>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const { showToast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.from === "card") {
      setActiveIndex(1);
    }
  }, [location.state?.from]);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const globalValue =
    (filters["global"] as { value: string | null })?.value ?? "";

  const init = async () => {
    try {
      setIsLoading(true);
      let endpoint = "/fetch-invitation-status";
      if (activeIndex === 1) {
        endpoint = "/view-contact";
      } else if (activeIndex === 2) {
        endpoint = "/hidden-profiles";
      }
      const res = await api.get(endpoint);
      if (res.data?.activities) {
        setUsersActivity(res.data.activities);
        setCurrentUser(res.data.currentUser);
      }
      setIsLoading(false);
    } catch (err: any) {
      showToast(
        "error",
        "Error",
        err.response?.data?.msg || "Unable to load activities"
      );
      setIsLoading(false);
    }
  };

  const handleInvitationAction = async (
    id: string | undefined,
    action: "accept" | "decline"
  ) => {
    if (!id) return;
    try {
      setIsLoading(true);
      const res = await api.post("/interest-action", { userId: id, action });

      setUsersActivity((prev) =>
        prev.map((user) =>
          user._id === id
            ? {
                ...user,
                interests: { ...user.interests, invitationStatus: action },
              }
            : user
        )
      );

      if (action === "accept") await init();

      showToast("success", "Success", res.data.msg || "Action successful");
      setIsLoading(false);
    } catch (err: any) {
      showToast(
        "error",
        "Error",
        err.response?.data?.msg || "Something went wrong"
      );
      setIsLoading(false);
    }
  };

  const handleHiddenProfileAction = async (id: string | undefined) => {
    if (!id) return;
    try {
      setIsLoading(true);
      const res = await api.post("/unhide-profile", { userId: id });

      setUsersActivity((prev) => prev.filter((user) => user._id !== id));

      showToast("success", "Success", res.data.msg || "Action successful");
      setIsLoading(false);
    } catch (err: any) {
      showToast(
        "error",
        "Error",
        err.response?.data?.msg || "Something went wrong"
      );
      setIsLoading(false);
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

  const invitationsActionTemplate = (rowData: UserDetails) => {
    const status = rowData.interests?.invitationStatus as InvitationStatus;

    if (status === "received") {
      return (
        <div className="flex gap-2">
          <Button
            label="Accept"
            icon="pi pi-check"
            className="p-button-success p-button-sm"
            onClick={() => handleInvitationAction(rowData._id, "accept")}
            loading={isLoading}
          />
          <Button
            label="Decline"
            icon="pi pi-times"
            className="p-button-danger p-button-sm mr-4"
            onClick={() => handleInvitationAction(rowData._id, "decline")}
            loading={isLoading}
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

  const hiddenProfileActionTemplate = (rowData: UserDetails) => (
    <Button
      label="Unhide Profile"
      icon="pi pi-eye"
      onClick={() => handleHiddenProfileAction(rowData._id)}
      className="normal-btn"
    />
  );

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
      <Spinner isLoading={isLoading} />

      {user && (
        <ViewCard
          user={user}
          hide={() => setUser(undefined)}
          isAccept={user.interests?.invitationStatus === "accept"}
          currentUser={currentUser}
        />
      )}
      <div className="flex flex-wrap sm:flex-nowrap ">
        <div className="filter-field w-full sm:w-auto">
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

        <TabView
          scrollable
          className="activity-tab"
          activeIndex={activeIndex}
          onTabChange={(e) => {
            setActiveIndex(e.index);
            setFilters({
              ...filters,
              global: {
                value: null,
                matchMode: FilterMatchMode.CONTAINS,
              },
            });
          }}>
          <TabPanel
            header="Invitation Status"
            leftIcon="pi pi-history mr-2"></TabPanel>
          <TabPanel
            header="Viewed Numbers"
            leftIcon="pi pi-phone mr-2"></TabPanel>
          <TabPanel
            header="Hidden Profiles"
            leftIcon="pi pi-eye-slash mr-2"></TabPanel>
        </TabView>
      </div>

      <div className="profiles-container">
        {activeIndex === 2 && (
          <p className="mb-4" style={{ fontSize: "0.9rem", color: "#555" }}>
            <strong>Note:</strong> All profiles listed here have been hidden by
            you, they are also restricted from viewing your profile.
          </p>
        )}
        <DataTable
          value={usersActivity}
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          globalFilterFields={["basic.uniqueId", "basic.fullName"]}
          paginator
          rows={7}
          emptyMessage="No data found"
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

          {(activeIndex === 0 || activeIndex === 2) && (
            <Column
              header="Action"
              body={
                activeIndex === 0
                  ? invitationsActionTemplate
                  : hiddenProfileActionTemplate
              }
              style={{ width: "280px" }}
            />
          )}
        </DataTable>
      </div>
    </div>
  );
};

export default Activity;
