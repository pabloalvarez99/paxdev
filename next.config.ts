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

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
