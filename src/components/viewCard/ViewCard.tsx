import { Dialog } from "primereact/dialog";
import type { UserDetails } from "../../utils/interfaces";
import "./ViewCard.scss";
import Profile from "../../screens/profile/Profile";
import { Button } from "primereact/button";
import { TEXT_COLOR } from "../../styles/variables";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useToast } from "../toastProvider/ToastProvider";
import Spinner from "../spinner/Spinner";
import { useNavigate } from "react-router-dom";
import { remainingInterest } from "../../utils/utils";

const ViewCard = (props: {
  user: UserDetails;
  hide: () => void;
  isAccept?: boolean;
  currentUser?: UserDetails;
}) => {
  const { user, hide, isAccept, currentUser } = props;
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [pendingInterests, setPendingInterests] = useState<number>(0);

  useEffect(() => {
    if (!currentUser) return;
    setPendingInterests(remainingInterest(currentUser));
  }, [currentUser]);

  const handleViewContact = () => {
    confirmDialog({
      message: `Viewing this contact costs 5 of your ${pendingInterests} interests, or send an interest and wait for mutual acceptance.`,
      header: "View Contact Details?",
      draggable: false,
      closable: false,
      icon: "pi pi-info-circle",
      acceptLabel: "Yes, View",
      rejectLabel: "Cancel",
      acceptClassName: "p-button-success",
      accept: handleViewConfirm,
    });
  };

  const handleViewConfirm = async () => {
    try {
      setIsLoading(true);
      await api.post("/view-contact", { receiverId: user._id });
      showToast(
        "success",
        "Success",
        "Request sent successfully, now you can view the profile under View Contact Section"
      );
      setIsLoading(false);
      navigate("/activity", { state: { from: "card" } });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      showToast(
        "error",
        "Error",
        err.response.data.msg || "Something went wrong"
      );
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      draggable={false}
      resizable={false}
      visible={true}
      header={<div className="header-dialog"> {user.basic.fullName}</div>}
      onHide={hide}
      className="card-dialog">
      <div>
        <ConfirmDialog />
        <Spinner isLoading={isLoading} />

        <div className="mb-4 mt-2 text-center">
          {!isAccept && (
            <div className="p-4 bg-white border border-amber-400 rounded-xl shadow-sm hover:bg-amber-50 transition duration-150 flex flex-col md:flex-row md:items-center mb-4">
              <div className="flex items-center mb-3 md:mb-0">
                <span className="flex items-center text-lg font-medium text-amber-900">
                  <i
                    style={{ fontSize: "1.2rem" }}
                    className="mr-4 icon-style pi pi-phone"
                  />
                  View Contact Details
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:ml-auto space-y-2 md:space-y-0 md:space-x-2 items-center md:items-start">
                <p
                  className={`px-3 self-center py-1 w-60 bg-amber-100 ${TEXT_COLOR} rounded-full font-semibold text-center`}>
                  Wait For Mutual Acceptance
                </p>

                <span className="self-center text-gray-400 font-medium block md:inline">
                  OR
                </span>

                <Button
                  onClick={handleViewContact}
                  disabled={pendingInterests < 5}
                  title={
                    pendingInterests < 5
                      ? "Purchase interests under Account to view contact."
                      : ""
                  }
                  className="normal-btn">
                  View for 5 Interests
                </Button>
              </div>
            </div>
          )}
        </div>
        <Profile user={user} />
      </div>
    </Dialog>
  );
};

export default ViewCard;
