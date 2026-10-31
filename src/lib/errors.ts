import { isAxiosError } from "axios";

/** Best user-facing message from an API error. */
export const errorMessage = (err: unknown, fallback = "Something went wrong") => {
  if (isAxiosError(err)) {
    const data = err.response?.data as { msg?: string; error?: string } | undefined;
    if (data?.msg) return data.msg;
    if (data?.error) return data.error;
    if (!err.response) return "Can't reach the server. Check your connection and try again.";
  }
  return fallback;
};
