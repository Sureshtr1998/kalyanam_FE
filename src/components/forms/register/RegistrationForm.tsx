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
import { usePublicLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { SelectType } from "@/utils/interfaces";
import { registerText } from "./lang";

type Step = 1 | 2 | 3;
type Busy = keyof (typeof registerText)["en"]["busy"];

const StepDots = ({ step, steps }: { step: Step; steps: string[] }) => (
  <ol className="mb-6 flex items-center gap-2">
    {steps.map((label, i) => {
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
          {i < steps.length - 1 && <span className={cn("h-px flex-1", done ? "bg-success" : "bg-border")} />}
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
  const [busy, setBusy] = useState<Busy | null>(null);
  const [referralOk, setReferralOk] = useState(true);
  const leadTracked = useRef(false);
  const uploaded = useRef<{ key: string; media: ImageFile[]; at: number } | null>(null);
  const t = registerText[usePublicLang()[0]];
  // Payment callbacks outlive a language change.
  const tRef = useRef(t);
  tRef.current = t;
  const translate = (options: SelectType[]) =>
    options.map((o) => ({
      ...o,
      label: t.options[o.value] ?? o.label,
      ...(o.group ? { group: t.qualificationGroups[o.group] ?? o.group } : {}),
    }));

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
    const need = (k: keyof BasicDetailsIn, msg = t.required) => {
      if (!String(form[k] ?? "").trim()) e[k] = msg;
    };
    if (s === 1) {
      need("fullName");
      need("gender");
      need("dob");
      if (!emailRegex.test(form.email)) e.email = t.invalidEmail;
      if ((form.password ?? "").length < MIN_PASSWORD_LENGTH) e.password = t.minChars(MIN_PASSWORD_LENGTH);
      if (form.password !== form.confirmPassword) e.confirmPassword = t.mismatch;
    }
    if (s === 2) {
      need("martialStatus");
      need("motherTongue");
      need("qualification");
      need("caste");
      need("profileCreatedBy");
    }
    if (s === 3) {
      if (!/^\d{10}$/.test(form.mobile)) e.mobile = t.invalidWhatsapp;
      if (form.alternateMob && !/^\d{10}$/.test(form.alternateMob)) e.alternateMob = t.tenDigits;
      if (!photos.length) e.photos = t.addPhoto;
      if (!referralOk) e.referralId = t.invalidReferral;
    }
    setErrors(e);
    if (Object.keys(e).length) toast.error(t.checkFields);
    return !Object.keys(e).length;
  };

  const next = async () => {
    if (!validate(step)) return;
    if (step === 1) {
      setBusy("checking");
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
    setBusy("creating");
    try {
      const res = await api.post("/user-register", order);
      setItem(user_login_token, res.data);
      toast.success(tRef.current.welcome, { description: tRef.current.welcomeDesc });
      window.location.href = "/profile";
    } catch (err) {
      setBusy(null);
      toast.error(tRef.current.paidFailed, {
        description: tRef.current.paidFailedDesc(errorMessage(err), order.paymentId, SUPPORT_EMAIL),
        duration: 20000,
      });
    }
  }, []);

  const { start, isStarting } = useCheckout({ description: "Annual membership", onPaid });

  const pay = async () => {
    setNoteOpen(false);
    try {
      setBusy("verifying");
      await api.get("/user-validation", {
        params: { email: form.email.trim().toLowerCase(), mobile: form.mobile },
      });

      // Upload photos once; reuse them if the user retries payment.
      const files = photos.filter((p): p is File => p instanceof File);
      const key = files.map((f) => `${f.name}:${f.size}`).join("|");
      if (uploaded.current?.key !== key || Date.now() - uploaded.current.at > UPLOAD_REUSE_MS) {
        setBusy("uploading");
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
      toast.error(t.cantContinue, { description: errorMessage(err) });
    }
  };

  const subCastes = subCasteOptions(form.caste);

  return (
    <div>
      <BlockingLoader show={!!busy && busy !== "checking"} message={busy ? t.busy[busy] : undefined} />
      <div className="mb-4 text-center">
        <h2 className="font-display text-3xl font-bold">{t.title}</h2>
        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
      </div>
      <StepDots step={step} steps={t.steps} />

      {step === 1 && (
        <FieldGrid>
          <Field label={t.fullName} required error={errors.fullName} className="sm:col-span-2">
            <Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} aria-invalid={!!errors.fullName || undefined} className="h-10 bg-card" autoComplete="name" />
          </Field>
          <Field label={t.email} required error={errors.email} className="sm:col-span-2">
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value.trim())} aria-invalid={!!errors.email || undefined} className="h-10 bg-card" autoComplete="email" />
          </Field>
          <Field label={t.password} required error={errors.password} hint={t.minChars(MIN_PASSWORD_LENGTH)}>
            <PasswordInput value={form.password} onChange={(e) => set("password", e.target.value)} aria-invalid={!!errors.password || undefined} autoComplete="new-password" />
          </Field>
          <Field label={t.confirmPassword} required error={errors.confirmPassword}>
            <PasswordInput value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} aria-invalid={!!errors.confirmPassword || undefined} autoComplete="new-password" />
          </Field>
          <Field label={t.gender} required error={errors.gender}>
            <SelectField value={form.gender} onChange={(v) => set("gender", v)} options={translate(genderOptions)} placeholder={t.select} invalid={!!errors.gender} />
          </Field>
          <Field label={t.dob} required error={errors.dob} hint={t.dobHint}>
            <DateField value={form.dob ?? ""} onChange={(v) => set("dob", v)} maxDate={eighteenYearsAgo()} placeholder={t.pickDate} invalid={!!errors.dob} />
          </Field>
        </FieldGrid>
      )}

      {step === 2 && (
        <FieldGrid>
          <Field label={t.caste} required error={errors.caste}>
            <SelectField searchable value={form.caste} onChange={(v) => set("caste", v)} options={casteOptions} placeholder={t.select} invalid={!!errors.caste} />
          </Field>
          <Field label={t.subCaste}>
            <SelectField
              searchable
              value={form.subCaste}
              onChange={(v) => set("subCaste", v)}
              options={subCastes}
              placeholder={form.caste && !subCastes.length ? t.notApplicable : t.select}
              disabled={!subCastes.length}
            />
          </Field>
          <Field label={t.motherTongue} required error={errors.motherTongue}>
            <SelectField searchable value={form.motherTongue} onChange={(v) => set("motherTongue", v)} options={motherTongueOptions} placeholder={t.select} invalid={!!errors.motherTongue} />
          </Field>
          <Field label={t.gothra} hint={t.optional}>
            <SelectField searchable creatable value={form.gothra} onChange={(v) => set("gothra", v.slice(0, 60))} options={gothraOptions} placeholder={t.select} />
          </Field>
          <Field label={t.marital} required error={errors.martialStatus}>
            <SelectField value={form.martialStatus} onChange={(v) => set("martialStatus", v)} options={translate(maritalOptions)} placeholder={t.select} invalid={!!errors.martialStatus} />
          </Field>
          <Field label={t.qualification} required error={errors.qualification}>
            <SelectField value={form.qualification} onChange={(v) => set("qualification", v)} options={translate(qualificationOptions)} placeholder={t.select} invalid={!!errors.qualification} />
          </Field>
          <Field label={t.createdBy} required error={errors.profileCreatedBy} className="sm:col-span-2">
            <SelectField value={form.profileCreatedBy} onChange={(v) => set("profileCreatedBy", v)} options={translate(createdByOptions)} placeholder={t.select} invalid={!!errors.profileCreatedBy} />
          </Field>
        </FieldGrid>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4">
          <Field label={t.photos} required error={errors.photos}>
            <PhotoManager value={photos} onChange={(p) => { setPhotos(p); setErrors((e) => ({ ...e, photos: "" })); }} text={t.photo} />
          </Field>
          <FieldGrid>
            <Field label={t.whatsapp} required error={errors.mobile} hint={t.whatsappHint}>
              <div className="flex">
                <span className="flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">+91</span>
                <Input inputMode="numeric" value={form.mobile} onChange={(e) => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} aria-invalid={!!errors.mobile || undefined} className="h-10 rounded-l-none bg-card" autoComplete="tel-national" />
              </div>
            </Field>
            <Field label={t.altNumber} hint={t.optional} error={errors.alternateMob}>
              <Input inputMode="numeric" value={form.alternateMob} onChange={(e) => set("alternateMob", e.target.value.replace(/\D/g, "").slice(0, 10))} className="h-10 bg-card" />
            </Field>
            <Field
              label={t.referral}
              hint={t.referralHint}
              error={form.referralId && !referralOk ? t.invalidReferral : undefined}
              className="sm:col-span-2">
              <Input value={form.referralId ?? ""} maxLength={7} onChange={(e) => set("referralId", e.target.value.toUpperCase())} className="h-10 bg-card font-mono uppercase" />
            </Field>
          </FieldGrid>
          <div className="flex items-center justify-between rounded-2xl border border-gold/40 bg-accent p-4">
            <div>
              <p className="text-sm font-semibold">{t.annual}</p>
              <p className="text-xs text-muted-foreground">{t.includes(INITIAL_NO_INTEREST)}</p>
            </div>
            <p className="font-display text-3xl font-bold text-primary">₹{amount}</p>
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        {step > 1 ? (
          <Button variant="outline" size="lg" className="h-11" onClick={() => setStep((s) => (s - 1) as Step)}>
            <ArrowLeft />
            {t.back}
          </Button>
        ) : null}
        <Button size="lg" className="h-11 flex-1" onClick={next} disabled={!!busy || isStarting}>
          {step < 3 ? (
            <>
              {busy === "checking" ? t.busy.checking : t.continue}
              <ArrowRight />
            </>
          ) : (
            <>
              <CreditCard />
              {isStarting ? t.opening : t.pay(amount)}
            </>
          )}
        </Button>
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        {t.already}{" "}
        <button type="button" onClick={() => setCurrentForm("login")} className="font-semibold text-primary hover:underline">
          {t.login}
        </button>
      </p>

      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{t.beforePay}</DialogTitle>
            <DialogDescription>{t.beforePayDesc}</DialogDescription>
          </DialogHeader>
          <ul className="space-y-3 text-sm leading-relaxed">
            {[
              ...t.notes(INITIAL_NO_INTEREST),
              <>
                {t.helpBefore}{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-primary">
                  {SUPPORT_EMAIL}
                </a>{" "}
                {t.helpAfter}
              </>,
            ].map((note, i) => (
              <li key={i} className="flex gap-2.5">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
          <DialogFooter>
            <Button size="lg" className="w-full" onClick={pay}>
              {t.understand(amount)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegistrationForm;
