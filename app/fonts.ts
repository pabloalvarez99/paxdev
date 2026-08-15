import localFont from "next/font/local";

/**
 * Source Serif 4, variable, latin subset, roman and italic. Two woff2 files committed under
 * app/fonts/ with their OFL licence, so the type program needs no font CDN at runtime and no
 * network at build time. Fallbacks are the closest faces a machine already has, in the same
 * transitional-serif family, so a swap moves the line by very little.
 */
export const serif = localFont({
  src: [
    {
      path: "./fonts/source-serif-4-latin-wght-normal.woff2",
      weight: "200 900",
      style: "normal",
    },
    {
      path: "./fonts/source-serif-4-latin-wght-italic.woff2",
      weight: "200 900",
      style: "italic",
    },
  ],
  variable: "--font-serif",
  display: "swap",
  preload: true,
  fallback: ["Iowan Old Style", "Palatino Linotype", "Palatino", "Georgia", "serif"],
});
