import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRightIcon,
  CheckIcon,
  CodeIcon,
  GithubIcon,
  GlobeIcon,
  ShieldIcon,
  TerminalIcon,
} from "@/components/icons";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { SystemMap } from "@/components/system-map";
import { ExternalLink, Status } from "@/components/ui";
import portfolio from "@/content/portfolio";

const { site, proof, aiSystems, selectedWork, capabilities, principles } = portfolio;
const flagship = aiSystems[0];

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${site.canonicalUrl}/#person`,
        name: site.owner,
        url: site.canonicalUrl,
        jobTitle: site.role,
        homeLocation: { "@type": "Country", name: site.location },
        sameAs: [site.githubUrl],
        knowsAbout: capabilities.flatMap((capability) => capability.skills),
      },
      {
        "@type": "WebSite",
        "@id": `${site.canonicalUrl}/#website`,
        name: site.name,
        url: site.canonicalUrl,
        creator: { "@id": `${site.canonicalUrl}/#person` },
      },
      {
        "@type": "ItemList",
        name: "AI Engineering Systems",
        itemListElement: aiSystems.map((system, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: system.name,
          description: system.summary,
          url: system.links[0]?.url ?? `${site.canonicalUrl}/#${system.slug}`,
        })),
      },
    ],
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <SiteHeader home />

      <main id="main-content">
        <section className="hero" id="top">
          <div className="hero-grid-overlay" aria-hidden="true" />
          <div className="container hero-layout">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="eyebrow-index">01</span>
                {site.owner} · {site.location}
              </div>

              <h1>
                AI systems that
                <span>show their work.</span>
              </h1>

              <p className="hero-lede">
                Production-shaped LLM systems: hybrid retrieval, grounded generation, bounded
                agents, multi-agent control, and the evaluation and ops seams most demos skip —
                plus the product surfaces they ship on. Every public AI repo runs without a key.
              </p>

              <div className="hero-actions">
                <a className="button button-primary" href="#systems">
                  Explore the systems
                  <ArrowUpRightIcon />
                </a>
                <a
                  className="button button-secondary"
                  href="https://github.com/pabloalvarez99/production-rag"
                  target="_blank"
                  rel="noreferrer"
                >
                  <GithubIcon />
                  View the flagship
                </a>
              </div>

              <div className="hero-note">
                <ShieldIcon />
                <span>No login. No data collection. Public evidence behind every claim.</span>
              </div>
            </div>

            <SystemMap systems={aiSystems} />
          </div>
        </section>

        <section className="proof-strip" aria-label="Portfolio evidence summary">
          <div className="container proof-grid">
            {proof.map((item) => (
              <article className="proof-item" key={item.label}>
                <strong>{item.value}</strong>
                <div>
                  <span>{item.label}</span>
                  <small>{item.detail}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section flagship-section" id="systems">
          <div className="container">
            <div className="section-heading split-heading">
              <div>
                <p className="section-kicker">01 / FLAGSHIP SYSTEM</p>
                <h2>Retrieval built for the moment confidence runs out.</h2>
              </div>
              <p>
                The portfolio starts with one hard contract: answers carry evidence, or the
                system declines to invent it.
              </p>
            </div>

            <div className="flagship-grid">
              <article className="flagship-copy">
                <div className="project-title-row">
                  <div>
                    <Status tone={flagship.statusTone}>{flagship.status}</Status>
                    <h3>{flagship.name}</h3>
                    <p className="project-phase">{flagship.phase}</p>
                  </div>
                  <span className="project-number">{flagship.number}</span>
                </div>

                <p className="flagship-summary">{flagship.summary}</p>

                <ol className="pipeline" aria-label="Production RAG pipeline">
                  <li>Retrieve</li>
                  <li>Fuse</li>
                  <li>Rerank</li>
                  <li>Ground</li>
                  <li>Evaluate</li>
                </ol>

                <ul className="evidence-list">
                  {flagship.evidence.map((item) => (
                    <li key={item.label}>
                      <CheckIcon />
                      <ExternalLink href={item.url}>{item.label}</ExternalLink>
                    </li>
                  ))}
                </ul>

                <div className="tag-list" aria-label="Production RAG technologies">
                  {flagship.stack.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>

                <div className="text-links">
                  {flagship.links.map((link) => (
                    <ExternalLink href={link.url} key={link.label}>
                      {link.label}
                    </ExternalLink>
                  ))}
                </div>
              </article>

              <figure className="product-frame">
                <div className="product-frame-bar">
                  <div className="window-dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </div>
                  <span>production-rag / free path</span>
                  <span className="frame-secure">LOCAL · $0</span>
                </div>
                <div className="product-screen">
                  <Image
                    alt="Production RAG interface showing a grounded answer with citations and pipeline timings"
                    height={1962}
                    priority
                    sizes="(max-width: 900px) 100vw, 50vw"
                    src="/production-rag-grounded.png"
                    width={1440}
                  />
                </div>
                <figcaption>
                  Generated from the running free stack—not a hand-built mockup.
                </figcaption>
              </figure>
            </div>

            {flagship.secondaryCapture ? (
              <div className="flagship-detail">
                <div className="flagship-detail-copy">
                  <p className="section-kicker">THE CONTROL THAT CANNOT OVER-PROMISE</p>
                  <h3>A filter the API would refuse is a filter the UI never offers.</h3>
                  <p>
                    The metadata filter reads its field list from the running deployment&apos;s
                    allowlist, so the control cannot propose a narrowing the API would reject. A
                    field posted by hand anyway gets the same typed 422 the API answers with, and
                    the result footer names the narrowing that produced the citations.
                  </p>
                  <div className="text-links">
                    <ExternalLink href="https://github.com/pabloalvarez99/production-rag/blob/main/docs/adr/0011-metadata-filters.md">
                      ADR 0011 — allowlist-only, fail closed
                    </ExternalLink>
                    <ExternalLink href="https://github.com/pabloalvarez99/production-rag/blob/1cd8e4b/docs/demo.md">
                      Walk the filter in the demo script
                    </ExternalLink>
                  </div>
                </div>

                <figure className="product-frame">
                  <div className="product-frame-bar">
                    <div className="window-dots" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </div>
                    <span>production-rag / metadata filter</span>
                    <span className="frame-secure">tags = hybrid</span>
                  </div>
                  <div className="product-screen">
                    <Image
                      alt={flagship.secondaryCapture.alt}
                      height={flagship.secondaryCapture.height}
                      loading="lazy"
                      sizes="(max-width: 900px) 100vw, 50vw"
                      src={flagship.secondaryCapture.src}
                      width={flagship.secondaryCapture.width}
                    />
                  </div>
                  <figcaption>
                    {flagship.secondaryCapture.caption}{" "}
                    <ExternalLink href={flagship.secondaryCapture.sourceUrl}>
                      Source file
                    </ExternalLink>
                  </figcaption>
                </figure>
              </div>
            ) : null}

            <div className="roadmap-heading">
              <div>
                <p className="section-kicker">THE FIVE-SYSTEM LADDER</p>
                <h3>Each project adds one layer of operational maturity.</h3>
              </div>
              <p>
                LIVE is linked to runnable evidence. PLANNED means exactly that. Each card opens a
                page that states what the system does not do before it asks you to be impressed.
              </p>
            </div>

            <div className="systems-grid">
              {aiSystems.map((system) => (
                <article className={`system-card system-card-${system.statusTone}`} id={system.slug} key={system.slug}>
                  <div className="system-card-top">
                    <span className="system-number">{system.number}</span>
                    <Status tone={system.statusTone}>{system.status}</Status>
                  </div>
                  <p className="system-outcome">{system.outcome}</p>
                  <h4>
                    <Link href={system.route}>{system.name}</Link>
                  </h4>
                  <p>{system.summary}</p>
                  <div className="compact-tags">
                    {system.stack.slice(0, 4).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  {system.hosted ? (
                    <div className="system-hosted">
                      <ExternalLink href={system.hosted.url}>{system.hosted.label}</ExternalLink>
                      <p>{system.hosted.note}</p>
                    </div>
                  ) : null}
                  {system.evidence.length > 0 ? (
                    <ul className="system-evidence" aria-label={`${system.name} evidence`}>
                      {system.evidence.map((item) => (
                        <li key={item.label}>
                          <ExternalLink href={item.url}>{item.label}</ExternalLink>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="system-study">
                    <Link className="button button-secondary button-small" href={system.route}>
                      Study {system.name}
                      <ArrowUpRightIcon />
                    </Link>
                  </div>
                  <div className="card-footer">
                    <span>{system.phase}</span>
                    {system.links.length > 0 ? (
                      <span className="card-links">
                        {system.links.map((link) => (
                          <ExternalLink href={link.url} key={link.label}>
                            {link.label}
                          </ExternalLink>
                        ))}
                      </span>
                    ) : (
                      <span className="no-link">No repository yet</span>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="roadmap-heading" id="gallery">
              <div>
                <p className="section-kicker">SEE IT WITHOUT CLONING</p>
                <h3>Five systems, five captures, all committed to their repositories.</h3>
              </div>
              <p>
                Each image is the official capture stored in that repository at the verified
                commit. Follow the caption link to see the same file on GitHub, or open the{" "}
                <Link href="/studio">demo studio</Link> to use the four that are hosted, or the{" "}
                <Link href="/interview">interview kit</Link> for the 45-minute script.
              </p>
            </div>

            <div className="gallery-grid">
              {aiSystems.map((system) => (
                <figure className="product-frame gallery-frame" key={`capture-${system.slug}`}>
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
                      alt={system.capture.alt}
                      height={system.capture.height}
                      loading="lazy"
                      sizes="(max-width: 900px) 100vw, 33vw"
                      src={system.capture.src}
                      width={system.capture.width}
                    />
                  </div>
                  <figcaption>
                    {system.capture.caption}{" "}
                    <ExternalLink href={system.capture.sourceUrl}>Source file</ExternalLink>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="section work-section" id="work">
          <div className="container">
            <div className="section-heading split-heading">
              <div>
                <p className="section-kicker">02 / SELECTED PRODUCT WORK</p>
                <h2>Beyond AI demos: software with users, constraints, and edges.</h2>
              </div>
              <p>
                Public repositories across commerce, healthcare, geospatial tooling, and
                offline-first business operations.
              </p>
            </div>

            <div className="work-grid">
              {selectedWork.map((project, index) => (
                <article className="work-card" key={project.name}>
                  <div className="work-card-index">0{index + 1}</div>
                  <div className="work-card-header">
                    <Status tone={project.statusTone}>{project.status}</Status>
                    <span>{project.category}</span>
                  </div>
                  <h3>{project.name}</h3>
                  <p>{project.summary}</p>
                  <div className="tag-list work-tags">
                    {project.stack.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <p className="work-note">{project.note}</p>
                  <div className="text-links work-links">
                    <ExternalLink href={project.repo}>Repository</ExternalLink>
                    {project.demo ? <ExternalLink href={project.demo}>Live surface</ExternalLink> : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section capabilities-section" id="capabilities">
          <div className="container">
            <div className="section-heading capabilities-heading">
              <p className="section-kicker">03 / CAPABILITY MAP</p>
              <h2>Knowledge is useful when it connects across the system.</h2>
              <p>
                The map below is derived from public code—not a keyword inventory copied from a
                job description.
              </p>
            </div>

            <div className="capability-list">
              {capabilities.map((capability, index) => {
                const icons = [TerminalIcon, CodeIcon, GlobeIcon, ShieldIcon];
                const Icon = icons[index];
                return (
                  <article className="capability-row" key={capability.title}>
                    <div className="capability-index">
                      <Icon />
                      <span>{capability.index}</span>
                    </div>
                    <div className="capability-intro">
                      <h3>{capability.title}</h3>
                      <p>{capability.description}</p>
                    </div>
                    <div className="capability-skills">
                      {capability.skills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>
                    <ExternalLink href={capability.evidenceUrl}>Evidence</ExternalLink>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section principles-section" id="principles">
          <div className="container principles-layout">
            <div className="principles-sticky">
              <p className="section-kicker">04 / ENGINEERING PRINCIPLES</p>
              <h2>The standard behind the stack.</h2>
              <p>
                Frameworks rotate. These constraints keep the work reviewable when they do.
              </p>
            </div>

            <div className="principles-list">
              {principles.map((principle) => (
                <article key={principle.number}>
                  <span>{principle.number}</span>
                  <div>
                    <h3>{principle.title}</h3>
                    <p>{principle.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container cta-card">
            <div className="cta-signal" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p className="section-kicker">OPEN TO THE RIGHT PROBLEM</p>
            <h2>AI engineering, applied systems, and platform work.</h2>
            <p>
              If the role values measurable behavior, explicit failure modes, and software that
              can be inspected end to end, the repositories are the conversation starter.
            </p>
            <a className="button button-light" href={site.githubUrl} target="_blank" rel="noreferrer">
              <GithubIcon />
              Review the GitHub portfolio
              <ArrowUpRightIcon />
            </a>
          </div>
        </section>
      </main>

      <SiteFooter home />
    </>
  );
}
