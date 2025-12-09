export type InvitationStatus = "received" | "accept" | "decline" | "sent";

export const getStatusSeverity = (status: InvitationStatus) => {
    switch (status) {
        case "accept":
            return "success";
        case "decline":
            return "danger";
        case "sent":
            return "warning";
        case "received":
            return "info";
        default:
            return "info";
    }
};

export const getStatusLabel = (status: InvitationStatus) => {
    switch (status) {
        case "accept":
            return "Accepted";
        case "decline":
            return "Declined";
        case "sent":
            return "Pending";
        case "received":
            return "Action Required";
        default:
            return "Unknown";
    }
};