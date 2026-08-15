import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ExternalLink, Status } from "@/components/ui";
import portfolio, { cloneOnlySystems, hostedSystems } from "@/content/portfolio";

const { site, aiSystems, selectedWork, principles, capabilities } = portfolio;

function hostLabel(url: string) {
  return url.replace(/^https:\/\//, "").replace(/\/$/, "");
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

  const hosted = hostedSystems();
  const cloneOnly = cloneOnlySystems();

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
          <div className="container">
            <h1>AI systems that show their work.</h1>
            <p className="hero-lede measure">
              Five public AI systems. Four hosted. One clone-only. Every claim has a
              repository, a test, or a running host.
            </p>
            <p className="text-links">
              <a href="#systems">Systems</a>
              <a href={site.githubUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </p>
            <p className="hero-note">No login. No data collection. Public evidence only.</p>
          </div>
        </section>

        <section className="section" id="open">
          <div className="container">
            <h2>Open now</h2>
            <ul className="open-list">
              {hosted.map((system) => (
                <li key={system.slug}>
                  <h3>
                    {system.number} {system.name}
                  </h3>
                  <p className="item-meta">
                    <Status tone={system.statusTone}>{system.status}</Status>
                    {" · hosted · "}
                    <span className="mono">{hostLabel(system.hosted!.url)}</span>
                    {" · "}
                    {system.phase}
                  </p>
                  <p>{system.hosted!.note}</p>
                  <p className="text-links">
                    <ExternalLink href={system.hosted!.url}>{system.hosted!.label}</ExternalLink>
                    <Link href={system.route}>Study</Link>
                  </p>
                </li>
              ))}
              {cloneOnly.map((system) => (
                <li key={system.slug}>
                  <h3>
                    {system.number} {system.name}
                  </h3>
                  <p className="item-meta">
                    <Status tone="planned">CLONE ONLY</Status>
                    {" · not hosted · "}
                    {system.phase}
                  </p>
                  <p>
                    Hybrid retrieval needs local Qdrant. Clone the repository. Never treat
                    another product&apos;s host as this flagship.
                  </p>
                  <p className="text-links">
                    <ExternalLink href={system.links[0].url}>Repository</ExternalLink>
                    <Link href={system.route}>Study</Link>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section" id="systems">
          <div className="container">
            <h2>Systems</h2>
            <ol className="systems-list">
              {aiSystems.map((system) => (
                <li id={system.slug} key={system.slug}>
                  <h3>
                    <Link href={system.route}>
                      {system.number} {system.name}
                    </Link>
                  </h3>
                  <p className="item-meta">
                    <Status tone={system.statusTone}>{system.status}</Status>
                    {" · "}
                    {system.hosted ? "hosted" : "clone only"}
                    {" · "}
                    {system.phase}
                  </p>
                  <p>{system.summary}</p>
                  <p className="text-links">
                    <Link href={system.route}>Study</Link>
                    {system.links.slice(0, 2).map((link) => (
                      <ExternalLink href={link.url} key={link.label}>
                        {link.label}
                      </ExternalLink>
                    ))}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section" id="honesty">
          <div className="container measure">
            <h2>Honesty</h2>
            <ul className="honesty-list">
              <li>
                <p>
                  P1 Production RAG is clone-only. It is not hosted. Hybrid retrieval needs
                  local Qdrant.
                </p>
              </li>
              <li>
                <p>
                  P5 AI Platform does not run P1–P4. Status shows four unconfigured
                  upstreams.
                </p>
              </li>
              <li>
                <p>
                  production-rag.vercel.app is Ipsura, another product. It is never this
                  flagship and is never linked as P1.
                </p>
              </li>
            </ul>
          </div>
        </section>

        <section className="section" id="work">
          <div className="container">
            <h2>Selected work</h2>
            <ul className="work-list">
              {selectedWork.map((project) => (
                <li key={project.name}>
                  <h3>{project.name}</h3>
                  <p className="item-meta">
                    <Status tone={project.statusTone}>{project.status}</Status>
                    {" · "}
                    {project.category}
                  </p>
                  <p>{project.summary}</p>
                  <p className="work-note">{project.note}</p>
                  <p className="text-links">
                    <ExternalLink href={project.repo}>Repository</ExternalLink>
                    {project.demo ? <ExternalLink href={project.demo}>Live surface</ExternalLink> : null}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section" id="principles">
          <div className="container measure">
            <h2>Principles</h2>
            <ul className="principles-plain">
              {principles.map((principle) => (
                <li key={principle.number}>
                  <p>
                    <strong>{principle.title}.</strong> {principle.copy}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter home />
    </>
  );
}
