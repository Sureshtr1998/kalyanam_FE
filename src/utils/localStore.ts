export const user_login_token = 'user_login_token';


export const getItem = (item: string) => {
    const stored = localStorage.getItem(item);
    if (!stored) return null;
    try {
        return JSON.parse(stored);
    } catch {
        return null;
    }
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setItem = (item: string, value: any) => {
    localStorage.setItem(item, JSON.stringify(value));
};


export const removeItem = (item: string) => {
    localStorage.removeItem(item);
};
