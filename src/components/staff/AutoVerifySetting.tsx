import { useCallback, useEffect, useState } from "react";
import { Clock, Power, PowerOff } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmButton } from "@/components/staff/MemberSheet";
import api from "@/utils/api";
import { formatInstant } from "@/lib/dates";
import { errorMessage } from "@/lib/errors";

interface AutoVerifyState {
  enabled: boolean;
  updatedBy: string | null;
  updatedAt: string | null;
  /** Unverified members who asked for help with their codes. */
  waiting: number;
}

/**
 * Admin: auto-verify mode. When on, a member who copied the "can't verify" help message
 * (OtpVerifyDialog) and is still unverified 4 hours later is verified automatically.
 */
export const AutoVerifySetting = ({ onChanged }: { onChanged?: () => void }) => {
  const [data, setData] = useState<AutoVerifyState | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api
      .get<AutoVerifyState>("/manage/auto-verify")
      .then((res) => setData(res.data))
      .catch(() => setData(null));
  }, []);
  useEffect(load, [load]);

  const set = async (enabled: boolean) => {
    setBusy(true);
    try {
      const res = await api.post<AutoVerifyState & { msg: string }>("/manage/auto-verify", { enabled });
      setData(res.data);
      toast.success(res.data.msg);
      onChanged?.();
    } catch (err) {
      toast.error("Couldn't change auto-verify", { description: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  if (!data) return null;

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <p className="flex flex-wrap items-center gap-2 font-semibold">
          <Clock className="size-4 text-primary" /> Auto-verify help requests
          {data.enabled ? (
            <Badge className="bg-success text-white">On</Badge>
          ) : (
            <Badge variant="outline">Off</Badge>
          )}
          {data.waiting > 0 && <Badge variant="secondary">{data.waiting} asked for help</Badge>}
        </p>
        <p className="text-sm text-muted-foreground">
          Members who can't get their codes copy a help message. When this is on, anyone still unverified 4 hours
          after asking is verified automatically, with the email and number they entered (unchecked by OTP).
          {data.updatedAt && (
            <> Last changed {formatInstant(data.updatedAt, true)}{data.updatedBy ? ` by ${data.updatedBy}` : ""}.</>
          )}
        </p>
      </div>
      {data.enabled ? (
        <Button variant="outline" disabled={busy} onClick={() => void set(false)}>
          <PowerOff /> Turn off
        </Button>
      ) : (
        <ConfirmButton
          icon={<Power />}
          label="Turn on"
          disabled={busy}
          title="Turn on auto-verify?"
          description="Members who asked for help and are still unverified after 4 hours will be verified without an OTP check, including anyone already waiting that long. Their email and WhatsApp number won't have been confirmed, so a wrong number stays wrong."
          confirm="Turn on"
          onConfirm={() => void set(true)}
        />
      )}
    </div>
  );
};
