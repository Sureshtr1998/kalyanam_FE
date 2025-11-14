/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import type { UserDetails } from "../../../utils/interfaces";
import "./Transactions.scss";

interface Props {
  data: UserDetails;
}

const TransactionDashboard = (props: Props) => {
  const { data } = props;
  const interestStats = useMemo(() => {
    const totalPurchased =
      data.transactions?.reduce((sum, t) => sum + (t.noOfInterest ?? 0), 0) ??
      0;

    const used = data.interests?.sent?.length ?? 0;

    const pending = totalPurchased - used;

    return {
      totalPurchased,
      used,
      pending: Math.max(0, pending),
    };
  }, [data.transactions, data.interests]);

  const dateBodyTemplate = (rowData: any) => {
    const date = new Date(rowData.dateOfTrans);
    if (isNaN(date.getTime())) {
      return rowData.dateOfTrans;
    }
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const amountBodyTemplate = (rowData: any) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(rowData.amountPaid);
  };

  const orderIdBodyTemplate = (rowData: any) => {
    const fullId = rowData.orderId;
    const truncatedId = fullId ? fullId.substring(0, 15) + "..." : "";

    const handleCopy = async () => {
      await navigator.clipboard.writeText(fullId);
    };

    return (
      <div className="flex items-center">
        <span style={{ marginRight: "0.5rem" }}>{truncatedId}</span>
        <Button
          icon="pi pi-copy"
          className="p-button-rounded mt-2 p-button-text p-button-sm"
          tooltip="Copy full Order ID"
          onClick={handleCopy}
          style={{ color: "#d97706" }}
        />
      </div>
    );
  };

  return (
    <div className="p-m-4">
      <Card>
        <div className="flex justify-between w-full flex-wrap">
          <div className="flex flex-col items-center flex-1">
            <StatsValue
              title="Total Purchased"
              value={interestStats.totalPurchased}
              color="#d97706"
            />
          </div>
          <div className="flex flex-col items-cente flex-1r">
            <StatsValue
              title="Used"
              value={interestStats.used}
              color="#78350f"
            />
          </div>
          <div className="flex flex-col items-center flex-1">
            <StatsValue
              title="Pending"
              value={interestStats.pending}
              color="#f59e0b"
            />
          </div>
        </div>
      </Card>

      <Card className="custom-card-style">
        <DataTable
          value={data.transactions}
          stripedRows
          paginator
          rows={5}
          className="custom-datatable p-datatable-sm"
          emptyMessage="No transactions found.">
          <Column
            field="orderId"
            header="Order ID"
            body={orderIdBodyTemplate}
            style={{ width: "240px" }}
          />
          <Column
            field="amountPaid"
            header="Amount Paid"
            body={amountBodyTemplate}
          />
          <Column field="noOfInterest" header="Interests Added" />
          <Column field="note" header="Note" style={{ width: "200px" }} />
          <Column
            field="dateOfTrans"
            header="Transaction Date"
            body={dateBodyTemplate}
          />
        </DataTable>
      </Card>
    </div>
  );
};

interface StatsValueProps {
  title: string;
  value: number;
  color: string;
}

const StatsValue = ({ title, value, color }: StatsValueProps) => (
  <div
    className="p-text-center"
    style={{
      padding: "0.5rem",
    }}>
    <div className="p-text-bold" style={{ color: "#78350f" }}>
      {title}
    </div>
    <div
      className="p-text-xxl p-text-bold p-mt-2"
      style={{ color: color, fontSize: "2em" }}>
      {value}
    </div>
  </div>
);

export default TransactionDashboard;
