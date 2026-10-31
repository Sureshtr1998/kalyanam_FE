import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, KeyRound, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Field } from "@/components/fields/Field";
import { PasswordInput } from "@/components/fields/PasswordInput";
import api from "@/utils/api";
import type { FormType } from "@/utils/interfaces";
import { MIN_PASSWORD_LENGTH } from "@/utils/constants";
import { errorMessage } from "@/lib/errors";

type Step = "email" | "otp" | "password";

const ForgotPasswordForm = ({ setCurrentForm }: { setCurrentForm: (f: FormType) => void }) => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  // Partners have separate accounts, so every step says which kind this is.
  const [isPartner, setIsPartner] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const run = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } catch (err) {
      toast.error("Something went wrong", { description: errorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  const requestOtp = () =>
    run(async () => {
      const res = await api.post("/request-reset", { email: email.trim().toLowerCase(), isPartner });
      toast.success("Check your email", { description: res.data.msg });
      setStep("otp");
      setTimer(60);
    });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (step === "email") {
      if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Please enter a valid email");
      void requestOtp();
    } else if (step === "otp") {
      void run(async () => {
        await api.post("/verify-otp", { email: email.trim().toLowerCase(), otp, isPartner });
        setStep("password");
      });
    } else {
      if (password.length < MIN_PASSWORD_LENGTH) {
        return toast.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      }
      if (password !== confirm) return toast.error("Passwords don't match");
      void run(async () => {
        await api.post("/reset-password", { email: email.trim().toLowerCase(), newPassword: password, isPartner });
        toast.success("Password updated", { description: "Please log in with your new password." });
        setCurrentForm("login");
      });
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="mb-1 text-center">
        <div className="mx-auto mb-2 flex size-11 items-center justify-center rounded-full bg-accent text-primary">
          <KeyRound className="size-5" />
        </div>
        <h2 className="font-display text-3xl font-bold">Reset password</h2>
        <p className="text-sm text-muted-foreground">
          {step === "email" && "We'll email you a 6-digit code."}
          {step === "otp" && (
            <>
              If <b className="text-foreground">{email}</b> has an account, we've emailed it a code. Check your spam folder too.
            </>
          )}
          {step === "password" && "Choose a new password."}
        </p>
      </div>

      {step === "email" && (
        <Field label="Registered email" htmlFor="fp-email">
          <Input
            id="fp-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 bg-card"
          />
        </Field>
      )}
      {step === "email" && (
        <div className="flex items-center gap-2">
          <Checkbox id="fp-partner" checked={isPartner} onCheckedChange={(v) => setIsPartner(v === true)} />
          <Label htmlFor="fp-partner" className="text-sm font-normal text-muted-foreground">
            I am a registered matchmaker partner
          </Label>
        </div>
      )}

      {step === "otp" && (
        <div className="flex flex-col items-center gap-3">
          <InputOTP maxLength={6} value={otp} onChange={setOtp} inputMode="numeric" pattern="^[0-9]*$">
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot key={i} index={i} className="size-11 bg-card text-base" />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <p className="text-xs text-muted-foreground">Can't find it? Check your spam folder.</p>
          <Button type="button" variant="link" size="sm" disabled={timer > 0 || loading} onClick={requestOtp}>
            <RefreshCw />
            {timer > 0 ? `Resend in ${timer}s` : "Resend code"}
          </Button>
        </div>
      )}

      {step === "password" && (
        <>
          <Field label="New password" hint={`At least ${MIN_PASSWORD_LENGTH} characters`}>
            <PasswordInput autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" />
          </Field>
          <Field label="Confirm new password">
            <PasswordInput autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="h-11" />
          </Field>
        </>
      )}

      <Button type="submit" size="lg" className="h-11" disabled={loading || (step === "otp" && otp.length !== 6)}>
        {loading ? "Please wait…" : step === "email" ? "Send code" : step === "otp" ? "Verify code" : "Update password"}
      </Button>
      <Button type="button" variant="ghost" onClick={() => setCurrentForm("login")}>
        <ArrowLeft />
        Back to login
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
