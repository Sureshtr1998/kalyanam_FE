
export const normalizeToArray = (value: string | string[] | undefined): string[] => {
    if (!value) return [];

    if (Array.isArray(value)) {
        return value.flatMap(item => item.split(",").map(v => v.trim()).filter(Boolean));
    }

    return value.split(",").map(v => v.trim()).filter(Boolean);
};