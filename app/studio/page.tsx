import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ArrowUpRightIcon, GithubIcon, ShieldIcon, TerminalIcon } from "@/components/icons";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ExternalLink, Status } from "@/components/ui";
import portfolio, { hostedSystems, verifiedUrls } from "@/content/portfolio";

const { site, studio, aiSystems } = portfolio;

export const metadata: Metadata = {
  title: `Demo studio — ${site.name}`,
  description:
    "The four hosted systems with three-step scripts, committed captures, deep links, and curl commands that were requested before they were published.",
  alternates: { canonical: `${site.canonicalUrl}/studio` },
};

const observed = new Map(verifiedUrls.checks.map((check) => [check.url, check.observed]));
const reachable = new Set(hostedSystems().map((system) => system.slug));

function systemFor(slug: string) {
  const system = aiSystems.find((candidate) => candidate.slug === slug);
  if (!system) {
    throw new Error(`studio references an unknown system: ${slug}`);
  }
  return system;
}

function primaryDeepLink(embed: (typeof studio.embeds)[number]) {
  return embed.deepLinks[0]?.url ?? embed.embedUrl;
}

// A slug that loses its verified 200 must break the build, not quietly keep an embed alive.
for (const embed of studio.embeds) {
  if (!reachable.has(embed.slug)) {
    throw new Error(`studio embeds ${embed.slug}, which has no verified hosted URL`);
  }
}

export default function StudioPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <SiteHeader />

      <main id="main-content" className="studio-page">
        <section className="section studio-hero">
          <div className="container">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Portfolio</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Demo studio</span>
            </nav>

            <p className="section-kicker">USE THE SYSTEMS, DO NOT TAKE MY WORD</p>
            <h1>Four running systems, one page, no signup.</h1>
            <p className="system-pitch">{studio.intro}</p>

            <div className="hero-note">
              <ShieldIcon />
              <span>
                Every URL on this page was requested on {site.lastVerified} and returned the status
                printed beside it. The list lives in{" "}
                <ExternalLink href="https://github.com/pabloalvarez99/paxdev/blob/main/content/verified-urls.json">
                  content/verified-urls.json
                </ExternalLink>{" "}
                and a test fails if this page claims a host that file never reached. A third-party
                iframe may be blocked; the deep link is the primary CTA on every card.
              </span>
            </div>
          </div>
        </section>

        {studio.embeds.map((embed) => {
          const system = systemFor(embed.slug);
          const deepLink = primaryDeepLink(embed);
          const capture =
            system.capture.src === embed.captureSrc
              ? system.capture
              : system.secondaryCapture?.src === embed.captureSrc
                ? system.secondaryCapture
                : system.capture;
          return (
            <section className="section studio-embed" id={embed.slug} key={embed.slug}>
              <div className="container">
                <div className="studio-heading">
                  <div>
                    <p className="section-kicker">
                      {system.number} · {system.name}
                    </p>
                    <h2>{system.outcome}</h2>
                    <p>{embed.howTo}</p>
                  </div>
                  <div className="studio-heading-side">
                    <Status tone="live">HOSTED</Status>
                    <ExternalLink href={deepLink}>Open deep link (primary CTA)</ExternalLink>
                    <Link className="button button-secondary button-small" href={system.route}>
                      Study this system
                      <ArrowUpRightIcon />
                    </Link>
                    <ExternalLink href={embed.embedUrl}>Open host root</ExternalLink>
                  </div>
                </div>

                <ol className="studio-script" aria-label={`Three-step script for ${system.name}`}>
                  {embed.script.map((step, index) => (
                    <li key={`${embed.slug}-step-${index}`}>
                      <span className="studio-script-n">{String(index + 1).padStart(2, "0")}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="studio-iframe-honesty">{embed.iframeHonesty}</p>

                <figure className="studio-capture product-frame">
                  <div className="product-frame-bar">
                    <div className="window-dots" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </div>
                    <span className="mono">capture · {system.phase}</span>
                    <span className="frame-secure">COMMITTED</span>
                  </div>
                  <div className="product-screen">
                    <Image
                      alt={capture.alt}
                      height={capture.height}
                      src={embed.captureSrc}
                      width={capture.width}
                    />
                  </div>
                  <figcaption>
                    {capture.caption}{" "}
                    <ExternalLink href={capture.sourceUrl}>Source on GitHub</ExternalLink>
                  </figcaption>
                </figure>

                <div className="studio-frame">
                  <div className="product-frame-bar">
                    <div className="window-dots" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </div>
                    <span className="mono">{embed.embedUrl.replace("https://", "")}</span>
                    <span className="frame-secure">LIVE · 200</span>
                  </div>
                  <iframe
                    className="studio-iframe"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
                    src={embed.embedUrl}
                    title={embed.embedTitle}
                  />
                </div>

                <div className="studio-detail">
                  <div>
                    <h3>Requests that were actually made</h3>
                    <ul className="probe-list">
                      {embed.deepLinks.map((link) => (
                        <li key={link.url}>
                          <span className={`probe-code probe-${link.expect}`}>
                            {observed.get(link.url) ?? link.expect}
                          </span>
                          <ExternalLink href={link.url}>{link.label}</ExternalLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3>
                      <TerminalIcon />
                      From a terminal
                    </h3>
                    <pre>
                      <code>{embed.curl}</code>
                    </pre>
                    <p className="studio-boundary">{embed.boundary}</p>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        <section className="section studio-clone">
          <div className="container">
            <div className="roadmap-heading">
              <div>
                <p className="section-kicker">NOT HOSTED, AND NOT PRETENDING TO BE</p>
                <h3>One system still clones. It does not get a fake link.</h3>
              </div>
              <p>
                Candidate hostnames for Production RAG were requested on {site.lastVerified} and
                returned 404. They are recorded as absent so a future refresh has to observe a 200
                before this card can become an embed. production-rag.vercel.app is another product
                and is never cited.
              </p>
            </div>

            <div className="clone-grid">
              {studio.cloneCards.map((card) => {
                const system = systemFor(card.slug);
                return (
                  <article className="clone-card" key={card.slug}>
                    <div className="system-card-top">
                      <span className="system-number">{system.number}</span>
                      <Status tone="planned">CLONE ONLY</Status>
                    </div>
                    <h4>{system.name}</h4>
                    <p>{card.why}</p>
                    <pre>
                      <code>{card.command}</code>
                    </pre>
                    <p className="clone-absent mono">
                      {card.absentUrl.replace("https://", "")} → 404
                    </p>
                    <div className="text-links">
                      <Link href={system.route}>Study this system</Link>
                      <ExternalLink href={system.links[0].url}>
                        <GithubIcon />
                        Repository
                      </ExternalLink>
                      {"demoDayUrl" in card && card.demoDayUrl ? (
                        <ExternalLink href={card.demoDayUrl as string}>
                          DEMO-DAY (stream · Filtering · /evals)
                        </ExternalLink>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container cta-card">
            <p className="section-kicker">NEXT</p>
            <h2>Clicking is the first pass. Reading is the second.</h2>
            <p>
              Each system has a page that states what it does not do, pins its captures to a
              commit, and publishes the three questions I would want to be asked about it.
            </p>
            <Link className="button button-light" href={aiSystems[0].route}>
              Study the flagship
              <ArrowUpRightIcon />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

