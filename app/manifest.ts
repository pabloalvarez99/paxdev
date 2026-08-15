import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pablo Figueroa",
    short_name: "Pablo Figueroa",
    description:
      "Sistemas de inteligencia artificial que funcionan y se pueden abrir ahora mismo, con evidencia pública detrás de cada afirmación.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F4ED",
    theme_color: "#F7F4ED",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
