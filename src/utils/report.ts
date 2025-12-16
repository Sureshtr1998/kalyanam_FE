import api from "./api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendReport = async (payload: any) => {
    await api
        .post("/report", {
            error: payload,
        })
        .catch(() => { });
}