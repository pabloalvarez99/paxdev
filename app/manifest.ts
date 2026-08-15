import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PAX / DEV — Pablo Alvarez",
    short_name: "PAX / DEV",
    description: "AI systems and product engineering with public evidence behind every claim.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F4ED",
    theme_color: "#F7F4ED",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
