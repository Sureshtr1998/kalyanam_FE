/** Shared by Refer & Earn and the partner dashboard's invite messages. */

export const escapeHtml = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** A share message: text, then a link shown behind its label where formatting survives. */
export interface ShareParts {
  intro: string;
  offer: string;
  label: string;
  url: string;
}

/** Plain text, for apps that can't hide a link behind words (WhatsApp, Instagram, SMS). */
export const shareText = (p: ShareParts) => `${p.intro}

${p.offer}

${p.label}: ${p.url}`;

/** Rich text: the label is the link. Used where pasting keeps formatting (Gmail, Docs, Facebook on desktop). */
export const shareHtml = (p: ShareParts) =>
  `<p>${escapeHtml(p.intro)}</p><p>${escapeHtml(p.offer)}</p><p><a href="${escapeHtml(p.url)}">${escapeHtml(p.label)}</a></p>`;

/** Copies both forms, so each app pastes the one it understands. Throws if the clipboard is unavailable. */
export const copyShareMessage = async (p: ShareParts) => {
  if (typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/plain": new Blob([shareText(p)], { type: "text/plain" }),
        "text/html": new Blob([shareHtml(p)], { type: "text/html" }),
      }),
    ]);
  } else {
    await navigator.clipboard.writeText(shareText(p));
  }
};

/** The phone's share sheet, or WhatsApp on desktop. */
export const shareViaApps = async (p: ShareParts) => {
  const text = shareText(p);
  if (navigator.share) {
    try {
      await navigator.share({ text });
    } catch {
      // Closed the share sheet: nothing to do.
    }
    return;
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
};
