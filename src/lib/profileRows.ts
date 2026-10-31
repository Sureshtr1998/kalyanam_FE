import { formatFloating } from "@/lib/dates";
import {
  countryOptions,
  createdByOptions,
  dietOptions,
  employedInOptions,
  familyStatus,
  heightOptions,
  maritalOptions,
  nakshatraOptions,
  parentStatus,
  qualificationOptions,
  qualificationPresets,
  rashiOptions,
  residingOptions,
} from "@/utils/constants";
import type { SelectType, UserDetails } from "@/utils/interfaces";
import { motherTongueOptions, normalizeToArray, optionLabel, presetLabels } from "@/utils/utils";

/** A label and its value; a list renders as chips on screen and as a comma list in the PDF. */
export type Row = [string, string | string[] | undefined];

const labels = (options: SelectType[], value?: string | string[]) =>
  normalizeToArray(value).map((v) => options.find((o) => o.value === v)?.label ?? v);

/**
 * Income is entered in lakhs per annum, but older profiles stored full rupees
 * (e.g. 1200000). Anything that large can't be LPA, so convert it.
 */
export const formatIncome = (salary?: number | string) => {
  const n = Number(salary);
  if (!n || n < 0) return undefined;
  const lpa = n >= 1000 ? n / 100000 : n;
  return `₹${Number(lpa.toFixed(2))} LPA`;
};

const siblings =(count?: string, married?: string) =>
  count && count !== "0" ? `${count}${married && married !== "0" ? ` (${married} married)` : ""}` : undefined;

export const aboutRows = ({ basic, personal = {} }: UserDetails): Row[] => [
  ["Born", formatFloating(basic.dob)],
  ["Mother tongue", optionLabel(motherTongueOptions, basic.motherTongue)],
  ["Marital status", optionLabel(maritalOptions, basic.martialStatus)],
  ["Height", optionLabel(heightOptions, personal.height)],
  ["Weight", personal.weight ? `${personal.weight} kg` : undefined],
  ["Diet", optionLabel(dietOptions, personal.diet)],
  ["Caste", [basic.caste, basic.subCaste].filter(Boolean).join(", ") || undefined],
  ["Gothra", basic.gothra],
  ["Rashi", optionLabel(rashiOptions, personal.rashi)],
  ["Nakshatra", optionLabel(nakshatraOptions, personal.nakshatra)],
  ["Profile created by", optionLabel(createdByOptions, basic.profileCreatedBy)],
];

export const careerRows = ({ basic, personal = {} }: UserDetails): Row[] => [
  ["Education", optionLabel(qualificationOptions, basic.qualification)],
  ["Employed in", optionLabel(employedInOptions, personal.employedIn)],
  ["Annual income", formatIncome(personal.salary)],
  ["Work city", personal.workCity],
  ["Country", optionLabel(countryOptions, personal.country)],
  ["Residing status", optionLabel(residingOptions, personal.residingStatus)],
  ["Address", personal.address],
];

export const familyRows = ({ family = {} }: UserDetails): Row[] => [
  ["Father", [family.fatherName, optionLabel(parentStatus, family.fatherStatus)].filter(Boolean).join(", ") || undefined],
  ["Father's occupation", optionLabel(employedInOptions, family.fatherOccup)],
  ["Mother", [family.motherName, optionLabel(parentStatus, family.motherStatus)].filter(Boolean).join(", ") || undefined],
  ["Mother's occupation", optionLabel(employedInOptions, family.motherOccup)],
  ["Family status", optionLabel(familyStatus, family.familyStatus)],
  ["Elder brothers", siblings(family.elderBro, family.elderBroMar)],
  ["Younger brothers", siblings(family.youngerBro, family.youngerBroMar)],
  ["Elder sisters", siblings(family.elderSis, family.elderSisMar)],
  ["Younger sisters", siblings(family.youngerSis, family.youngerSisMar)],
];

export const preferenceRows = ({ partner = {} }: UserDetails): Row[] => [
  ["Age", partner.ageFrom || partner.ageTo ? `${partner.ageFrom ?? "18"} to ${partner.ageTo ?? "60"} yrs` : undefined],
  [
    "Height",
    partner.heightFrom || partner.heightTo
      ? `${optionLabel(heightOptions, partner.heightFrom) ?? "Any"} to ${optionLabel(heightOptions, partner.heightTo) ?? "Any"}`
      : undefined,
  ],
  ["Caste", labels([], partner.caste)],
  ["Mother tongue", labels(motherTongueOptions, partner.motherTongue)],
  ["Employed in", labels(employedInOptions, partner.employedIn)],
  ["Education", presetLabels(qualificationOptions, qualificationPresets, partner.qualification)],
  ["Marital status", labels(maritalOptions, partner.martialStatus)],
  ["Country", labels(countryOptions, partner.country)],
];
