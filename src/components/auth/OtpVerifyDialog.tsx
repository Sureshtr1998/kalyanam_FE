import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Mail, MessageCircle, RefreshCw, ShieldCheck } from "lucide-react";
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
  name?: string;
  email: string;
  mobile: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Gets the verify response, which for partners carries the verification token. */
  onVerified: (data: { verificationToken?: string }) => void;
  /** Partners verify before they have an account, on their own endpoints. */
  variant?: "member" | "partner";
}

const VARIANTS = {
  member: {
    send: "/send-otp",
    verify: "/verify-otp-registration",
    button: "Verify & save profile",
    subject: "Help verifying my profile",
    who: "a member",
    ask: "Please help me verify my profile.",
  },
  partner: {
    send: "/broker-send-otp",
    verify: "/broker-verify-otp",
    button: "Verify & continue to payment",
    subject: "Help verifying my partner application",
    who: "a partner applicant",
    ask: "Please help me complete my partner registration.",
  },
};

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
export const OtpVerifyDialog = ({ name, email, mobile, open, onOpenChange, onVerified, variant = "member" }: Props) => {
  const v = VARIANTS[variant];
  const [copied, setCopied] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const sentFor = useRef<string | null>(null);

  const send = useCallback(async () => {
    try {
      const res = await api.post(v.send, { email, mobile });
      toast.success("Codes sent", { description: res.data.msg });
      setTimer(60);
    } catch (err) {
      toast.error("Couldn't send codes", { description: errorMessage(err) });
      onOpenChange(false);
    }
  }, [email, mobile, onOpenChange, v.send]);

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

  const helpSubject = v.subject;
  const helpMessage =
    `Namaste,\n\n` +
    `This is ${name?.trim() || v.who}, registered with mobile number +91 ${mobile} ` +
    `and email ID ${email}. I am not able to receive or enter the verification codes. ` +
    `${v.ask}\n\nThank you.`;

  const copyHelp = async () => {
    try {
      await navigator.clipboard.writeText(helpMessage);
      setCopied(true);
      toast.success("Message copied", { description: `Paste it in an email to ${SUPPORT_EMAIL}` });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy", { description: "Please select the text and copy it manually." });
    }
  };

  const verify = async () => {
    setVerifying(true);
    try {
      const res = await api.post(v.verify, { email, mobile, emailOtp, mobileOtp });
      toast.success("Verified", { description: "Thank you, your contact details are confirmed." });
      onOpenChange(false);
      onVerified(res.data ?? {});
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
          {verifying ? "Verifying…" : v.button}
        </Button>

        <div className="space-y-2 text-center text-xs text-muted-foreground">
          <p>Didn't get it? Check your spam folder.</p>
          <Button variant="link" size="sm" disabled={timer > 0} onClick={send}>
            <RefreshCw />
            {timer > 0 ? `Resend codes in ${timer}s` : "Resend codes"}
          </Button>
        </div>

        <div className="space-y-2 rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
          <p>
            Still stuck? Copy this message and email it to{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(helpSubject)}&body=${encodeURIComponent(helpMessage)}`}
              className="font-semibold text-primary hover:underline">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
          <p className="select-all whitespace-pre-line rounded-md bg-card p-2.5 text-left text-foreground">
            {helpMessage}
          </p>
          <Button variant="outline" size="sm" className="w-full" onClick={copyHelp}>
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy message"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
