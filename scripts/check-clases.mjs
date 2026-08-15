#!/usr/bin/env node
/**
 * Revisa las clases estáticas de public/clases/.
 *
 * Son veinte archivos HTML escritos a mano y después traducidos. Nada del build de Next
 * los mira: no pasan por el compilador, no tienen tipos, no rompen ningún test si alguien
 * borra media página. Es justo la clase de contenido que se pudre en silencio, así que la
 * revisión tiene que ser explícita.
 *
 * Lo que exige, y por qué cada cosa:
 *
 *  - Existen los capítulos esperados. Si una traducción falló a la mitad, el índice de
 *    /clases simplemente no lo muestra y la página sigue viéndose bien. Un capítulo que
 *    desaparece sin ruido es peor que uno roto.
 *  - lang="es". Sin eso el lector de pantalla pronuncia español con fonemas ingleses.
 *  - La hoja compartida, y ningún <style> inline. Si un capítulo se queda con su CSS
 *    propio, se ve distinto del resto y el lector nota que salió del sitio.
 *  - Prosa sin inglés suelto. Heurística, no prueba: busca palabras funcionales inglesas
 *    fuera de <pre> y <code>. El código, los identificadores y los mensajes de error se
 *    dejan en inglés a propósito, y por eso se los excluye.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const raiz = join(root, "public", "clases");

const esperado = {
  "production-rag": 4,
  "agentic-rag-research": 4,
  "multi-agent-orchestration": 4,
  repomind: 4,
  "ai-platform": 4,
};

const failures = [];
const fail = (msg) => failures.push(msg);

if (!existsSync(join(raiz, "clases.css"))) {
  fail("falta public/clases/clases.css, la hoja que comparten todos los capítulos");
}

// Palabras que en español no existen y que en inglés aparecen en cualquier párrafo. Si
// una de éstas sobrevive en la prosa, el párrafo quedó sin traducir.
const inglesEnProsa = /\b(the|and|with|that|this|from|which|because|when|there)\b/gi;

// Excepciones: nombres propios y títulos que se dejan como están.
const nombresPropios = [
  /\bThe Creative Act\b/g,
  /\bProduction RAG\b/g,
  /\bAI Platform\b/g,
  /\bMulti-Agent Orchestration\b/g,
  /\bAgentic RAG Research\b/g,
  /\bRepoMind\b/g,
];

/** Texto visible, sin el marcado, sin código y sin lo que no se lee. */
function prosaDe(html) {
  let prosa = html
    .replace(/<(script|style|pre|code|kbd|samp)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ");
  for (const nombre of nombresPropios) prosa = prosa.replace(nombre, " ");
  return prosa;
}

let total = 0;

for (const [slug, cuantas] of Object.entries(esperado)) {
  const carpeta = join(raiz, slug);
  if (!existsSync(carpeta)) {
    fail(`falta la carpeta public/clases/${slug} (se esperaban ${cuantas} capítulos)`);
    continue;
  }

  const archivos = readdirSync(carpeta).filter((n) => /^clase-\d{2}\.html$/.test(n));
  if (archivos.length !== cuantas) {
    fail(
      `${slug}: hay ${archivos.length} capítulos y se esperaban ${cuantas} ` +
        `(${archivos.sort().join(", ") || "ninguno"})`,
    );
  }

  for (const archivo of archivos.sort()) {
    total += 1;
    const ruta = `public/clases/${slug}/${archivo}`;
    const html = readFileSync(join(carpeta, archivo), "utf8");

    if (!/<html[^>]*\blang="es"/i.test(html)) {
      fail(`${ruta}: falta lang="es" en <html>`);
    }
    if (!/<link[^>]+href="\.\.\/clases\.css"/i.test(html)) {
      fail(`${ruta}: no enlaza ../clases.css`);
    }
    if (/<style\b/i.test(html)) {
      fail(`${ruta}: quedó un <style> inline; el estilo va en clases.css`);
    }
    if (!/<h1[^>]*>[\s\S]*?<\/h1>/i.test(html)) {
      fail(`${ruta}: no tiene <h1>, así que el índice no puede sacarle título`);
    }
    if (!html.includes("/clases")) {
      fail(`${ruta}: no tiene ningún enlace de vuelta al índice /clases`);
    }

    const sueltas = prosaDe(html).match(inglesEnProsa) ?? [];
    if (sueltas.length > 3) {
      const muestra = [...new Set(sueltas.map((s) => s.toLowerCase()))].slice(0, 6);
      fail(
        `${ruta}: ${sueltas.length} palabras inglesas en la prosa (${muestra.join(", ")}) — ` +
          `parece que quedó un tramo sin traducir`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error(`check-clases FALLA (${failures.length})`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(`check-clases OK — ${total} capítulos, todos en español y con la hoja compartida`);
