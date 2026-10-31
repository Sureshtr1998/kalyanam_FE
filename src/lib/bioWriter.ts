// Writes "About me" and partner-expectation text from the member's own details.
// Plain templates (no AI service), so it is free and instant. Each call picks
// different phrasing, so "Rewrite" gives a fresh version.
import { fetchLabel, motherTongueOptions, normalizeToArray, presetLabels } from "@/utils/utils";
import { ageFromFloating } from "@/lib/dates";
import { heightOptions, qualificationOptions, qualificationPresets } from "@/utils/constants";
import type { UserDetails } from "@/utils/interfaces";

const pick = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];
const label = (options: { label: string; value: string }[], v?: string) => {
  const l = fetchLabel(options, v);
  return l === "-" ? "" : l;
};
const article = (word: string) => (/^[aeiou]/i.test(word) ? "an" : "a");
const firstName = (name = "") => name.trim().split(/\s+/)[0] ?? "";
const listOf = (items: string[]) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} or ${items[items.length - 1]}`;
const sentence = (s: string) => {
  const t = s.trim().replace(/\s+/g, " ");
  return t ? t[0].toUpperCase() + t.slice(1) + (/[.!?]$/.test(t) ? "" : ".") : "";
};
/** Keeps whole sentences only, within the textarea's limit. */
const fit = (sentences: string[], max: number) =>
  sentences
    .filter(Boolean)
    .reduce((out, s) => (out.length + s.length + 1 <= max ? (out ? `${out} ${s}` : s) : out), "");

const WORK: Record<string, string> = {
  Private: "working in the private sector",
  Government: "working with the government",
  PSU: "working in a public sector undertaking",
  Defence: "serving in the defence forces",
  Business: "running a business",
  "Self Employed": "self-employed",
  Student: "currently pursuing studies",
  Homemaker: "a homemaker",
  Retired: "retired",
};

const PREFERRED_WORK: Record<string, string> = {
  Private: "in the private sector",
  Government: "in government service",
  PSU: "in a PSU",
  Defence: "in the defence forces",
  Business: "in business",
  "Self Employed": "self-employed",
  Student: "studying",
  Homemaker: "a homemaker",
};

/** [first person, third person] */
const VALUES: [string, string][] = [
  ["value honesty, respect and a good sense of humour", "values honesty, respect and a good sense of humour"],
  ["believe in mutual respect, open communication and growing together", "believes in mutual respect, open communication and growing together"],
  ["enjoy a healthy balance of tradition and a modern outlook", "enjoys a healthy balance of tradition and a modern outlook"],
  ["am grounded, family-oriented and easy to talk to", "is grounded, family-oriented and easy to talk to"],
  ["care deeply about family and keep simple, sincere values", "cares deeply about family and keeps simple, sincere values"],
];

const WISHES = [
  "a kind, understanding partner who values family",
  "a caring and supportive life partner with similar values",
  "someone sincere and respectful who will be a true companion",
  "a partner who balances tradition with an open mind",
];

export const writeAboutMe = (data: UserDetails, max = 600) => {
  const b = data.basic;
  const p = data.personal ?? {};
  const f = data.family ?? {};
  const self = !b.profileCreatedBy || b.profileCreatedBy === "Self";
  const female = b.gender === "Female";
  const name = firstName(b.fullName) || (female ? "She" : "He");
  const relation =
    b.profileCreatedBy === "Parent"
      ? `our ${female ? "daughter" : "son"}`
      : b.profileCreatedBy === "Sibling"
        ? `my ${female ? "sister" : "brother"}`
        : "";

  // Written by the member, or about them by family/friends.
  const he = female ? "she" : "he";
  const v = self
    ? { am: "I am", have: "I have", come: "I come", my: "my", has: "have" }
    : { am: `${he} is`, have: `${he} has`, come: `${he} comes`, my: female ? "her" : "his", has: "has" };

  const age = ageFromFloating(b.dob);
  const height = label(heightOptions, p.height).split(" (")[0];
  const qual = label(qualificationOptions, b.qualification);
  const tongue = label(motherTongueOptions, b.motherTongue);
  const community = b.subCaste || b.caste;
  const work = p.employedIn ? WORK[p.employedIn] : "";
  const place = p.workCity || (p.country && p.country !== "India" ? p.country : "");

  const intro = self
    ? pick([`Hi, I'm ${name}${age ? `, ${age}` : ""}`, `Namaste! I am ${name}${age ? `, ${age} years old` : ""}`])
    : `${name} is ${relation || "a wonderful person"}${age ? `, ${age} years old` : ""}`;

  const career = [
    qual && `${v.have} completed ${v.my} ${qual}`,
    work && `${v.am} ${work}${place ? ` in ${place}` : ""}`,
  ]
    .filter(Boolean)
    .join(" and ");

  const siblings = (["elderBro", "youngerBro", "elderSis", "youngerSis"] as const).reduce(
    (n, k) => n + (Number(f[k]) || 0),
    0
  );
  const background = [f.familyStatus?.toLowerCase(), tongue && `${tongue}-speaking`, community].filter(Boolean).join(" ");
  const family = background
    ? `${v.come} from ${article(background)} ${background} family${siblings ? ` and ${v.has} ${siblings} sibling${siblings > 1 ? "s" : ""}` : ""}`
    : "";

  const diet = p.diet?.toLowerCase();
  const looks = height
    ? `${v.am} ${height} tall${diet ? ` and ${diet}` : ""}`
    : diet
      ? `${v.am} ${diet}`
      : "";

  const [first, third] = pick(VALUES);
  const values = self ? `I ${first}` : `${name} ${third}`;
  const wish = self
    ? `I am looking for ${pick(WISHES)}`
    : `${relation ? "We are" : "The family is"} looking for ${pick(WISHES)} for ${female ? "her" : "him"}`;

  return fit([intro, career, family, looks, values, wish].map(sentence), max);
};

