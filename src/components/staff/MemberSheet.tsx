import { useEffect, useState, type ReactNode } from "react";
import {
  BadgeCheck,
  Coins,
  Copy,
  Eye,
  EyeOff,
  IndianRupee,
  LoaderCircle,
  Pencil,
  ShieldCheck,
  ShieldOff,
  Trash2,
  UserMinus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Field, FieldGrid } from "@/components/fields/Field";
import { SelectField } from "@/components/fields/SelectField";
import { DateField } from "@/components/fields/DateField";
import { PartnerPreferencesForm } from "@/components/profile/PartnerPreferencesForm";
import { ProfilePlaceholder } from "@/components/common/ProfilePlaceholder";
import api from "@/utils/api";
import {
  countryOptions,
  createdByOptions,
  dietOptions,
  employedInOptions,
  familyStatus,
  genderOptions,
  gothraOptions,
  heightOptions,
  imageUrl,
  maritalOptions,
  nakshatraOptions,
  qualificationOptions,
  rashiOptions,
  residingOptions,
} from "@/utils/constants";
import { casteOptions, fetchLabel, motherTongueOptions, subCasteOptions } from "@/utils/utils";
import type { PartnerDetailsIn } from "@/utils/interfaces";
import { ageFromFloating, formatFloating, formatInstant, toDateValue } from "@/lib/dates";
import { errorMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";
import { inr, type MemberDetail, type StaffKind } from "./staffTypes";

interface Props {
  id: string | null;
  kind: StaffKind;
  onClose: () => void;
  /** Something changed (or the member was removed); refresh the list. */
  onChanged: () => void;
}

type Draft = {
  basic: Record<string, unknown>;
  personal: Record<string, unknown>;
  family: Record<string, unknown>;
  partner: PartnerDetailsIn;
  staffNote: string;
};

const toDraft = (m: MemberDetail): Draft => ({
  basic: { ...m.basic, dob: toDateValue(m.basic.dob) },
  personal: { ...(m.personal ?? {}) },
  family: { ...(m.family ?? {}) },
  partner: { ...(m.partner ?? {}) },
  staffNote: m.staffNote ?? "",
});

const Row = ({ label, value }: { label: string; value?: ReactNode }) => (
  <div className="flex justify-between gap-3 border-b border-border/60 py-1.5 text-sm last:border-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right font-medium">{value || value === 0 ? value : "-"}</span>
  </div>
);

const copy = (text?: string) => {
  if (!text) return;
  void navigator.clipboard.writeText(text);
  toast.success("Copied", { description: text });
};

export const MemberSheet = ({ id, kind, onClose, onChanged }: Props) => {
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [tab, setTab] = useState("overview");
  const [busy, setBusy] = useState<string | null>(null);
  const [credits, setCredits] = useState("");
  const admin = kind === "admin";

  useEffect(() => {
    if (!id) return;
    setMember(null);
    setTab("overview");
    api
      .get<{ member: MemberDetail }>(`/manage/users/${id}`)
      .then((res) => {
        setMember(res.data.member);
        setDraft(toDraft(res.data.member));
      })
      .catch((err) => {
        toast.error("Couldn't load member", { description: errorMessage(err) });
        onClose();
      });
  }, [id, onClose]);

  const act = async (key: string, run: () => Promise<{ data: { msg: string; member?: MemberDetail } }>, close = false) => {
    setBusy(key);
    try {
      const res = await run();
      toast.success(res.data.msg);
      if (res.data.member) {
        setMember(res.data.member);
        setDraft(toDraft(res.data.member));
      }
      onChanged();
      if (close) onClose();
    } catch (err) {
      toast.error("Couldn't save", { description: errorMessage(err) });
    } finally {
      setBusy(null);
    }
  };

  const post = (path: string, body?: object) => () => api.post(`/manage/users/${id}/${path}`, body);

  const setIn = (section: "basic" | "personal" | "family", key: string, value: unknown) =>
    setDraft((d) => (d ? { ...d, [section]: { ...d[section], [key]: value } } : d));

  const save = () =>
    draft &&
    act("save", () =>
      api.post(`/manage/users/${id}/profile`, {
        basic: draft.basic,
        personal: draft.personal,
        family: draft.family,
        partner: draft.partner,
        staffNote: draft.staffNote,
      })
    );

  const b = draft?.basic ?? {};
  const text = (section: "basic" | "personal" | "family", key: string, label: string, props: { type?: string; maxLength?: number } = {}) => (
    <Field label={label}>
      <Input
        value={String((draft?.[section] as Record<string, unknown>)?.[key] ?? "")}
        onChange={(e) => setIn(section, key, e.target.value)}
        className="h-10 bg-card"
        {...props}
      />
    </Field>
  );
  const select = (
    section: "basic" | "personal" | "family",
    key: string,
    label: string,
    options: { label: string; value: string }[],
    searchable = false
  ) => (
    <Field label={label}>
      <SelectField
        value={String((draft?.[section] as Record<string, unknown>)?.[key] ?? "")}
        onChange={(v) => setIn(section, key, v)}
        options={options}
        searchable={searchable}
      />
    </Field>
  );

  const images = (b.images as { url: string; fileId: string }[] | undefined) ?? [];

  return (
    <Sheet open={!!id} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto p-0 sm:max-w-2xl">
        {!member || !draft ? (
          <div className="space-y-4 p-6">
            <SheetHeader className="p-0">
              <SheetTitle>Loading member…</SheetTitle>
              <SheetDescription className="sr-only">Member details are loading.</SheetDescription>
            </SheetHeader>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <>
            <SheetHeader className="border-b border-border bg-gradient-to-r from-primary/10 via-accent to-gold/15 p-5">
              <div className="flex items-center gap-4">
                <div className="size-16 shrink-0 overflow-hidden rounded-2xl ring-2 ring-gold/40">
                  {member.basic.images?.[0]?.url ? (
                    <img src={imageUrl(member.basic.images[0].url, "thumb")} alt="" className="size-full object-cover" />
                  ) : (
                    <ProfilePlaceholder name={member.basic.fullName} seed={member._id} />
                  )}
                </div>
                <div className="min-w-0">
                  <SheetTitle className="truncate font-display text-2xl">{member.basic.fullName}</SheetTitle>
                  <SheetDescription className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <button type="button" onClick={() => copy(member.basic.uniqueId)} className="inline-flex items-center gap-1 font-mono font-semibold text-foreground">
                      {member.basic.uniqueId} <Copy className="size-3" />
                    </button>
                    <span>·</span>
                    <span>
                      {member.basic.gender}, {ageFromFloating(member.basic.dob) ?? "?"} yrs
                    </span>
                    <span>·</span>
                    <span>Joined {formatInstant(member.createdAt)}</span>
                  </SheetDescription>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {member.isVerified ? (
                      <Badge className="bg-success text-white"><BadgeCheck /> Verified</Badge>
                    ) : (
                      <Badge variant="outline">Not verified</Badge>
                    )}
                    {member.isHidden && <Badge variant="secondary"><EyeOff /> Hidden</Badge>}
                    {!member.hasCompleteProfile && <Badge variant="outline" className="border-gold text-gold-foreground">Incomplete</Badge>}
                    {member.isAdmin && <Badge><ShieldCheck /> Admin</Badge>}
                    {member.brokerUnlinked && <Badge variant="outline">Removed by partner</Badge>}
                  </div>
                </div>
              </div>
            </SheetHeader>

            {/* Quick actions */}
            <div className="flex flex-wrap gap-2 border-b border-border p-4">
              <Button
                size="sm"
                variant={member.isVerified ? "outline" : "default"}
                disabled={!!busy}
                onClick={() => act("verify", post("verify", { value: !member.isVerified }))}>
                {busy === "verify" ? <LoaderCircle className="animate-spin" /> : <BadgeCheck />}
                {member.isVerified ? "Remove verification" : "Verify profile"}
              </Button>
              <Button size="sm" variant="outline" disabled={!!busy} onClick={() => act("hide", post("hidden", { value: !member.isHidden }))}>
                {busy === "hide" ? <LoaderCircle className="animate-spin" /> : member.isHidden ? <Eye /> : <EyeOff />}
                {member.isHidden ? "Unhide profile" : "Hide profile"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setTab("edit")}>
                <Pencil /> Edit profile
              </Button>
              {admin && (
                <ConfirmButton
                  icon={member.isAdmin ? <ShieldOff /> : <ShieldCheck />}
                  label={member.isAdmin ? "Remove admin" : "Make admin"}
                  disabled={!!busy}
                  title={member.isAdmin ? `Remove ${member.basic.fullName}'s admin access?` : `Make ${member.basic.fullName} an admin?`}
                  description={
                    member.isAdmin
                      ? "They will lose access to the admin panel straight away."
                      : "Admins can see every member's contact details, edit or delete accounts, change credits and manage partners."
                  }
                  confirm={member.isAdmin ? "Remove admin" : "Make admin"}
                  onConfirm={() => act("admin", post("admin", { value: !member.isAdmin }))}
                />
              )}
              {!admin && (
                <ConfirmButton
                  icon={<UserMinus />}
                  label="Remove from my list"
                  title={`Remove ${member.basic.fullName} from your list?`}
                  description="Their account stays active on the site; you just won't manage them any more. Only an admin can undo this."
                  confirm="Remove"
                  onConfirm={() => act("unlink", post("unlink"), true)}
                />
              )}
              {admin && (
                <ConfirmButton
                  icon={<Trash2 />}
                  label="Delete account"
                  destructive
                  title={`Delete ${member.basic.fullName}'s account?`}
                  description="This permanently removes their profile, photos and history, and can't be undone."
                  confirm="Delete permanently"
                  onConfirm={() => act("delete", () => api.delete(`/manage/users/${id}`), true)}
                />
              )}
            </div>

            <Tabs value={tab} onValueChange={setTab} className="p-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="activity">{admin ? "Payments" : "Activity"}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-3 space-y-4">
                <section className="rounded-2xl border border-border p-4">
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Contact</h3>
                  <Row label="Email" value={<button type="button" onClick={() => copy(member.basic.email)} className="hover:text-primary">{member.basic.email}</button>} />
                  <Row label="WhatsApp" value={member.basic.mobile && <a href={`tel:+91${member.basic.mobile}`} className="hover:text-primary">+91 {member.basic.mobile}</a>} />
                  <Row label="Alternate" value={member.basic.alternateMob} />
                  <Row label="Address" value={member.personal?.address} />
                </section>
                <section className="rounded-2xl border border-border p-4">
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Profile</h3>
                  <Row label="Date of birth" value={formatFloating(member.basic.dob)} />
                  <Row label="Mother tongue" value={fetchLabel(motherTongueOptions, member.basic.motherTongue)} />
                  <Row label="Caste" value={[member.basic.caste, member.basic.subCaste].filter(Boolean).join(" · ")} />
                  <Row label="Gothra" value={member.basic.gothra} />
                  <Row label="Qualification" value={fetchLabel(qualificationOptions, member.basic.qualification)} />
                  <Row label="Work" value={[member.personal?.employedIn, member.personal?.workCity, member.personal?.country].filter(Boolean).join(" · ")} />
                  <Row label="Marital status" value={member.basic.martialStatus} />
                  <Row label="Created by" value={member.basic.profileCreatedBy} />
                  <Row label="Last active" value={member.lastActiveAt ? formatInstant(member.lastActiveAt, true) : "Never"} />
                  <Row
                    label="Referral"
                    value={member.basic.referralId ? `${member.basic.referralId}${member.broker ? ` (${member.broker.name})` : ""}` : "None"}
                  />
                  {admin && member.basic.referralId && member.broker && (
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted p-3 text-sm">
                      <span className="flex items-center gap-1.5">
                        <IndianRupee className="size-4 text-gold" />
                        Commission {member.commissionPaidAt ? `paid ${formatInstant(member.commissionPaidAt)}` : "due"}
                      </span>
                      <div className="flex gap-2">
                        {member.brokerUnlinked && (
                          <Button size="xs" variant="outline" disabled={!!busy} onClick={() => act("relink", post("relink"))}>
                            Return to partner
                          </Button>
                        )}
                        <Button
                          size="xs"
                          variant={member.commissionPaidAt ? "outline" : "default"}
                          disabled={!!busy}
                          onClick={() => act("commission", post("commission", { paid: !member.commissionPaidAt }))}>
                          {member.commissionPaidAt ? "Mark as due" : "Mark as paid"}
                        </Button>
                      </div>
                    </div>
                  )}
                </section>
                <section className="grid grid-cols-3 gap-2 text-center sm:grid-cols-4">
                  {[
                    ["Credits left", member.stats.remainingCredits],
                    ["Sent", member.stats.sent],
                    ["Received", member.stats.received],
                    ["Accepted", member.stats.accepted],
                    ["Declined", member.stats.declined],
                    ["Contacts seen", member.stats.contactsViewed],
                    ["Blocked", member.stats.blocked],
                    ["Profile views", member.stats.profileViews],
                  ].map(([label, n]) => (
                    <div key={label} className="rounded-xl bg-muted p-2">
                      <p className="font-display text-xl font-bold">{n}</p>
                      <p className="text-[11px] text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </section>
                {member.staffNote && (
                  <p className="rounded-xl border border-gold/40 bg-accent p-3 text-sm">
                    <span className="font-semibold">Staff note: </span>
                    {member.staffNote}
                  </p>
                )}
              </TabsContent>

              <TabsContent value="edit" className="mt-3 space-y-5">
                <section className="space-y-3">
                  <h3 className="text-sm font-bold">Photos</h3>
                  {images.length ? (
                    <div className="flex flex-wrap gap-2">
                      {images.map((img) => (
                        <div key={img.fileId} className="relative size-20 overflow-hidden rounded-xl ring-1 ring-border">
                          <img src={imageUrl(img.url, "thumb")} alt="" className="size-full object-cover" />
                          <button
                            type="button"
                            aria-label="Remove photo"
                            onClick={() => setIn("basic", "images", images.filter((i) => i.fileId !== img.fileId))}
                            className="absolute right-1 top-1 rounded-full bg-white/90 p-0.5 text-destructive shadow">
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No photos.</p>
                  )}
                </section>

                <section className="space-y-3">
                  <h3 className="text-sm font-bold">Basic</h3>
                  <FieldGrid>
                    {text("basic", "fullName", "Full name")}
                    {select("basic", "gender", "Gender", genderOptions)}
                    <Field label="Date of birth">
                      <DateField value={String(b.dob ?? "")} onChange={(v) => setIn("basic", "dob", v)} />
                    </Field>
                    {text("basic", "email", "Email", { type: "email" })}
                    {text("basic", "mobile", "WhatsApp number", { maxLength: 10 })}
                    {text("basic", "alternateMob", "Alternate number", { maxLength: 10 })}
                    {select("basic", "motherTongue", "Mother tongue", motherTongueOptions, true)}
                    {select("basic", "caste", "Caste", casteOptions, true)}
                    {select("basic", "subCaste", "Sub-caste", subCasteOptions(String(b.caste ?? "")), true)}
                    {select("basic", "gothra", "Gothra", gothraOptions, true)}
                    {select("basic", "qualification", "Qualification", qualificationOptions, true)}
                    {select("basic", "martialStatus", "Marital status", maritalOptions)}
                    {select("basic", "profileCreatedBy", "Profile created by", createdByOptions)}
                  </FieldGrid>
                  <Field label="About">
                    <Textarea value={String(b.note ?? "")} onChange={(e) => setIn("basic", "note", e.target.value)} rows={3} />
                  </Field>
                </section>

                <section className="space-y-3">
                  <h3 className="text-sm font-bold">Personal</h3>
                  <FieldGrid>
                    {select("personal", "height", "Height", heightOptions)}
                    {text("personal", "weight", "Weight (kg)", { type: "number" })}
                    {select("personal", "employedIn", "Employed in", employedInOptions)}
                    {text("personal", "salary", "Annual income (LPA)", { type: "number" })}
                    {text("personal", "workCity", "Work city")}
                    {select("personal", "country", "Country", countryOptions, true)}
                    {select("personal", "residingStatus", "Residing status", residingOptions)}
                    {select("personal", "diet", "Diet", dietOptions)}
                    {select("personal", "rashi", "Rashi", rashiOptions)}
                    {select("personal", "nakshatra", "Nakshatra", nakshatraOptions, true)}
                  </FieldGrid>
                  {text("personal", "address", "Address")}
                </section>

                <section className="space-y-3">
                  <h3 className="text-sm font-bold">Family</h3>
                  <FieldGrid>
                    {text("family", "fatherName", "Father's name")}
                    {text("family", "fatherOccup", "Father's occupation")}
                    {text("family", "motherName", "Mother's name")}
                    {text("family", "motherOccup", "Mother's occupation")}
                    {select("family", "familyStatus", "Family status", familyStatus)}
                  </FieldGrid>
                </section>

                <section className="space-y-3">
                  <h3 className="text-sm font-bold">Partner preferences</h3>
                  <PartnerPreferencesForm
                    value={draft.partner}
                    onChange={(k, v) => setDraft((d) => (d ? { ...d, partner: { ...d.partner, [k]: v } } : d))}
                  />
                </section>

                <Field label="Staff note" hint="Only visible to admins and this member's partner.">
                  <Textarea value={draft.staffNote} onChange={(e) => setDraft((d) => (d ? { ...d, staffNote: e.target.value } : d))} rows={2} />
                </Field>

                <div className="sticky bottom-0 -mx-4 flex justify-end gap-2 border-t border-border bg-background/95 p-3 backdrop-blur">
                  <Button variant="ghost" onClick={() => setDraft(toDraft(member))}>
                    Reset
                  </Button>
                  <Button onClick={() => void save()} disabled={!!busy}>
                    {busy === "save" && <LoaderCircle className="animate-spin" />}
                    Save changes
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="mt-3 space-y-4">
                {admin && (
                  <section className="rounded-2xl border border-border p-4">
                    <h3 className="mb-2 flex items-center gap-1.5 text-sm font-bold">
                      <Coins className="size-4 text-gold" /> Adjust credits
                    </h3>
                    <p className="mb-3 text-xs text-muted-foreground">
                      Currently {member.stats.remainingCredits} left. Use a negative number to take credits away. Logged in their payment history.
                    </p>
                    <form
                      className="flex gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        void act("credits", post("credits", { amount: Number(credits) })).then(() => setCredits(""));
                      }}>
                      <Input
                        type="number"
                        value={credits}
                        onChange={(e) => setCredits(e.target.value)}
                        placeholder="e.g. 10"
                        className="h-9 max-w-32"
                      />
                      <Button type="submit" size="sm" disabled={!credits || Number(credits) === 0 || !!busy}>
                        Apply
                      </Button>
                    </form>
                  </section>
                )}
                {admin ? (
                  <section className="rounded-2xl border border-border p-4">
                    <h3 className="mb-2 text-sm font-bold">
                      Payments <span className="font-normal text-muted-foreground">· {inr(member.stats.totalPaid)} in total</span>
                    </h3>
                    {member.transactions?.length ? (
                      <ul className="divide-y divide-border text-sm">
                        {member.transactions.map((t, i) => (
                          <li key={t.orderId ?? i} className="flex items-start justify-between gap-3 py-2">
                            <div className="min-w-0">
                              <p className="font-medium">{t.note}</p>
                              <p className="truncate font-mono text-xs text-muted-foreground">{t.paymentId || t.orderId}</p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="font-semibold">{inr(t.amountPaid)}</p>
                              <p className="text-xs text-muted-foreground">{formatInstant(t.dateOfTrans)}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No payments.</p>
                    )}
                  </section>
                ) : (
                  <p className={cn("rounded-2xl border border-border p-4 text-sm text-muted-foreground")}>
                    {member.basic.fullName.split(" ")[0]} has sent {member.stats.sent} interests, received {member.stats.received} and
                    accepted {member.stats.accepted}. Payment details are only visible to the admin team.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

/** A small outline button that asks for confirmation before running `onConfirm`. */
export const ConfirmButton = ({
  icon,
  label,
  title,
  description,
  confirm,
  destructive,
  disabled,
  className,
  onConfirm,
}: {
  icon: ReactNode;
  label: string;
  title: string;
  description: string;
  confirm: string;
  destructive?: boolean;
  disabled?: boolean;
  className?: string;
  onConfirm: () => void;
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        size="sm"
        variant="outline"
        disabled={disabled}
        className={cn(destructive && "border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive", className)}>
        {icon}
        {label}
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction className={cn(destructive && "bg-destructive text-white hover:bg-destructive/90")} onClick={onConfirm}>
          {confirm}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
