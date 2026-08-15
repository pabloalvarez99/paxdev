import type { MetadataRoute } from "next";

import portfolio from "@/content/portfolio";

const { site, aiSystems } = portfolio;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = site.lastVerified;

  return [
    {
      url: site.canonicalUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.canonicalUrl}/studio`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.canonicalUrl}/interview`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.canonicalUrl}/read`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${site.canonicalUrl}/changelog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${site.canonicalUrl}/casestudy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...aiSystems.map((system) => ({
      url: `${site.canonicalUrl}${system.route}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
