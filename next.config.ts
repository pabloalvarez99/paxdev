import type { NextConfig } from "next";

import verifiedUrls from "./content/verified-urls.json";

/**
 * The demo studio embeds the hosted systems. frame-src is derived from the same fixture the
 * content is derived from, so a host that loses its verified 200 loses its frame permission in
 * the same commit; nothing else is allowed to be framed.
 */
const frameSources = Array.from(
  new Set(
    verifiedUrls.checks
      .filter((check) => check.observed === 200)
      .map((check) => new URL(check.url).origin)
      .filter((origin) => origin.startsWith("https://pax-")),
  ),
).sort();

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  `frame-src ${frameSources.join(" ")}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
];

/**
 * The site used to live at paxdev.vercel.app. Links to that address are already out in the
 * world, so it keeps answering — but it answers with a permanent redirect to the current
 * address rather than serving a second copy of the same pages under a second name.
 *
 * This lives in the config, not in the hosting dashboard, for one reason: a redirect
 * configured by clicking is a redirect nobody can review, test, or find again. Here it is a
 * line in a file, it moves with the repository, and `has: host` makes the rule state exactly
 * which name it applies to instead of relying on a project setting to be right.
 */
const OLD_HOST = "paxdev.vercel.app";
const NEW_ORIGIN = "https://pablofigueroa99dev.vercel.app";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: OLD_HOST }],
        destination: `${NEW_ORIGIN}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
