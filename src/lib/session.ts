import { getItem, removeItem, user_login_token } from "@/utils/localStore";

export interface Session {
  id?: string;
  fullName?: string;
  email?: string;
  mobile?: string;
  token?: string;
  role?: "USER" | "BROKER";
  isAdmin?: boolean;
}

export const getSession = (): Session | null => getItem(user_login_token);

export const isLoggedIn = () => !!getSession()?.token;

export const isBroker = () => getSession()?.role === "BROKER";


export const signOut = () => {
  removeItem(user_login_token);
  window.location.href = "/";
};
