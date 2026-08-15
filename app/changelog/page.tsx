import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ExternalLink, Status } from "@/components/ui";
import portfolio from "@/content/portfolio";
import pins from "@/content/pins.json";
import releases from "@/content/releases.json";

const { site } = portfolio;

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Vendored GitHub release notes for the five AI systems on the ladder. Stale tags fail CI against content/pins.json.",
  alternates: { canonical: `${site.canonicalUrl}/changelog` },
};

export default function ChangelogPage() {
  const pinBySlug = new Map(pins.systems.map((s) => [s.slug, s]));

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className="changelog-page">
        <section className="section">
          <div className="container narrow">
            <h1>What each system last shipped</h1>
            <p className="lede">
              Notes below are vendored from GitHub Releases into{" "}
              <code className="mono">content/releases.json</code> (fetched{" "}
              {releases.fetchedAt}). Each tag must match{" "}
              <code className="mono">content/pins.json</code>. A stale fixture fails the unit
              test — not a human re-reading the page.
            </p>
            <p className="meta mono">
              Site pins verified {site.lastVerified} · pin table {pins.pinnedAt}
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container changelog-list">
            {releases.releases.map((rel) => {
              const pin = pinBySlug.get(rel.slug);
              return (
                <article className="changelog-card" key={rel.slug} id={rel.slug}>
                  <div className="changelog-card-head">
                    <div>
                      <p className="section-kicker">
                        {rel.id} · {rel.repo}
                      </p>
                      <h2>
                        {rel.name || rel.tag}{" "}
                        <Status tone="live">{rel.tag}</Status>
                      </h2>
                      <p className="meta mono">
                        published {rel.publishedAt?.slice(0, 10) ?? "—"}
                        {pin ? ` · pin main ${pin.main} · ${pin.mode}` : ""}
                      </p>
                    </div>
                    <ExternalLink href={rel.htmlUrl}>GitHub release</ExternalLink>
                  </div>
                  <pre className="changelog-body">{rel.body || "(empty release body)"}</pre>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section">
          <div className="container narrow">
            <p>
              <Link href="/">← Portfolio</Link>
              {" · "}
              <Link href="/interview">Interview kit</Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
