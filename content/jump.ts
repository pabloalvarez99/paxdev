import type { JumpTarget } from "./jump-rank";
import jump from "./jump.json";
import portfolio from "./portfolio.json";

export type { JumpTarget };

const systemTerms = jump.systemTerms as Record<string, string[]>;

/** Chapters one to five: the systems, in ladder order, reachable by digit. */
export const chapters: JumpTarget[] = portfolio.aiSystems.map((system, index) => ({
  chapter: String(index + 1),
  label: `${system.number} ${system.name}`,
  href: system.route,
  hint: system.outcome,
  terms: [system.name.toLowerCase(), system.slug, ...(systemTerms[system.slug] ?? [])],
}));

export const pages: JumpTarget[] = jump.pages.map((page) => ({
  chapter: null,
  label: page.label,
  href: page.href,
  hint: page.hint,
  terms: [page.label.toLowerCase(), ...page.terms],
}));

/**
 * The whole keyboard map as data, built on the server so the browser never receives
 * content/portfolio.json to power a jump box.
 */
export const jumpTargets: JumpTarget[] = [...chapters, ...pages];
