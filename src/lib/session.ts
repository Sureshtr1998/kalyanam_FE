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

/** sessionStorage key holding the id of the member who has seen the home-page login notice this session. */
export const LOGIN_NOTICE_SHOWN = "login_notice_shown";

export const signOut = () => {
  removeItem(user_login_token);
  try {
    sessionStorage.removeItem(LOGIN_NOTICE_SHOWN); // logging back in shows the notice again
  } catch {
    // Storage blocked: nothing to clear.
  }
  window.location.href = "/";
};
