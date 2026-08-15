import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ExternalLink, Status } from "@/components/ui";
import portfolio from "@/content/portfolio";
import pins from "@/content/pins.json";
import releases from "@/content/releases.json";

const { site } = portfolio;

export const metadata: Metadata = {
  title: "Versiones",
  description:
    "Las notas de publicación de los cinco sistemas, copiadas de GitHub. Una etiqueta vieja hace fallar la verificación automática contra content/pins.json.",
  alternates: { canonical: `${site.canonicalUrl}/changelog` },
};

export default function ChangelogPage() {
  const pinBySlug = new Map(pins.systems.map((s) => [s.slug, s]));

  return (
    <>
      <a className="skip-link" href="#main-content">
        Ir al contenido
      </a>
      <SiteHeader />
      <main id="main-content" className="changelog-page">
        <section className="section">
          <div className="container narrow">
            <h1>Lo último que publicó cada sistema</h1>
            <p className="lede">
              Las notas de abajo se copiaron de las publicaciones de GitHub a{" "}
              <code className="mono">content/releases.json</code> (traídas el{" "}
              {releases.fetchedAt}). Cada etiqueta tiene que coincidir con{" "}
              <code className="mono">content/pins.json</code>. Si una queda vieja, falla una
              prueba automática: no depende de que una persona se acuerde de releer la página.
            </p>
            <p className="meta mono">
              Verificado el {site.lastVerified} · tabla de versiones {pins.pinnedAt}
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
                        publicado {rel.publishedAt?.slice(0, 10) ?? "—"}
                        {pin ? ` · main ${pin.main} · ${pin.mode}` : ""}
                      </p>
                    </div>
                    <ExternalLink href={rel.htmlUrl}>Ver en GitHub</ExternalLink>
                  </div>
                  <pre className="changelog-body">{rel.body || "(nota de publicación vacía)"}</pre>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section">
          <div className="container narrow">
            <p>
              <Link href="/">← Volver al inicio</Link>
              {" · "}
              <Link href="/interview">Guion de entrevista</Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
