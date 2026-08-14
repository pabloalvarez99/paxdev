import type { MetadataRoute } from "next";

import portfolio from "@/content/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: portfolio.site.canonicalUrl,
      lastModified: portfolio.site.lastVerified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
