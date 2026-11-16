import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/misc/SEO";
import { LegalPage, type LegalSection } from "@/components/common/LegalPage";
import { localeOf, localePath, usePublicLang, type Lang } from "@/lib/i18n";
import { SEO_URL, SUPPORT_EMAIL, updatedDate } from "@/utils/constants";

/**
 * A policy page's text as plain data, so each language is one object.
 * A block is a paragraph (string), a sub-heading ({ h }) or a bullet list ({ ul }).
 * Inline markup: **bold**, [label](/path#hash) for a link to another page
 * (it opens in the reader's language), and {email} for the support email.
 */
export type LegalBlock = string | { h: string } | { ul: string[] };
export interface LegalDoc {
  seoTitle: string;
  seoDescription: string;
  title: string;
  description: string;
  sections: { id: string; title: string; blocks: LegalBlock[] }[];
}

/** Page chrome around every policy, per language. */
// eslint-disable-next-line react-refresh/only-export-components
export const legalUi: Record<Lang, { contents: string; jump: string; updated: string; englishPrevails: string }> = {
  en: { contents: "Contents", jump: "Jump to a section", updated: "Last updated", englishPrevails: "" },
  kn: {
    contents: "ಪರಿವಿಡಿ",
    jump: "ವಿಭಾಗಕ್ಕೆ ಹೋಗಿ",
    updated: "ಕೊನೆಯ ನವೀಕರಣ",
    englishPrevails: "ಇದು ಇಂಗ್ಲಿಷ್ ನೀತಿಯ ಅನುವಾದ. ಅರ್ಥದಲ್ಲಿ ವ್ಯತ್ಯಾಸ ಕಂಡುಬಂದರೆ ಇಂಗ್ಲಿಷ್ ಆವೃತ್ತಿಯೇ ಅಂತಿಮ.",
  },
  hi: {
    contents: "विषय सूची",
    jump: "किसी भाग पर जाएँ",
    updated: "अंतिम अपडेट",
    englishPrevails: "यह अंग्रेज़ी नीति का अनुवाद है। अर्थ में कोई अंतर हो तो अंग्रेज़ी संस्करण ही मान्य होगा।",
  },
  te: {
    contents: "విషయ సూచిక",
    jump: "విభాగానికి వెళ్ళండి",
    updated: "చివరి నవీకరణ",
    englishPrevails: "ఇది ఇంగ్లీష్ విధానానికి అనువాదం. అర్థంలో తేడా ఉంటే ఇంగ్లీష్ వెర్షనే చెల్లుతుంది.",
  },
  ta: {
    contents: "உள்ளடக்கம்",
    jump: "பகுதிக்குச் செல்லுங்கள்",
    updated: "கடைசியாக புதுப்பிக்கப்பட்டது",
    englishPrevails: "இது ஆங்கிலக் கொள்கையின் மொழிபெயர்ப்பு. பொருளில் வேறுபாடு இருந்தால் ஆங்கிலப் பதிப்பே செல்லும்.",
  },
};

const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\{email\})/g;

const inline = (text: string, lang: Lang): ReactNode =>
  text.split(TOKEN).map((part, i) => {
    if (part === "{email}")
      return (
        <a key={i} className="font-semibold text-primary" href={`mailto:${SUPPORT_EMAIL}`}>
          {SUPPORT_EMAIL}
        </a>
      );
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)#]+)(#[^)]*)?\)$/);
    if (link)
      return (
        <Link key={i} className="font-semibold text-primary" to={localePath(link[2], lang) + (link[3] ?? "")}>
          {link[1]}
        </Link>
      );
    return <Fragment key={i}>{part}</Fragment>;
  });

const renderBlock = (b: LegalBlock, i: number, lang: Lang) => {
  if (typeof b === "string") return <p key={i}>{inline(b, lang)}</p>;
  if ("h" in b)
    return (
      <h3 key={i} className="pt-2 text-lg font-semibold text-foreground">
        {inline(b.h, lang)}
      </h3>
    );
  return (
    <ul key={i}>
      {b.ul.map((li, j) => (
        <li key={j}>{inline(li, lang)}</li>
      ))}
    </ul>
  );
};

/** A full policy page in the reader's language (/kn/terms, /hi/privacy …). */
export const LegalDocPage = ({
  docs,
  path,
  pageType,
}: {
  docs: Record<Lang, LegalDoc>;
  path: string;
  pageType?: "terms" | "privacy";
}) => {
  const [lang] = usePublicLang();
  const doc = docs[lang];
  const ui = legalUi[lang];
  const sections: LegalSection[] = doc.sections.map((s) => ({
    id: s.id,
    title: s.title,
    content: <>{s.blocks.map((b, i) => renderBlock(b, i, lang))}</>,
  }));
  const effective = new Date(updatedDate).toLocaleDateString(localeOf(lang), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <>
      <SEO title={doc.seoTitle} description={doc.seoDescription} url={SEO_URL + path} pageType={pageType} />
      <LegalPage
        title={doc.title}
        description={doc.description}
        effective={effective}
        sections={sections}
        labels={ui}
      />
    </>
  );
};
