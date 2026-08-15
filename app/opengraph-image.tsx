import { ImageResponse } from "next/og";

export const alt = "Pablo Figueroa — Ingeniero de IA y producto";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#F7F4ED",
        color: "#1A1916",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Georgia, 'Times New Roman', serif",
        height: "100%",
        justifyContent: "space-between",
        padding: "72px 80px",
        width: "100%",
      }}
    >
      <span style={{ fontSize: 28, letterSpacing: 1 }}>Pablo Figueroa</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 920 }}>
        <span style={{ fontSize: 64, letterSpacing: -2, lineHeight: 1.05 }}>
          Sistemas de IA que se pueden abrir y revisar.
        </span>
        <span style={{ color: "#6B6760", fontFamily: "Arial, sans-serif", fontSize: 26 }}>
          Cuatro publicados. Uno sólo para clonar. Chile.
        </span>
      </div>
    </div>,
    size,
  );
}
