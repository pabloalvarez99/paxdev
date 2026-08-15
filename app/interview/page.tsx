import type { Metadata } from "next";
import Link from "next/link";

import { ArchitecturePoster } from "@/components/architecture-poster";
import { ArrowUpRightIcon, TerminalIcon } from "@/components/icons";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { ExternalLink, Status } from "@/components/ui";
import portfolio from "@/content/portfolio";

const { site, interviewKit, aiSystems } = portfolio;

export const metadata: Metadata = {
  title: `Interview kit — ${site.name}`,
  description:
    "Forty-five minute demo-day script with minute marks, exact clicks and curls, and an architecture poster with honest HOSTED vs CLONE chips.",
  alternates: { canonical: `${site.canonicalUrl}/interview` },
};

function systemName(slug: string) {
  return aiSystems.find((system) => system.slug === slug)?.name ?? slug;
}

function StepBody({
  step,
}: {
  step: (typeof interviewKit.beats)[number]["steps"][number];
}) {
  if (step.kind === "command") {
    return (
      <div>
        <p className="script-do-label">
          <TerminalIcon /> CURL / CLONE
        </p>
        <pre>
          <code>{step.value}</code>
        </pre>
        <p className="script-watch">{step.note}</p>
      </div>
    );
  }

  if (step.kind === "ask") {
    return (
      <div>
        <p className="script-do-label">ASK</p>
        <p>
          <strong>{step.value}</strong>
        </p>
        <p className="script-watch">{step.note}</p>
      </div>
    );
  }

  const href = step.url ?? "/";
  const internal = href.startsWith("/");
  return (
    <div>
      <p className="script-do-label">OPEN</p>
      <p>
        {internal ? (
          <Link href={href}>
            {step.value}
            <ArrowUpRightIcon />
          </Link>
        ) : (
          <ExternalLink href={href}>{step.value}</ExternalLink>
        )}
      </p>
      <p className="script-watch">{step.note}</p>
    </div>
  );
}

export default function InterviewPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <SiteHeader />

      <main id="main-content" className="interview-page">
        <section className="section kit-hero">
          <div className="container">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Portfolio</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Interview kit</span>
            </nav>

            <p className="section-kicker">45 minutes</p>
            <h1>{interviewKit.title}</h1>
            <p className="system-pitch">{interviewKit.intro}</p>
            <p className="hero-note">
              Verified {site.lastVerified}. Source script:{" "}
              <ExternalLink href={interviewKit.source.url}>
                {interviewKit.source.label}
              </ExternalLink>
              . Hosted URLs on this page are the same ones in{" "}
              <ExternalLink href="https://github.com/pabloalvarez99/paxdev/blob/main/content/verified-urls.json">
                content/verified-urls.json
              </ExternalLink>
              .
            </p>

            <div className="kit-rules">
              {interviewKit.rules.map((rule) => (
                <article key={rule.title}>
                  <h3>{rule.title}</h3>
                  <p>{rule.body}</p>
                </article>
              ))}
            </div>

            <article className="kit-dayof">
              <h3>{interviewKit.dayOfChecklist.title}</h3>
              <p>{interviewKit.dayOfChecklist.body}</p>
              <pre>
                <code>{interviewKit.dayOfChecklist.command}</code>
              </pre>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="roadmap-heading">
              <div>
                <p className="section-kicker">ARCHITECTURE POSTER</p>
                <h3>Exact type. Honest chips. No image-model garble.</h3>
              </div>
              <p>
                HOSTED means a URL we curled returned the claimed status on {site.lastVerified}.
                CLONE means no such URL exists for that system.
              </p>
            </div>
            <ArchitecturePoster />
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="roadmap-heading">
              <div>
                <p className="section-kicker">THE SCRIPT</p>
                <h3>Minute marks, exact click or curl, and the sentence I volunteer first.</h3>
              </div>
            </div>

            <ol className="script-list">
              {interviewKit.beats.map((beat) => (
                <li className="script-beat" key={beat.clock + beat.system}>
                  <div className="script-clock">
                    {beat.clock}
                    <small>{beat.mode}</small>
                    <small>{systemName(beat.system)}</small>
                    <small className="mono">main {beat.sha}</small>
                    {beat.host ? <small className="mono">{beat.host.replace("https://", "")}</small> : null}
                  </div>
                  <div>
                    <div className="system-hero-meta" style={{ border: "none", padding: 0 }}>
                      <Status tone={beat.mode === "HOSTED" ? "live" : "planned"}>
                        {beat.mode}
                      </Status>
                    </div>
                    <h3>{beat.title}</h3>
                    <p className="script-say">{beat.say}</p>
                    <div className="script-do">
                      {beat.steps.map((step, index) => (
                        <StepBody key={`${beat.system}-${index}`} step={step} />
                      ))}
                    </div>
                    <p className="script-watch">
                      <strong>Watch for:</strong> {beat.watch}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="roadmap-heading">
              <div>
                <p className="section-kicker">CLOSE</p>
                <h3>Three sentences that end the call without inventing a claim.</h3>
              </div>
            </div>
            <ol className="interview-list">
              {interviewKit.close.map((line, index) => (
                <li key={line}>
                  <span className="interview-index">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p>{line}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="script-watch" style={{ marginTop: 32 }}>
              {interviewKit.divergence}
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <h2>After the call</h2>
            <p className="text-links">
              <Link href="/studio">Studio</Link>
              <Link href={aiSystems[0].route}>Study the flagship</Link>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
