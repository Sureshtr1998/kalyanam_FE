/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { DataTable, type DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import api from "../../utils/api";
import type { UserDetails } from "../../utils/interfaces";
import ViewCard from "../../components/viewCard/ViewCard";
import { useToast } from "../../components/toastProvider/ToastProvider";
import { FilterMatchMode } from "primereact/api";
import FormInput from "../../components/fields/FormInput";
import { getInitials } from "../../utils/utils";

const HiddenProfiles = () => {
  const [hiddenProfiles, setHiddenProfiles] = useState<UserDetails[]>([]);
  const [user, setUser] = useState<UserDetails>();
  const [loading, setLoading] = useState<boolean>(false);
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState<UserDetails>();

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
      const res = await api.get("/hidden-profiles");
      if (res.data?.hiddenProfiles) {
        setHiddenProfiles(res.data.hiddenProfiles);
        setCurrentUser(res.data.currentUser);
      }
      setLoading(false);
    } catch (err: any) {
      showToast(
        "error",
        "Error",
        err.response?.data?.msg || "Unable to load profiles"
      );
      setLoading(false);
    }
  };

  const handleAction = async (id: string | undefined) => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await api.post("/unhide-profile", { userId: id });

      setHiddenProfiles((prev) => prev.filter((user) => user._id !== id));

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

  const statusAndActionTemplate = (rowData: UserDetails) => (
    <Button
      label="Unhide Profile"
      icon="pi pi-eye"
      onClick={() => handleAction(rowData._id)}
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
      <div className="hiddenProfiles-container">
        <DataTable
          value={hiddenProfiles}
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          globalFilterFields={["basic.uniqueId", "basic.fullName"]}
          paginator
          rows={7}
          loading={loading}
          emptyMessage="No Hidden Profiles found"
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
            header="Action"
            body={statusAndActionTemplate}
            style={{ width: "280px" }}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default HiddenProfiles;
