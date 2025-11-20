/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { registerSW } from "virtual:pwa-register";

export const usePWA = () => {
  // Install prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Detect if app is installed
  const [isInstalled, setIsInstalled] = useState(false);

  // Detect if device is mobile
  const [isMobile, setIsMobile] = useState(false);

  // Detect update
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateServiceWorker, setUpdateServiceWorker] = useState<
    (() => void) | null
  >(null);

  // Install prompt listener
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Detect mobile & PWA installed
  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));

    const checkInstalled = () => {
      const standaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as any).standalone === true;
      setIsInstalled(standaloneMode);
    };

    checkInstalled();
    window.addEventListener("appinstalled", checkInstalled);
    return () => window.removeEventListener("appinstalled", checkInstalled);
  }, []);

  // PWA update detection
  useEffect(() => {
    const updateSW = registerSW({
      onRegistered(r) {
        console.log("Service Worker registered", r);
      },
      onNeedRefresh() {
        setUpdateAvailable(true);
      },
      onOfflineReady() {
        console.log("App ready for offline use");
      },
    });

    setUpdateServiceWorker(() => updateSW);
  }, []);

  // Show Install Button
  const showInstallButton = isMobile && !isInstalled && deferredPrompt !== null;

  // Trigger install
  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the PWA install prompt");
      }
      setDeferredPrompt(null);
    });
  };

  // Reload app for update
  const reloadApp = () => {
    if (updateServiceWorker) {
      updateServiceWorker(); // fetch latest SW
      window.location.reload();
    }
  };

  return { showInstallButton, handleInstallClick, updateAvailable, reloadApp };
};
