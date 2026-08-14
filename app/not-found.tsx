import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="section-kicker">404 / ROUTE NOT FOUND</p>
      <h1>This path is not part of the system.</h1>
      <p>The portfolio is a focused single-page index. Return to the verified surface.</p>
      <Link className="button button-primary" href="/">
        Back to PAX / DEV
      </Link>
    </main>
  );
}
