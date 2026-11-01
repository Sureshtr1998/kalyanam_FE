import type { ReactNode } from "react";
import { Heart, Lock, LockOpen, ShieldCheck } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/fields/Field";
import { WriteForMe } from "@/components/fields/WriteForMe";
import { MultiSelectField } from "@/components/fields/SelectField";
import { ChipGroup, FilterGroup, RangeField } from "@/components/fields/FilterControls";
import { cn } from "@/lib/utils";
import {
  ageOptions,
  countryOptions,
  employedInOptions,
  heightOptions,
  maritalOptions,
  qualificationOptions,
  qualificationPresets,
} from "@/utils/constants";
import type { PartnerDetailsIn, SelectType } from "@/utils/interfaces";
import { casteOptions, motherTongueOptions, normalizeToArray } from "@/utils/utils";

interface Props {
  value: PartnerDetailsIn;
  onChange: (name: keyof PartnerDetailsIn, value: string | string[] | undefined) => void;
  errors?: Partial<Record<keyof PartnerDetailsIn, string>>;
  /** When given, shows a "Write for me" button for the note. */
  writeNote?: () => string;
}

type StrictKey =
  | "age"
  | "height"
  | "caste"
  | "subCaste"
  | "motherTongue"
  | "martialStatus"
  | "qualification"
  | "employedIn"
  | "country";

/** Same keys as the backend (utils/matching.js). Members who never chose have every one. */
const ALL_STRICT: StrictKey[] = [
  "age",
  "height",
  "caste",
  "subCaste",
  "motherTongue",
  "martialStatus",
  "qualification",
  "employedIn",
  "country",
];

const strictOf = (p: PartnerDetailsIn) => p.strict ?? ALL_STRICT;

const shortHeight = (label: string) => label.split(" (")[0];

const labelOf = (options: SelectType[], v: string) => options.find((o) => o.value === v)?.label ?? v;

/** "Tamil or Telugu", or "4 selected languages" for longer lists. */
const either = (values: string[], noun: string, options: SelectType[] = []) =>
  values.length > 2 ? `${values.length} selected ${noun}` : values.map((v) => labelOf(options, v)).join(" or ");

/** Each filled preference in words, with its must-have key. */
const describe = (p: PartnerDetailsIn): [StrictKey, string][] => {
  const out: [StrictKey, string][] = [];
  if (p.ageFrom || p.ageTo) out.push(["age", `aged ${p.ageFrom ?? 18} to ${p.ageTo ?? 60}`]);
  if (p.heightFrom || p.heightTo) {
    const h = (v?: string) => shortHeight(labelOf(heightOptions, v ?? ""));
    out.push([
      "height",
      p.heightFrom && p.heightTo
        ? `${h(p.heightFrom)} to ${h(p.heightTo)} tall`
        : p.heightFrom
        ? `at least ${h(p.heightFrom)} tall`
        : `up to ${h(p.heightTo)} tall`,
    ]);
  }
  const list = (key: StrictKey & keyof PartnerDetailsIn, text: (v: string[]) => string) => {
    const v = normalizeToArray(p[key] as string | string[] | undefined);
    if (v.length) out.push([key, text(v)]);
  };
  list("caste", (v) => `from ${either(v, "castes", casteOptions)}`);
  list("motherTongue", (v) => `speaking ${either(v, "languages", motherTongueOptions)}`);
  list("martialStatus", (v) => either(v, "marital statuses", maritalOptions).toLowerCase());
  list("qualification", (v) => `with ${either(v, "qualifications", qualificationOptions)}`);
  list("employedIn", (v) => `working in ${v.map((x) => labelOf(employedInOptions, x)).join(", ").toLowerCase()}`);
  list("country", (v) => `living in ${either(v, "countries", countryOptions)}`);
  return out;
};

/** Plain-language summary: who can see this member, and what is only preferred. */
const Audience = ({ value }: { value: PartnerDetailsIn }) => {
  const strict = strictOf(value);
  const parts = describe(value);
  const must = parts.filter(([k]) => strict.includes(k)).map(([, t]) => t);
  const nice = parts.filter(([k]) => !strict.includes(k)).map(([, t]) => t);
  return (
    <div className="space-y-1.5 pt-1">
      <p className="flex gap-1.5 font-medium text-primary">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" />
        {must.length
          ? `Only members ${must.join(", ")} can see your profile.`
          : "Everyone of the opposite gender can see your profile."}
      </p>
      {nice.length > 0 && (
        <p className="flex gap-1.5 text-muted-foreground">
          <Heart className="mt-0.5 size-4 shrink-0" />
          <span>
            <b className="text-foreground">Preferred:</b> {nice.join(", ")}. Members outside these can still see you;
            they only shape your own matches.
          </span>
        </p>
      )}
    </div>
  );
};

