/*
 * El índice de las clases se lee del disco, no de una lista escrita a mano.
 *
 * Las veinte clases son HTML estático en public/clases/. Una lista paralela en JSON
 * tendría que actualizarse cada vez que se agrega o se renombra un capítulo, y el día que
 * alguien se olvide el índice va a mentir sin que nada falle: la página seguiría
 * compilando y mostrando un capítulo que ya no existe, o escondiendo uno que sí. Leer la
 * carpeta hace imposible esa clase de mentira.
 *
 * Esto corre en el servidor, en build. No llega nada de node:fs al navegador.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import portfolio from "./portfolio";

const raiz = join(process.cwd(), "public", "clases");

export type Clase = {
  numero: number;
  titulo: string;
  archivo: string;
  href: string;
};

export type ClasesDeSistema = {
  slug: string;
  numeroSistema: string;
  nombre: string;
  ruta: string;
  clases: Clase[];
};

/** Saca el texto del primer <h1>, sin el marcado de adentro. */
function tituloDe(html: string, respaldo: string) {
  const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html);
  if (!h1) return respaldo;
  const texto = h1[1]
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;|&rsquo;/g, "’")
    .replace(/\s+/g, " ")
    .trim();
  return texto.length > 0 ? texto : respaldo;
}

export function clasesPorSistema(): ClasesDeSistema[] {
  return portfolio.aiSystems
    .map((sistema) => {
      const carpeta = join(raiz, sistema.slug);
      if (!existsSync(carpeta)) {
        return { ...sistema, clases: [] as Clase[] };
      }

      const clases = readdirSync(carpeta)
        .filter((nombre) => /^clase-\d{2}\.html$/.test(nombre))
        .sort()
        .map((archivo) => {
          const numero = Number.parseInt(archivo.slice(6, 8), 10);
          const html = readFileSync(join(carpeta, archivo), "utf8");
          return {
            numero,
            titulo: tituloDe(html, `Clase ${numero}`),
            archivo,
            href: `/clases/${sistema.slug}/${archivo}`,
          };
        });

      return { ...sistema, clases };
    })
    .map(({ slug, number, name, route, clases }) => ({
      slug,
      numeroSistema: number,
      nombre: name,
      ruta: route,
      clases,
    }))
    .filter((sistema) => sistema.clases.length > 0);
}

export function totalClases() {
  return clasesPorSistema().reduce((total, sistema) => total + sistema.clases.length, 0);
}
