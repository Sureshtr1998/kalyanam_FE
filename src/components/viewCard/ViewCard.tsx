import { Dialog } from "primereact/dialog";
import type { UserDetails } from "../../utils/interfaces";
import "./ViewCard.scss";
import Profile from "../../screens/profile/Profile";
import { Message } from "primereact/message";

const ViewCard = (props: {
  user: UserDetails;
  hide: () => void;
  isAccept?: boolean;
}) => {
  const { user, hide, isAccept } = props;

  return (
    <Dialog
      draggable={false}
      resizable={false}
      visible={true}
      header={<div className="header-dialog"> {user.basic.fullName}</div>}
      onHide={hide}
      className="card-dialog">
      <div>
        <div className="mb-4 text-center">
          {!isAccept && (
            <Message
              severity="info"
              text="The Mobile Number and Email Id will be visible under Basic Details only after mutual acceptance."
              className="info-msg"
            />
          )}
        </div>
        <Profile user={user} />
      </div>
    </Dialog>
  );
};

export default ViewCard;
