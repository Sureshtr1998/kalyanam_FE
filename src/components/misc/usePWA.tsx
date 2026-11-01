import { reloadApp, usePWAState } from "@/lib/pwa";

export const usePWA = () => {
  const { updateAvailable } = usePWAState();
  return { updateAvailable, reloadApp };
};
