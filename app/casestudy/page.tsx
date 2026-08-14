import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import portfolio from "@/content/portfolio";

const { site } = portfolio;

export const metadata: Metadata = {
  title: "Case study — why this portfolio is built this way",
  description:
    "Why pins drift, why GitHub profile APIs 403, why stats cards stay gone, and how the anti-rot pipeline works.",
  alternates: { canonical: `${site.canonicalUrl}/casestudy` },
};

function renderSimpleMarkdown(md: string): string {
  // Minimal, dependency-free markdown for a committed CASESTUDY: headings, paragraphs, lists, code.
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let inCode = false;
  let listOpen = false;

  const closeList = () => {
    if (listOpen) {
      out.push("</ul>");
      listOpen = false;
    }
  };

  for (const raw of lines) {
    const line = raw;
    if (line.startsWith("```")) {
      closeList();
      if (inCode) {
        out.push("</code></pre>");
        inCode = false;
      } else {
        out.push("<pre class=\"changelog-body\"><code>");
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      out.push(
        line
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;") + "\n",
      );
      continue;
    }
    if (!line.trim()) {
      closeList();
      continue;
    }
    if (line.startsWith("# ")) {
      closeList();
      out.push(`<h1>${escapeInline(line.slice(2))}</h1>`);
      continue;
    }
    if (line.startsWith("## ")) {
      closeList();
      out.push(`<h2>${escapeInline(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith("### ")) {
      closeList();
      out.push(`<h3>${escapeInline(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith("| ") && line.includes("|")) {
      // skip table separator noise as plain pre blocks for honesty
      closeList();
      out.push(`<p class="mono">${escapeInline(line)}</p>`);
      continue;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      if (!listOpen) {
        out.push("<ul>");
        listOpen = true;
      }
      out.push(`<li>${escapeInline(line.slice(2))}</li>`);
      continue;
    }
    closeList();
    out.push(`<p>${escapeInline(line)}</p>`);
  }
  closeList();
  if (inCode) out.push("</code></pre>");
  return out.join("\n");
}

function escapeInline(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/`([^`]+)`/g, "<code class=\"mono\">$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
    );
}

export default function CaseStudyPage() {
  const md = readFileSync(join(process.cwd(), "docs", "CASESTUDY.md"), "utf8");
  // Strip YAML frontmatter if present
  const body = md.replace(/^---[\s\S]*?---\n/, "");
  const html = renderSimpleMarkdown(body);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className="casestudy-page">
        <article
          className="section container narrow casestudy-prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
      <SiteFooter />
    </>
  );
}
