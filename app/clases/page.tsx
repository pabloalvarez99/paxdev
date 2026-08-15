import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { clasesPorSistema, totalClases } from "@/content/clases";
import portfolio from "@/content/portfolio";

const { site } = portfolio;

export const metadata: Metadata = {
  title: "Clases",
  description:
    "Veinte capítulos que leen el código de los cinco sistemas línea por línea, con las decisiones y los errores incluidos.",
  alternates: { canonical: `${site.canonicalUrl}/clases` },
};

export default function ClasesPage() {
  const sistemas = clasesPorSistema();
  const total = totalClases();

  return (
    <>
      <a className="skip-link" href="#main-content">
        Ir al contenido
      </a>
      <SiteHeader />
      <main id="main-content">
        <section className="section">
          <div className="container narrow">
            <h1>Las clases</h1>
            <p className="lede">
              {total} capítulos que explican cómo está hecho cada uno de los cinco sistemas,
              leyendo el código propio línea por línea. No son tutoriales de una librería de
              moda: son la lectura de lo que efectivamente se construyó, con las decisiones y
              los errores adentro.
            </p>
            <p>
              Cada capítulo se puede leer solo. Se abren en el navegador, sin cuenta y sin
              instalar nada, y están pensados también para imprimirse.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            {sistemas.map((sistema) => (
              <div className="clases-sistema" key={sistema.slug}>
                <h2>
                  {sistema.numeroSistema} {sistema.nombre}
                </h2>
                <p className="item-meta">
                  {sistema.clases.length}{" "}
                  {sistema.clases.length === 1 ? "capítulo" : "capítulos"} ·{" "}
                  <Link href={sistema.ruta}>ver el sistema</Link>
                </p>
                <ol className="clases-lista">
                  {sistema.clases.map((clase) => (
                    <li key={clase.href}>
                      {/*
                        Un <a> plano y no <Link>: el destino es HTML estático en public/,
                        no una ruta de Next. Un <Link> intentaría navegar por el router del
                        lado del cliente hacia algo que el router no conoce.
                      */}
                      <a href={clase.href}>
                        <span className="clases-numero">Clase {clase.numero}</span>
                        <span className="clases-titulo">{clase.titulo}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="container narrow">
            <p>
              <Link href="/">← Volver al inicio</Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
