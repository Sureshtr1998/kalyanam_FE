import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Props {
  value?: string;
  onChange: (text: string) => void;
  /** Builds a fresh draft each time it is called. */
  write: () => string;
}

/** Fills a textarea with a draft built from the member's details; Undo restores the old text. */
export const WriteForMe = ({ value, onChange, write }: Props) => {
  const onClick = () => {
    const previous = value ?? "";
    const draft = write();
    if (!draft) {
      toast.info("Fill in a few more details first", {
        description: "We use your education, work and family details to write this.",
      });
      return;
    }
    onChange(draft);
    toast.success(previous ? "Rewritten from your details" : "Draft written from your details", {
      description: "Feel free to edit it to sound like you.",
      action: previous ? { label: "Undo", onClick: () => onChange(previous) } : undefined,
    });
  };

  return (
    <Button type="button" variant="outline" size="sm" className="h-7 gap-1 rounded-full px-2.5 text-xs" onClick={onClick}>
      <Sparkles className="size-3.5 text-primary" />
      {value ? "Rewrite" : "Write for me"}
    </Button>
  );
};
