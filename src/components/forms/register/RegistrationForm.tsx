import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CreditCard, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGrid } from "@/components/fields/Field";
import { SelectField } from "@/components/fields/SelectField";
import { DateField } from "@/components/fields/DateField";
import { PasswordInput } from "@/components/fields/PasswordInput";
import { PhotoManager, type PhotoItem } from "@/components/profile/PhotoManager";
import { BlockingLoader } from "@/components/common/Loaders";
import { useCheckout, type PaidOrder } from "@/hooks/useCheckout";
import { trackPixel } from "@/lib/pixel";
import api from "@/utils/api";
import { setItem, user_login_token } from "@/utils/localStore";
import {
  DISCOUNT_NAMES,
  INITIAL_NO_INTEREST,
  SUPPORT_EMAIL,
  createdByOptions,
  emailRegex,
  MIN_PASSWORD_LENGTH,
  UPLOAD_REUSE_MS,
  formDefaultVals,
  genderOptions,
  gothraOptions,
  maritalOptions,
  qualificationOptions,
} from "@/utils/constants";
import type { BasicDetailsIn, FormType, ImageFile } from "@/utils/interfaces";
import { casteOptions, getRefferalAmount, motherTongueOptions, subCasteOptions } from "@/utils/utils";
import { errorMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;
const STEPS = ["Account", "Background", "Photos & contact"];

const StepDots = ({ step }: { step: Step }) => (
  <ol className="mb-6 flex items-center gap-2">
    {STEPS.map((label, i) => {
      const n = (i + 1) as Step;
      const done = n < step;
      const active = n === step;
      return (
        <li key={label} className="flex flex-1 items-center gap-2">
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
              done && "bg-success text-success-foreground",
              active && "bg-primary text-primary-foreground ring-4 ring-primary/15",
              !done && !active && "bg-muted text-muted-foreground"
            )}>
            {done ? <Check className="size-4" /> : n}
          </span>
          <span className={cn("hidden text-xs font-semibold sm:block", active ? "text-foreground" : "text-muted-foreground")}>
            {label}
          </span>
          {i < STEPS.length - 1 && <span className={cn("h-px flex-1", done ? "bg-success" : "bg-border")} />}
        </li>
      );
    })}
  </ol>
);

const eighteenYearsAgo = () => {
  const d = new Date();
  return new Date(d.getFullYear() - 18, d.getMonth(), d.getDate());
};

