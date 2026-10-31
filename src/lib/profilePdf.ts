import type { GState, jsPDF } from "jspdf";
import { aboutRows, careerRows, familyRows, preferenceRows, type Row } from "@/lib/profileRows";
import { heightOptions, imageUrl, qualificationOptions, SEO_URL, SUPPORT_EMAIL } from "@/utils/constants";
import type { UserDetails } from "@/utils/interfaces";
import { optionLabel } from "@/utils/utils";
import { ageFromFloating } from "@/lib/dates";

type RGB = [number, number, number];

// Brand palette (matches --saffron-700, --marigold and friends in index.css).
const SAFFRON: RGB = [194, 65, 12];
const GOLD: RGB = [245, 158, 11];
const CREAM: RGB = [255, 247, 237];
const INK: RGB = [41, 37, 36];
const MUTED: RGB = [120, 113, 108];
const SUCCESS_BG: RGB = [236, 253, 245];
const SUCCESS: RGB = [21, 128, 61];

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 15;
const CONTENT_W = PAGE_W - MARGIN * 2;
const BOTTOM = PAGE_H - 18;
const SITE = new URL(SEO_URL).host.replace(/^www\./, "");

/** The built-in PDF fonts have no rupee glyph. */
const clean = (text: string) => text.replace(/₹\s?/g, "Rs. ");

const rowText = (v: Row[1]) => (Array.isArray(v) ? v.join(", ") : v ?? "");

/** Loads an image through a canvas so any format (webp included) ends up as JPEG/PNG data jsPDF can embed. */
const loadImage = (src: string, maxSide: number, type: "image/jpeg" | "image/png" = "image/jpeg") =>
  new Promise<string | null>((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.naturalWidth * scale);
        canvas.height = Math.round(img.naturalHeight * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL(type, 0.9));
      } catch {
        resolve(null); // tainted canvas (no CORS): the PDF just goes without it
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });

/** Subtle diagonal brand mark behind the page content. */
const drawWatermark = (doc: jsPDF, logo: string | null, faint: GState) => {
  doc.saveGraphicsState();
  doc.setGState(faint);
  if (logo) {
    const size = 95;
    doc.addImage(logo, "PNG", (PAGE_W - size) / 2, (PAGE_H - size) / 2, size, size, "logo", "FAST");
  }
  doc.setFont("times", "bolditalic");
  doc.setFontSize(46);
  doc.setTextColor(...SAFFRON);
  const angle = 35;
  const rad = (angle * Math.PI) / 180;
  const text = "Seetha Rama Kalyana";
  const w = doc.getTextWidth(text);
  // Centre the rotated line on a few points down the page.
  for (const cy of [PAGE_H * 0.22, PAGE_H * 0.5, PAGE_H * 0.78]) {
    const x = PAGE_W / 2 - (w / 2) * Math.cos(rad);
    const y = cy + (w / 2) * Math.sin(rad);
    doc.text(text, x, y, { angle });
  }
  doc.restoreGraphicsState();
};

const drawHeader = (doc: jsPDF, logo: string | null, profileId?: string) => {
  doc.setFillColor(...SAFFRON);
  doc.rect(0, 0, PAGE_W, 26, "F");
  doc.setFillColor(...GOLD);
  doc.rect(0, 26, PAGE_W, 1.2, "F");
  if (logo) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(MARGIN, 5, 16, 16, 3, 3, "F");
    doc.addImage(logo, "PNG", MARGIN + 0.8, 5.8, 14.4, 14.4, "logo", "FAST");
  }
  const x = logo ? MARGIN + 21 : MARGIN;
  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text("Seetha Rama Kalyana", x, 13);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`Matrimony profile  ·  ${SITE}  ·  ${SUPPORT_EMAIL}`, x, 19);
  if (profileId) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`Profile ID: ${profileId}`, PAGE_W - MARGIN, 15, { align: "right" });
  }
};

