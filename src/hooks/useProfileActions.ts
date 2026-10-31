import { useState } from "react";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import api from "@/utils/api";
import type { UserDetails } from "@/utils/interfaces";
import { errorMessage } from "@/lib/errors";

/** Shortlist / interest / block / report for one profile. */
export const useProfileActions = (
  profile: UserDetails,
  onRemoved?: (id: string, usedInterests?: number) => void
) => {
  const { user, setUser, refresh } = useUser();
  const id = profile._id ?? "";
  const [busy, setBusy] = useState(false);
  const saved = (user.shortlisted ?? []).some((s) => String(s) === id);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (err) {
      toast.error("Something went wrong", { description: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  const toggleShortlist = () =>
    run(async () => {
      const res = await api.post<{ shortlisted: string[]; msg: string }>("/shortlist", { userId: id });
      setUser({ ...user, shortlisted: res.data.shortlisted });
      toast.success(res.data.msg);
    });

  const sendInterest = () =>
    run(async () => {
      await api.post("/send-interest", { receiverId: id });
      toast.success(`Interest sent to ${profile.basic.fullName}`, {
        description: "We've emailed them. Track replies under Activity.",
      });
      onRemoved?.(id, 1);
      void refresh();
    });

  const block = () =>
    run(async () => {
      await api.post("/hide-profile", { userId: id });
      toast.success("Blocked", {
        description: "Neither of you will see the other. Undo any time from Activity, Blocked.",
      });
      onRemoved?.(id);
    });

  const report = (reason: string, details: string) =>
    run(async () => {
      const res = await api.post<{ msg: string }>("/report-profile", { userId: id, reason, details });
      toast.success("Report sent", { description: res.data.msg });
      onRemoved?.(id);
    });

  return { id, busy, saved, toggleShortlist, sendInterest, block, report };
};
