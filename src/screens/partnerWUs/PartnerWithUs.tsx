import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeIndianRupee, ChartLine, Megaphone, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGrid } from "@/components/fields/Field";
import { MultiSelectField } from "@/components/fields/SelectField";
import { PasswordInput } from "@/components/fields/PasswordInput";
import { PhotoManager, type PhotoItem } from "@/components/profile/PhotoManager";
import { BlockingLoader } from "@/components/common/Loaders";
import { Lotus } from "@/components/common/Brand";
import SEO from "@/components/misc/SEO";
import { useCheckout, type PaidOrder } from "@/hooks/useCheckout";
import api from "@/utils/api";
import type { BrokerRegistrationForm } from "@/utils/brokerInterface";
import type { ImageFile } from "@/utils/interfaces";
import {
  BROKERAGE_REGISTRATION_FEE,
  MIN_PASSWORD_LENGTH,
  SEO_URL,
  SUPPORT_NUMBER,
  UPLOAD_REUSE_MS,
  brokerFormDefaultVals,
} from "@/utils/constants";
import { casteOptions, motherTongueOptions } from "@/utils/utils";
import { errorMessage } from "@/lib/errors";
import { usePublicLang } from "@/lib/i18n";
import { translations } from "./lang";

const PartnerWithUs = () => {
  const [language] = usePublicLang();
  const [data, setData] = useState<BrokerRegistrationForm>(brokerFormDefaultVals);
  const [idProof, setIdProof] = useState<PhotoItem[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const navigate = useNavigate();

  const t = useCallback(
    (key: string): string => translations[language]?.[key] || translations.en[key] || key,
    [language]
  );

  const set = <K extends keyof BrokerRegistrationForm>(k: K, v: BrokerRegistrationForm[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const files = idProof.filter((p): p is File => p instanceof File);
  const incomplete =
    !data.name || !data.email || !data.password || !/^\d{10}$/.test(data.phone) || !data.companyName ||
    !data.address || !data.caste.length || !files.length;

  // Uploaded before payment (so a failed upload never follows a charge) and
  // reused if the partner retries checkout with the same files.
  const uploaded = useRef<{ key: string; media: ImageFile[]; at: number } | null>(null);

  const onPaid = useCallback(
    async (order: PaidOrder) => {
      setBusy("Completing your registration…");
      try {
        await api.post("/broker-register", { ...order, idProofs: uploaded.current?.media ?? [] });
        toast.success("Application received", {
          description: "We'll verify your details within 24–48 hours. Log in as a partner to see your referral ID once approved.",
        });
        navigate("/");
      } catch (err) {
        toast.error("Payment received, but registration didn't finish", {
          description: `${errorMessage(err)} Payment ID: ${order.paymentId}`,
          duration: 20000,
        });
      } finally {
        setBusy(null);
      }
    },
    [navigate]
  );

  const { start, isStarting } = useCheckout({ description: "Partner registration", onPaid });

  const submit = async () => {
    if (data.password.length < MIN_PASSWORD_LENGTH) {
      return toast.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }
    if (data.password !== data.confirmPassword) return toast.error("Passwords don't match");
    try {
      setBusy("Checking your details…");
      await api.get("/broker-validation", { params: { email: data.email, mobile: data.phone } });
      const key = files.map((f) => `${f.name}:${f.size}`).join("|");
      if (uploaded.current?.key !== key || Date.now() - uploaded.current.at > UPLOAD_REUSE_MS) {
        setBusy("Uploading your ID proof…");
        const form = new FormData();
        files.forEach((f) => form.append("images", f));
        const upload = await api.post("/broker-register/upload-idproof", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploaded.current = { key, media: upload.data.media, at: Date.now() };
      }
      setBusy(null);
      const { name, email, phone, companyName, address, caste, motherTongue, note, password } = data;
      await start({
        purpose: "broker",
        // Validated and priced on the server before payment, like member sign-ups.
        broker: { name, email: email.trim().toLowerCase(), phone, companyName, address, caste, motherTongue, note, password },
      });
    } catch (err) {
      setBusy(null);
      toast.error("Partner registration is unavailable right now", { description: errorMessage(err) });
    }
  };

  const benefits = [
    { icon: <BadgeIndianRupee />, n: 1 },
    { icon: <Megaphone />, n: 2 },
    { icon: <ChartLine />, n: 3 },
  ];

  return (
    <>
      <SEO
        title="Partner With Us | Matrimony Broker Partnership – Seetha Rama Kalyana"
        description="Partner with Seetha Rama Kalyana as a trusted matrimony broker. Earn referral commissions, track registrations, and grow your business digitally."
        keywords="matrimony broker partnership, matrimony referral program, marriage broker platform, seetha rama kalyana partner, matrimony agent registration"
        url={SEO_URL + "/partner-with-us"}
      />
      <BlockingLoader show={!!busy} message={busy ?? undefined} />

      <section className="bg-sunrise relative overflow-hidden">
        <div className="bg-kolam pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16">
          <Lotus className="mx-auto h-6 w-10 text-gold" />
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{t("title")}</h1>
          <p className="mt-3 text-muted-foreground sm:text-lg">{t("subtitle")}</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-8 px-4 py-12 sm:px-6">
        <section>
          <h2 className="mb-5 text-center font-display text-3xl font-bold">{t("benefits_title")}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.n} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground [&_svg]:size-5">
                  {b.icon}
                </div>
                <h3 className="mt-3 font-semibold">{t(`benefit_${b.n}_strong`).replace(/:$/, "")}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(`benefit_${b.n}_text`)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col items-center justify-between gap-3 rounded-2xl border border-gold/40 bg-accent p-4 sm:flex-row">
            <p className="text-sm font-medium">{t("contact_support")}</p>
            <Button asChild className="bg-success text-success-foreground hover:bg-success/90">
              <a href={`https://wa.me/${SUPPORT_NUMBER}`} target="_blank" rel="noreferrer">
                <MessageCircle />
                {t("contact_button")}
              </a>
            </Button>
          </div>
        </section>

        <section>
          <h2 className="mb-5 text-center font-display text-3xl font-bold">{t("onboarding_title")}</h2>
          <ol className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <li key={n} className="relative rounded-2xl border border-border bg-card p-5">
                <span className="flex size-9 items-center justify-center rounded-full bg-gold font-bold text-gold-foreground">{n}</span>
                <h3 className="mt-3 font-semibold">{t(`step_${n}_title`)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t(`step_${n}_desc`)}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-3xl border border-gold/30 bg-card p-5 shadow-sm sm:p-8">
          <h2 className="mb-6 font-display text-3xl font-bold">{t("form_title")}</h2>
          <div className="space-y-8">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">{t("section_1_title")}</p>
              <FieldGrid>
                <Field label={t("label_name")} required>
                  <Input value={data.name} placeholder={t("placeholder_name")} onChange={(e) => set("name", e.target.value)} className="h-10 bg-card" />
                </Field>
                <Field label={t("label_email")} required>
                  <Input type="email" value={data.email} placeholder={t("placeholder_email")} onChange={(e) => set("email", e.target.value.trim().toLowerCase())} className="h-10 bg-card" />
                </Field>
                <Field label={t("label_phone")} required>
                  <Input inputMode="numeric" value={data.phone} placeholder={t("placeholder_phone")} onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} className="h-10 bg-card" />
                </Field>
              </FieldGrid>
            </div>
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">{t("section_2_title")}</p>
              <FieldGrid>
                <Field label={t("label_password")} required>
                  <PasswordInput value={data.password} placeholder={t("placeholder_password")} onChange={(e) => set("password", e.target.value)} autoComplete="new-password" />
                </Field>
                <Field label={t("label_confirm_password")} required>
                  <PasswordInput value={data.confirmPassword} placeholder={t("placeholder_confirm_password")} onChange={(e) => set("confirmPassword", e.target.value)} autoComplete="new-password" />
                </Field>
              </FieldGrid>
            </div>
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">{t("section_3_title")}</p>
              <FieldGrid>
                <Field label={t("label_company_name")} required>
                  <Input value={data.companyName} placeholder={t("placeholder_company_name")} onChange={(e) => set("companyName", e.target.value)} className="h-10 bg-card" />
                </Field>
                <Field label={t("label_address")} required>
                  <Input value={data.address} placeholder={t("placeholder_address")} onChange={(e) => set("address", e.target.value)} className="h-10 bg-card" />
                </Field>
                <Field label={t("label_community_serve")} required>
                  <MultiSelectField value={data.caste} onChange={(v) => set("caste", v)} options={casteOptions} />
                </Field>
                <Field label={t("mother_tongues_serve")}>
                  <MultiSelectField value={data.motherTongue} onChange={(v) => set("motherTongue", v)} options={motherTongueOptions} />
                </Field>
                <Field label={t("label_note")} className="sm:col-span-2">
                  <Textarea value={data.note} placeholder={t("label_note_placeholder")} onChange={(e) => set("note", e.target.value)} className="min-h-20 bg-card" />
                </Field>
              </FieldGrid>
            </div>
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">{t("section_4_title")}</p>
              <Field label={t("label_id_proof")} required>
                <PhotoManager value={idProof} onChange={setIdProof} />
              </Field>
            </div>
            <Button size="lg" className="w-full" disabled={incomplete || isStarting || !!busy} onClick={submit}>
              {isStarting ? "Opening checkout…" : t("submit_button") || `Pay ₹${BROKERAGE_REGISTRATION_FEE} & apply`}
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default PartnerWithUs;