export const writePartnerNote = (data: UserDetails, max = 500) => {
  const pr = data.partner ?? {};
  const p = data.personal ?? {};
  const b = data.basic;
  const partner = b.gender === "Female" ? "groom" : b.gender === "Male" ? "bride" : "partner";

  const ages = pr.ageFrom || pr.ageTo ? `aged ${pr.ageFrom ?? 18} to ${pr.ageTo ?? 60}` : "";
  const castes = normalizeToArray(pr.caste);
  const community = castes.length && castes.length <= 3 ? `from the ${listOf(castes)} community` : "";
  const quals = presetLabels(qualificationOptions, qualificationPresets, pr.qualification);
  const education = quals.length && quals.length <= 3 ? `Preferred education: ${listOf(quals)}` : "";

  const opening = pick([
    `Looking for a ${pick(["kind", "caring", "sincere", "warm"])} and ${pick(["understanding", "respectful", "supportive"])} ${partner}${ages ? ` ${ages}` : ""}${community ? `, ${community}` : ""}`,
    `We hope to find a well-educated ${partner}${ages ? ` ${ages}` : ""}${community ? ` ${community}` : ""}`,
  ]);
  const values = pick([
    "Someone who respects elders, values family and is open to sharing responsibilities",
    "Good values, a positive attitude and mutual respect matter more to us than anything else",
    "We value honesty, kindness and a willingness to grow together as a family",
  ]);
  const diet =
    p.diet === "Vegetarian" ? "A vegetarian partner would be preferred" : "";
  const work = normalizeToArray(pr.employedIn).filter((e) => !["Not Working", "Retired"].includes(e));
  const career =
    work.length && work.length <= 3 ? `Preferably ${listOf(work.map((w) => PREFERRED_WORK[w] ?? w.toLowerCase()))}` : "";
  const closing = pick([
    "Families with similar values are welcome to reach out",
    "Horoscope matching is welcome",
    "Looking forward to connecting with like-minded families",
  ]);

  return fit([opening, values, education, career, diet, closing].map(sentence), max);
};
