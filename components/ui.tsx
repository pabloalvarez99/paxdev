import { ArrowUpRightIcon } from "@/components/icons";

export function Status({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <span className={`status status-${tone}`}>{children}</span>;
}

export function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
      <ArrowUpRightIcon />
    </a>
  );
}
