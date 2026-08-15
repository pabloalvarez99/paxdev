"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ArrowUpRightIcon, CheckIcon, GithubIcon, ShieldIcon } from "@/components/icons";
import { Status } from "@/components/ui";
import systemsEs from "@/content/i18n/systems-es.json";

type Props = {
  slug: string;
  title: string;
  route: string;
  status: string;
  statusTone: "live" | "planned" | "progress" | string;
  phase: string;
  lastVerified: string;
  en: { headline: string; pitch: string; kicker: string };
  cta: {
    kind: string;
    label: string;
    url: string;
    command: string;
    note: string;
  };
  repoUrl: string;
  live: string[];
  planned: string[];
};

export function SystemHeroI18n({
  slug,
  title,
  status,
  statusTone,
  phase,
  lastVerified,
  en,
  cta,
  repoUrl,
  live,
  planned,
}: Props) {
  /*
   * El sitio está en español, así que el español es el estado inicial y no una opción
   * escondida detrás de un botón. El inglés se queda porque es el idioma en que están
   * escritos el código, los repositorios y la documentación que esta página cita: quien
   * vaya a leer la fuente puede querer los mismos términos con los que se va a encontrar.
   */
  const [lang, setLang] = useState<"en" | "es">("es");
  const esCopy = systemsEs.systems[slug as keyof typeof systemsEs.systems];

  const copy = useMemo(() => {
    if (lang === "es" && esCopy) {
      return {
        headline: esCopy.headline,
        pitch: esCopy.pitch,
        kicker: esCopy.kicker,
        liveLabel: systemsEs.ui.live,
        notShippedLabel: systemsEs.ui.notShipped,
        verifiedText: `${systemsEs.ui.verified} ${lastVerified}`,
        sourceLabel: "Leer el código",
        ctaKind:
          cta.kind === "hosted"
            ? "PUBLICADO · sin clonar, sin clave"
            : "CLONAR · corre sin costo",
        liveLede: "Cada línea de acá tiene detrás una prueba, una ruta o un archivo del repositorio en",
        plannedLede:
          "El límite, dicho antes de que lo descubras solo. Nada de lo de abajo se presenta como hecho, ni escondido en una nota al pie, ni descrito como que ya viene.",
      };
    }
    return {
      headline: en.headline,
      pitch: en.pitch,
      kicker: en.kicker,
      liveLabel: "LIVE",
      notShippedLabel: "NOT SHIPPED",
      verifiedText: `Verified ${lastVerified}`,
      sourceLabel: "Read the source",
      ctaKind: cta.kind === "hosted" ? "HOSTED · no clone, no key" : "CLONE · runs at $0",
      liveLede: "Every line here is backed by a test, a route, or a file in the repository at",
      plannedLede:
        "The boundary, stated before you find it yourself. Nothing below is presented as built, hidden in a footnote, or described as coming soon.",
    };
  }, [lang, en, esCopy, lastVerified, cta.kind]);

  return (
    <>
      <section className="section system-hero">
        <div className="container">
          <nav className="crumbs" aria-label="Ruta de navegación">
            <Link href="/">Inicio</Link>
            <span aria-hidden="true">/</span>
            <Link href="/#sistemas">Sistemas</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{title}</span>
          </nav>

          <div className="system-hero-top">
            <p className="section-kicker">{copy.kicker}</p>
            <div className="lang-toggle" role="group" aria-label="Idioma">
              <button
                type="button"
                className={lang === "en" ? "is-active" : undefined}
                aria-pressed={lang === "en"}
                onClick={() => setLang("en")}
              >
                {systemsEs.ui.langEn}
              </button>
              <button
                type="button"
                className={lang === "es" ? "is-active" : undefined}
                aria-pressed={lang === "es"}
                onClick={() => setLang("es")}
              >
                {systemsEs.ui.langEs}
              </button>
            </div>
          </div>
          <h1>{copy.headline}</h1>

          <div className="system-hero-meta">
            <Status tone={statusTone}>{status}</Status>
            <span className="mono">{phase}</span>
            <span className="mono">{copy.verifiedText}</span>
          </div>

          <p className="system-pitch">{copy.pitch}</p>

          <div className="hero-actions">
            <a className="button button-primary" href={cta.url} target="_blank" rel="noreferrer">
              {cta.label}
              <ArrowUpRightIcon />
            </a>
            <a className="button button-secondary" href={repoUrl} target="_blank" rel="noreferrer">
              <GithubIcon />
              {copy.sourceLabel}
            </a>
          </div>

          <div className="cta-strip">
            <p className="cta-strip-kind">{copy.ctaKind}</p>
            <pre>
              <code>{cta.command}</code>
            </pre>
            <p>{cta.note}</p>
          </div>
        </div>
      </section>

      <section className="section system-contract">
        <div className="container contract-grid">
          <article className="contract-column contract-live">
            <h2>
              <CheckIcon />
              {copy.liveLabel}
            </h2>
            <p className="contract-lede">
              {copy.liveLede} <span className="mono">{phase}</span>.
            </p>
            <ul>
              {live.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="contract-column contract-planned">
            <h2>
              <ShieldIcon />
              {copy.notShippedLabel}
            </h2>
            <p className="contract-lede">{copy.plannedLede}</p>
            <ul>
              {planned.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </>
  );
}
