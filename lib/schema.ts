import { siteConfig as fallbackConfig } from "./constants";

/**
 * Schema.org structured data, injected into <head> via a <script type="application/ld+json">
 * tag in app/layout.tsx. Search engines use this to render rich results
 * (sitelinks, knowledge panel info, breadcrumbs, etc.)
 */
export function getOrganizationSchema(config: typeof fallbackConfig = fallbackConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.name,
    alternateName: config.shortName,
    url: config.url,
    logo: `${config.url}/logo.png`,
    image: `${config.url}/logo.png`,
    description: config.description,
    telephone: config.phoneRaw,
    email: config.email,
    priceRange: "$$",
    areaServed: "Worldwide",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    founder: {
      "@type": "Person",
      name: config.founder,
    },
    sameAs: [
      config.links.github,
      config.links.linkedin,
      config.links.instagram,
      config.links.twitter,
      config.links.youtube,
      config.links.behance,
      config.links.whatsapp,
    ].filter(Boolean),
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

export function getWebsiteSchema(config: typeof fallbackConfig = fallbackConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.name,
    url: config.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${config.url}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function getBreadcrumbSchema(config: typeof fallbackConfig = fallbackConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: config.url,
      },
    ],
  };
}

export function getLocalBusinessSchema(config: typeof fallbackConfig = fallbackConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: config.name,
    image: `${config.url}/logo.png`,
    url: config.url,
    telephone: config.phoneRaw,
    email: config.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: config.location,
      addressLocality: "Tamil Nadu",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "11.1271",
      longitude: "78.6569",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    sameAs: [
      config.links.github,
      config.links.linkedin,
      config.links.instagram,
      config.links.twitter,
      config.links.youtube,
      config.links.behance,
      config.links.whatsapp,
    ].filter(Boolean),
  };
}

export function getServicesSchema(config: typeof fallbackConfig = fallbackConfig) {
  const services = [
    {
      name: "Website Development & Web Application Development",
      description: "Custom website development, React/Next.js frontend development, Node.js backend, and Flutter mobile app development with maximum page speed optimization.",
      category: "Software/Web Development"
    },
    {
      name: "UI/UX Design & Brand Identity Design",
      description: "Premium user experience design, wireframing, interactive prototyping, logo design, and branding assets using Figma and modern design systems.",
      category: "Graphic Design"
    },
    {
      name: "Video Editing & YouTube Thumbnail Design",
      description: "Professional YouTube video editing, motion graphics, social media creatives, and high-conversion custom YouTube thumbnail design.",
      category: "Creative Services"
    },
    {
      name: "SEO Services & Digital Marketing",
      description: "Complete search engine optimization including Local SEO, Technical SEO, On-Page SEO, and website speed optimization to achieve a 100 Lighthouse score.",
      category: "Digital Marketing"
    }
  ];

  return services.map((service, index) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${config.url}/#service-${index}`,
    "name": service.name,
    "description": service.description,
    "serviceType": service.category,
    "provider": {
      "@type": "LocalBusiness",
      "name": config.name,
      "image": `${config.url}/logo.png`,
      "url": config.url,
      "telephone": config.phoneRaw,
      "priceRange": "$$"
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": "Contact for pricing"
    }
  }));
}

