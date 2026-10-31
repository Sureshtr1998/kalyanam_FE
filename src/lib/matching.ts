import { ageFromFloating } from "@/lib/dates";
import type { PartnerDetailsIn, UserDetails } from "@/utils/interfaces";
import { normalizeToArray } from "@/utils/utils";
import { heightOptions } from "@/utils/constants";

const feet = (cm?: string) => heightOptions.find((o) => o.value === cm)?.label.split(" (")[0];

export interface PreferenceCheck {
  label: string;
  /** What the preference asks for, in words. */
  wanted: string;
  /** null = the other person hasn't filled this in. */
  ok: boolean | null;
}

const LIST_PREFS: {
  key: keyof PartnerDetailsIn;
  label: string;
  value: (u: UserDetails) => string | undefined;
}[] = [
  { key: "caste", label: "Caste", value: (u) => u.basic?.caste },
  { key: "subCaste", label: "Sub caste", value: (u) => u.basic?.subCaste },
  { key: "motherTongue", label: "Mother tongue", value: (u) => u.basic?.motherTongue },
  { key: "martialStatus", label: "Marital status", value: (u) => u.basic?.martialStatus },
  { key: "qualification", label: "Education", value: (u) => u.basic?.qualification },
  { key: "employedIn", label: "Employed in", value: (u) => u.personal?.employedIn },
  { key: "country", label: "Country", value: (u) => u.personal?.country },
];

const lower = (v?: string) => (v ?? "").toLowerCase();

/**
 * How `person` fits the partner preferences `prefs`.
 * Only preferences that were actually set are returned.
 */
export const checkPreferences = (
  prefs: PartnerDetailsIn | undefined,
  person: UserDetails
): PreferenceCheck[] => {
  if (!prefs) return [];
  const checks: PreferenceCheck[] = [];

  const age = ageFromFloating(person.basic?.dob);
  if (prefs.ageFrom || prefs.ageTo) {
    const from = Number(prefs.ageFrom || 18);
    const to = Number(prefs.ageTo || 60);
    checks.push({
      label: "Age",
      wanted: `${from} to ${to} yrs`,
      ok: age === null ? null : age >= from && age <= to,
    });
  }

  const height = Number(person.personal?.height);
  if (prefs.heightFrom || prefs.heightTo) {
    const from = Number(prefs.heightFrom || 0);
    const to = Number(prefs.heightTo || 999);
    checks.push({
      label: "Height",
      wanted:
        prefs.heightFrom && prefs.heightTo
          ? `${feet(prefs.heightFrom)} to ${feet(prefs.heightTo)}`
          : prefs.heightFrom
          ? `${feet(prefs.heightFrom)} or taller`
          : `Up to ${feet(prefs.heightTo)}`,
      ok: height ? height >= from && height <= to : null,
    });
  }

  for (const p of LIST_PREFS) {
    const wanted = normalizeToArray(prefs[p.key] as string | string[] | undefined);
    if (!wanted.length) continue;
    const value = p.value(person);
    checks.push({
      label: p.label,
      wanted: wanted.length > 3 ? `${wanted.slice(0, 3).join(", ")} +${wanted.length - 3}` : wanted.join(", "),
      ok: value ? wanted.map(lower).includes(lower(value)) : null,
    });
  }
  return checks;
};

/** Percentage of the viewer's set preferences that `candidate` meets. */
export const matchScore = (viewer: UserDetails, candidate: UserDetails) => {
  const checks = checkPreferences(viewer.partner, candidate).filter((c) => c.ok !== null);
  if (!checks.length) return null;
  return Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);
};

/** "Active today", "Active 3 days ago"… or null when unknown / long ago. */
export const activityLabel = (lastActiveAt?: string) => {
  if (!lastActiveAt) return null;
  const days = Math.floor((Date.now() - new Date(lastActiveAt).getTime()) / 86400000);
  if (Number.isNaN(days) || days > 30) return null;
  if (days < 1) return "Active today";
  if (days === 1) return "Active yesterday";
  return `Active ${days} days ago`;
};

export const isNewProfile = (createdAt?: string) =>
  !!createdAt && Date.now() - new Date(createdAt).getTime() < 14 * 86400000;