const RegistrationForm = ({ setCurrentForm }: { setCurrentForm: (f: FormType) => void }) => {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<BasicDetailsIn>({ ...formDefaultVals.basic, referralId: "" } as BasicDetailsIn);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [noteOpen, setNoteOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [referralOk, setReferralOk] = useState(true);
  const leadTracked = useRef(false);
  const uploaded = useRef<{ key: string; media: ImageFile[]; at: number } | null>(null);

  const set = (name: keyof BasicDetailsIn, value: string) => {
    setForm((f) => ({ ...f, [name]: value, ...(name === "caste" ? { subCaste: "" } : {}) }));
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  // Referral codes are 7 characters; validate as soon as one is typed.
  useEffect(() => {
    const code = form.referralId?.trim().toUpperCase() ?? "";
    if (!code) return setReferralOk(true);
    if (code.length !== 7) return setReferralOk(false);
    if (DISCOUNT_NAMES.includes(code)) return setReferralOk(true);
    let cancelled = false;
    api
      .get(`/validate-referral/${code}`)
      .then((res) => !cancelled && setReferralOk(!!res.data.valid))
      .catch(() => !cancelled && setReferralOk(false));
    return () => {
      cancelled = true;
    };
  }, [form.referralId]);

  // Only a code that passed validation earns the discounted price.
  const amount = getRefferalAmount(referralOk ? form.referralId?.trim().toUpperCase() : undefined);

  const validate = (s: Step) => {
    const e: Record<string, string> = {};
    const need = (k: keyof BasicDetailsIn, msg = "Required") => {
      if (!String(form[k] ?? "").trim()) e[k] = msg;
    };
    if (s === 1) {
      need("fullName");
      need("gender");
      need("dob");
      if (!emailRegex.test(form.email)) e.email = "Enter a valid email";
      if ((form.password ?? "").length < MIN_PASSWORD_LENGTH) e.password = `At least ${MIN_PASSWORD_LENGTH} characters`;
      if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    }
    if (s === 2) {
      need("martialStatus");
      need("motherTongue");
      need("qualification");
      need("caste");
      need("profileCreatedBy");
    }
    if (s === 3) {
      if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter a 10-digit WhatsApp number";
      if (form.alternateMob && !/^\d{10}$/.test(form.alternateMob)) e.alternateMob = "Must be 10 digits";
      if (!photos.length) e.photos = "Add at least one photo";
      if (!referralOk) e.referralId = "Invalid referral ID";
    }
    setErrors(e);
    if (Object.keys(e).length) toast.error("Please check the highlighted fields");
    return !Object.keys(e).length;
  };

  const next = async () => {
    if (!validate(step)) return;
    if (step === 1) {
      setBusy("Checking…");
      try {
        await api.get("/user-validation", { params: { email: form.email.trim().toLowerCase() } });
      } catch (err) {
        setErrors({ email: errorMessage(err) });
        toast.error(errorMessage(err));
        return;
      } finally {
        setBusy(null);
      }
      // A new email passed the first step: report a lead once per visit.
      if (!leadTracked.current) {
        leadTracked.current = true;
        trackPixel("Lead", { content_name: "Registration" });
      }
    }
    if (step < 3) setStep((s) => (s + 1) as Step);
    else setNoteOpen(true);
  };

  const onPaid = useCallback(async (order: PaidOrder) => {
    setBusy("Creating your profile…");
    try {
      const res = await api.post("/user-register", order);
      setItem(user_login_token, res.data);
      toast.success("Welcome to Seetha Rama Kalyana!", {
        description: "Your payment is confirmed. Let's complete your profile.",
      });
      window.location.href = "/profile";
    } catch (err) {
      setBusy(null);
      toast.error("Payment received, but registration didn't finish", {
        description: `${errorMessage(err)} Payment ID: ${order.paymentId}. Write to ${SUPPORT_EMAIL} and we'll fix it quickly.`,
        duration: 20000,
      });
    }
  }, []);

  const { start, isStarting } = useCheckout({ description: "Annual membership", onPaid });

  const pay = async () => {
    setNoteOpen(false);
    try {
      setBusy("Checking your details…");
      await api.get("/user-validation", {
        params: { email: form.email.trim().toLowerCase(), mobile: form.mobile },
      });

      // Upload photos once; reuse them if the user retries payment.
      const files = photos.filter((p): p is File => p instanceof File);
      const key = files.map((f) => `${f.name}:${f.size}`).join("|");
      if (uploaded.current?.key !== key || Date.now() - uploaded.current.at > UPLOAD_REUSE_MS) {
        setBusy("Uploading your photos…");
        const data = new FormData();
        files.forEach((f) => data.append("images", f));
        const res = await api.post("/user-register/upload-images", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploaded.current = { key, media: res.data.media, at: Date.now() };
      }
      setBusy(null);

      await start({
        purpose: "registration",
        registration: {
          ...form,
          email: form.email.trim().toLowerCase(),
          referralId: form.referralId?.trim().toUpperCase(),
          images: uploaded.current!.media,
        },
      });
    } catch (err) {
      setBusy(null);
      toast.error("Couldn't continue", { description: errorMessage(err) });
    }
  };

  const subCastes = subCasteOptions(form.caste);

  return (
    <div>
      <BlockingLoader show={!!busy && busy !== "Checking…"} message={busy ?? undefined} />
      <div className="mb-4 text-center">
        <h2 className="font-display text-3xl font-bold">Create your profile</h2>
        <p className="text-sm text-muted-foreground">Takes about 3 minutes</p>
      </div>
      <StepDots step={step} />

      {step === 1 && (
        <FieldGrid>
          <Field label="Bride / groom's full name" required error={errors.fullName} className="sm:col-span-2">
            <Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} aria-invalid={!!errors.fullName || undefined} className="h-10 bg-card" autoComplete="name" />
          </Field>
          <Field label="Email" required error={errors.email} className="sm:col-span-2">
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value.trim())} aria-invalid={!!errors.email || undefined} className="h-10 bg-card" autoComplete="email" />
          </Field>
          <Field label="Password" required error={errors.password} hint={`At least ${MIN_PASSWORD_LENGTH} characters`}>
            <PasswordInput value={form.password} onChange={(e) => set("password", e.target.value)} aria-invalid={!!errors.password || undefined} autoComplete="new-password" />
          </Field>
          <Field label="Confirm password" required error={errors.confirmPassword}>
            <PasswordInput value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} aria-invalid={!!errors.confirmPassword || undefined} autoComplete="new-password" />
          </Field>
          <Field label="Gender" required error={errors.gender}>
            <SelectField value={form.gender} onChange={(v) => set("gender", v)} options={genderOptions} invalid={!!errors.gender} />
          </Field>
          <Field label="Date of birth" required error={errors.dob} hint="Must be 18 or older">
            <DateField value={form.dob ?? ""} onChange={(v) => set("dob", v)} maxDate={eighteenYearsAgo()} invalid={!!errors.dob} />
          </Field>
        </FieldGrid>
      )}

      {step === 2 && (
        <FieldGrid>
          <Field label="Caste" required error={errors.caste}>
            <SelectField searchable value={form.caste} onChange={(v) => set("caste", v)} options={casteOptions} invalid={!!errors.caste} />
          </Field>
          <Field label="Sub caste">
            <SelectField
              searchable
              value={form.subCaste}
              onChange={(v) => set("subCaste", v)}
              options={subCastes}
              placeholder={form.caste && !subCastes.length ? "Not applicable" : "Select"}
              disabled={!subCastes.length}
            />
          </Field>
          <Field label="Mother tongue" required error={errors.motherTongue}>
            <SelectField searchable value={form.motherTongue} onChange={(v) => set("motherTongue", v)} options={motherTongueOptions} invalid={!!errors.motherTongue} />
          </Field>
          <Field label="Gothra" hint="Optional">
            <SelectField searchable creatable value={form.gothra} onChange={(v) => set("gothra", v.slice(0, 60))} options={gothraOptions} />
          </Field>
          <Field label="Marital status" required error={errors.martialStatus}>
            <SelectField value={form.martialStatus} onChange={(v) => set("martialStatus", v)} options={maritalOptions} invalid={!!errors.martialStatus} />
          </Field>
          <Field label="Highest qualification" required error={errors.qualification}>
            <SelectField value={form.qualification} onChange={(v) => set("qualification", v)} options={qualificationOptions} invalid={!!errors.qualification} />
          </Field>
          <Field label="Profile created by" required error={errors.profileCreatedBy} className="sm:col-span-2">
            <SelectField value={form.profileCreatedBy} onChange={(v) => set("profileCreatedBy", v)} options={createdByOptions} invalid={!!errors.profileCreatedBy} />
          </Field>
        </FieldGrid>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4">
          <Field label="Photos" required error={errors.photos}>
            <PhotoManager value={photos} onChange={(p) => { setPhotos(p); setErrors((e) => ({ ...e, photos: "" })); }} />
          </Field>
          <FieldGrid>
            <Field label="WhatsApp number" required error={errors.mobile} hint="We'll send a verification code here">
              <div className="flex">
                <span className="flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">+91</span>
                <Input inputMode="numeric" value={form.mobile} onChange={(e) => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} aria-invalid={!!errors.mobile || undefined} className="h-10 rounded-l-none bg-card" autoComplete="tel-national" />
              </div>
            </Field>
            <Field label="Alternate number" hint="Optional" error={errors.alternateMob}>
              <Input inputMode="numeric" value={form.alternateMob} onChange={(e) => set("alternateMob", e.target.value.replace(/\D/g, "").slice(0, 10))} className="h-10 bg-card" />
            </Field>
            <Field
              label="Referral ID"
              hint="Optional · 7 characters"
              error={form.referralId && !referralOk ? "Invalid referral ID" : undefined}
              className="sm:col-span-2">
              <Input value={form.referralId ?? ""} maxLength={7} onChange={(e) => set("referralId", e.target.value.toUpperCase())} className="h-10 bg-card font-mono uppercase" />
            </Field>
          </FieldGrid>
          <div className="flex items-center justify-between rounded-2xl border border-gold/40 bg-accent p-4">
            <div>
              <p className="text-sm font-semibold">Annual membership</p>
              <p className="text-xs text-muted-foreground">Includes {INITIAL_NO_INTEREST} credits (1 per interest)</p>
            </div>
            <p className="font-display text-3xl font-bold text-primary">₹{amount}</p>
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        {step > 1 ? (
          <Button variant="outline" size="lg" className="h-11" onClick={() => setStep((s) => (s - 1) as Step)}>
            <ArrowLeft />
            Back
          </Button>
        ) : null}
        <Button size="lg" className="h-11 flex-1" onClick={next} disabled={!!busy || isStarting}>
          {step < 3 ? (
            <>
              {busy === "Checking…" ? "Checking…" : "Continue"}
              <ArrowRight />
            </>
          ) : (
            <>
              <CreditCard />
              {isStarting ? "Opening checkout…" : `Pay ₹${amount} & register`}
            </>
          )}
        </Button>
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already a member?{" "}
        <button type="button" onClick={() => setCurrentForm("login")} className="font-semibold text-primary hover:underline">
          Log in
        </button>
      </p>

      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Before you pay</DialogTitle>
            <DialogDescription>A few honest notes about Seetha Rama Kalyana.</DialogDescription>
          </DialogHeader>
          <ul className="space-y-3 text-sm leading-relaxed">
            {[
              "We're in an active growth phase. New profiles join regularly.",
              "You'll get an email whenever someone sends or accepts your interest.",
              `Your membership includes ${INITIAL_NO_INTEREST} credits: each interest you send uses 1. It's a one-time annual fee with no hidden charges.`,
              <>
                Need help? Write to{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-primary">
                  {SUPPORT_EMAIL}
                </a>{" "}
                and we reply within 24 hours.
              </>,
            ].map((t, i) => (
              <li key={i} className="flex gap-2.5">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <DialogFooter>
            <Button size="lg" className="w-full" onClick={pay}>
              I understand · Pay ₹{amount}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegistrationForm;
