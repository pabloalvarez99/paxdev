import type { AiSystem } from "@/content/portfolio";

type SystemMapProps = {
  systems: AiSystem[];
};

export function SystemMap({ systems }: SystemMapProps) {
  return (
    <div
      className="system-map"
      role="img"
      aria-label="Five-layer AI engineering roadmap: production RAG and agentic research are active, followed by multi-agent orchestration, repository intelligence, and an AI platform."
    >
      <div className="map-toolbar" aria-hidden="true">
        <span>SYSTEM MAP / 2026</span>
        <span className="map-toolbar-status">
          <i /> 02 ACTIVE
        </span>
      </div>

      <div className="map-canvas" aria-hidden="true">
        <svg className="map-lines" viewBox="0 0 620 380" preserveAspectRatio="none">
          <path d="M72 320 C145 320 125 256 198 256 S255 193 326 193 S385 130 458 130 S500 68 558 68" />
          <path className="map-line-glow" d="M72 320 C145 320 125 256 198 256" />
          <circle cx="72" cy="320" r="4" />
          <circle cx="198" cy="256" r="4" />
          <circle cx="326" cy="193" r="4" />
          <circle cx="458" cy="130" r="4" />
          <circle cx="558" cy="68" r="4" />
        </svg>

        {systems.map((system, index) => (
          <div
            className={`map-node map-node-${index + 1} ${system.statusTone}`}
            key={system.slug}
          >
            <span className="map-node-number">{system.number}</span>
            <span className="map-node-label">{system.name}</span>
            <span className="map-node-state">{system.status}</span>
          </div>
        ))}

        <div className="map-orbit map-orbit-one" />
        <div className="map-orbit map-orbit-two" />
      </div>

      <div className="map-footer" aria-hidden="true">
        <span>RETRIEVE</span>
        <span>ACT</span>
        <span>COORDINATE</span>
        <span>UNDERSTAND</span>
        <span>OPERATE</span>
      </div>
    </div>
  );
}
