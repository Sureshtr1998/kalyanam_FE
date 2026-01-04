import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import "./RegisterNote.scss";
import { SUPPORT_EMAIL } from "../../utils/constants";

interface Props {
  onHide: () => void;
  onAccept: () => void;
}

const RegisterNote = ({ onHide, onAccept }: Props) => {
  return (
    <Dialog
      header={
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <i className="pi pi-pen-to-square mr-4 mt-1" />
            <span className="text-lg font-bold">Note</span>
          </div>
        </div>
      }
      visible
      onHide={onHide}
      draggable={false}
      resizable={false}
      style={{ width: "500px", maxWidth: "90vw" }}
      className="register-note-dialog">
      <div className="space-y-3 text-sm leading-relaxed text-gray-800">
        <p>
          <strong>1)</strong> We’re in an active growth phase right now. You’ll
          see more profiles appearing on a regular basis.
        </p>

        <p>
          <strong>2)</strong> You’ll receive email notifications whenever
          someone sends you an interest or accepts your interest.
        </p>

        <p>
          <strong>3)</strong> After registration, you can view profiles and use
          interests based on your plan. All memberships are one-time and fully
          transparent.
        </p>

        <p>
          <strong>4)</strong> For any issues or special assistance, please
          contact{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-[#e07b00] font-medium hover:underline">
            {SUPPORT_EMAIL}
          </a>
          . We’ll respond to your query within <strong>24 hours</strong>.
        </p>
      </div>

      <div className="flex justify-center mt-6">
        <Button onClick={onAccept} className="update-btn">
          Okay, I Understand
        </Button>
      </div>
    </Dialog>
  );
};

export default RegisterNote;
