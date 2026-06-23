import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Toaster } from "@/components/ui/toaster";
import { PageLoader } from "@/components/shared/PageLoader";
import { supabase } from "@/lib/supabase";
import { siteConfig as fallbackConfig } from "@/lib/constants";
import { getOrganizationSchema, getWebsiteSchema } from "@/lib/schema";
import { SpeedInsights } from "@vercel/speed-insights/next";

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

export async function generateMetadata(): Promise<Metadata> {
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
        keywords: data.keywords && data.keywords.length ? data.keywords : config.keywords,
      };
    }
  } catch (err) {
    console.error("Failed to fetch site config from Supabase:", err);
  }

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
          url: config.ogImage,
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
      images: [config.ogImage],
      creator: "@dkcreativesoln",
    },
    icons: {
      icon: "/icon",
      shortcut: "/icon",
      apple: "/icon",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = getOrganizationSchema();
  const websiteSchema = getWebsiteSchema();

  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen bg-dk-bg font-body text-white antialiased">
        <PageLoader />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
