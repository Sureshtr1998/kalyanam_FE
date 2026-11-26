import { useState } from "react";
import { Loader2, Mail, MessageCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActionCard, Empty, ErrorNote, Panel } from "./shared";
import { post, relative, useOps, type OpsAction } from "./opsUtils";

interface MailRow {
  _id: string;
  from: { email: string; name: string };
  subject: string;
  text: string;
  receivedAt: string;
  category: string;
  language?: string;
  summary?: string;
  status: string;
  matchedUser?: { basic: { fullName: string; email: string; mobile: string; uniqueId?: string }; isVerified: boolean } | null;
}
interface CommentRow { _id: string; platform: "facebook" | "instagram"; author: string; text: string; createdAt: string; category: string; language?: string; reply?: string; status: string }

const CAT: Record<string, string> = {
  verification: "bg-primary/10 text-primary",
  refund: "bg-destructive/10 text-destructive",
  urgent: "bg-destructive text-white",
  complaint: "bg-gold/20 text-gold-foreground",
  question: "bg-accent text-accent-foreground",
  praise: "bg-success/15 text-success",
  hate: "bg-destructive text-white",
  spam: "bg-muted text-muted-foreground",
  company: "bg-muted text-muted-foreground",
  other: "bg-muted text-muted-foreground",
};

const Chip = ({ c }: { c: string }) => <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", CAT[c] ?? CAT.other)}>{c}</span>;

const open = (a: OpsAction) => ["scheduled", "needs_you", "shadow"].includes(a.status);

const Support = () => {
  const { data, error, reload } = useOps<{ mails: MailRow[]; actions: OpsAction[] }>("/manage/ops/support");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hideCompany, setHideCompany] = useState(true);
  const [checking, setChecking] = useState(false);
  if (error) return <ErrorNote>{error}</ErrorNote>;
  if (!data) return null;
  const pending = data.actions.filter(open).sort((a, b) => (a.status === "needs_you" ? -1 : 0) - (b.status === "needs_you" ? -1 : 0));
  const mails = data.mails.filter((m) => !hideCompany || !["company", "spam"].includes(m.category));
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" variant="outline" disabled={checking} onClick={async () => { setChecking(true); try { await post("/manage/ops/run/support"); reload(); } finally { setChecking(false); } }}>
          {checking ? <Loader2 className="animate-spin" /> : <RefreshCw />} Check inbox now
        </Button>
      </div>
      <Panel title={`Waiting to go out · ${pending.length}`} sub="Replies and verifications go out at the time shown. Edit or cancel any of them.">
        {pending.length ? <div className="space-y-3">{pending.map((a) => <ActionCard key={a._id} action={a} onChanged={reload} />)}</div> : <Empty>Nothing pending.</Empty>}
      </Panel>
      <Panel
        title="Inbox"
        sub="contactus@seetharamakalyana.in, as the agent sorted it."
        actions={<Button size="xs" variant="ghost" onClick={() => setHideCompany((v) => !v)}>{hideCompany ? "Show company mail" : "Hide company mail"}</Button>}
      >
        {mails.length === 0 ? <Empty>No mail yet.</Empty> : (
          <ul className="divide-y divide-border">
            {mails.map((m) => (
              <li key={m._id} className="py-3">
                <button className="w-full text-left" onClick={() => setExpanded(expanded === m._id ? null : m._id)}>
                  <div className="flex items-center gap-2">
                    <Chip c={m.category} />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">{m.from.name || m.from.email}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{relative(m.receivedAt)}</span>
                  </div>
                  <p className="mt-1 truncate text-sm">{m.subject}</p>
                  {m.summary && <p className="text-xs text-muted-foreground">{m.summary}{m.language ? ` · ${m.language}` : ""}</p>}
                </button>
                {expanded === m._id && (
                  <div className="mt-2 space-y-2">
                    {m.matchedUser && (
                      <p className="rounded-lg bg-accent px-3 py-2 text-xs">
                        Matched member: <b>{m.matchedUser.basic.fullName}</b> · {m.matchedUser.basic.mobile} · {m.matchedUser.basic.email} · {m.matchedUser.isVerified ? "verified" : "not verified"}
                      </p>
                    )}
                    <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-muted px-3 py-2 font-sans text-xs">{m.text}</pre>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
};

const Comments = () => {
  const { data, error, reload } = useOps<{ comments: CommentRow[]; actions: OpsAction[] }>("/manage/ops/comments");
  const [checking, setChecking] = useState(false);
  if (error) return <ErrorNote>{error}</ErrorNote>;
  if (!data) return null;
  const pending = data.actions.filter(open);
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" variant="outline" disabled={checking} onClick={async () => { setChecking(true); try { await post("/manage/ops/run/comments"); reload(); } finally { setChecking(false); } }}>
          {checking ? <Loader2 className="animate-spin" /> : <RefreshCw />} Check comments now
        </Button>
      </div>
      <Panel title={`Pending · ${pending.length}`} sub="Hidden hate/spam is deleted after 24 h: cancel to keep it hidden instead.">
        {pending.length ? <div className="space-y-3">{pending.map((a) => <ActionCard key={a._id} action={a} onChanged={reload} />)}</div> : <Empty>Nothing pending.</Empty>}
      </Panel>
      <Panel title="Recent comments">
        {data.comments.length === 0 ? <Empty>No comments seen yet.</Empty> : (
          <ul className="divide-y divide-border">
            {data.comments.map((c) => (
              <li key={c._id} className="py-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-1.5 text-[10px] font-bold text-primary">{c.platform === "instagram" ? "IG" : "FB"}</span>
                  <span className="font-semibold">{c.author}</span>
                  <Chip c={c.category} />
                  <span className="ml-auto text-xs capitalize text-muted-foreground">{c.status} · {relative(c.createdAt)}</span>
                </div>
                <p className={cn("mt-1", c.status === "hidden" || c.status === "deleted" ? "text-muted-foreground line-through" : "")}>{c.text}</p>
                {c.reply && <p className="mt-1 rounded-lg bg-accent/60 px-3 py-1.5 text-xs">↳ {c.reply}</p>}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
};

export const InboxView = () => {
  const [tab, setTab] = useState<"mail" | "comments">("mail");
  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-xl bg-muted p-1">
        {[["mail", "Support mail", Mail], ["comments", "Comments", MessageCircle]].map(([k, label, Icon]) => {
          const I = Icon as typeof Mail;
          return (
            <button key={k as string} onClick={() => setTab(k as "mail")} className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium", tab === k ? "bg-card shadow-sm" : "text-muted-foreground")}>
              <I className="size-4" /> {label as string}
            </button>
          );
        })}
      </div>
      {tab === "mail" ? <Support /> : <Comments />}
    </div>
  );
};
