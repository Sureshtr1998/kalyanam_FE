import { Button } from "primereact/button";
import api from "../../utils/api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useToast } from "../../components/toastProvider/ToastProvider";
import { useNavigate } from "react-router-dom";
import { getItem, removeItem, user_login_token } from "../../utils/localStore";
import "./Accounts.scss";
import { useEffect, useState } from "react";
import PaymentModal from "../../components/paymentModal/PaymentModal";
import {
  PURCHASE_INTEREST_FEE,
  PURCHASE_NO_INTEREST,
} from "../../utils/constants";
import type { UserDetails } from "../../utils/interfaces";
import Spinner from "../../components/spinner/Spinner";
import TransactionDashboard from "./transactions/Transactions";

interface Props {
  data: UserDetails;
}

const Accounts = (props: Props) => {
  const { data } = props;

  const [userData, setUserData] = useState<UserDetails>(data);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setUserData(data);
  }, [data]);

  const [isLoading, setIsLoading] = useState(false);

  const [isPayment, setPayment] = useState<boolean>(false);

  const { fullName, mobile, email } = getItem(user_login_token) ?? {};

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

  const handleSuccess = async (orderId: string) => {
    try {
      setIsLoading(true);

      const payload = {
        orderId,
        amount: PURCHASE_INTEREST_FEE,
        noOfInterest: PURCHASE_NO_INTEREST,
      };

      const res = await api.post("/buy-interest", payload);
      setUserData(res.data.profile);
      showToast(
        "success",
        "Purchased Successful",
        "You have purchased interests successfully"
      );
      setIsLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showToast(
        "error",
        "Purchase Failed",
        err.response?.data?.msg || "Server error"
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <ConfirmDialog />
      <Spinner hideText isLoading={isLoading} />

      {isPayment && (
        <PaymentModal
          onSuccess={handleSuccess}
          onHide={() => setPayment(false)}
          userName={fullName}
          userEmail={email}
          userPhone={mobile}
          amount={PURCHASE_INTEREST_FEE}
        />
      )}

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
        <div className="text-center custom-dashboard">
          <TransactionDashboard data={userData} />
          <div className="mt-8">
            <Button
              label={`Buy ${PURCHASE_NO_INTEREST} Interests`}
              icon="pi pi-lock-open"
              className="p-button-sm p-button-accent"
              onClick={() => setPayment(true)}
            />
          </div>
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

export default Accounts;
