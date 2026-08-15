import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { SystemHeroI18n } from "@/components/system-hero-i18n";
import { ExternalLink } from "@/components/ui";
import portfolio, { systemBySegment, systemSegment } from "@/content/portfolio";

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
  const capture = system.capture;
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
        <SystemHeroI18n
          slug={system.slug}
          title={page.title}
          route={system.route}
          status={system.status}
          statusTone={system.statusTone}
          phase={system.phase}
          lastVerified={site.lastVerified}
          en={{ headline: page.headline, pitch: page.pitch, kicker: page.kicker }}
          cta={page.cta}
          repoUrl={system.links[0].url}
          live={page.live}
          planned={page.planned}
        />

        <section className="section system-captures">
          <div className="container">
            <h2>Capture</h2>
            <p className="item-meta">
              One image from the repository at the commit named in the caption.
            </p>
            <figure className="plain-capture">
              <Image
                alt={capture.alt}
                height={capture.height}
                loading="lazy"
                sizes="(max-width: 900px) 100vw, 28rem"
                src={capture.src}
                width={capture.width}
              />
              <figcaption>
                {capture.caption} <ExternalLink href={capture.sourceUrl}>Source file</ExternalLink>
              </figcaption>
            </figure>
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
