import Link from "next/link";

import { PaperSheet } from "@/components/paper-sheet";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ExternalLink, Status } from "@/components/ui";
import { totalClases } from "@/content/clases";
import flota from "@/content/flota";
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
        inLanguage: "es",
        creator: { "@id": `${site.canonicalUrl}/#person` },
      },
      {
        "@type": "ItemList",
        name: "Sistemas de IA",
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
        Ir al contenido
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
            <h1>Sistemas de inteligencia artificial que se pueden abrir y revisar.</h1>
            <p className="hero-lede measure">
              Cinco sistemas construidos y publicados. Cuatro se abren en el navegador ahora
              mismo, sin instalar nada y sin crear una cuenta. Cada afirmación de esta página
              tiene detrás un repositorio de código abierto, una prueba automática o un
              servidor funcionando.
            </p>
            <div className="hero-honesty measure">
              <p>
                El quinto, <strong>P1 Production RAG</strong>, sólo se puede clonar: no está
                publicado en internet porque su motor de búsqueda necesita instalarse en una
                máquina propia. Decirlo cuesta menos que inventar una demostración que se cae
                en la reunión. Aclaración importante: <span className="mono">
                  production-rag.vercel.app
                </span>{" "}
                es otro producto, de otra persona, y nunca se enlaza acá como si fuera este
                sistema.
              </p>
              <p>
                <strong>P5 AI Platform</strong> sí está publicado, y su propia página de estado
                informa cuatro conexiones sin configurar. Aparece así a propósito: el sistema
                está hecho para decir la verdad sobre sí mismo, incluso cuando la verdad es
                que algo todavía no está conectado.
              </p>
            </div>
            <p className="text-links">
              <a href="#metodo">Cómo trabajo</a>
              <a href="#sistemas">Los sistemas</a>
              <Link href="/clases">Clases</Link>
              <a href={site.githubUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </p>
            <p className="hero-note">
              Sin registro. Sin recolección de datos. Sólo evidencia pública. Se puede navegar
              con el teclado:{" "}
              <button
                aria-label="Abrir la guía de teclas"
                className="legend-open"
                data-legend-open
                type="button"
              >
                <kbd aria-hidden="true">?</kbd>
              </button>{" "}
              abre la guía.
            </p>

            <PaperSheet />
          </div>
        </section>

        <section className="section" id="abiertos">
          <div className="container">
            <h2>Se puede abrir ahora</h2>
            <ul className="open-list">
              {hosted.map((system) => (
                <li key={system.slug}>
                  <h3>
                    {system.number} {system.name}
                  </h3>
                  <p className="item-meta">
                    <Status tone={system.statusTone}>{system.status}</Status>
                    {" · publicado · "}
                    <span className="mono">{hostLabel(system.hosted!.url)}</span>
                  </p>
                  <p>{system.hosted!.note}</p>
                  <p className="text-links">
                    <ExternalLink href={system.hosted!.url}>{system.hosted!.label}</ExternalLink>
                    <Link href={system.route}>Ver en detalle</Link>
                  </p>
                </li>
              ))}
              {cloneOnly.map((system) => (
                <li key={system.slug}>
                  <h3>
                    {system.number} {system.name}
                  </h3>
                  <p className="item-meta">
                    <Status tone="planned">SÓLO CLONAR</Status>
                    {" · no publicado"}
                  </p>
                  <p>
                    Su motor de búsqueda necesita instalarse en una máquina propia, así que se
                    entrega como código para clonar y correr, no como una dirección web.
                  </p>
                  <p className="text-links">
                    <ExternalLink href={system.links[0].url}>Repositorio</ExternalLink>
                    <Link href={system.route}>Ver en detalle</Link>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/*
          La sección que un lector no técnico entiende de inmediato y que ningún otro
          portfolio tiene: no qué se construyó, sino a qué velocidad y con qué método.
          Los números son medidos, y los límites de lo que miden van al lado de los
          números, no en una nota al pie que nadie lee.
        */}
        <section className="section" id="metodo">
          <div className="container">
            <h2>Cómo trabajo</h2>
            <div className="measure">
              <p>
                Una persona sola, coordinando cuatro asistentes de inteligencia artificial
                distintos que trabajan al mismo tiempo, cada uno sobre su propia copia del
                código. Mientras uno escribe una función, otro corrige un error en otro
                proyecto y un tercero documenta lo que acaba de decidirse. Es la forma de
                trabajar de los equipos grandes —varias tareas avanzando en paralelo, sin
                pisarse— hecha por una persona.
              </p>
              <p>
                Lo que lo sostiene no es la velocidad: es el registro. Cada sesión termina
                escribiendo qué se hizo, qué se decidió y qué quedó abierto. Por eso otro puede
                entrar mañana y entender el porqué de cada cosa, en vez de heredar código sin
                explicación.
              </p>
            </div>

            <dl className="flota-cifras">
              <div>
                <dt>Sesiones de trabajo documentadas</dt>
                <dd>{flota.cifras.sesiones}</dd>
              </div>
              <div>
                <dt>Días</dt>
                <dd>{flota.cifras.dias}</dd>
              </div>
              <div>
                <dt>Promedio por día</dt>
                <dd>{flota.cifras.promedioPorDia}</dd>
              </div>
              <div>
                <dt>Asistentes de IA coordinados</dt>
                <dd>{flota.agentes.length}</dd>
              </div>
              <div>
                <dt>Decisiones archivadas con sus alternativas</dt>
                <dd>{flota.cifras.decisiones}</dd>
              </div>
              <div>
                <dt>Copias del código avanzando en paralelo</dt>
                <dd>{flota.cifras.copiasParalelas}</dd>
              </div>
            </dl>

            <p className="measure">
              Repartidas así:{" "}
              {flota.agentes.map((agente, index) => (
                <span key={agente.nombre}>
                  {index > 0 ? ", " : ""}
                  {agente.nombre} {agente.sesiones}
                </span>
              ))}
              . Entre el {flota.cifras.desde} y el {flota.cifras.hasta}.
            </p>

            <div className="measure flota-limites">
              <p>
                Qué no dicen estos números, para que nadie los lea de más:
              </p>
              <ul>
                {flota.limites.map((limite) => (
                  <li key={limite}>{limite}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section" id="clases">
          <div className="container measure">
            <h2>Las clases</h2>
            {/*
              El número sale de contar los archivos, no de escribirlo acá. Un "veinte
              capítulos" a mano sobrevive intacto al día en que queden dieciocho.
            */}
            <p>
              {totalClases()} capítulos que explican, línea por línea, cómo está hecho cada uno
              de los cinco sistemas. No son tutoriales de una librería de moda: son la lectura
              del código propio, con las decisiones y los errores incluidos.
            </p>
            <p>
              Sirven para dos cosas. Para quien quiera evaluar el nivel técnico sin leer un
              repositorio entero. Y para quien quiera aprender: cada capítulo termina con
              ejercicios.
            </p>
            <p className="text-links">
              <Link href="/clases">Abrir el índice de clases</Link>
            </p>
          </div>
        </section>

        <section className="section" id="sistemas">
          <div className="container">
            <h2>Los cinco sistemas</h2>
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
                    {system.hosted ? "publicado" : "sólo clonar"}
                  </p>
                  <p>{system.summary}</p>
                  <p className="text-links">
                    <Link href={system.route}>Ver en detalle</Link>
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

        <section className="section" id="honestidad">
          <div className="container measure">
            <h2>Lo que todavía no está</h2>
            <p>
              Un portfolio que sólo muestra lo que salió bien no se puede verificar. Éstas son
              las tres cosas que a esta altura conviene decir en voz alta.
            </p>
            <ul className="honesty-list">
              <li>
                <p>
                  P1 Production RAG no está publicado en internet. Su motor de búsqueda
                  necesita instalarse localmente.
                </p>
              </li>
              <li>
                <p>
                  P5 AI Platform no ejecuta a los otros cuatro sistemas. Su página de estado
                  informa cuatro conexiones sin configurar, y así es como debe leerse.
                </p>
              </li>
              <li>
                <p>
                  <span className="mono">production-rag.vercel.app</span> es un producto
                  distinto, de otra persona. Nunca se presenta acá como P1 ni se enlaza como
                  tal.
                </p>
              </li>
            </ul>
          </div>
        </section>

        <section className="section" id="trabajos">
          <div className="container">
            <h2>Otros trabajos</h2>
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
                    <ExternalLink href={project.repo}>Repositorio</ExternalLink>
                    {project.demo ? (
                      <ExternalLink href={project.demo}>Verlo funcionando</ExternalLink>
                    ) : null}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section" id="principios">
          <div className="container measure">
            <h2>Cómo decido</h2>
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
