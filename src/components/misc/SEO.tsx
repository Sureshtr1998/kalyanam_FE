import { useLocation } from "react-router-dom";
import { LANGUAGES, localeOf, localePath, splitLocalePath, TRANSLATED_PATHS } from "@/lib/i18n";
import { SEO_URL, SITE_NAME, SOCIAL_PROFILES, SUPPORT_EMAIL, SUPPORT_PHONE } from "@/utils/constants";

type JsonLd = Record<string, unknown>;

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  /** Absolute canonical URL. Defaults to the site root; translated pages use their own language's URL. */
  url?: string;
  /** Absolute or root-relative share image. */
  image?: string;
  /** Private pages (matches, account…) must not be indexed. */
  noindex?: boolean;
  type?: "website" | "article";
  pageType?: "default" | "faq" | "blog" | "terms" | "privacy";
  faqItems?: { question: string; answer: string }[];
  blogPosts?: { title: string; summary: string; slug?: string }[];
  /** Extra schema.org nodes for this page. */
  additionalSchema?: JsonLd[];
}

// 1200x630 JPEG: the size and format every link preview (WhatsApp, Facebook, X, LinkedIn) supports.
const DEFAULT_IMAGE = `${SEO_URL}/assets/og-default.jpg`;

const absolute = (path: string) => (path.startsWith("http") ? path : `${SEO_URL}${path}`);
/** Absolute URL of a site path; the home page has no trailing slash, like SEO_URL. */
const pageHref = (path: string) => (path === "/" ? SEO_URL : `${SEO_URL}${path}`);

/**
 * Per-page metadata. React 19 hoists <title>, <meta> and <link> into <head>;
 * the JSON-LD script stays in the body, which search engines accept.
 */
export default function SEO({
  title,
  description,
  keywords,
  url: pageUrl = SEO_URL,
  image = DEFAULT_IMAGE,
  noindex = false,
  type = "website",
  pageType = "default",
  faqItems = [],
  blogPosts = [],
  additionalSchema = [],
}: SEOProps) {
  const img = absolute(image);
  const { pathname } = useLocation();
  const { lang: urlLang, path } = splitLocalePath(pathname);
  const lang = urlLang ?? "en";
  const locale = localeOf(lang);
  const translated = TRANSLATED_PATHS.includes(path);
  const url = translated ? pageHref(localePath(path, lang)) : pageUrl;

  const graph: JsonLd[] = [
    {
      "@type": "Organization",
      "@id": `${SEO_URL}/#organization`,
      name: SITE_NAME,
      alternateName: ["Seetha Rama Kalyana Matrimony", "Seetharamakalyana"],
      url: SEO_URL,
      logo: { "@type": "ImageObject", url: `${SEO_URL}/logo.png`, width: 512, height: 512 },
      email: SUPPORT_EMAIL,
      description:
        "A newly launched Hindu matrimony platform for families across India and abroad, with verified profiles, two-way privacy, horoscope matching and no sales calls.",
      areaServed: { "@type": "Country", name: "India" },
      knowsLanguage: LANGUAGES.map((l) => l.locale),
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: SUPPORT_EMAIL,
        telephone: SUPPORT_PHONE.replace(/\s/g, ""),
        areaServed: "IN",
        availableLanguage: ["English", "Kannada", "Hindi", "Telugu", "Tamil"],
      },
      ...(SOCIAL_PROFILES.length ? { sameAs: SOCIAL_PROFILES } : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${SEO_URL}/#website`,
      url: SEO_URL,
      name: `${SITE_NAME} Matrimony`,
      inLanguage: LANGUAGES.map((l) => l.locale),
      publisher: { "@id": `${SEO_URL}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: locale,
      primaryImageOfPage: img,
      isPartOf: { "@id": `${SEO_URL}/#website` },
    },
    // Nodes live inside one @graph, so they must not carry their own @context.
    ...additionalSchema.map((node) =>
      Object.fromEntries(Object.entries(node).filter(([key]) => key !== "@context"))
    ),
  ];

  if (pageType === "faq" && faqItems.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  if (pageType === "blog" && blogPosts.length) {
    graph.push({
      "@type": "Blog",
      "@id": `${SEO_URL}/blog#blog`,
      url: `${SEO_URL}/blog`,
      name: `${SITE_NAME} Blog`,
      description,
      publisher: { "@id": `${SEO_URL}/#organization` },
      blogPost: blogPosts.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        description: post.summary,
        ...(post.slug ? { url: `${SEO_URL}/blog/${post.slug}` } : {}),
      })),
    });
  }

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"} />
      {!noindex && <link rel="canonical" href={url} />}
      {/* Every language version lists all of them, itself included. */}
      {!noindex &&
        translated &&
        LANGUAGES.map((l) => (
          <link
            key={l.value}
            rel="alternate"
            hrefLang={l.locale}
            href={pageHref(localePath(path, l.value))}
          />
        ))}
      {!noindex && translated && <link rel="alternate" hrefLang="x-default" href={pageHref(path)} />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={locale.replace("-", "_")} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      {img === DEFAULT_IMAGE && (
        <>
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content="Seetha Rama Kalyana, Hindu matrimony across India" />
        </>
      )}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />

      {!noindex && (
        <script type="application/ld+json">
          {JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}
        </script>
      )}
    </>
  );
}
