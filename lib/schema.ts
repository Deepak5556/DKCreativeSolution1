import { siteConfig } from "./constants";

/**
 * Schema.org structured data, injected into <head> via a <script type="application/ld+json">
 * tag in app/layout.tsx. Search engines use this to render rich results
 * (sitelinks, knowledge panel info, breadcrumbs, etc.)
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.svg`,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    description: siteConfig.description,
    telephone: siteConfig.phoneRaw,
    email: siteConfig.email,
    priceRange: "$$",
    areaServed: "Worldwide",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    founder: {
      "@type": "Person",
      name: siteConfig.founder,
    },
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.linkedin,
      siteConfig.links.instagram,
      siteConfig.links.twitter,
      siteConfig.links.youtube,
      siteConfig.links.behance,
    ],
    makesOffer: [
      "Website Development",
      "Video Editing",
      "Poster Design",
      "UI/UX Design",
      "Landing Page Development",
      "Portfolio Website Development",
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name,
      },
    })),
  };
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function getBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
    ],
  };
}
