import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords: string;
  url?: string;
  robots?: string;
  pageType?: "default" | "faq" | "blog" | "terms" | "privacy";
  faqItems?: { question: string; answer: string }[]; // for FAQ
  blogPosts?: { title: string; summary: string }[]; // for Blog
}

export default function SEO({
  title,
  description,
  keywords,
  url = "https://seetharamakalyana.in",
  robots = "index, follow",
  pageType = "default",
  faqItems = [],
  blogPosts = [],
}: SEOProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const schema: any = [
    {
      "@type": "Organization",
      "@id": `${url}/#organization`,
      name: "Seetha Rama Kalyana",
      url,
      logo: `${url}/logo.png`,
      description:
        "A trusted Kannada Brahmin matrimony platform helping families find the perfect life partner based on tradition, values, and trust.",
    },
    {
      "@type": "WebSite",
      "@id": `${url}/#website`,
      url,
      name: "Seetha Rama Kalyana Matrimony",
      publisher: { "@id": `${url}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      isPartOf: { "@id": `${url}/#website` },
    },
  ];

  // Add FAQ structured data if pageType is 'faq'
  if (pageType === "faq" && faqItems.length > 0) {
    schema.push({
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  // Add Blog structured data if pageType is 'blog'
  if (pageType === "blog" && blogPosts.length > 0) {
    schema.push({
      "@type": "Blog",
      "@id": `${url}/blog#blog`,
      url: `${url}/blog`,
      name: "Seetha Rama Kalyana Blog",
      description: description,
      publisher: {
        "@type": "Organization",
        name: "Seetha Rama Kalyana",
        logo: {
          "@type": "ImageObject",
          url: `${url}/logo.png`,
        },
      },
      hasPart: blogPosts.map((post, index) => ({
        "@type": "BlogPosting",
        headline: post.title,
        description: post.summary,
        position: index + 1,
      })),
    });
  }

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />

      {/* Canonical link */}
      <link rel="canonical" href={url} />

      {/* JSON-LD structured data */}
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
