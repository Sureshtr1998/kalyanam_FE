/* eslint-disable @typescript-eslint/no-explicit-any */

import type { UserDetails } from "./interfaces";
import casteData from "./caste.json"
import languageData from "./lang.json"

export const normalizeToArray = (value: string | string[] | undefined): string[] => {
    if (!value) return [];

    if (Array.isArray(value)) {
        return value.flatMap(item => item?.split(",")?.map(v => v.trim()).filter(Boolean));
    }

    return value?.split(",").map(v => v.trim()).filter(Boolean);
};

export const fetchLabel = (options: { label: string, value: string }[], value: string | undefined) => {
    return options.find(option => option.value === value)?.label || '-'
}


export const arrayLabel = (value: string | string[] | undefined, options: { label: string, value: string }[]) => {
    if (!value || !value.length) return '-'
    return normalizeToArray(value).map(val => fetchLabel(options, val)).join(', ')
}
export const getInitials = (name: string = "") => {
    return name
        .split("")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
};

export const isImageFile = (item: any) => {
    return item && typeof item === "object" && "url" in item && "fileId" in item;
}

export const remainingInterest = (user: UserDetails) => {
    return (user.interests?.totalNoOfInterest ?? 0) - ((user.interests?.sent?.length ?? 0) + ((user.interests?.viewed?.length ?? 0) * 5));
}

export const calculateAge = (dob: string) => {
    if (!dob) return -1;
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export const dateFormat = (date: Date) => {
    if (!date) return "";

    const formattedDate = date
        .toLocaleDateString("en-GB")
        .split("/")
        .reverse()
        .join("-");

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const hasTime = !(hours === 0 && minutes === 0);

    if (!hasTime) {
        return formattedDate;
    }

    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");

    return `${formattedDate} ${hh}:${mm}`;
};


export const parseGptResponse = (gptResponse: string) => {
    if (!gptResponse) return {};

    const cleaned = gptResponse
        .replace(/```json|```/g, "")
        .trim();

    try {
        return JSON.parse(cleaned);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {

        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
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
    label: item.caste,
    value: item.caste.toLowerCase()
}));

export const subCasteOptions = (caste: string) => {
    if (!caste) return [];

    const casteObj = casteData.find(
        item => item.caste.toLowerCase() === caste
    );

    if (!casteObj || !casteObj.subCastes.length) {
        return [];
    }

    return casteObj.subCastes.map(subCaste => ({
        label: subCaste,
        value: subCaste
    }));
};