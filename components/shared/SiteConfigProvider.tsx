"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { siteConfig as defaultSiteConfig } from "@/lib/constants";

type SiteConfig = typeof defaultSiteConfig;

const SiteConfigContext = createContext<SiteConfig>(defaultSiteConfig);

export const useSiteConfig = () => useContext(SiteConfigContext);

interface SiteConfigProviderProps {
  children: React.ReactNode;
}

export function SiteConfigProvider({ children }: SiteConfigProviderProps) {
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/content/site_settings");
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const dbRow = data[0];
          setConfig({
            name: dbRow.name ?? defaultSiteConfig.name,
            shortName: dbRow.shortName ?? defaultSiteConfig.shortName,
            tagline: dbRow.tagline ?? defaultSiteConfig.tagline,
            description: dbRow.description ?? defaultSiteConfig.description,
            url: dbRow.url ?? defaultSiteConfig.url,
            ogImage: dbRow.ogImage ?? defaultSiteConfig.ogImage,
            email: dbRow.email ?? defaultSiteConfig.email,
            phone: dbRow.phone ?? defaultSiteConfig.phone,
            phoneRaw: dbRow.phoneRaw ?? defaultSiteConfig.phoneRaw,
            location: dbRow.location ?? defaultSiteConfig.location,
            founder: dbRow.founder ?? defaultSiteConfig.founder,
            keywords: dbRow.keywords ?? defaultSiteConfig.keywords,
            links: {
              github: dbRow.githubUrl ?? defaultSiteConfig.links.github,
              linkedin: dbRow.linkedinUrl ?? defaultSiteConfig.links.linkedin,
              instagram: dbRow.instagramUrl ?? defaultSiteConfig.links.instagram,
              twitter: dbRow.twitterUrl ?? defaultSiteConfig.links.twitter,
              youtube: dbRow.youtubeUrl ?? defaultSiteConfig.links.youtube,
              behance: dbRow.behanceUrl ?? defaultSiteConfig.links.behance,
              whatsapp: dbRow.whatsappUrl ?? defaultSiteConfig.links.whatsapp,
            },
          });
        }
      } catch (err) {
        console.error("Error loading dynamic site settings:", err);
      }
    }
    fetchConfig();
  }, []);

  return (
    <SiteConfigContext.Provider value={config}>
      {children}
    </SiteConfigContext.Provider>
  );
}
