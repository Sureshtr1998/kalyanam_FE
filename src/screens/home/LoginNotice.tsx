import { useState } from "react";
import { CalendarHeart, Download, FileText, LoaderCircle, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UserDetails } from "@/utils/interfaces";
import { errorMessage } from "@/lib/errors";
import { downloadProfilePdf } from "@/lib/profilePdf";
import { LOGIN_NOTICE_SHOWN } from "@/lib/session";
import { MEMBERSHIP_START } from "@/utils/constants";
import { localeOf, type Lang } from "@/lib/i18n";
import { homeText } from "./lang";

const membershipStart = new Date(`1 ${MEMBERSHIP_START}`);

/** The membership-start and "we'll email you" notes, shared by the empty state and the login notice. */
export const MembershipNotes = ({ lang, className }: { lang: Lang; className?: string }) => {
  const t = homeText[lang];
  const locale = localeOf(lang);
  const start = Number.isNaN(membershipStart.getTime())
    ? MEMBERSHIP_START
    : membershipStart.toLocaleString(locale, { month: "long", year: "numeric" });
  const now = new Date().toLocaleString(locale, { month: "long" });
  return (
    <ul className={className}>
      <li className="flex gap-3 rounded-xl bg-accent p-3 text-accent-foreground">
        <CalendarHeart className="mt-0.5 size-5 shrink-0 text-primary" />
        <span>
          <b>{t.membershipBold(start)}</b>
          {t.membershipRest(now)}
        </span>
      </li>
      <li className="flex gap-3 rounded-xl bg-accent p-3 text-accent-foreground">
        <MailCheck className="mt-0.5 size-5 shrink-0 text-primary" />
        <span>
          <b>{t.noCheckBold}</b> {t.noCheckRest}
        </span>
      </li>
    </ul>
  );
};

const alreadyShown = (id: string) => {
  try {
    return sessionStorage.getItem(LOGIN_NOTICE_SHOWN) === id;
  } catch {
    return true;
  }
};

const markShown = (id: string) => {
  try {
    sessionStorage.setItem(LOGIN_NOTICE_SHOWN, id);
  } catch {
    // Storage blocked: the notice just shows again next time.
  }
};

/** Shown once per browser session after a member logs in, with a shortcut to their biodata PDF. */
export const LoginNotice = ({ user, lang }: { user: UserDetails; lang: Lang }) => {
  const t = homeText[lang];
  const [open, setOpen] = useState(() => !!user._id && !alreadyShown(user._id));
  const [downloading, setDownloading] = useState(false);

  const close = (next: boolean) => {
    if (next) return;
    if (user._id) markShown(user._id);
    setOpen(false);
  };

  const download = async () => {
    setDownloading(true);
    try {
      await downloadProfilePdf(user, { showContact: true });
    } catch (e) {
      toast.error("Couldn't create the PDF", { description: errorMessage(e) });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{t.welcomeTitle}</DialogTitle>
          <DialogDescription>{t.welcomeDesc}</DialogDescription>
        </DialogHeader>
        <MembershipNotes lang={lang} className="grid gap-2 text-sm" />
        <div className="flex gap-3 rounded-xl border border-gold/40 p-3 text-sm">
          <FileText className="mt-0.5 size-5 shrink-0 text-primary" />
          <div className="space-y-2">
            <p>
              <b>{t.biodataBold}</b> {t.biodataRest}
            </p>
            <Button variant="outline" size="sm" onClick={() => void download()} disabled={downloading}>
              {downloading ? <LoaderCircle className="animate-spin" /> : <Download />}
              {downloading ? t.preparingPdf : t.downloadBiodata}
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => close(false)}>{t.gotIt}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
