import { SEO_URL, SITE_NAME, SUPPORT_EMAIL } from "@/utils/constants";

type JsonLd = Record<string, unknown>;

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  /** Absolute canonical URL. Defaults to the site root. */
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

const DEFAULT_IMAGE = `${SEO_URL}/assets/hero.webp`;

const absolute = (path: string) => (path.startsWith("http") ? path : `${SEO_URL}${path}`);

/**
 * Per-page metadata. React 19 hoists <title>, <meta> and <link> into <head>;
 * the JSON-LD script stays in the body, which search engines accept.
 */
export default function SEO({
  title,
  description,
  keywords,
  url = SEO_URL,
  image = DEFAULT_IMAGE,
  noindex = false,
  type = "website",
  pageType = "default",
  faqItems = [],
  blogPosts = [],
  additionalSchema = [],
}: SEOProps) {
  const img = absolute(image);
  const graph: JsonLd[] = [
    {
      "@type": "Organization",
      "@id": `${SEO_URL}/#organization`,
      name: SITE_NAME,
      url: SEO_URL,
      logo: `${SEO_URL}/logo.png`,
      email: SUPPORT_EMAIL,
      description:
        "A trusted Hindu matrimony platform helping families find the perfect life partner based on tradition, values, and trust.",
    },
    {
      "@type": "WebSite",
      "@id": `${SEO_URL}/#website`,
      url: SEO_URL,
      name: `${SITE_NAME} Matrimony`,
      inLanguage: "en-IN",
      publisher: { "@id": `${SEO_URL}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
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

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
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
