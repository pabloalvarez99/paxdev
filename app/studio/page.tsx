import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ExternalLink, Status } from "@/components/ui";
import portfolio, { hostedSystems, verifiedUrls } from "@/content/portfolio";

const { site, studio, aiSystems } = portfolio;

export const metadata: Metadata = {
  title: `Estudio — ${site.name}`,
  description:
    "Los cuatro sistemas publicados, con enlaces, guiones y comandos curl. Production RAG sigue siendo solo para clonar.",
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
        Ir al contenido
      </a>

      <SiteHeader />

      <main id="main-content" className="studio-page">
        <section className="section studio-hero">
          <div className="container">
            <nav className="crumbs" aria-label="Ruta de navegación">
              <Link href="/">Inicio</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Estudio</span>
            </nav>

            <h1>Cuatro sistemas publicados. Uno para clonar.</h1>
            <p className="system-pitch">{studio.intro}</p>
            <p className="hero-note">
              Cada dirección de esta página se pidió el {site.lastVerified} y devolvió el código
              que aparece al lado. La lista completa está en{" "}
              <ExternalLink href="https://github.com/pabloalvarez99/paxdev/blob/main/content/verified-urls.json">
                content/verified-urls.json
              </ExternalLink>
              . Tres de los cuatro servidores permiten mostrarse dentro de esta página y están
              incrustados abajo; el de AI Platform envía <code>X-Frame-Options: DENY</code>, así
              que no. En todos los casos, el enlace directo es la vía principal.
            </p>
          </div>
        </section>

        {studio.embeds.map((embed) => {
          const system = systemFor(embed.slug);
          const deepLink = primaryDeepLink(embed);
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
                    <ExternalLink href={deepLink}>Abrir enlace directo</ExternalLink>
                    <Link href={system.route}>Ver este sistema</Link>
                    <ExternalLink href={embed.embedUrl}>Abrir el servidor</ExternalLink>
                  </div>
                </div>

                <ol className="studio-script" aria-label={`Guion de tres pasos para ${system.name}`}>
                  {embed.script.map((step, index) => (
                    <li key={`${embed.slug}-step-${index}`}>
                      <span className="studio-script-n">{String(index + 1).padStart(2, "0")}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="studio-iframe-honesty">{embed.iframeHonesty}</p>

                {/*
                  A frame the host refuses is not a frame that might work: the gateway sends
                  X-Frame-Options: DENY, so every reader gets the same empty rectangle and a
                  console error, forever. Rendering it anyway and calling that "may be blocked
                  on mobile" would be the exact species of overclaim this site is built against.
                  So it is not rendered, and the sentence above says which header and why.
                */}
                {embed.framable ? (
                  <iframe
                    className="studio-iframe"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
                    src={embed.embedUrl}
                    title={embed.embedTitle}
                  />
                ) : null}

                <div className="studio-detail">
                  <div>
                    <h3>Pedidos que se hicieron de verdad</h3>
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
                    <h3>Desde una terminal</h3>
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
            <h2>No publicado</h2>
            <p className="roadmap-heading">
              Las direcciones candidatas para Production RAG se pidieron el {site.lastVerified} y
              devolvieron 404. Se quedan afuera hasta que una nueva medición observe un 200.
              production-rag.vercel.app es otro producto y nunca se lo cita como P1.
            </p>

            <div className="clone-grid">
              {studio.cloneCards.map((card) => {
                const system = systemFor(card.slug);
                return (
                  <article className="clone-card" key={card.slug}>
                    <p className="item-meta">
                      {system.number} · <Status tone="planned">CLONE ONLY</Status>
                    </p>
                    <h3>{system.name}</h3>
                    <p>{card.why}</p>
                    <pre>
                      <code>{card.command}</code>
                    </pre>
                    <p className="clone-absent mono">
                      {card.absentUrl.replace("https://", "")} → 404
                    </p>
                    <p className="text-links">
                      <Link href={system.route}>Ver este sistema</Link>
                      <ExternalLink href={system.links[0].url}>Repositorio</ExternalLink>
                      {"demoDayUrl" in card && card.demoDayUrl ? (
                        <ExternalLink href={card.demoDayUrl as string}>
                          DEMO-DAY (stream · Filtering · /evals)
                        </ExternalLink>
                      ) : null}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
