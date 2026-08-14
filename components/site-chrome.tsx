import Link from "next/link";

import { ArrowUpRightIcon, GithubIcon } from "@/components/icons";
import portfolio from "@/content/portfolio";

const { site } = portfolio;

export function SiteHeader({ home = false }: { home?: boolean }) {
  const anchor = (hash: string) => (home ? hash : `/${hash}`);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href={home ? "#top" : "/"}>
          <span className="brand-mark">P/A</span>
          <span className="brand-copy">
            <strong>PAX / DEV</strong>
            <small>AI SYSTEMS</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href={anchor("#systems")}>Systems</a>
          <Link href="/studio">Demo studio</Link>
          <Link href="/interview">Interview kit</Link>
          <a href={anchor("#capabilities")}>Capabilities</a>
          <a href={anchor("#principles")}>Principles</a>
        </nav>

        <a
          className="github-link"
          href={site.githubUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub portfolio"
        >
          <GithubIcon />
          <span>GitHub</span>
          <ArrowUpRightIcon />
        </a>
      </div>
    </header>
  );
}

export function SiteFooter({ home = false }: { home?: boolean }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link className="brand footer-brand" href={home ? "#top" : "/"}>
            <span className="brand-mark">P/A</span>
            <span className="brand-copy">
              <strong>PAX / DEV</strong>
              <small>AI SYSTEMS</small>
            </span>
          </Link>
          <p>Independent engineering portfolio operated by {site.owner}.</p>
        </div>
        <div className="footer-meta">
          <span>Verified {site.lastVerified}</span>
          <span>No login · No tracking · No credential forms</span>
          <a href={site.githubUrl} target="_blank" rel="noreferrer">
            github.com/pabloalvarez99
            <ArrowUpRightIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}
