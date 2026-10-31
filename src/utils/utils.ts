import type { UserDetails } from "./interfaces";
import casteData from "./caste.json"
import languageData from "./lang.json"
import { REFERRAL_REGISTRATION_FEE, CONTACT_COST, DISCOUNT_NAMES, PERSONAL_DISCOUNT_PRICE, REGISTRATION_FEE } from "./constants";

export const normalizeToArray = (value: string | string[] | undefined): string[] => {
    if (!value) return [];

    if (Array.isArray(value)) {
        return value.flatMap(item => item?.split(",")?.map(v => v.trim()).filter(Boolean));
    }

    return value?.split(",").map(v => v.trim()).filter(Boolean);
};

/** Label for a stored option value; undefined when empty. */
export const optionLabel = (options: { label: string; value: string }[], value?: string) =>
    value ? options.find((o) => o.value === value)?.label ?? value : undefined;

/** Labels for a multi-select value, with any fully selected preset shown as its own label ("Any Graduate"). */
export const presetLabels = (
    options: { label: string; value: string }[],
    presets: { label: string; values: string[] }[],
    value?: string | string[]
) => {
    let rest = normalizeToArray(value);
    const out: string[] = [];
    for (const p of presets) {
        if (p.values.length > 1 && p.values.every((v) => rest.includes(v))) {
            out.push(p.label);
            rest = rest.filter((v) => !p.values.includes(v));
        }
    }
    return [...out, ...rest.map((v) => options.find((o) => o.value === v)?.label ?? v)];
};

export const fetchLabel =(options: { label: string, value: string }[], value: string | undefined) => {
    return options.find(option => option.value === value)?.label || '-'
}

export const getInitials = (name: string = "") => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : name.slice(0, 2);
    return letters.toUpperCase() || "SR";
};

export const remainingInterest = (user: UserDetails) => {
    return (user.interests?.totalNoOfInterest ?? 0) - ((user.interests?.sent?.length ?? 0) + ((user.interests?.viewed?.length ?? 0) * CONTACT_COST));
}

/** Shape of the astrologer's JSON reply (fields depend on the consultation type). */
export interface AstroReading {
    personality_summary?: string;
    positive_traits?: string[];
    negative_traits?: string[];
    answer?: string[];
    easy_remedy?: string;
    costly_remedy?: string;
    compatibility_summary?: string;
    score?: number | string;
    /** 36 for Guna Milan readings; older readings were scored out of 100. */
    out_of?: number;
    verdict?: string;
    kootas?: { name: string; score?: number; out_of?: number }[];
}

export const parseGptResponse = (gptResponse: string): AstroReading | string => {
    if (!gptResponse) return {};

    const cleaned = gptResponse
        .replace(/```json|```/g, "")
        .trim();

    try {
        return JSON.parse(cleaned) as AstroReading;

    } catch {

        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]) as AstroReading;
            } catch {
                return gptResponse
            }
        }
        return {};
    }
};


export const motherTongueOptions = languageData.map(item => ({
    label: item.key,
    value: item.value
}));

export const casteOptions = casteData.map(item => ({
    label: ("label" in item && item.label) || item.caste,
    value: item.caste
}));

export const subCasteOptions = (caste: string) => {
    if (!caste) return [];

    const casteObj = casteData.find(
        item => item.caste === caste
    );

    if (!casteObj || !casteObj.subCastes.length) {
        return [];
    }

    return casteObj.subCastes.map(subCaste => ({
        label: subCaste,
        value: subCaste
    }));
};


export const getRefferalAmount = (referralId?: string) => {
    if (!referralId) return REGISTRATION_FEE
    else if (DISCOUNT_NAMES.includes(referralId)) return PERSONAL_DISCOUNT_PRICE
    else return REFERRAL_REGISTRATION_FEE
}