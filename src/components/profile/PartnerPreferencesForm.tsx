import { EyeOff, ShieldCheck } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/fields/Field";
import { WriteForMe } from "@/components/fields/WriteForMe";
import { MultiSelectField } from "@/components/fields/SelectField";
import { ChipGroup, FilterGroup, RangeField } from "@/components/fields/FilterControls";
import {
  ageOptions,
  countryOptions,
  employedInOptions,
  heightOptions,
  maritalOptions,
  qualificationOptions,
  qualificationPresets,
} from "@/utils/constants";
import type { PartnerDetailsIn } from "@/utils/interfaces";
import { casteOptions, motherTongueOptions, normalizeToArray } from "@/utils/utils";

interface Props {
  value: PartnerDetailsIn;
  onChange: (name: keyof PartnerDetailsIn, value: string | string[] | undefined) => void;
  errors?: Partial<Record<keyof PartnerDetailsIn, string>>;
  /** When given, shows a "Write for me" button for the note. */
  writeNote?: () => string;
}

const shortHeight = (label: string) => label.split(" (")[0];

/** Plain-language summary of who will be able to see this member. */
const audience = (p: PartnerDetailsIn) => {
  const parts: string[] = [];
  if (p.ageFrom || p.ageTo) parts.push(`aged ${p.ageFrom ?? 18} to ${p.ageTo ?? 60}`);
  const caste = normalizeToArray(p.caste);
  if (caste.length) parts.push(`from ${caste.length > 2 ? `${caste.length} selected castes` : caste.join(" or ")}`);
  const tongue = normalizeToArray(p.motherTongue);
  if (tongue.length) parts.push(`speaking ${tongue.length > 2 ? `${tongue.length} selected languages` : tongue.join(" or ")}`);
  const work = normalizeToArray(p.employedIn);
  if (work.length) parts.push(`working in ${work.join(", ").toLowerCase()}`);
  return parts.length ? `Only members ${parts.join(", ")} can see your profile.` : "Everyone of the opposite gender can see your profile.";
};

export const PartnerPreferencesForm = ({ value, onChange, errors = {}, writeNote }: Props) => (
  <div>
    <div className="mb-5 flex gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-4">
      <EyeOff className="mt-0.5 size-5 shrink-0 text-primary" />
      <div className="space-y-1 text-sm">
        <p className="font-semibold text-foreground">Your preferences also decide who can see you</p>
        <p className="text-muted-foreground">
          Matching works both ways. If you choose, for example, only certain castes or an age range,{" "}
          <b className="text-foreground">members outside your choices will not be able to find or view your profile</b>,
          and you won't see them either. Leave a section empty to welcome everyone.
        </p>
        <p className="flex items-center gap-1.5 pt-1 font-medium text-primary">
          <ShieldCheck className="size-4" />
          {audience(value)}
        </p>
      </div>
    </div>

    <div className="grid gap-x-8 lg:grid-cols-2">
      <div>
        <FilterGroup title="Age *" hint={errors.ageFrom || errors.ageTo ? "Please choose an age range" : undefined}>
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
        </FilterGroup>
        <FilterGroup title="Height">
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
        </FilterGroup>
        <FilterGroup title="Marital status" hint="Leave empty for any">
          <ChipGroup options={maritalOptions} value={value.martialStatus} onChange={(v) => onChange("martialStatus", v)} />
        </FilterGroup>
        <FilterGroup title="Employed in *" hint={errors.employedIn ? <span className="text-destructive">Choose at least one</span> : undefined}>
          <ChipGroup options={employedInOptions} value={value.employedIn} onChange={(v) => onChange("employedIn", v)} />
        </FilterGroup>
      </div>
      <div>
        <FilterGroup title="Caste *">
          <Field error={errors.caste}>
            <MultiSelectField
              value={value.caste}
              onChange={(v) => onChange("caste", v)}
              options={casteOptions}
              placeholder="Choose castes"
              invalid={!!errors.caste}
            />
          </Field>
        </FilterGroup>
        <FilterGroup title="Mother tongue">
          <MultiSelectField
            value={value.motherTongue}
            onChange={(v) => onChange("motherTongue", v)}
            options={motherTongueOptions}
            placeholder="Any language"
          />
        </FilterGroup>
        <FilterGroup title="Education">
          <MultiSelectField
            value={value.qualification}
            onChange={(v) => onChange("qualification", v)}
            options={qualificationOptions}
            presets={qualificationPresets}
            placeholder="Any education"
          />
        </FilterGroup>
        <FilterGroup title="Country">
          <MultiSelectField
            value={value.country}
            onChange={(v) => onChange("country", v)}
            options={countryOptions}
            placeholder="Any country"
          />
        </FilterGroup>
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
