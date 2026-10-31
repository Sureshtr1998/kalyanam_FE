import axios from "axios";
import { env } from "@/config/env";
import { getItem, removeItem, user_login_token } from "./localStore";

const api = axios.create({
    baseURL: env.apiBaseUrl,
    // Without a timeout a stalled request leaves the UI spinning forever.
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = getItem(user_login_token)?.token
        if (token) {
            config.headers["x-auth-token"] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only 401 means the session is gone; 403 is "not allowed" (e.g. a profile
        // that's no longer available) and must not sign the member out.
        if (error.response?.status === 401) {
            removeItem(user_login_token)

            // Redirect to login
            if (window.location.pathname !== "/") {
                window.location.href = "/";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
