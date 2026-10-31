import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BadgeCheck, Briefcase, Download, Filter, House, LoaderCircle, Lock, Save, UserRound } from "lucide-react";
import SEO from "@/components/misc/SEO";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Field, FieldGrid } from "@/components/fields/Field";
import { SelectField } from "@/components/fields/SelectField";
import { PhotoManager, type PhotoItem } from "@/components/profile/PhotoManager";
import { PartnerPreferencesForm } from "@/components/profile/PartnerPreferencesForm";
import { OtpVerifyDialog } from "@/components/auth/OtpVerifyDialog";
import { BlockingLoader } from "@/components/common/Loaders";
import { useUser } from "@/context/UserContext";
import api from "@/utils/api";
import {
  countryOptions,
  createdByOptions,
  dietOptions,
  employedInOptions,
  familyStatus,
  gothraOptions,
  heightOptions,
  mandatoryBasicFields,
  mandatoryFamilyFields,
  mandatoryPartnerFields,
  mandatoryPersonalFields,
  maritalOptions,
  nakshatraOptions,
  noSiblingOptions,
  parentStatus,
  qualificationOptions,
  rashiOptions,
  residingOptions,
} from "@/utils/constants";
import type { ImageFile, UserDataType, UserDetails } from "@/utils/interfaces";
import { motherTongueOptions, normalizeToArray, subCasteOptions } from "@/utils/utils";
import { formatFloating } from "@/lib/dates";
import { errorMessage } from "@/lib/errors";
import { sendReport } from "@/utils/report";
import { cn } from "@/lib/utils";
import { writeAboutMe, writePartnerNote } from "@/lib/bioWriter";
import { WriteForMe } from "@/components/fields/WriteForMe";
import { downloadProfilePdf } from "@/lib/profilePdf";

type Section = Exclude<UserDataType, never>;
type Errors = Record<Section, Record<string, string>>;

const MANDATORY: Record<Section, string[]> = {
  basic: mandatoryBasicFields,
  personal: mandatoryPersonalFields,
  family: mandatoryFamilyFields,
  partner: mandatoryPartnerFields,
};

const isEmpty = (v: unknown) => (Array.isArray(v) ? v.length === 0 : !v);

const findErrors = (data: UserDetails): Errors => {
  const errors: Errors = { basic: {}, personal: {}, family: {}, partner: {} };
  (Object.keys(MANDATORY) as Section[]).forEach((section) => {
    MANDATORY[section].forEach((key) => {
      const value = (data[section] as Record<string, unknown> | undefined)?.[key];
      if (isEmpty(key === "caste" && section === "partner" ? normalizeToArray(value as string[]) : value)) {
        errors[section][key] = "Required";
      }
    });
  });
  return errors;
};

const ReadOnly = ({ label, value }: { label: string; value?: ReactNode }) => (
  <Field label={label}>
    <div className="flex h-10 items-center gap-2 rounded-md border border-dashed border-border bg-muted/60 px-3 text-sm text-foreground/80">
      <Lock className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="truncate">{value || "-"}</span>
    </div>
  </Field>
);

const SECTIONS: { id: Section; label: string; icon: ReactNode }[] = [
  { id: "basic", label: "Basic", icon: <UserRound /> },
  { id: "personal", label: "Personal", icon: <Briefcase /> },
  { id: "family", label: "Family", icon: <House /> },
  { id: "partner", label: "Partner", icon: <Filter /> },
];

