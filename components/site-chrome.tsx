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

        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href={home ? "#sistemas" : "/#sistemas"}>Sistemas</a>
          <Link href="/clases">Clases</Link>
          <Link href="/studio">Estudio</Link>
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
        <nav className="footer-links" aria-label="Pie de página">
          <Link href={home ? "#top" : "/"}>Inicio</Link>
          <a href={home ? "#sistemas" : "/#sistemas"}>Sistemas</a>
          <Link href="/clases">Clases</Link>
          <Link href="/interview">Entrevista</Link>
          <Link href="/read">Versión de lectura</Link>
          <Link href="/studio">Estudio</Link>
          <Link href="/changelog">Historial de cambios</Link>
          <Link href="/casestudy">Caso de estudio</Link>
          <a href={site.githubUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
        <p className="mono">
          Verificado el {site.lastVerified} · Sin inicio de sesión · Sin seguimiento · Sin
          formularios de credenciales
        </p>
      </div>
    </footer>
  );
}
