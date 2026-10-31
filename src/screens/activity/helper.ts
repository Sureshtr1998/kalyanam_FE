export type InvitationStatus = "received" | "accept" | "decline" | "sent";

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