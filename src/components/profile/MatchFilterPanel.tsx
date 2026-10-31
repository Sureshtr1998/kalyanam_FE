import { MultiSelectField } from "@/components/fields/SelectField";
import { ChipGroup, FilterGroup, RangeField } from "@/components/fields/FilterControls";
import {
  ageOptions,
  countryOptions,
  dietOptions,
  employedInOptions,
  heightOptions,
  maritalOptions,
  qualificationOptions,
  qualificationPresets,
} from "@/utils/constants";
import type { MatchFilters, PartnerDetailsIn } from "@/utils/interfaces";
import { casteOptions, motherTongueOptions } from "@/utils/utils";

interface Props {
  value: MatchFilters;
  onChange: (value: MatchFilters) => void;
}

/** The body of the Matches filter sheet. */
export const MatchFilterPanel = ({ value, onChange }: Props) => {
  const p = value.partner;
  const setPartner = (patch: Partial<PartnerDetailsIn>) => onChange({ ...value, partner: { ...p, ...patch } });

  return (
    <div>
      <FilterGroup title="Age">
        <RangeField
          options={ageOptions}
          from={p.ageFrom}
          to={p.ageTo}
          format={(o) => `${o.label} yrs`}
          onChange={(ageFrom, ageTo) => setPartner({ ageFrom, ageTo })}
        />
      </FilterGroup>
      <FilterGroup title="Height">
        <RangeField
          options={heightOptions}
          from={p.heightFrom}
          to={p.heightTo}
          format={(o) => o.label.split(" (")[0]}
          onChange={(heightFrom, heightTo) => setPartner({ heightFrom, heightTo })}
        />
      </FilterGroup>
      <FilterGroup title="Community">
        <div className="grid gap-2">
          <MultiSelectField
            value={p.caste}
            onChange={(caste) => setPartner({ caste })}
            options={casteOptions}
            placeholder="Any caste"
          />
          <MultiSelectField
            value={p.motherTongue}
            onChange={(motherTongue) => setPartner({ motherTongue })}
            options={motherTongueOptions}
            placeholder="Any mother tongue"
          />
        </div>
      </FilterGroup>
      <FilterGroup title="Marital status">
        <ChipGroup options={maritalOptions} value={p.martialStatus} onChange={(martialStatus) => setPartner({ martialStatus })} />
      </FilterGroup>
      <FilterGroup title="Diet">
        <ChipGroup options={dietOptions} value={value.diet} onChange={(diet) => onChange({ ...value, diet })} />
      </FilterGroup>
      <FilterGroup title="Employed in">
        <ChipGroup options={employedInOptions} value={p.employedIn} onChange={(employedIn) => setPartner({ employedIn })} />
      </FilterGroup>
      <FilterGroup title="Education & location">
        <div className="grid gap-2">
          <MultiSelectField
            value={p.qualification}
            onChange={(qualification) => setPartner({ qualification })}
            options={qualificationOptions}
            presets={qualificationPresets}
            placeholder="Any education"
          />
          <MultiSelectField
            value={p.country}
            onChange={(country) => setPartner({ country })}
            options={countryOptions}
            placeholder="Any country"
          />
        </div>
      </FilterGroup>
    </div>
  );
};
