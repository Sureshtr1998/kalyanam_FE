import { useCallback, useEffect, useRef, useState } from "react";
import { Mail, MessageCircle, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Field } from "@/components/fields/Field";
import api from "@/utils/api";
import { errorMessage } from "@/lib/errors";
import { SUPPORT_EMAIL } from "@/utils/constants";

interface Props {
  email: string;
  mobile: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
}

const Otp = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <InputOTP maxLength={6} value={value} onChange={onChange} inputMode="numeric" pattern="^[0-9]*$">
    <InputOTPGroup>
      {Array.from({ length: 6 }).map((_, i) => (
        <InputOTPSlot key={i} index={i} className="size-11 bg-card text-base sm:size-12" />
      ))}
    </InputOTPGroup>
  </InputOTP>
);

/** Verifies the member's email + WhatsApp number with two OTPs. */
export const OtpVerifyDialog = ({ email, mobile, open, onOpenChange, onVerified }: Props) => {
  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const sentFor = useRef<string | null>(null);

  const send = useCallback(async () => {
    try {
      const res = await api.post("/send-otp", { email, mobile });
      toast.success("Codes sent", { description: res.data.msg });
      setTimer(60);
    } catch (err) {
      toast.error("Couldn't send codes", { description: errorMessage(err) });
      onOpenChange(false);
    }
  }, [email, mobile, onOpenChange]);

  useEffect(() => {
    const key = `${email}|${mobile}`;
    if (open && sentFor.current !== key) {
      sentFor.current = key;
      setEmailOtp("");
      setMobileOtp("");
      void send();
    }
    if (!open) sentFor.current = null;
  }, [open, email, mobile, send]);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const verify = async () => {
    setVerifying(true);
    try {
      await api.post("/verify-otp-registration", { emailOtp, mobileOtp });
      toast.success("Verified", { description: "Thank you, your contact details are confirmed." });
      onOpenChange(false);
      onVerified();
    } catch (err) {
      toast.error("Verification failed", { description: errorMessage(err, "Invalid code") });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-accent text-primary">
            <ShieldCheck className="size-6" />
          </div>
          <DialogTitle className="text-center font-display text-2xl">Verify your contact</DialogTitle>
          <DialogDescription className="text-center">
            We sent a 6-digit code to <b className="text-foreground">{email}</b> and another to
            WhatsApp <b className="text-foreground">+91 {mobile}</b>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-5 py-2">
          <Field
            label={
              <span className="flex items-center gap-1.5">
                <Mail className="size-4" /> Email code
              </span>
            }>
            <Otp value={emailOtp} onChange={setEmailOtp} />
          </Field>
          <Field
            label={
              <span className="flex items-center gap-1.5">
                <MessageCircle className="size-4" /> WhatsApp code
              </span>
            }>
            <Otp value={mobileOtp} onChange={setMobileOtp} />
          </Field>
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={verify}
          disabled={verifying || emailOtp.length !== 6 || mobileOtp.length !== 6}>
          {verifying ? "Verifying…" : "Verify & save profile"}
        </Button>

        <div className="space-y-2 text-center text-xs text-muted-foreground">
          <p>Didn't get it? Check your spam folder.</p>
          <Button variant="link" size="sm" disabled={timer > 0} onClick={send}>
            <RefreshCw />
            {timer > 0 ? `Resend codes in ${timer}s` : "Resend codes"}
          </Button>
          <p>
            Still stuck? Email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-primary hover:underline">
              {SUPPORT_EMAIL}
            </a>{" "}
            with your registered email and number.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