export const downloadProfilePdf = async (user: UserDetails, { showContact }: { showContact: boolean }) => {
  const { jsPDF, GState } = await import("jspdf");
  const { basic, personal = {} } = user;
  const imageUrls = (basic.images ?? []).map((i) => i.url).filter(Boolean);
  const [logo, ...loaded] = await Promise.all([
    loadImage("/logo.png", 320, "image/png"),
    ...imageUrls.map((u) => loadImage(imageUrl(u, "card"), 640)),
  ]);
  const [photo = null, ...morePhotos] = loaded.filter((p): p is string => !!p);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const faint = new GState({ opacity: 0.06 });
  doc.setProperties({ title: `${basic.fullName} - Seetha Rama Kalyana`, author: "Seetha Rama Kalyana" });

  drawWatermark(doc, logo, faint);
  drawHeader(doc, logo, basic.uniqueId);
  let y = 36;

  const newPage = () => {
    doc.addPage();
    drawWatermark(doc, logo, faint);
    y = MARGIN + 3;
  };
  const ensure = (h: number) => {
    if (y + h > BOTTOM) newPage();
  };

  // --- Hero: photo + name + quick facts ---
  const photoW = 50;
  const photoH = 62.5;
  if (photo) {
    doc.addImage(photo, "JPEG", MARGIN, y, photoW, photoH, undefined, "MEDIUM");
  } else {
    doc.setFillColor(...CREAM);
    doc.roundedRect(MARGIN, y, photoW, photoH, 3, 3, "F");
    doc.setFont("times", "bold");
    doc.setFontSize(34);
    doc.setTextColor(...SAFFRON);
    const initials = basic.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");
    doc.text(initials, MARGIN + photoW / 2, y + photoH / 2 + 4, { align: "center" });
  }
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.6);
  doc.roundedRect(MARGIN, y, photoW, photoH, 3, 3, "S");

  const tx = MARGIN + photoW + 8;
  const tw = PAGE_W - MARGIN - tx;
  let ty = y + 8;
  doc.setTextColor(...INK);
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  const nameLines = doc.splitTextToSize(clean(basic.fullName), tw) as string[];
  doc.text(nameLines, tx, ty);
  ty += nameLines.length * 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...MUTED);
  const idLine = [basic.uniqueId, user.isVerified ? "Verified profile" : null].filter(Boolean).join("  ·  ");
  if (idLine) {
    doc.text(idLine, tx, ty);
    ty += 7;
  }

  const age = ageFromFloating(basic.dob);
  const facts = [
    age !== null ? `${age} yrs` : null,
    optionLabel(heightOptions, personal.height)?.split(" (")[0],
    optionLabel(qualificationOptions, basic.qualification),
    personal.employedIn,
    personal.workCity || personal.country,
  ].filter((f): f is string => !!f);
  if (facts.length) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    let fx = tx;
    for (const f of facts.map(clean)) {
      const w = doc.getTextWidth(f) + 6;
      if (fx + w > PAGE_W - MARGIN) {
        fx = tx;
        ty += 8;
      }
      doc.setFillColor(...CREAM);
      doc.roundedRect(fx, ty - 4.3, w, 6.2, 3, 3, "F");
      doc.setTextColor(...SAFFRON);
      doc.text(f, fx + 3, ty);
      fx += w + 2;
    }
    ty += 9;
  }

  // Contact: only what the member can already see on the site.
  const contact = showContact
    ? [
        basic.mobile && `Phone: +91 ${basic.mobile}`,
        basic.alternateMob && `Alternate: +91 ${basic.alternateMob}`,
        basic.email && `Email: ${basic.email}`,
      ].filter((c): c is string => !!c)
    : [];
  if (contact.length) {
    const h = 9 + contact.length * 5.2;
    doc.setFillColor(...SUCCESS_BG);
    doc.roundedRect(tx, ty, tw, h, 2.5, 2.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...SUCCESS);
    doc.text("CONTACT DETAILS", tx + 4, ty + 5.5);
    doc.setFontSize(10);
    doc.setTextColor(...INK);
    contact.forEach((c, i) => doc.text(c, tx + 4, ty + 11 + i * 5.2));
    ty += h + 4;
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);
    const note = doc.splitTextToSize(
      `Contact details are shared on ${SITE} once an interest is accepted or the contact is unlocked.`,
      tw
    ) as string[];
    doc.text(note, tx, ty);
    ty += note.length * 4 + 4;
  }

  y = Math.max(y + photoH, ty) + 9;

  // --- Detail sections ---
  const colGap = 8;
  const colW = (CONTENT_W - colGap) / 2;

  const section = (title: string, rows: Row[], note?: string) => {
    const visible = rows
      .map(([k, v]) => [k, clean(rowText(v))] as const)
      .filter(([, v]) => v !== "");
    if (!visible.length && !note) return;

    ensure(22);
    doc.setFont("times", "bold");
    doc.setFontSize(15);
    doc.setTextColor(...SAFFRON);
    doc.text(title, MARGIN, y);
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y + 2.2, PAGE_W - MARGIN, y + 2.2);
    y += 8;

    if (note) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9.5);
      const lines = doc.splitTextToSize(clean(note), CONTENT_W - 8) as string[];
      for (const line of lines) {
        ensure(5);
        doc.setFillColor(...GOLD);
        doc.rect(MARGIN, y - 3.6, 1, 4.8, "F");
        doc.setTextColor(...INK);
        doc.text(line, MARGIN + 4, y);
        y += 4.8;
      }
      y += 3;
    }

    for (let i = 0; i < visible.length; i += 2) {
      const pair = visible.slice(i, i + 2).map(([k, v]) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        return { label: k.toUpperCase(), lines: doc.splitTextToSize(v, colW) as string[] };
      });
      const h = 4 + Math.max(...pair.map((p) => p.lines.length)) * 4.6 + 3;
      ensure(h);
      pair.forEach((p, j) => {
        const x = MARGIN + j * (colW + colGap);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.2);
        doc.setTextColor(...MUTED);
        doc.text(p.label, x, y);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...INK);
        doc.text(p.lines, x, y + 4.6);
      });
      y += h;
    }
    y += 5;
  };

  section("About", aboutRows(user), basic.note);
  section("Education & career", careerRows(user), personal.note);
  section("Family", familyRows(user), user.family?.note);
  section("Looking for", preferenceRows(user), user.partner?.note);

  // --- Remaining photos last, three to a row, each fitted whole inside its frame ---
  if (morePhotos.length) {
    const gap = 6;
    const cellW = (CONTENT_W - gap * 2) / 3;
    const cellH = cellW * 1.25;
    ensure(10 + cellH);
    doc.setFont("times", "bold");
    doc.setFontSize(15);
    doc.setTextColor(...SAFFRON);
    doc.text("Photos", MARGIN, y);
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y + 2.2, PAGE_W - MARGIN, y + 2.2);
    y += 7;
    morePhotos.forEach((img, i) => {
      const col = i % 3;
      if (col === 0 && i > 0) {
        y += cellH + gap;
        ensure(cellH);
      }
      const cx = MARGIN + col * (cellW + gap);
      const { width, height } = doc.getImageProperties(img);
      const scale = Math.min(cellW / width, cellH / height);
      const w = width * scale;
      const h = height * scale;
      doc.setFillColor(...CREAM);
      doc.roundedRect(cx, y, cellW, cellH, 3, 3, "F");
      doc.addImage(img, "JPEG", cx + (cellW - w) / 2, y + (cellH - h) / 2, w, h, undefined, "MEDIUM");
      doc.setDrawColor(...GOLD);
      doc.setLineWidth(0.6);
      doc.roundedRect(cx, y, cellW, cellH, 3, 3, "S");
    });
  }

  // --- Footer on every page ---
  const pages = doc.getNumberOfPages();
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, PAGE_H - 12, PAGE_W - MARGIN, PAGE_H - 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(`Downloaded from ${SITE} on ${today}  ·  Contact: ${SUPPORT_EMAIL}  ·  Keep this profile private.`, MARGIN, PAGE_H - 7.5);
    doc.text(`Page ${p} of ${pages}`, PAGE_W - MARGIN, PAGE_H - 7.5, { align: "right" });
  }

  const fileName = [basic.fullName, basic.uniqueId].filter(Boolean).join(" - ").replace(/[\\/:*?"<>|]+/g, "");
  doc.save(`${fileName || "profile"}.pdf`);
};
