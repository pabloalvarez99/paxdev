import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="section-kicker">404</p>
      <h1>This path is not on the site.</h1>
      <p>Return to the portfolio.</p>
      <Link href="/">Back to Pablo Alvarez</Link>
    </main>
  );
}