const Profile = () => {
  const { user, loaded, setUser } = useUser();
  const [data, setData] = useState<UserDetails>(user);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [tab, setTab] = useState<Section>("basic");
  const [showErrors, setShowErrors] = useState(false);
  const [saving, setSaving] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    setData(user);
    setPhotos(user.basic?.images ?? []);
    if (user._id && !user.hasCompleteProfile) {
      toast.info("Complete your profile", {
        description: "Fill the fields marked * to start viewing matches.",
      });
    }
    // Only seed the form once the profile has loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, user._id]);

  const errors = useMemo(() => findErrors(data), [data]);
  const errorCount = (s: Section) => Object.keys(errors[s]).length;
  const totalMissing = SECTIONS.reduce((n, s) => n + errorCount(s.id), 0) + (photos.length ? 0 : 1);
  const totalRequired = SECTIONS.reduce((n, s) => n + MANDATORY[s.id].length, 0) + 1;
  const completion = Math.round(((totalRequired - totalMissing) / totalRequired) * 100);
  const err = (s: Section, k: string) => (showErrors ? errors[s][k] : undefined);

  const set = (section: Section, name: string, value: unknown) =>
    setData((d) => ({ ...d, [section]: { ...(d[section] ?? {}), [name]: value } }));

  const basic = data.basic;
  const personal = data.personal ?? {};
  const family = data.family ?? {};

  const save = async () => {
    try {
      setSaving(true);
      const newFiles = photos.filter((p): p is File => p instanceof File);
      let uploaded: ImageFile[] = [];
      if (newFiles.length) {
        const form = new FormData();
        newFiles.forEach((f) => form.append("images", f));
        const res = await api.post("/my-profile/upload-images", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploaded = res.data.media;
      }
      // Keep the member's chosen order (cover first).
      let next = 0;
      const images = photos.map((p) =>
        p instanceof File ? uploaded[next++] : { url: p.url, fileId: p.fileId }
      ).filter(Boolean);

      const res = await api.post("/my-profile", {
        ...data,
        basic: { ...data.basic, images },
      });
      setUser(res.data.profile);
      setData(res.data.profile);
      setPhotos(res.data.profile.basic.images ?? []);
      setShowErrors(false);
      toast.success("Profile saved", {
        description: res.data.profile.hasCompleteProfile
          ? "Your profile is live. Happy matching!"
          : "Saved. Fill the remaining * fields to start matching.",
      });
    } catch (e) {
      const needsVerify = (e as { response?: { data?: { needsVerification?: boolean } } })?.response?.data
        ?.needsVerification;
      if (needsVerify) {
        setVerifyOpen(true);
      } else {
        toast.error("Couldn't save profile", { description: errorMessage(e) });
        void sendReport(JSON.stringify({ msg: errorMessage(e), userId: data._id }));
      }
    } finally {
      setSaving(false);
    }
  };

  const onSave = () => {
    setShowErrors(true);
    const firstBad = SECTIONS.find((s) => errorCount(s.id));
    if (firstBad || !photos.length) {
      if (firstBad) setTab(firstBad.id);
      toast.error("A few details are missing", {
        description: !photos.length
          ? "Please add at least one photo."
          : `Please fill the required fields in ${firstBad!.label} details.`,
      });
      return;
    }
    if (!/^\d{10}$/.test(basic.mobile ?? "")) {
      setTab("basic");
      toast.error("Enter a valid 10-digit WhatsApp number");
      return;
    }
    if (!data.isVerified) setVerifyOpen(true);
    else void save();
  };

  const download = async () => {
    setDownloading(true);
    try {
      // The saved profile, not unsaved edits: new photos aren't uploaded yet.
      await downloadProfilePdf(user, { showContact: true });
    } catch (e) {
      toast.error("Couldn't create the PDF", { description: errorMessage(e) });
    } finally {
      setDownloading(false);
    }
  };

  if (!loaded) return <BlockingLoader show message="Loading your profile…" />;

  return (
    <div className="mx-auto max-w-5xl">
      <SEO title="My profile | Seetha Rama Kalyana" description="My profile" noindex />
      <BlockingLoader show={saving} message="Saving your profile…" />
      <OtpVerifyDialog
        open={verifyOpen}
        onOpenChange={setVerifyOpen}
        email={basic.email}
        mobile={basic.mobile}
        onVerified={save}
      />

      {/* Header card */}
      <div className="mb-6 overflow-hidden rounded-3xl border border-gold/30 bg-card shadow-sm">
        <div className="bg-kolam h-20 bg-gradient-to-r from-primary/10 via-accent to-gold/20 sm:h-24" />
        <div className="grid gap-6 p-4 sm:p-6 md:grid-cols-[1fr_1.1fr]">
          <div className="-mt-14 sm:-mt-16">
            <PhotoManager value={photos} onChange={setPhotos} />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl font-bold sm:text-4xl">{basic.fullName}</h1>
              {data.isVerified ? (
                <Badge className="gap-1 bg-success text-success-foreground">
                  <BadgeCheck className="size-3.5" /> Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="border-gold text-accent-foreground">
                  Not verified yet
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Profile ID <span className="font-mono font-semibold text-foreground">{basic.uniqueId ?? "-"}</span>
              {" · "}Born {formatFloating(basic.dob)}
            </p>
            {user._id && (
              <div>
                <Button variant="outline" size="sm" onClick={() => void download()} disabled={downloading}>
                  {downloading ? <LoaderCircle className="animate-spin" /> : <Download />}
                  {downloading ? "Preparing PDF…" : "Download my profile (PDF)"}
                </Button>
                <p className="mt-1 text-xs text-muted-foreground">Uses your last saved details. Save first to include recent edits.</p>
              </div>
            )}
            <div className="rounded-2xl bg-muted p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold">Profile completeness</span>
                <span className="font-bold text-primary">{completion}%</span>
              </div>
              <Progress value={completion} className="h-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                {totalMissing
                  ? `${totalMissing} required item${totalMissing === 1 ? "" : "s"} left. Complete profiles get far more responses.`
                  : "All required details are filled in."}
              </p>
            </div>
            {!data.hasCompleteProfile && (
              <Alert className="border-gold/50 bg-accent">
                <AlertTitle>Finish your profile to see matches</AlertTitle>
                <AlertDescription>
                  Fields marked <span className="font-bold text-primary">*</span> are required. On your first save
                  we'll verify your email and WhatsApp number with a one-time code.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Section)}>
        <TabsList className="mb-4 grid h-auto w-full grid-cols-4 bg-card p-1 shadow-sm ring-1 ring-border">
          {SECTIONS.map((s) => (
            <TabsTrigger
              key={s.id}
              value={s.id}
              className="relative h-full min-h-11 flex-col items-center justify-center gap-1 py-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:flex-row sm:text-sm [&_svg]:size-4">
              {s.icon}
              {s.label}
              {showErrors && errorCount(s.id) > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                  {errorCount(s.id)}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <TabsContent value="basic" className="mt-0">
            <FieldGrid>
              <ReadOnly label="Full name" value={basic.fullName} />
              <ReadOnly label="Gender" value={basic.gender} />
              <ReadOnly label="Date of birth" value={formatFloating(basic.dob)} />
              <ReadOnly label="Caste" value={basic.caste} />
              {basic.referralId && (
                <ReadOnly
                  label="Referred by"
                  value={
                    <>
                      <span className="font-mono font-semibold">{basic.referralId}</span>
                      {data.referredBy && ` · ${data.referredBy.companyName || data.referredBy.name}`}
                    </>
                  }
                />
              )}
              <Field
                label="Email"
                required
                hint={data.isVerified ? "Verified. Contact support to change." : "We'll send a verification code here."}>
                <Input
                  type="email"
                  value={basic.email ?? ""}
                  disabled={data.isVerified}
                  onChange={(e) => set("basic", "email", e.target.value.trim().toLowerCase())}
                  className="h-10 bg-card"
                />
              </Field>
              <Field
                label="WhatsApp number"
                required
                hint={data.isVerified ? "Verified. Contact support to change." : "10 digits, without +91."}>
                <Input
                  inputMode="numeric"
                  value={basic.mobile ?? ""}
                  disabled={data.isVerified}
                  onChange={(e) => set("basic", "mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="h-10 bg-card"
                />
              </Field>
              <Field label="Sub caste">
                <SelectField
                  searchable
                  value={basic.subCaste}
                  onChange={(v) => set("basic", "subCaste", v)}
                  options={subCasteOptions(basic.caste)}
                  placeholder={subCasteOptions(basic.caste).length ? "Select" : "Not applicable"}
                  disabled={!subCasteOptions(basic.caste).length}
                />
              </Field>
              <Field label="Gothra">
                <SelectField
                  searchable
                  creatable
                  value={basic.gothra}
                  onChange={(v) => set("basic", "gothra", v.slice(0, 60))}
                  options={gothraOptions}
                />
              </Field>
              <Field label="Mother tongue" required error={err("basic", "motherTongue")}>
                <SelectField
                  searchable
                  value={basic.motherTongue}
                  onChange={(v) => set("basic", "motherTongue", v)}
                  options={motherTongueOptions}
                  invalid={!!err("basic", "motherTongue")}
                />
              </Field>
              <Field label="Marital status" required error={err("basic", "martialStatus")}>
                <SelectField
                  value={basic.martialStatus}
                  onChange={(v) => set("basic", "martialStatus", v)}
                  options={maritalOptions}
                  invalid={!!err("basic", "martialStatus")}
                />
              </Field>
              <Field label="Highest qualification" required error={err("basic", "qualification")}>
                <SelectField
                  value={basic.qualification}
                  onChange={(v) => set("basic", "qualification", v)}
                  options={qualificationOptions}
                  invalid={!!err("basic", "qualification")}
                />
              </Field>
              <Field label="Profile created by">
                <SelectField
                  value={basic.profileCreatedBy}
                  onChange={(v) => set("basic", "profileCreatedBy", v)}
                  options={createdByOptions}
                />
              </Field>
              <Field label="Alternate contact" hint="Optional · 10 digits">
                <Input
                  inputMode="numeric"
                  value={basic.alternateMob ?? ""}
                  onChange={(e) => set("basic", "alternateMob", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="h-10 bg-card"
                />
              </Field>
              <Field label="About me" className="sm:col-span-2">
                <Textarea
                  value={basic.note ?? ""}
                  onChange={(e) => set("basic", "note", e.target.value.slice(0, 600))}
                  placeholder="A few lines about yourself, your values and interests"
                  className="min-h-24 bg-card"
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    Drafted from your Personal &amp; Family details. Edit freely.
                  </span>
                  <WriteForMe
                    value={basic.note}
                    onChange={(t) => set("basic", "note", t)}
                    write={() => writeAboutMe(data)}
                  />
                </div>
              </Field>
            </FieldGrid>
          </TabsContent>

          <TabsContent value="personal" className="mt-0">
            <FieldGrid>
              <Field label="Height" required error={err("personal", "height")}>
                <SelectField
                  value={personal.height}
                  onChange={(v) => set("personal", "height", v)}
                  options={heightOptions}
                  invalid={!!err("personal", "height")}
                />
              </Field>
              <Field label="Weight (kg)">
                <Input
                  type="number"
                  inputMode="numeric"
                  min={30}
                  max={200}
                  value={personal.weight ?? ""}
                  onChange={(e) => set("personal", "weight", e.target.value)}
                  className="h-10 bg-card"
                />
              </Field>
              <Field label="Country" required error={err("personal", "country")}>
                <SelectField
                  searchable
                  value={personal.country}
                  onChange={(v) => set("personal", "country", v)}
                  options={countryOptions}
                  invalid={!!err("personal", "country")}
                />
              </Field>
              <Field label="Residing status" required error={err("personal", "residingStatus")}>
                <SelectField
                  value={personal.residingStatus}
                  onChange={(v) => set("personal", "residingStatus", v)}
                  options={residingOptions}
                  invalid={!!err("personal", "residingStatus")}
                />
              </Field>
              <Field label="Employed in" required error={err("personal", "employedIn")}>
                <SelectField
                  value={personal.employedIn}
                  onChange={(v) => set("personal", "employedIn", v)}
                  options={employedInOptions}
                  invalid={!!err("personal", "employedIn")}
                />
              </Field>
              <Field label="Diet" required error={err("personal", "diet")}>
                <SelectField
                  value={personal.diet}
                  onChange={(v) => set("personal", "diet", v)}
                  options={dietOptions}
                  invalid={!!err("personal", "diet")}
                />
              </Field>
              <Field label="Annual income (LPA)">
                <Input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={personal.salary ?? ""}
                  onChange={(e) => set("personal", "salary", e.target.value)}
                  className="h-10 bg-card"
                />
              </Field>
              <Field label="Work city">
                <Input
                  value={personal.workCity ?? ""}
                  onChange={(e) => set("personal", "workCity", e.target.value)}
                  className="h-10 bg-card"
                />
              </Field>
              <Field label="Rashi">
                <SelectField
                  value={personal.rashi}
                  onChange={(v) => set("personal", "rashi", v)}
                  options={rashiOptions}
                />
              </Field>
              <Field label="Nakshatra">
                <SelectField
                  searchable
                  value={personal.nakshatra}
                  onChange={(v) => set("personal", "nakshatra", v)}
                  options={nakshatraOptions}
                />
              </Field>
              <Field label="Address" className="sm:col-span-2" hint="Only visible to members whose contact you share.">
                <Input
                  value={personal.address ?? ""}
                  onChange={(e) => set("personal", "address", e.target.value)}
                  className="h-10 bg-card"
                />
              </Field>
              <Field label="About my career" className="sm:col-span-2">
                <Textarea
                  value={personal.note ?? ""}
                  onChange={(e) => set("personal", "note", e.target.value.slice(0, 600))}
                  className="min-h-20 bg-card"
                />
              </Field>
            </FieldGrid>
          </TabsContent>

          <TabsContent value="family" className="mt-0">
            <FieldGrid>
              <Field label="Father's / guardian's name" required error={err("family", "fatherName")}>
                <Input
                  value={family.fatherName ?? ""}
                  onChange={(e) => set("family", "fatherName", e.target.value)}
                  aria-invalid={!!err("family", "fatherName") || undefined}
                  className="h-10 bg-card"
                />
              </Field>
              <Field label="Mother's / guardian's name" required error={err("family", "motherName")}>
                <Input
                  value={family.motherName ?? ""}
                  onChange={(e) => set("family", "motherName", e.target.value)}
                  aria-invalid={!!err("family", "motherName") || undefined}
                  className="h-10 bg-card"
                />
              </Field>
              <Field label="Father is">
                <SelectField value={family.fatherStatus} onChange={(v) => set("family", "fatherStatus", v)} options={parentStatus} />
              </Field>
              <Field label="Mother is">
                <SelectField value={family.motherStatus} onChange={(v) => set("family", "motherStatus", v)} options={parentStatus} />
              </Field>
              <Field label="Father's occupation">
                <SelectField value={family.fatherOccup} onChange={(v) => set("family", "fatherOccup", v)} options={employedInOptions} />
              </Field>
              <Field label="Mother's occupation">
                <SelectField value={family.motherOccup} onChange={(v) => set("family", "motherOccup", v)} options={employedInOptions} />
              </Field>
              <Field label="Family status" className="sm:col-span-2">
                <SelectField value={family.familyStatus} onChange={(v) => set("family", "familyStatus", v)} options={familyStatus} />
              </Field>
              {(
                [
                  ["elderBro", "elderBroMar", "Elder brothers"],
                  ["youngerBro", "youngerBroMar", "Younger brothers"],
                  ["elderSis", "elderSisMar", "Elder sisters"],
                  ["youngerSis", "youngerSisMar", "Younger sisters"],
                ] as const
              ).map(([count, married, label]) => (
                <div key={count} className="grid grid-cols-2 gap-3">
                  <Field label={label}>
                    <SelectField
                      value={family[count]}
                      onChange={(v) => set("family", count, v)}
                      options={noSiblingOptions}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="of whom married">
                    <SelectField
                      value={family[married]}
                      onChange={(v) => set("family", married, v)}
                      options={noSiblingOptions.filter((o) => Number(o.value) <= Number(family[count] ?? 0))}
                      placeholder="0"
                      disabled={!family[count] || family[count] === "0"}
                    />
                  </Field>
                </div>
              ))}
              <Field label="About my family" className="sm:col-span-2">
                <Textarea
                  value={family.note ?? ""}
                  onChange={(e) => set("family", "note", e.target.value.slice(0, 600))}
                  placeholder="Native place, traditions, values…"
                  className="min-h-20 bg-card"
                />
              </Field>
            </FieldGrid>
          </TabsContent>

          <TabsContent value="partner" className="mt-0">
            <p className="mb-4 text-sm text-muted-foreground">
              These preferences decide which profiles you see on your Matches page.
            </p>
            <PartnerPreferencesForm
              value={data.partner ?? {}}
              onChange={(name, value) => set("partner", name, value)}
              writeNote={() => writePartnerNote(data)}
              errors={showErrors ? errors.partner : {}}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* Sticky save bar (sits above the mobile tab bar) */}
      <div className="sticky bottom-20 z-30 mt-6 lg:bottom-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-2xl border border-gold/40 bg-card/95 p-3 shadow-lg backdrop-blur">
          <p className={cn("text-xs sm:text-sm", totalMissing ? "text-muted-foreground" : "text-success")}>
            {totalMissing ? `${totalMissing} required item${totalMissing === 1 ? "" : "s"} left` : "Ready to save"}
          </p>
          <Button size="lg" onClick={onSave} disabled={saving}>
            <Save />
            Save profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
