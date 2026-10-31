export const user_login_token = 'user_login_token';


export const getItem = (item: string) => {
    // No storage while pages are prerendered at build time.
    if (typeof localStorage === "undefined") return null;
    const stored = localStorage.getItem(item);
    if (!stored) return null;
    try {
        return JSON.parse(stored);
    } catch {
        return null;
    }
};


export const setItem = (item: string, value: unknown) => {
    localStorage.setItem(item, JSON.stringify(value));
};


export const removeItem = (item: string) => {
    localStorage.removeItem(item);
};
