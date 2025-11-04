import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

interface Props {
  onHide: () => void;
  onSuccess: () => void;
}

const PaymentModal = ({ onHide, onSuccess }: Props) => {
  return (
    <Dialog
      header={
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <i className="pi pi-indian-rupee mr-4" />
            <span className="text-lg font-bold">Payment</span>
          </div>
        </div>
      }
      visible
      onHide={onHide}
      draggable={false}
      resizable={false}
      style={{ width: "400px" }}>
      Cashfree/PhonePE integration
      <div className="mt-4" />
      <Button onClick={onSuccess} className="update-btn">
        Purchase for 251
      </Button>
    </Dialog>
  );
};

export default PaymentModal;
