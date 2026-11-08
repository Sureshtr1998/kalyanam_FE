import { useCallback, useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { AlertTriangle, CloudUpload, DatabaseBackup, Download, FileUp, History, Lock, RotateCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/utils/api";
import { formatInstant } from "@/lib/dates";
import { errorMessage } from "@/lib/errors";

interface StoredBackup {
  id: string;
  name: string;
  createdAt: string;
  size: number;
  reason: "manual" | "scheduled" | "pre-restore";
  docs: number | null;
}

interface BackupsResponse {
  cloud: boolean;
  keep: number;
  confirmWord: string;
  counts: Record<string, number>;
  backups: StoredBackup[];
  listError?: string;
}

interface Preview {
  token: string;
  expiresIn: number;
  source: { type: "cloud" | "file"; id?: string; name: string };
  header: { createdAt: string; reason: string; createdBy: string | null; database: string | null; totalDocs: number };
  collections: { name: string; backup: number | null; current: number }[];
  warnings: string[];
  confirmWord: string;
}

const LONG = { timeout: 180000 };
/** The api client defaults to JSON, which would turn FormData into JSON. */
const withBody = (body: unknown) =>
  body instanceof FormData ? { ...LONG, headers: { "Content-Type": "multipart/form-data" } } : LONG;
// Vercel refuses request/response bodies over ~4.5 MB.
const MAX_FILE = 4 * 1024 * 1024;

const size = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

const REASONS: Record<StoredBackup["reason"], string> = {
  manual: "Manual",
  scheduled: "Daily",
  "pre-restore": "Before restore",
};

/** Error text from a request made with responseType "blob". */
const blobError = async (err: unknown) => {
  if (isAxiosError(err) && err.response?.data instanceof Blob) {
    try {
      return JSON.parse(await err.response.data.text()).msg ?? errorMessage(err);
    } catch {
      /* fall through */
    }
  }
  return errorMessage(err);
};

const saveBlob = (blob: Blob, fallbackName: string, disposition?: string) => {
  const name = /filename="([^"]+)"/.exec(disposition ?? "")?.[1] ?? fallbackName;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/** Admin: database backups (take, download, restore). */
export const Backups = () => {
  const [data, setData] = useState<BackupsResponse | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    api
      .get<BackupsResponse>("/manage/backups")
      .then((res) => setData(res.data))
      .catch((err) => toast.error("Couldn't load backups", { description: errorMessage(err) }));
  }, []);
  useEffect(load, [load]);

  const run = async (key: string, fn: () => Promise<void>) => {
    setBusy(key);
    try {
      await fn();
    } finally {
      setBusy(null);
    }
  };

  const backupNow = () =>
    run("backup", async () => {
      try {
        const res = await api.post("/manage/backups", undefined, LONG);
        toast.success("Backup saved", {
          description: res.data.warning ?? `${res.data.header.totalDocs} documents${res.data.pruned ? ` · ${res.data.pruned} old backup${res.data.pruned > 1 ? "s" : ""} removed` : ""}`,
        });
        load();
      } catch (err) {
        toast.error("Backup failed", { description: errorMessage(err) });
      }
    });

  const download = (path: string, key: string) =>
    run(key, async () => {
      try {
        const res = await api.get<Blob>(path, { ...LONG, responseType: "blob" });
        saveBlob(res.data, "kalyanam-backup.json.gz", res.headers["content-disposition"]);
      } catch (err) {
        toast.error("Download failed", { description: await blobError(err) });
      }
    });

  const openPreview = (key: string, body: FormData | { id: string }, file: File | null) =>
    run(key, async () => {
      try {
        const res = await api.post<Preview>("/manage/backups/preview", body, withBody(body));
        setPreviewFile(file);
        setPreview(res.data);
      } catch (err) {
        toast.error("Couldn't open the backup", { description: errorMessage(err) });
      }
    });

  const pickFile = (file?: File) => {
    if (fileInput.current) fileInput.current.value = "";
    if (!file) return;
    if (file.size > MAX_FILE) {
      toast.error("File too large", { description: "Files over 4 MB can't go through the website. Use scripts/db-backup.js on the server instead." });
      return;
    }
    const form = new FormData();
    form.append("backup", file);
    void openPreview("file", form, file);
  };

  if (!data) return <Skeleton className="h-64 w-full rounded-3xl" />;

  const latest = data.backups.find((b) => b.reason !== "pre-restore");
  const liveTotal = Object.values(data.counts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <DatabaseBackup className="size-4 text-primary" /> Database backups
            </p>
            <p className="text-sm text-muted-foreground">
              {liveTotal.toLocaleString("en-IN")} documents in {Object.keys(data.counts).length} collections right now.
              {data.cloud
                ? ` A backup is taken automatically every night, and the newest ${data.keep} are kept (encrypted).`
                : ""}
            </p>
            {data.cloud && (
              <p className="text-xs text-muted-foreground">
                Last backup: {latest ? `${formatInstant(latest.createdAt, true)} (${REASONS[latest.reason]})` : "none yet"}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" disabled={!!busy || !data.cloud} onClick={backupNow}>
              <CloudUpload /> {busy === "backup" ? "Backing up…" : "Back up now"}
            </Button>
            <Button size="sm" variant="outline" disabled={!!busy} onClick={() => download("/manage/backups/export", "export")}>
              <Download /> {busy === "export" ? "Preparing…" : "Download current data"}
            </Button>
            <Button size="sm" variant="outline" disabled={!!busy} onClick={() => fileInput.current?.click()}>
              <FileUp /> {busy === "file" ? "Checking…" : "Restore from a file"}
            </Button>
            <input
              ref={fileInput}
              type="file"
              accept=".gz,.kbak,application/gzip"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
          </div>
        </div>
      </div>

      {!data.cloud && (
        <Alert>
          <AlertTriangle />
          <AlertTitle>Cloud backups are off</AlertTitle>
          <AlertDescription>
            Set <code>BACKUP_SECRET</code> (a long random value, saved in your password manager) and <code>CRON_SECRET</code> on the
            server to turn on automatic encrypted backups. Until then you can still download the data to your computer.
          </AlertDescription>
        </Alert>
      )}
      {data.listError && (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>{data.listError}</AlertTitle>
        </Alert>
      )}

      {data.cloud && (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Taken</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Documents</TableHead>
                <TableHead className="text-right">Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.backups.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="whitespace-nowrap">{formatInstant(b.createdAt, true)}</TableCell>
                  <TableCell>
                    <Badge variant={b.reason === "pre-restore" ? "outline" : "secondary"}>{REASONS[b.reason]}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{b.docs?.toLocaleString("en-IN") ?? "-"}</TableCell>
                  <TableCell className="text-right tabular-nums">{size(b.size)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" disabled={!!busy} onClick={() => download(`/manage/backups/${b.id}/download`, `dl-${b.id}`)}>
                        <Download /> {busy === `dl-${b.id}` ? "…" : "Download"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!!busy}
                        className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => openPreview(`rs-${b.id}`, { id: b.id }, null)}>
                        <RotateCcw /> {busy === `rs-${b.id}` ? "Checking…" : "Restore"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!data.backups.length && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    No backups yet. Take the first one with “Back up now”.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <History className="mt-0.5 size-3.5 shrink-0" />
        Downloaded files are plain (unencrypted) and contain every member's details. Keep them somewhere private, e.g. an
        encrypted drive. If the website itself is down, the server has <code>scripts/db-backup.js</code> to restore one.
      </p>

      {preview && (
        <RestoreDialog
          preview={preview}
          file={previewFile}
          onClose={() => setPreview(null)}
          onDone={() => {
            setPreview(null);
            load();
          }}
        />
      )}
    </div>
  );
};

const RestoreDialog = ({ preview, file, onClose, onDone }: { preview: Preview; file: File | null; onClose: () => void; onDone: () => void }) => {
  const inBackup = preview.collections.filter((c) => c.backup !== null).map((c) => c.name);
  const [chosen, setChosen] = useState<string[]>(inBackup);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const ready = chosen.length > 0 && password.length > 0 && confirm.trim() === preview.confirmWord && !busy;

  const restore = async () => {
    setBusy(true);
    try {
      let body: FormData | object = { token: preview.token, password, confirm, collections: chosen };
      if (preview.source.type === "file") {
        const form = new FormData();
        form.append("token", preview.token);
        form.append("password", password);
        form.append("confirm", confirm);
        form.append("collections", JSON.stringify(chosen));
        if (file) form.append("backup", file);
        body = form;
      }
      const res = await api.post("/manage/backups/restore", body, withBody(body));
      toast.success("Restore complete", {
        description: `Restored ${Object.keys(res.data.restored).join(", ")} to ${formatInstant(res.data.from, true)}. A safety copy of the previous data was saved first.`,
        duration: 15000,
      });
      onDone();
    } catch (err) {
      toast.error("Restore didn't happen", { description: errorMessage(err), duration: 15000 });
      setPassword("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && !busy && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Restore the database?</DialogTitle>
          <DialogDescription>
            Backup from {formatInstant(preview.header.createdAt, true)}
            {preview.header.createdBy ? ` by ${preview.header.createdBy}` : ""} · {preview.header.totalDocs.toLocaleString("en-IN")} documents
          </DialogDescription>
        </DialogHeader>

        <p className="flex items-center gap-2 text-sm text-success">
          <ShieldCheck className="size-4" /> Checked: the file is complete and unchanged.
        </p>

        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>The ticked collections will be replaced with the backup's copy.</AlertTitle>
          <AlertDescription>
            Anything added or changed since the backup in those collections is lost. A safety copy of the current data is saved
            first, and the restore won't start if that fails.
          </AlertDescription>
        </Alert>

        {!!preview.warnings.length && (
          <ul className="list-disc space-y-1 pl-5 text-sm text-gold-foreground">
            {preview.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        )}

        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>Collection</TableHead>
                <TableHead className="text-right">Now</TableHead>
                <TableHead className="text-right">After restore</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {preview.collections.map((c) => {
                const on = chosen.includes(c.name);
                return (
                  <TableRow key={c.name} className={c.backup === null ? "text-muted-foreground" : undefined}>
                    <TableCell>
                      <Checkbox
                        checked={on}
                        disabled={c.backup === null || busy}
                        aria-label={`Restore ${c.name}`}
                        onCheckedChange={(v) => setChosen((prev) => (v ? [...prev, c.name] : prev.filter((n) => n !== c.name)))}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{c.name}</TableCell>
                    <TableCell className="text-right tabular-nums">{c.current}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {c.backup === null ? "not in backup" : on ? <b>{c.backup}</b> : `${c.current} (unchanged)`}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="restore-password">Your admin password</Label>
            <Input id="restore-password" type="password" autoComplete="current-password" value={password} disabled={busy} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="restore-confirm">Type {preview.confirmWord} to confirm</Label>
            <Input id="restore-confirm" autoComplete="off" value={confirm} disabled={busy} onChange={(e) => setConfirm(e.target.value)} placeholder={preview.confirmWord} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">This confirmation expires in {Math.round(preview.expiresIn / 60)} minutes.</p>

        <DialogFooter>
          <Button variant="outline" disabled={busy} onClick={onClose}>Cancel</Button>
          <Button disabled={!ready} className="bg-destructive text-white hover:bg-destructive/90" onClick={restore}>
            <Lock /> {busy ? "Restoring… don't close this" : `Restore ${chosen.length} collection${chosen.length === 1 ? "" : "s"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
