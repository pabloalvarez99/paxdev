#!/usr/bin/env node
/**
 * Vuelve a medir las cifras del método de trabajo y falla si content/flota.json se movió.
 *
 * La página presenta estos números como medidos, no estimados. Un número medido que nadie
 * vuelve a medir es un número estimado con mejor prensa: envejece igual, y encima con la
 * credibilidad de haber sido cierto alguna vez. Por eso existe este archivo.
 *
 * El vault es privado y no está en CI, así que sin él esto no falla: informa que no pudo
 * medir y termina en 0. Esa es la diferencia entre "no se pudo comprobar" y "está mal", y
 * confundirlas volvería el gate inútil en un lado o insoportable en el otro.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const flota = JSON.parse(readFileSync(join(root, "content", "flota.json"), "utf8"));

const vault = process.env.SECOND_BRAIN ?? "C:\\obsidian-mind";
const sessions = join(vault, "work", "sessions");

if (!existsSync(sessions)) {
  console.log(
    `check-flota: el vault no está acá (${vault}), así que no se midió nada. ` +
      `Las cifras de content/flota.json quedan como estaban.`,
  );
  process.exit(0);
}

const failures = [];
const compare = (label, esperado, medido) => {
  if (esperado !== medido) {
    failures.push(`${label}: flota.json dice ${esperado}, la medición da ${medido}`);
  }
};

const archivos = readdirSync(sessions).filter((name) => name.endsWith(".md"));

const fechas = new Set();
const porAgente = new Map();
for (const name of archivos) {
  const match = /^(\d{4}-\d{2}-\d{2})-(claude|codex|grok|kimi|pi|cursor)/.exec(name);
  if (!match) continue;
  fechas.add(match[1]);
  const agente = match[2];
  porAgente.set(agente, (porAgente.get(agente) ?? 0) + 1);
}

const ordenadas = [...fechas].sort();

compare("sesiones", flota.cifras.sesiones, archivos.length);
compare("días", flota.cifras.dias, fechas.size);
compare("desde", flota.cifras.desde, ordenadas[0]);
compare("hasta", flota.cifras.hasta, ordenadas[ordenadas.length - 1]);

// El promedio se publica redondeado, así que se compara redondeado. Guardar el decimal
// exacto sería precisión falsa sobre una cifra cuyo denominador ya es grueso.
compare(
  "promedio por día",
  flota.cifras.promedioPorDia,
  Math.round(archivos.length / fechas.size),
);

for (const carpeta of [
  ["decisiones", "decisions"],
  ["registros", "cli-logs"],
]) {
  const [clave, dir] = carpeta;
  const ruta = join(vault, "work", dir);
  if (!existsSync(ruta)) {
    failures.push(`${clave}: no existe ${ruta}`);
    continue;
  }
  compare(clave, flota.cifras[clave], readdirSync(ruta).length);
}

// Los nombres de agente se publican capitalizados y se miden en minúscula.
for (const agente of flota.agentes) {
  const medido = porAgente.get(agente.nombre.toLowerCase()) ?? 0;
  compare(`sesiones de ${agente.nombre}`, agente.sesiones, medido);
}

const sumaAgentes = flota.agentes.reduce((total, agente) => total + agente.sesiones, 0);
if (sumaAgentes !== flota.cifras.sesiones) {
  failures.push(
    `las sesiones por agente suman ${sumaAgentes} pero el total publicado es ${flota.cifras.sesiones}`,
  );
}

if (failures.length > 0) {
  console.error(`check-flota FALLA (${failures.length})`);
  for (const f of failures) console.error(`  - ${f}`);
  console.error(
    "\nLas cifras de la página tienen que decir lo que el vault dice hoy. " +
      "Actualizá content/flota.json y su campo medidoEl.",
  );
  process.exit(1);
}

console.log(
  `check-flota OK — ${flota.cifras.sesiones} sesiones, ${flota.cifras.dias} días, ` +
    `${flota.agentes.length} agentes, medido el ${flota.medidoEl}`,
);
