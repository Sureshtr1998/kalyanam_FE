import { Button } from "primereact/button"
import Topbar from "../../components/topbar/Topbar"
import "./Settings.scss"
import api from "../../utils/api";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useToast } from "../../components/toastProvider/ToastProvider";
import { useNavigate } from "react-router-dom";
import { removeItem, user_login_token } from "../../utils/localStore";

const Settings = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();


    const logOff = () => {
        removeItem(user_login_token)
        navigate('/')
    }

    const deleteAcct = () => {
        confirmDialog({
            message: "Are you sure you want to delete your account? This action cannot be undone.",
            header: "Confirm Deletion",
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
            showToast('success', 'Deleted', res.data?.msg || "Account deleted successfully")
            logOff()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            showToast('success', 'Deleted', err.response?.data?.msg || "Failed to delete account")
        }
    };


    const hideAcct = () => {
        confirmDialog({
            message: "Hide your account? You will be logged out. Your profile will automatically become visible when you log in again.",
            header: "Confirm Hide Account",
            icon: "pi pi-eye-slash",
            acceptLabel: "Yes, Hide",
            rejectLabel: "Cancel",
            acceptClassName: "p-button-warning",
            rejectClassName: "p-button-secondary",
            accept: handleHideConfirm,
        });
    };

    const handleHideConfirm = async () => {
        try {
            const res = await api.post("/hide-profile");
            showToast('success', 'Success', res.data.msg || "")
            logOff()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            showToast('error', 'Error', err.response?.data?.msg || "Failed to hide profile")
        }
    };


    return <div>
        <Topbar />
        <ConfirmDialog />
        <div className=" mt-32 ml-8">
            <p> Transaction History, Subscription plans, remaining interests </p>
            <div className="action-items">
                <Button
                    label="Delete Account"
                    className="p-button-danger"
                    rounded
                    onClick={deleteAcct}
                />
                <Button
                    label={"Hide Profile"}
                    className="p-button-secondary"
                    rounded
                    onClick={hideAcct}
                />
            </div>
        </div>
    </div>

}


export default Settings