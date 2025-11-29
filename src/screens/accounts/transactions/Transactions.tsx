/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import type { UserDetails } from "../../../utils/interfaces";
import "./Transactions.scss";
import { remainingInterest } from "../../../utils/utils";

interface Props {
  data: UserDetails;
}

const TransactionDashboard = (props: Props) => {
  const { data } = props;
  const interestStats = useMemo(() => {
    const totalPurchased = data.interests?.totalNoOfInterest ?? 0;

    const used =
      (data.interests?.sent?.length ?? 0) +
      (data.interests?.viewed?.length ?? 0) * 5;

    const pending = remainingInterest(data);

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

  const IdBodyTemplate = (rowData: any, isOrder: boolean) => {
    const fullId = isOrder ? rowData.orderId : rowData.paymentId;
    const truncatedId = fullId ? fullId.substring(0, 15) + "..." : "";
    const copyText = isOrder ? "Copy full Order ID" : "Copy full Payment ID";

    const handleCopy = async () => {
      await navigator.clipboard.writeText(fullId);
    };

    return (
      <div className="flex items-center">
        <span style={{ marginRight: "0.5rem" }}>{truncatedId}</span>
        <Button
          icon="pi pi-copy"
          className="p-button-rounded mt-2 p-button-text p-button-sm"
          tooltip={copyText}
          onClick={handleCopy}
          style={{ color: "#d97706" }}
        />
      </div>
    );
  };

  return (
    <div className="p-m-4">
      <Card>
        <div className="flex flex-wrap w-full">
          <div className="flex flex-col items-center w-full md:w-1/3">
            <StatsValue
              title="Total Purchased"
              value={interestStats.totalPurchased}
              color="#d97706"
            />
          </div>

          <div className="flex flex-col items-center w-full md:w-1/3">
            <StatsValue
              title="Used"
              value={interestStats.used}
              color="#78350f"
            />
          </div>

          <div className="flex flex-col items-center w-full md:w-1/3">
            <StatsValue
              title="Pending"
              value={interestStats.pending}
              color="#f59e0b"
            />
          </div>
        </div>
      </Card>

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
          body={(rowData) => IdBodyTemplate(rowData, true)}
          style={{ minWidth: "9rem" }}
        />
        <Column
          field="paymentId"
          header="Payment ID"
          body={(rowData) => IdBodyTemplate(rowData, false)}
          style={{ minWidth: "9rem" }}
        />
        <Column
          field="amountPaid"
          header="Amount Paid"
          body={amountBodyTemplate}
          style={{ minWidth: "9rem" }}
        />
        <Column
          field="noOfInterest"
          style={{ minWidth: "9rem" }}
          header="Interests Added"
        />
        <Column field="note" header="Note" style={{ minWidth: "9rem" }} />
        <Column
          field="dateOfTrans"
          header="Transaction Date"
          body={dateBodyTemplate}
          style={{ minWidth: "9rem" }}
        />
      </DataTable>
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
