import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import portfolio from "@/content/portfolio";

const { site, interviewKit, aiSystems } = portfolio;

export const metadata: Metadata = {
  title: `Reading copy — ${site.name}`,
  description:
    "The forty-five minute interview script set as continuous prose, one column, made to be printed and folded.",
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
        Ask <em>{step.value}</em> {step.note}
      </p>
    );
  }

  const href = step.url ?? "/";
  const internal = href.startsWith("/");
  return (
    <p>
      Open{" "}
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
        Skip to content
      </a>

      <SiteHeader />

      <main className="read-page" id="main-content">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Portfolio</Link>
          <span aria-hidden="true">/</span>
          <Link href="/interview">Interview kit</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Reading copy</span>
        </nav>

        <p className="section-kicker">Reading copy</p>
        <h1>{interviewKit.title}</h1>
        <p className="read-lede">{interviewKit.intro}</p>

        <section className="read-part">
          <p className="read-running">The rules of the room</p>
          <h2>What holds for every beat</h2>
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
              Minute {beat.clock} · {systemName(beat.system)} · {beat.mode} · main {beat.sha}
            </p>
            <h2>{beat.title}</h2>
            <p>{beat.say}</p>
            {beat.steps.map((step, index) => (
              <StepProse key={`${beat.system}-${index}`} step={step} />
            ))}
            <p className="read-aside">Watch for: {beat.watch}</p>
          </section>
        ))}

        <section className="read-part">
          <p className="read-running">Close</p>
          <h2>Three sentences that end the call</h2>
          {interviewKit.close.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className="read-aside">{interviewKit.divergence}</p>
        </section>

        <p className="read-colophon">
          Verified {site.lastVerified}. The original script is{" "}
          <a href={interviewKit.source.url} rel="noreferrer" target="_blank">
            {interviewKit.source.label}
          </a>
          . The same material with its status chips, poster and code blocks is on the{" "}
          <Link href="/interview">interview kit</Link> page. Set in Source Serif 4.
        </p>
      </main>

      <SiteFooter />
    </>
  );
}
