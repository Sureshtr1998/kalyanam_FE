import api from "./api";

export const sendReport = async (payload: unknown) => {
  await api.post("/report", { error: payload }).catch(() => {});
};
