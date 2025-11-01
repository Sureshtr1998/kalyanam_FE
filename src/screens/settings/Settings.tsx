import { Button } from "primereact/button";
import "./Settings.scss";
import api from "../../utils/api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useToast } from "../../components/toastProvider/ToastProvider";
import { useNavigate } from "react-router-dom";
import { removeItem, user_login_token } from "../../utils/localStore";
import "./Settings.scss";

const Settings = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const logOff = () => {
    removeItem(user_login_token);
    navigate("/");
  };

  const deleteAcct = () => {
    confirmDialog({
      message:
        "Are you sure you want to delete your account? This action cannot be undone.",
      header: "Confirm Deletion",
      draggable: false,
      closable: false,
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Yes, Delete",
      rejectLabel: "Cancel",
      acceptClassName: "p-button-danger",
      accept: handleDeleteConfirm,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await api.delete("/delete-account");
      showToast(
        "success",
        "Deleted",
        res.data?.msg || "Account deleted successfully"
      );
      logOff();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showToast(
        "success",
        "Deleted",
        err.response?.data?.msg || "Failed to delete account"
      );
    }
  };

  const handleHideConfirm = async () => {
    try {
      const res = await api.post("/hide-profile");
      showToast("success", "Success", res.data.msg || "");
      logOff();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showToast(
        "error",
        "Error",
        err.response?.data?.msg || "Failed to hide profile"
      );
    }
  };

  return (
    <div className="p-4">
      <ConfirmDialog />

      <div className="profile-settings-card">
        <h2 className="card-title">Profile Visibility</h2>
        <p className="card-description">
          Hide your account? You will be logged out. Your profile will
          automatically become visible when you log in again.
        </p>
        <div className="toggle-container">
          <span className="toggle-label">Hide Profile from all members</span>
          <label className="toggle-switch">
            <input
              onClick={handleHideConfirm}
              type="checkbox"
              id="hide-profile-toggle"
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="profile-settings-card">
        <h2 className="card-title">Transaction History</h2>
        <div className="text-center">
          <p> Payment Records</p>
        </div>
      </div>

      <div className="delete-account-card">
        <h2 className="delete-title">Delete Account</h2>
        <p className="delete-warning">
          This action is irreversible and will permanently remove your profile
          and data.
        </p>
        <Button onClick={deleteAcct} className="delete-btn">
          Permanently Delete Account
        </Button>
      </div>
    </div>
  );
};

export default Settings;
