
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