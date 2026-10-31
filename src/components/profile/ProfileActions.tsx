import { useState } from "react";
import { Ban, EllipsisVertical, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const REASONS = [
  "Fake profile",
  "Inappropriate photos or content",
  "Asking for money",
  "Already married",
  "Abusive behaviour",
  "Other",
];

interface MenuProps {
  name: string;
  busy: boolean;
  onBlock: () => void;
  onReport: (reason: string, details: string) => void;
  className?: string;
  triggerClassName?: string;
}

/** "⋮" menu with Block and Report, each behind a clear confirmation. */
export const ProfileMoreMenu = ({ name, busy, onBlock, onReport, className, triggerClassName }: MenuProps) => {
  const [blockOpen, setBlockOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState("");

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={cn("rounded-full", triggerClassName)} aria-label="More options">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onSelect={() => setBlockOpen(true)}>
            <Ban />
            Hide &amp; block
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={() => setReportOpen(true)}>
            <Flag />
            Report profile
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={blockOpen} onOpenChange={setBlockOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hide and block {name}?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>Blocking works both ways:</p>
                <ul className="ml-5 list-disc space-y-1">
                  <li>{name} won't appear in your matches.</li>
                  <li>
                    <b className="text-foreground">{name} won't be able to see your profile</b> or send you an
                    interest.
                  </li>
                  <li>You can unblock any time from Activity, Blocked.</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={busy} onClick={onBlock}>
              Block
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report {name}</DialogTitle>
            <DialogDescription>
              Our team reviews every report. {name} will also be blocked for you.
            </DialogDescription>
          </DialogHeader>
          <RadioGroup value={reason} onValueChange={setReason} className="gap-2">
            {REASONS.map((r) => (
              <Label
                key={r}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border p-3 font-normal",
                  reason === r ? "border-primary bg-primary/5" : "border-border"
                )}>
                <RadioGroupItem value={r} />
                {r}
              </Label>
            ))}
          </RadioGroup>
          <Textarea
            value={details}
            onChange={(e) => setDetails(e.target.value.slice(0, 500))}
            placeholder="Anything else we should know? (optional)"
            className="min-h-20"
          />
          <DialogFooter>
            <Button
              variant="destructive"
              disabled={busy}
              onClick={() => {
                onReport(reason, details);
                setReportOpen(false);
              }}>
              <Flag />
              Send report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
