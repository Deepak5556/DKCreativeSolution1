import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Toaster } from "@/components/ui/toaster";
import { PageLoader } from "@/components/shared/PageLoader";
import { supabase } from "@/lib/supabase";
import { siteConfig as fallbackConfig } from "@/lib/constants";
import {
  getOrganizationSchema,
  getWebsiteSchema,
  getBreadcrumbSchema,
  getLocalBusinessSchema,
  getServicesSchema,
} from "@/lib/schema";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteConfigProvider } from "@/components/shared/SiteConfigProvider";

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

async function getSiteConfig() {
  let config = fallbackConfig;
  try {
    const { data } = await supabase.from("site_settings").select("*").limit(1).single();
    if (data) {
      config = {
        ...config,
        name: data.name || config.name,
        shortName: data.short_name || config.shortName,
        tagline: data.tagline || config.tagline,
        description: data.description || config.description,
        url: data.url || config.url,
        ogImage: data.og_image || config.ogImage,
        email: data.email || config.email,
        phone: data.phone || config.phone,
        phoneRaw: data.phone_raw || config.phoneRaw,
        location: data.location || config.location,
        founder: data.founder || config.founder,
        keywords: Array.from(new Set([
          ...(data.keywords && data.keywords.length ? data.keywords : []),
          ...fallbackConfig.keywords,
        ])),
        links: {
          github: data.github_url || config.links.github,
          linkedin: data.linkedin_url || config.links.linkedin,
          instagram: data.instagram_url || config.links.instagram,
          twitter: data.twitter_url || config.links.twitter,
          youtube: data.youtube_url || config.links.youtube,
          behance: data.behance_url || config.links.behance,
          whatsapp: data.whatsapp_url || config.links.whatsapp,
        },
      };
    }
  } catch (err) {
    console.error("Failed to fetch site config from Supabase:", err);
  }
  return config;
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const ogImageUrl = config.ogImage.startsWith("http")
    ? config.ogImage
    : `${config.url}${config.ogImage}`;

  return {
    metadataBase: new URL(config.url),
    title: {
      default: `${config.name} | ${config.tagline}`,
      template: `%s | ${config.name}`,
    },
    description: config.description,
    keywords: config.keywords,
    authors: [{ name: config.founder, url: config.url }],
    creator: config.name,
    publisher: config.name,
    applicationName: config.name,
    formatDetection: { telephone: true, email: true, address: true },
    alternates: { canonical: config.url },
    category: "technology",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: {
      google: "MwtG3rhwgRjuW5jvNT-nscDB1_ibIIbL5856et2JJGc",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: config.url,
      siteName: config.name,
      title: `${config.name} | ${config.tagline}`,
      description: config.description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: config.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.name} | ${config.tagline}`,
      description: config.description,
      images: [ogImageUrl],
      creator: "@dkcreativesoln",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig();
  const organizationSchema = getOrganizationSchema(config);
  const websiteSchema = getWebsiteSchema(config);
  const breadcrumbSchema = getBreadcrumbSchema(config);
  const localBusinessSchema = getLocalBusinessSchema(config);
  const servicesSchema = getServicesSchema(config);

  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {servicesSchema.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className="min-h-screen bg-dk-bg font-body text-white antialiased">
        <SiteConfigProvider>
          <PageLoader />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster />
          <SpeedInsights />
        </SiteConfigProvider>
      </body>
    </html>
  );
}
