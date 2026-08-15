export type JumpTarget = {
  /** The digit that opens this destination directly, when it has one. */
  chapter: string | null;
  label: string;
  href: string;
  hint: string;
  /** Words a reviewer might remember instead of the name. Lowercase, substring-matched. */
  terms: string[];
};

/**
 * Rank destinations for a typed query. A lookup table, not a search engine: exact vocabulary
 * first, then names that start with what was typed, then anything that contains it. An empty
 * query returns the whole table, so `/` is also a table of contents.
 *
 * Kept free of content imports so the browser gets the matcher without the portfolio.
 */
export function rankTargets(query: string, targets: JumpTarget[]): JumpTarget[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return targets;
  }

  const scored = targets
    .map((target) => {
      const label = target.label.toLowerCase();
      let score = 0;
      if (target.terms.some((term) => term === q)) score = 4;
      else if (label.startsWith(q) || label.replace(/^\d+\s+/, "").startsWith(q)) score = 3;
      else if (target.terms.some((term) => term.startsWith(q))) score = 2;
      else if (label.includes(q) || target.terms.some((term) => term.includes(q))) score = 1;
      return { target, score };
    })
    .filter((entry) => entry.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.map((entry) => entry.target);
}
