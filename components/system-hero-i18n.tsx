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
  const [lang, setLang] = useState<"en" | "es">("en");
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
      };
    }
    return {
      headline: en.headline,
      pitch: en.pitch,
      kicker: en.kicker,
      liveLabel: "LIVE",
      notShippedLabel: "NOT SHIPPED",
      verifiedText: `Verified ${lastVerified}`,
    };
  }, [lang, en, esCopy, lastVerified]);

  return (
    <>
      <section className="section system-hero">
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Portfolio</Link>
            <span aria-hidden="true">/</span>
            <Link href="/#systems">Systems</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{title}</span>
          </nav>

          <div className="system-hero-top">
            <p className="section-kicker">{copy.kicker}</p>
            <div className="lang-toggle" role="group" aria-label="Language">
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
              Read the source
            </a>
          </div>

          <div className="cta-strip">
            <p className="cta-strip-kind">
              {cta.kind === "hosted" ? "HOSTED · no clone, no key" : "CLONE · runs at $0"}
            </p>
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
              Every line here is backed by a test, a route, or a file in the repository at{" "}
              <span className="mono">{phase}</span>.
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
            <p className="contract-lede">
              The boundary, stated before you find it yourself. Nothing below is presented as built,
              hidden in a footnote, or described as coming soon.
            </p>
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
