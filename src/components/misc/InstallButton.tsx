import { useEffect, useState } from "react";
import { Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import type { Lang } from "@/lib/i18n";
import { isIOS, isInAppBrowser, isMobileDevice, promptInstall, usePWAState } from "@/lib/pwa";
import { cn } from "@/lib/utils";

/** The hint shows once per browser session, after the page settles, then hides itself. */
const HINT_SHOWN = "pwa_hint_shown";
const HINT_DELAY_MS = 1500;
const HINT_DURATION_MS = 4000;

const text: Record<Lang, { label: string; hint: string; ios: string }> = {
  en: {
    label: "Install app",
    hint: "Install our app for quick access",
    ios: "Tap {share} Share, then “Add to Home Screen”.",
  },
  kn: {
    label: "ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ",
    hint: "ತ್ವರಿತ ಪ್ರವೇಶಕ್ಕಾಗಿ ನಮ್ಮ ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ",
    ios: "{share} ಶೇರ್ ಟ್ಯಾಪ್ ಮಾಡಿ, ನಂತರ “Add to Home Screen” ಆಯ್ಕೆಮಾಡಿ.",
  },
  hi: {
    label: "ऐप इंस्टॉल करें",
    hint: "जल्दी पहुँच के लिए हमारा ऐप इंस्टॉल करें",
    ios: "{share} शेयर पर टैप करें, फिर “Add to Home Screen” चुनें।",
  },
  ta: {
    label: "செயலியை நிறுவு",
    hint: "விரைவான அணுகலுக்கு எங்கள் செயலியை நிறுவுங்கள்",
    ios: "{share} பகிர் என்பதைத் தட்டி, பின்னர் “Add to Home Screen” என்பதைத் தேர்ந்தெடுக்கவும்.",
  },
  te: {
    label: "యాప్ ఇన్‌స్టాల్ చేయండి",
    hint: "త్వరిత యాక్సెస్ కోసం మా యాప్‌ను ఇన్‌స్టాల్ చేయండి",
    ios: "{share} షేర్‌ను నొక్కి, ఆపై “Add to Home Screen” ఎంచుకోండి.",
  },
};

const hintShown = () => {
  try {
    return sessionStorage.getItem(HINT_SHOWN) === "1";
  } catch {
    return true;
  }
};

const markHintShown = () => {
  try {
    sessionStorage.setItem(HINT_SHOWN, "1");
  } catch {
    // Storage blocked: the hint just shows again next time.
  }
};

/**
 * Header icon for adding the site to the home screen on phones: the browser's install dialog
 * on Android, or Share → Add to Home Screen steps on iPhone (Safari has no install event).
 * A short hint points at it once per session.
 */
export const InstallButton = ({ lang = "en", className }: { lang?: Lang; className?: string }) => {
  const { canPrompt, installed } = usePWAState();
  // Device checks run after mount, so prerendered HTML and hydration match.
  const [supported, setSupported] = useState(false);
  const [ios, setIos] = useState(false);
  const [open, setOpen] = useState<"hint" | "ios" | null>(null);
  const t = text[lang];

  useEffect(() => {
    setSupported(isMobileDevice() && !isInAppBrowser());
    setIos(isIOS());
  }, []);

  const visible = supported && !installed && (canPrompt || ios);

  useEffect(() => {
    if (!visible || hintShown()) return;
    const show = setTimeout(() => {
      markHintShown();
      setOpen("hint");
    }, HINT_DELAY_MS);
    const hide = setTimeout(() => setOpen((o) => (o === "hint" ? null : o)), HINT_DELAY_MS + HINT_DURATION_MS);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [visible]);

  if (!visible) return null;

  const onClick = async () => {
    if (canPrompt) {
      setOpen(null);
      await promptInstall();
    } else {
      setOpen((o) => (o === "ios" ? null : "ios"));
    }
  };

  const [before, after] = t.ios.split("{share}");

  return (
    <Popover open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
      <PopoverAnchor asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={onClick}
          aria-label={t.label}
          className={cn("rounded-full text-primary", className)}>
          <Download />
        </Button>
      </PopoverAnchor>
      <PopoverContent
        align="end"
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-auto max-w-64 rounded-xl px-3 py-2 text-sm">
        {open === "ios" ? (
          <p>
            {before}
            <Share className="mx-0.5 inline size-4 -translate-y-0.5 text-primary" aria-label="Share" />
            {after}
          </p>
        ) : (
          <p className="font-medium">{t.hint}</p>
        )}
      </PopoverContent>
    </Popover>
  );
};
