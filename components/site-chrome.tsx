import Link from "next/link";

import portfolio from "@/content/portfolio";

const { site } = portfolio;

export function SiteHeader({ home = false }: { home?: boolean }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href={home ? "#top" : "/"}>
          {site.owner}
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href={home ? "#systems" : "/#systems"}>Systems</a>
          <Link href="/interview">Interview</Link>
          <Link href="/studio">Studio</Link>
          <a href={site.githubUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({ home = false }: { home?: boolean }) {
  return (
    <footer className="site-footer">
      <div className="container footer-plain">
        <nav className="footer-links" aria-label="Footer">
          <Link href={home ? "#top" : "/"}>Home</Link>
          <a href={home ? "#systems" : "/#systems"}>Systems</a>
          <Link href="/interview">Interview</Link>
          <Link href="/studio">Studio</Link>
          <Link href="/changelog">Changelog</Link>
          <Link href="/casestudy">Case study</Link>
          <a href={site.githubUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
        <p className="mono">
          Verified {site.lastVerified} · No login · No tracking · No credential forms
        </p>
      </div>
    </footer>
  );
}
