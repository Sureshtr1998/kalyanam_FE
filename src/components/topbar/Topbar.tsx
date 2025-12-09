import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { useNavigate, useLocation } from "react-router-dom";
import { getItem, removeItem, user_login_token } from "../../utils/localStore";
import Filter from "../filter/Filter";
import type { UserDetails } from "../../utils/interfaces";
import "./Topbar.scss";
import { formDefaultVals } from "../../utils/constants";
import api from "../../utils/api";
import Spinner from "../spinner/Spinner";
import { useToast } from "../toastProvider/ToastProvider";
import { getInitials } from "../../utils/utils";

interface Props {
  applyFilter?: (filterData: UserDetails) => void;
}

const Topbar = ({ applyFilter }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const menu = useRef<Menu>(null);
  const { showToast } = useToast();

  const [visible, setVisible] = useState(false);
  const [userData, setUserData] = useState<UserDetails>(formDefaultVals);

  useEffect(() => {
    if (location.pathname === "/home" || location.pathname === "/account") {
      fetchUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/my-profile");
      if (!res.data.profile?.hasCompleteProfile) {
        navigate("/profile");
      }
      setUserData(res.data.profile);
      applyFilter?.(res.data.profile);
      setIsLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showToast(
        "error",
        "Error",
        err.response?.data?.msg || "Unable to load user data"
      );
      setIsLoading(false);
    }
  };

  const filterHandler = (filterData: UserDetails) => {
    setUserData({
      ...userData,
      partner: filterData.partner,
    });
    applyFilter?.(filterData);
  };

  const avatarMenuItems = [
    {
      label: "Profile",
      icon: "pi pi-user-edit",
      command: () => navigate("/profile"),
    },
    {
      label: "Activity",
      icon: "pi pi-bolt",
      command: () => navigate("/activity"),
    },
    {
      label: "Account",
      icon: "pi pi-cog",
      command: () => navigate("/account"),
    },
    {
      separator: true,
    },
    {
      label: "Sign Out",
      icon: "pi pi-sign-out",
      className: "signout-item",
      command: () => {
        removeItem(user_login_token);
        navigate("/");
      },
    },
  ];

  return (
    <div className="topbar-container">
      <Spinner isLoading={isLoading} />

      <div className="topbar-content">
        {/* Left: Filter or Home */}
        <div className="left-section">
          {location.pathname === "/home" ? (
            <>
              <Sidebar
                header="Filter"
                className="sidebar-filter"
                visible={visible}
                onHide={() => setVisible(false)}>
                {userData && (
                  <Filter
                    applyFilter={filterHandler}
                    userData={userData}
                    onHide={() => setVisible(false)}
                  />
                )}
              </Sidebar>
              <Button
                icon="pi pi-filter"
                className="filter-btn p-button-text"
                onClick={() => setVisible(true)}
                tooltip="Open Filter"
              />
            </>
          ) : (
            <Button
              icon="pi pi-home"
              style={{ fontSize: "2rem" }}
              className="filter-btn p-button-text"
              onClick={() => navigate("/home")}
              tooltip="Go to Home"
            />
          )}
        </div>

        <div className="logo-text hidden md:block">
          Seetha Rama <span>Kalyana</span>
        </div>

        {/* Right: User Avatar & Menu */}
        <div className="right-section">
          <Menu model={avatarMenuItems} popup ref={menu} />
          <Avatar
            label={
              getItem(user_login_token)?.fullName
                ? getInitials(getItem(user_login_token).fullName)
                : "OM"
            }
            shape="circle"
            className="avatar-icon"
            onClick={(e) => menu.current?.toggle(e)}
          />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
