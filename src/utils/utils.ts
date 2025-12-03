/* eslint-disable @typescript-eslint/no-explicit-any */

import type { UserDetails } from "./interfaces";

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