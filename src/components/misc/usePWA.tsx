import { useEffect, useState } from "react";
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

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateServiceWorker, setUpdateServiceWorker] = useState<(() => void) | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));

    const checkInstalled = () => {
      const standaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as NavigatorWithStandalone).standalone === true;
      setIsInstalled(standaloneMode);
    };

    checkInstalled();
    window.addEventListener("appinstalled", checkInstalled);
    return () => window.removeEventListener("appinstalled", checkInstalled);
  }, []);

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setUpdateAvailable(true);
      },
    });
    setUpdateServiceWorker(() => updateSW);
  }, []);

  const showInstallButton = isMobile && !isInstalled && deferredPrompt !== null;

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  const reloadApp = () => {
    if (updateServiceWorker) updateServiceWorker();
    else window.location.reload();
  };

  return { showInstallButton, handleInstallClick, updateAvailable, reloadApp };
};
