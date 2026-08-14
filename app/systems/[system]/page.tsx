import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowUpRightIcon, CheckIcon, GithubIcon, ShieldIcon } from "@/components/icons";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ExternalLink, Status } from "@/components/ui";
import portfolio, { systemBySegment, systemCaptures, systemSegment } from "@/content/portfolio";

const { site, aiSystems } = portfolio;

type Params = { system: string };

export function generateStaticParams(): Params[] {
  return aiSystems.map((system) => ({ system: systemSegment(system) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const system = systemBySegment((await params).system);
  if (!system) {
    return {};
  }
  return {
    title: `${system.page.title} — ${site.name}`,
    description: system.summary,
    alternates: { canonical: `${site.canonicalUrl}${system.route}` },
  };
}

export default async function SystemPage({ params }: { params: Promise<Params> }) {
  const system = systemBySegment((await params).system);
  if (!system) {
    notFound();
  }

  const { page } = system;
  const captures = systemCaptures(system);
  const index = aiSystems.indexOf(system);
  const previous = aiSystems[index - 1];
  const next = aiSystems[index + 1];

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <SiteHeader />

      <main id="main-content" className="system-page">
        <section className="section system-hero">
          <div className="container">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Portfolio</Link>
              <span aria-hidden="true">/</span>
              <Link href="/#systems">Systems</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{page.title}</span>
            </nav>

            <p className="section-kicker">{page.kicker}</p>
            <h1>{page.headline}</h1>

            <div className="system-hero-meta">
              <Status tone={system.statusTone}>{system.status}</Status>
              <span className="mono">{system.phase}</span>
              <span className="mono">Verified {site.lastVerified}</span>
            </div>

            <p className="system-pitch">{page.pitch}</p>

            <div className="hero-actions">
              <a
                className="button button-primary"
                href={page.cta.url}
                target="_blank"
                rel="noreferrer"
              >
                {page.cta.label}
                <ArrowUpRightIcon />
              </a>
              <a
                className="button button-secondary"
                href={system.links[0].url}
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon />
                Read the source
              </a>
            </div>

            <div className="cta-strip">
              <p className="cta-strip-kind">
                {page.cta.kind === "hosted" ? "HOSTED · no clone, no key" : "CLONE · runs at $0"}
              </p>
              <pre>
                <code>{page.cta.command}</code>
              </pre>
              <p>{page.cta.note}</p>
            </div>
          </div>
        </section>

        <section className="section system-contract">
          <div className="container contract-grid">
            <article className="contract-column contract-live">
              <h2>
                <CheckIcon />
                LIVE
              </h2>
              <p className="contract-lede">
                Every line here is backed by a test, a route, or a file in the repository at{" "}
                <span className="mono">{system.phase}</span>.
              </p>
              <ul>
                {page.live.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="contract-column contract-planned">
              <h2>
                <ShieldIcon />
                NOT SHIPPED
              </h2>
              <p className="contract-lede">
                The boundary, stated before you find it yourself. Nothing below is presented as
                built, hidden in a footnote, or described as coming soon.
              </p>
              <ul>
                {page.planned.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="section system-captures">
          <div className="container">
            <div className="roadmap-heading">
              <div>
                <p className="section-kicker">OFFICIAL CAPTURES</p>
                <h3>Pinned to the commit, not to a branch that can move under them.</h3>
              </div>
              <p>
                Each image is vendored from the source repository at the exact commit named in its
                caption link, and the bytes were compared against the GitHub blob before publishing.
              </p>
            </div>

            <div className="capture-pair">
              {captures.map((capture) => (
                <figure className="product-frame" key={capture.src}>
                  <div className="product-frame-bar">
                    <div className="window-dots" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </div>
                    <span>{system.slug}</span>
                    <span className="frame-secure">{system.status}</span>
                  </div>
                  <div className="product-screen">
                    <Image
                      alt={capture.alt}
                      height={capture.height}
                      loading="lazy"
                      sizes="(max-width: 900px) 100vw, 50vw"
                      src={capture.src}
                      width={capture.width}
                    />
                  </div>
                  <figcaption>
                    {capture.caption} <ExternalLink href={capture.sourceUrl}>Source file</ExternalLink>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="section system-interview">
          <div className="container">
            <div className="roadmap-heading">
              <div>
                <p className="section-kicker">INTERVIEW THIS SYSTEM</p>
                <h3>Three questions worth asking, and the answers I would give.</h3>
              </div>
              <p>
                Published in advance, because a trade-off I can only defend when nobody has read it
                first is not a trade-off I understand.
              </p>
            </div>

            <ol className="interview-list">
              {page.interview.map((item, position) => (
                <li key={item.question}>
                  <span className="interview-index">{String(position + 1).padStart(2, "0")}</span>
                  <div>
                    <h4>{item.question}</h4>
                    <p>{item.why}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section system-reading">
          <div className="container">
            <div className="roadmap-heading">
              <div>
                <p className="section-kicker">READ THE PRIMARY SOURCES</p>
                <h3>Everything above is a summary of a file you can open.</h3>
              </div>
              <p>
                The case study explains why the system is shaped this way; SHIP is the LIVE and
                not-shipped contract this page is derived from.
              </p>
            </div>

            <ul className="reading-list">
              {page.docs.map((doc) => (
                <li key={doc.url}>
                  <ExternalLink href={doc.url}>{doc.label}</ExternalLink>
                </li>
              ))}
              {system.evidence.map((item) => (
                <li key={item.url}>
                  <ExternalLink href={item.url}>{item.label}</ExternalLink>
                </li>
              ))}
            </ul>

            <nav className="system-pager" aria-label="Other systems">
              {previous ? (
                <Link href={previous.route}>
                  <small>Previous</small>
                  {previous.name}
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link className="system-pager-next" href={next.route}>
                  <small>Next</small>
                  {next.name}
                </Link>
              ) : (
                <span />
              )}
            </nav>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
