import { useSyncExternalStore } from "react";
import { registerSW } from "virtual:pwa-register";

/** Chrome's install prompt event (not yet in the DOM typings). */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/** iOS Safari exposes `standalone` when launched from the home screen. */
interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

type PWAState = {
  /** Android / desktop Chrome: the browser's own install dialog can be shown. */
  canPrompt: boolean;
  /** Already running as the installed app. */
  installed: boolean;
  updateAvailable: boolean;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let updateSW: ReturnType<typeof registerSW> | null = null;
let state: PWAState = { canPrompt: false, installed: false, updateAvailable: false };
const serverState = state;

const listeners = new Set<() => void>();
const set = (patch: Partial<PWAState>) => {
  state = { ...state, ...patch };
  listeners.forEach((cb) => cb());
};
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as NavigatorWithStandalone).standalone === true;

/**
 * Called once from main.tsx, before React mounts: Chrome can fire `beforeinstallprompt`
 * before the lazy layouts load, and every route (not only public pages) needs the worker.
 */
export const initPWA = () => {
  set({ installed: isStandalone() });

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    set({ canPrompt: true });
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    set({ canPrompt: false, installed: true });
  });

  updateSW = registerSW({
    onNeedRefresh() {
      set({ updateAvailable: true });
    },
  });
};

/** Shows the browser's install dialog; resolves true if the user installed. */
export const promptInstall = async () => {
  if (!deferredPrompt) return false;
  const prompt = deferredPrompt;
  deferredPrompt = null;
  set({ canPrompt: false });
  await prompt.prompt();
  const { outcome } = await prompt.userChoice;
  return outcome === "accepted";
};

export const reloadApp = () => {
  if (updateSW) updateSW();
  else window.location.reload();
};

export const usePWAState = () => useSyncExternalStore(subscribe, () => state, () => serverState);

const ua = () => (typeof navigator === "undefined" ? "" : navigator.userAgent);

export const isMobileDevice = () => /Android|iPhone|iPad|iPod/i.test(ua());

/** iPhone / iPad: no install event, so users add it via Share → Add to Home Screen. */
export const isIOS = () =>
  /iPhone|iPad|iPod/i.test(ua()) ||
  // iPadOS reports itself as a Mac.
  (typeof navigator !== "undefined" && navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

/** Facebook / Instagram / WhatsApp in-app browsers can't install web apps. */
export const isInAppBrowser = () => /FBAN|FBAV|Instagram|WhatsApp|Line\//i.test(ua());
