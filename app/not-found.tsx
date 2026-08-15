import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="section-kicker">404</p>
      <h1>Esta dirección no existe en el sitio.</h1>
      <p>Puede que el enlace esté mal escrito o que la página haya cambiado de lugar.</p>
      <Link href="/">Volver al inicio</Link>
    </main>
  );
}
