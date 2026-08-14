import Image from "next/image";

import {
  ArrowUpRightIcon,
  CheckIcon,
  CodeIcon,
  GithubIcon,
  GlobeIcon,
  ShieldIcon,
  TerminalIcon,
} from "@/components/icons";
import { SystemMap } from "@/components/system-map";
import portfolio from "@/content/portfolio";

const { site, proof, aiSystems, selectedWork, capabilities, principles } = portfolio;
const flagship = aiSystems[0];

function Status({ tone, children }: { tone: string; children: React.ReactNode }) {
  return (
    <span className={`status status-${tone}`}>
      <i aria-hidden="true" />
      {children}
    </span>
  );
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
      <ArrowUpRightIcon />
    </a>
  );
}

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

      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top">
            <span className="brand-mark">P/A</span>
            <span className="brand-copy">
              <strong>PAX / DEV</strong>
              <small>AI SYSTEMS</small>
            </span>
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#systems">Systems</a>
            <a href="#work">Selected work</a>
            <a href="#capabilities">Capabilities</a>
            <a href="#principles">Principles</a>
          </nav>

          <a
            className="github-link"
            href={site.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub portfolio"
          >
            <GithubIcon />
            <span>GitHub</span>
            <ArrowUpRightIcon />
          </a>
        </div>
      </header>

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
                I build retrieval, agents, and product infrastructure with the parts most demos
                omit: budgets, citations, failure states, evaluation, and a path anyone can run.
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
                    <li key={item}>
                      <CheckIcon />
                      <span>{item}</span>
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

            <div className="roadmap-heading">
              <div>
                <p className="section-kicker">THE FIVE-SYSTEM LADDER</p>
                <h3>Each project adds one layer of operational maturity.</h3>
              </div>
              <p>LIVE and IN PROGRESS are linked to code. PLANNED means exactly that.</p>
            </div>

            <div className="systems-grid">
              {aiSystems.map((system) => (
                <article className={`system-card system-card-${system.statusTone}`} id={system.slug} key={system.slug}>
                  <div className="system-card-top">
                    <span className="system-number">{system.number}</span>
                    <Status tone={system.statusTone}>{system.status}</Status>
                  </div>
                  <p className="system-outcome">{system.outcome}</p>
                  <h4>{system.name}</h4>
                  <p>{system.summary}</p>
                  <div className="compact-tags">
                    {system.stack.slice(0, 4).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <div className="card-footer">
                    <span>{system.phase}</span>
                    {system.links[0] ? (
                      <ExternalLink href={system.links[0].url}>Inspect</ExternalLink>
                    ) : (
                      <span className="no-link">No repository yet</span>
                    )}
                  </div>
                </article>
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

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <a className="brand footer-brand" href="#top">
              <span className="brand-mark">P/A</span>
              <span className="brand-copy">
                <strong>PAX / DEV</strong>
                <small>AI SYSTEMS</small>
              </span>
            </a>
            <p>Independent engineering portfolio operated by {site.owner}.</p>
          </div>
          <div className="footer-meta">
            <span>Verified {site.lastVerified}</span>
            <span>No login · No tracking · No credential forms</span>
            <a href={site.githubUrl} target="_blank" rel="noreferrer">
              github.com/pabloalvarez99
              <ArrowUpRightIcon />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
