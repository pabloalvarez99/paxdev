import { ImageResponse } from "next/og";

export const alt = "Pablo Alvarez — AI Systems & Product Engineer";
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
      <span style={{ fontSize: 28, letterSpacing: 1 }}>Pablo Alvarez</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 920 }}>
        <span style={{ fontSize: 72, letterSpacing: -2, lineHeight: 1.05 }}>
          AI systems that show their work.
        </span>
        <span style={{ color: "#6B6760", fontFamily: "Arial, sans-serif", fontSize: 26 }}>
          Four hosted systems. One clone-only flagship. Chile.
        </span>
      </div>
    </div>,
    size,
  );
}