/** Lock pill that marks one preference as a must-have. */
const MustHave = ({ name, value, onChange }: { name: StrictKey; value: PartnerDetailsIn; onChange: Props["onChange"] }) => {
  const strict = strictOf(value);
  const on = strict.includes(name);
  return (
    <button
      type="button"
      aria-pressed={on}
      title={on ? "Members outside this cannot see you" : "Members outside this can still see you"}
      onClick={() => onChange("strict", on ? strict.filter((k) => k !== name) : [...strict, name])}
      className={cn(
        "flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        on
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border bg-card text-muted-foreground hover:border-gold hover:text-foreground"
      )}>
      {on ? <Lock className="size-3" /> : <LockOpen className="size-3" />}
      {on ? "Must-have" : "Preferred"}
    </button>
  );
};

/** FilterGroup with a must-have toggle in its header. */
const PrefGroup = ({
  name,
  value,
  onChange,
  ...rest
}: {
  name: StrictKey;
  value: PartnerDetailsIn;
  onChange: Props["onChange"];
  title: string;
  hint?: ReactNode;
  children: ReactNode;
}) => <FilterGroup {...rest} action={<MustHave name={name} value={value} onChange={onChange} />} />;

export const PartnerPreferencesForm = ({ value, onChange, errors = {}, writeNote }: Props) => (
  <div>
    <div className="mb-5 flex gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-4">
      <Lock className="mt-0.5 size-5 shrink-0 text-primary" />
      <div className="space-y-1 text-sm">
        <p className="font-semibold text-foreground">Must-haves also decide who can see you</p>
        <p className="text-muted-foreground">
          Matching works both ways. Mark a preference as a <b className="text-foreground">must-have</b> and{" "}
          <b className="text-foreground">members outside it will not be able to find or view your profile</b>. Leave
          it as <b className="text-foreground">preferred</b> and it only shapes your own matches. Every must-have
          shrinks who can see you, so keep them for real dealbreakers.
        </p>
        <Audience value={value} />
      </div>
    </div>

    <div className="grid gap-x-8 lg:grid-cols-2">
      <div>
        <PrefGroup name="age" value={value} onChange={onChange} title="Age *" hint={errors.ageFrom || errors.ageTo ? "Please choose an age range" : undefined}>
          <RangeField
            explicit
            options={ageOptions}
            from={value.ageFrom}
            to={value.ageTo}
            format={(o) => `${o.label} yrs`}
            onChange={(from, to) => {
              onChange("ageFrom", from);
              onChange("ageTo", to);
            }}
          />
        </PrefGroup>
        <PrefGroup name="height" value={value} onChange={onChange} title="Height">
          <RangeField
            options={heightOptions}
            from={value.heightFrom}
            to={value.heightTo}
            format={(o) => shortHeight(o.label)}
            onChange={(from, to) => {
              onChange("heightFrom", from);
              onChange("heightTo", to);
            }}
          />
        </PrefGroup>
        <PrefGroup name="martialStatus" value={value} onChange={onChange} title="Marital status" hint="Leave empty for any">
          <ChipGroup options={maritalOptions} value={value.martialStatus} onChange={(v) => onChange("martialStatus", v)} />
        </PrefGroup>
        <PrefGroup name="employedIn" value={value} onChange={onChange} title="Employed in *" hint={errors.employedIn ? <span className="text-destructive">Choose at least one</span> : undefined}>
          <ChipGroup options={employedInOptions} value={value.employedIn} onChange={(v) => onChange("employedIn", v)} />
        </PrefGroup>
      </div>
      <div>
        <PrefGroup name="caste" value={value} onChange={onChange} title="Caste *">
          <Field error={errors.caste}>
            <MultiSelectField
              value={value.caste}
              onChange={(v) => onChange("caste", v)}
              options={casteOptions}
              placeholder="Choose castes"
              invalid={!!errors.caste}
            />
          </Field>
        </PrefGroup>
        <PrefGroup name="motherTongue" value={value} onChange={onChange} title="Mother tongue">
          <MultiSelectField
            value={value.motherTongue}
            onChange={(v) => onChange("motherTongue", v)}
            options={motherTongueOptions}
            placeholder="Any language"
          />
        </PrefGroup>
        <PrefGroup name="qualification" value={value} onChange={onChange} title="Education">
          <MultiSelectField
            value={value.qualification}
            onChange={(v) => onChange("qualification", v)}
            options={qualificationOptions}
            presets={qualificationPresets}
            placeholder="Any education"
          />
        </PrefGroup>
        <PrefGroup name="country" value={value} onChange={onChange} title="Country">
          <MultiSelectField
            value={value.country}
            onChange={(v) => onChange("country", v)}
            options={countryOptions}
            placeholder="Any country"
          />
        </PrefGroup>
        <FilterGroup
          title="Anything else?"
          action={
            writeNote && <WriteForMe value={value.note} onChange={(t) => onChange("note", t)} write={writeNote} />
          }>
          <Textarea
            value={value.note ?? ""}
            onChange={(e) => onChange("note", e.target.value.slice(0, 500))}
            placeholder="Values, lifestyle, family expectations…"
            className="min-h-24 bg-card"
          />
        </FilterGroup>
      </div>
    </div>
  </div>
);
