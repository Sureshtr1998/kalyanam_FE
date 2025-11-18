import { Helmet } from "react-helmet-async";

interface Props {
  title: string;
  description: string;
  keywords: string;
  robots?: string;
}
export default function SEO(props: Props) {
  const { title, description, keywords, robots = "index, follow" } = props;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      // Organization
      {
        "@type": "Organization",
        "@id": "https://seetharamakalyana.in/#organization",
        name: "Seetha Rama Kalyana",
        url: "https://seetharamakalyana.in",
        logo: "https://seetharamakalyana.in/logo.png",
        description:
          "A trusted Kannada Brahmin matrimony platform helping families find the perfect life partner based on tradition, values, and trust.",
      },

      // Website
      {
        "@type": "WebSite",
        "@id": "https://seetharamakalyana.in/#website",
        url: "https://seetharamakalyana.in",
        name: "Seetha Rama Kalyana Matrimony",
        publisher: {
          "@id": "https://seetharamakalyana.in/#organization",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://seetharamakalyana.in/search?q={query}",
          "query-input": "required name=query",
        },
      },

      // WebPage
      {
        "@type": "WebPage",
        "@id": "https://seetharamakalyana.in/about-us#webpage",
        url: "https://seetharamakalyana.in/about-us",
        name: title || "About Us | Seetha Rama Kalyana",
        description:
          description ||
          "Learn about Seetha Rama Kalyana, our mission, core values, and dedicated team serving the Brahmin community.",
        isPartOf: {
          "@id": "https://seetharamakalyana.in/#website",
        },
        breadcrumb: {
          "@id": "https://seetharamakalyana.in/about-us#breadcrumb",
        },
      },

      // Breadcrumb
      {
        "@type": "BreadcrumbList",
        "@id": "https://seetharamakalyana.in/about-us#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://seetharamakalyana.in",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "About Us",
            item: "https://seetharamakalyana.in/about-us",
          },
        ],
      },

      // Service
      {
        "@type": "Service",
        "@id": "https://seetharamakalyana.in/#service",
        serviceType: "Matrimony Service",
        provider: {
          "@id": "https://seetharamakalyana.in/#organization",
        },
        areaServed: "Worldwide",
        description:
          "Premium matrimony service focused on the Kannada Brahmin community, helping families connect for meaningful lifelong matches.",
      },

      // Page sections as WebPageElement
      {
        "@type": "WebPageElement",
        "@id": "https://seetharamakalyana.in/about-us#header",
        name: "Header Section",
        cssSelector: ".header-section",
        description:
          "Top section introducing Seetha Rama Kalyana and its mission.",
      },
      {
        "@type": "WebPageElement",
        "@id": "https://seetharamakalyana.in/about-us#mission",
        name: "Mission Section",
        cssSelector: ".mission-section",
        description: "Section describing the platform's mission and values.",
      },
      {
        "@type": "WebPageElement",
        "@id": "https://seetharamakalyana.in/about-us#team",
        name: "Team Section",
        cssSelector: ".team-section",
        description:
          "Section highlighting the dedicated team behind Seetha Rama Kalyana.",
      },
      {
        "@type": "WebPageElement",
        "@id": "https://seetharamakalyana.in/about-us#commitment",
        name: "Commitment Section",
        cssSelector: ".commitment-section",
        description: "Section outlining core values and commitments to users.",
      },
      {
        "@type": "WebPageElement",
        "@id": "https://seetharamakalyana.in/about-us#action",
        name: "Action Section",
        cssSelector: ".action-section",
        description:
          "Call-to-action section inviting users to register and start their journey.",
      },
    ],
  };

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
