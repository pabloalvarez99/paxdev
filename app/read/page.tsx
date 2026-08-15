import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import portfolio from "@/content/portfolio";

const { site, interviewKit, aiSystems } = portfolio;

export const metadata: Metadata = {
  title: `Versión de lectura — ${site.name}`,
  description:
    "El guion de la entrevista de cuarenta y cinco minutos, en prosa continua, a una columna, pensado para imprimir y doblar.",
  alternates: { canonical: `${site.canonicalUrl}/read` },
};

type Beat = (typeof interviewKit.beats)[number];
type Step = Beat["steps"][number];

function systemName(slug: string) {
  return aiSystems.find((system) => system.slug === slug)?.name ?? slug;
}

/** Each step, said the way it would be said out loud rather than shown as a chip. */
function StepProse({ step }: { step: Step }) {
  if (step.kind === "command") {
    return (
      <>
        <p className="read-command">{step.value}</p>
        <p>{step.note}</p>
      </>
    );
  }

  if (step.kind === "ask") {
    return (
      <p>
        Preguntar <em>{step.value}</em> {step.note}
      </p>
    );
  }

  const href = step.url ?? "/";
  const internal = href.startsWith("/");
  return (
    <p>
      Abrir{" "}
      {internal ? (
        <Link href={href}>{step.value}</Link>
      ) : (
        <a href={href} rel="noreferrer" target="_blank">
          {step.value}
        </a>
      )}
      . {step.note}
    </p>
  );
}

export default function ReadPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Ir al contenido
      </a>

      <SiteHeader />

      <main className="read-page" id="main-content">
        <nav className="crumbs" aria-label="Ruta de navegación">
          <Link href="/">Portafolio</Link>
          <span aria-hidden="true">/</span>
          <Link href="/interview">Kit de entrevista</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Versión de lectura</span>
        </nav>

        <p className="section-kicker">Versión de lectura</p>
        <h1>{interviewKit.title}</h1>
        <p className="read-lede">{interviewKit.intro}</p>

        <section className="read-part">
          <p className="read-running">Las reglas de la sala</p>
          <h2>Lo que vale para cada tramo</h2>
          {interviewKit.rules.map((rule) => (
            <p key={rule.title}>
              <strong>{rule.title}.</strong> {rule.body}
            </p>
          ))}
          <p>
            <strong>{interviewKit.dayOfChecklist.title}.</strong>{" "}
            {interviewKit.dayOfChecklist.body}
          </p>
          <p className="read-command">{interviewKit.dayOfChecklist.command}</p>
        </section>

        {interviewKit.beats.map((beat) => (
          <section className="read-part" key={beat.clock + beat.system}>
            <p className="read-running">
              Minuto {beat.clock} · {systemName(beat.system)} · {beat.mode} · main {beat.sha}
            </p>
            <h2>{beat.title}</h2>
            <p>{beat.say}</p>
            {beat.steps.map((step, index) => (
              <StepProse key={`${beat.system}-${index}`} step={step} />
            ))}
            <p className="read-aside">Qué observar: {beat.watch}</p>
          </section>
        ))}

        <section className="read-part">
          <p className="read-running">Cierre</p>
          <h2>Tres frases que terminan la llamada</h2>
          {interviewKit.close.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className="read-aside">{interviewKit.divergence}</p>
        </section>

        <p className="read-colophon">
          Verificado el {site.lastVerified}. El guion original es{" "}
          <a href={interviewKit.source.url} rel="noreferrer" target="_blank">
            {interviewKit.source.label}
          </a>
          . El mismo material, con sus etiquetas de estado, el póster y los bloques de código,
          está en la página del{" "}
          <Link href="/interview">kit de entrevista</Link>. Compuesto en Source Serif 4.
        </p>
      </main>

      <SiteFooter />
    </>
  );
}
