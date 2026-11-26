import { useState } from "react";
import { ExternalLink, GitPullRequest, Loader2, Rocket, Send } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Empty, ErrorNote, Panel } from "./shared";
import { post, relative, useOps } from "./opsUtils";

interface Request {
  repo: "fe" | "be";
  number: number;
  title: string;
  mode: "read" | "write";
  state: string;
  createdAt: string;
  url: string;
  replies: { body: string; at: string }[];
  pr: { number: number; url: string; state: string; branch: string; preview: { url: string; state: string } | null } | null;
  branch: { name: string; preview: { url: string; state: string } | null } | null;
}

const REPO = { fe: "Website", be: "Backend" };

/**
 * Developer tab. Read mode answers questions about the code; write mode
 * makes the change on a branch with a Vercel preview. Deploy merges it to
 * master only after you confirm.
 */
export const DevView = () => {
  const { data, error, reload } = useOps<{ configured: boolean; requests: Request[] }>("/manage/ops/dev");
  const [mode, setMode] = useState<"read" | "write">("read");
  const [repo, setRepo] = useState<"fe" | "be">("fe");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [follow, setFollow] = useState<Record<string, string>>({});

  const act = async (key: string, fn: () => Promise<unknown>) => {
    setBusy(key);
    try {
      await fn();
      reload();
    } catch {
      /* toast shown */
    } finally {
      setBusy(null);
    }
  };

  if (error) return <ErrorNote>{error}</ErrorNote>;
  if (data && !data.configured) return <Empty>GitHub isn't connected. Set GITHUB_TOKEN on the server and add ANTHROPIC_API_KEY as a secret in both GitHub repos.</Empty>;

  return (
    <div className="space-y-4">
      <Panel title="Ask or change something" sub="Works from any device. Nothing reaches the live site until you press Deploy.">
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex rounded-xl bg-muted p-1">
            {(["read", "write"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)} className={cn("rounded-lg px-3 py-1.5 text-sm font-medium", mode === m ? "bg-card shadow-sm" : "text-muted-foreground")}>
                {m === "read" ? "Read · just answer" : "Write · make a change"}
              </button>
            ))}
          </div>
          <div className="inline-flex rounded-xl bg-muted p-1">
            {(["fe", "be"] as const).map((r) => (
              <button key={r} onClick={() => setRepo(r)} className={cn("rounded-lg px-3 py-1.5 text-sm font-medium", repo === r ? "bg-card shadow-sm" : "text-muted-foreground")}>
                {REPO[r]}
              </button>
            ))}
          </div>
        </div>
        <Textarea
          className="mt-3"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={mode === "read" ? "e.g. How does the referral reward get paid out?" : "e.g. On the pricing page, change the heading to …"}
        />
        <Button
          className="mt-2"
          disabled={!!busy || text.trim().length < 5}
          onClick={() => act("send", async () => { await post("/manage/ops/dev", { repo, mode, request: text }); setText(""); })}
        >
          {busy === "send" ? <Loader2 className="animate-spin" /> : <Send />} {mode === "read" ? "Ask" : "Request change"}
        </Button>
      </Panel>

      <Panel title="Requests" sub="Answers and preview links appear here in a few minutes. Pull down / reopen to refresh.">
        {!data ? null : data.requests.length === 0 ? <Empty>No requests yet.</Empty> : (
          <div className="space-y-3">
            {data.requests.map((r) => {
              const key = `${r.repo}-${r.number}`;
              const preview = r.pr?.preview ?? r.branch?.preview;
              const deployable = r.mode === "write" && r.state === "open" && (r.pr?.state === "open" || (!r.pr && r.branch));
              return (
                <article key={key} className="rounded-2xl border border-border p-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={cn("rounded-full px-2 py-0.5 font-semibold", r.mode === "write" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>{r.mode}</span>
                    <span className="font-medium text-muted-foreground">{REPO[r.repo]} #{r.number}</span>
                    {r.pr?.state === "merged" && <span className="rounded-full bg-success/15 px-2 py-0.5 font-semibold text-success">Deployed</span>}
                    <span className="ml-auto text-muted-foreground">{relative(r.createdAt)}</span>
                  </div>
                  <h4 className="mt-2 font-semibold">{r.title}</h4>
                  {r.replies.length === 0 && r.state === "open" && <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> The agent is working on it…</p>}
                  {r.replies.map((c, i) => (
                    <div key={i} className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-muted px-3 py-2 text-sm">{c.body}</div>
                  ))}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {preview && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={preview.url} target="_blank" rel="noreferrer"><ExternalLink /> Open preview</a>
                      </Button>
                    )}
                    {r.pr && (
                      <Button size="sm" variant="ghost" asChild>
                        <a href={r.pr.url} target="_blank" rel="noreferrer"><GitPullRequest /> PR #{r.pr.number}</a>
                      </Button>
                    )}
                    {deployable && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" disabled={!!busy}><Rocket /> Deploy</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Deploy to the live site?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This merges “{r.title}” into master. Vercel puts it live in a minute or two. Check the preview first.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Not yet</AlertDialogCancel>
                            <AlertDialogAction onClick={() => act(`deploy-${key}`, () => post(`/manage/ops/dev/${r.repo}/${r.number}/deploy`, { confirm: true }))}>Deploy</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    <a href={r.url} target="_blank" rel="noreferrer" className="ml-auto self-center text-xs text-muted-foreground underline">GitHub</a>
                  </div>
                  {r.state === "open" && (
                    <div className="mt-3 flex gap-2">
                      <Textarea rows={1} className="min-h-9 text-sm" placeholder="Follow up: change this, fix that…" value={follow[key] ?? ""} onChange={(e) => setFollow({ ...follow, [key]: e.target.value })} />
                      <Button size="icon" variant="outline" aria-label="Send follow-up" disabled={!follow[key]?.trim() || !!busy} onClick={() => act(`f-${key}`, async () => { await post(`/manage/ops/dev/${r.repo}/${r.number}/comment`, { text: follow[key] }); setFollow({ ...follow, [key]: "" }); })}>
                        <Send />
                      </Button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
};
