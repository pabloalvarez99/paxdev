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
        Ir al contenido
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
            <h2>Captura</h2>
            <p className="item-meta">
              Una imagen sacada del repositorio, en la versión exacta que dice el pie.
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
                {capture.caption}{" "}
                <ExternalLink href={capture.sourceUrl}>Archivo de origen</ExternalLink>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="section system-interview">
          <div className="container">
            <div className="roadmap-heading">
              <div>
                <p className="section-kicker">PREGUNTAS SOBRE ESTE SISTEMA</p>
                <h3>Tres preguntas que vale la pena hacer, con sus respuestas.</h3>
              </div>
              <p>
                Publicadas de antemano. Una decisión que sólo se puede defender cuando nadie la
                leyó antes es una decisión que no se entiende del todo.
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
                <p className="section-kicker">LEER LAS FUENTES</p>
                <h3>Todo lo de arriba resume un archivo que se puede abrir.</h3>
              </div>
              <p>
                Los documentos explican por qué el sistema tiene esta forma, y cuál es el límite
                entre lo que ya está publicado y lo que todavía no. Esta página se deriva de
                ellos.
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

            <nav className="system-pager" aria-label="Otros sistemas">
              {previous ? (
                <Link href={previous.route}>
                  <small>Anterior</small>
                  {previous.name}
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link className="system-pager-next" href={next.route}>
                  <small>Siguiente</small>
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
