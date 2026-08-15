import portfolio from "@/content/portfolio";

const poster = portfolio.architecturePoster;

/** Exact-type SVG poster: five roles, HOSTED vs CLONE chips, no image-model text. */
export function ArchitecturePoster() {
  const rowHeight = 72;
  const top = 88;
  const width = 960;
  const height = top + poster.layers.length * rowHeight + 72;

  return (
    <div className="poster" role="img" aria-label={poster.subtitle}>
      <svg viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
        <rect width={width} height={height} fill="#F7F4ED" />
        <text
          x="40"
          y="40"
          fill="#6B6760"
          fontFamily="Consolas, 'SFMono-Regular', monospace"
          fontSize="13"
          letterSpacing="2"
        >
          Five-system ladder
        </text>
        <text
          x="40"
          y="68"
          fill="#0B0B0A"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="28"
          fontWeight="500"
        >
          {poster.title}
        </text>

        {poster.layers.map((layer, index) => {
          const y = top + index * rowHeight;
          return (
            <g key={layer.number}>
              <line
                x1="40"
                x2={width - 40}
                y1={y}
                y2={y}
                stroke="#D8D2C6"
                strokeWidth="1"
              />
              <text
                x="40"
                y={y + 32}
                fill="#6B6760"
                fontFamily="Consolas, 'SFMono-Regular', monospace"
                fontSize="20"
                fontWeight="500"
              >
                {layer.number}
              </text>
              <text
                x="96"
                y={y + 24}
                fill="#0B0B0A"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize="20"
                fontWeight="500"
              >
                {layer.name}
              </text>
              <text
                x="96"
                y={y + 48}
                fill="#6B6760"
                fontFamily="system-ui, sans-serif"
                fontSize="13"
              >
                {layer.role} · {layer.oneLiner}
              </text>
              <rect
                x={width - 150}
                y={y + 18}
                width="110"
                height="28"
                fill="#F7F4ED"
                stroke="#1A1916"
                strokeWidth="1"
              />
              <text
                x={width - 95}
                y={y + 37}
                textAnchor="middle"
                fill="#1A1916"
                fontFamily="Consolas, 'SFMono-Regular', monospace"
                fontSize="12"
                letterSpacing="1"
              >
                {layer.chip}
              </text>
            </g>
          );
        })}

        <text
          x="40"
          y={height - 24}
          fill="#6B6760"
          fontFamily="system-ui, sans-serif"
          fontSize="12"
        >
          {poster.footer}
        </text>
      </svg>
    </div>
  );
}
