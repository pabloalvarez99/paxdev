import { ImageResponse } from "next/og";

export const alt = "Pablo Alvarez — AI Systems & Product Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#07110f",
        color: "#f5f4e8",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: "58px 64px",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          border: "1px solid rgba(101, 246, 209, .28)",
          bottom: 28,
          display: "flex",
          left: 28,
          position: "absolute",
          right: 28,
          top: 28,
        }}
      />
      <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
        <div style={{ alignItems: "center", display: "flex", gap: 18 }}>
          <div
            style={{
              alignItems: "center",
              border: "1px solid #65f6d1",
              color: "#65f6d1",
              display: "flex",
              fontSize: 22,
              fontWeight: 700,
              height: 54,
              justifyContent: "center",
              width: 64,
            }}
          >
            P/A
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: 2 }}>PAX / DEV</span>
            <span style={{ color: "#8faaa3", fontSize: 15, letterSpacing: 4 }}>AI SYSTEMS</span>
          </div>
        </div>
        <span style={{ color: "#65f6d1", fontSize: 17, letterSpacing: 3 }}>CHILE · 2026</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 970 }}>
        <span style={{ color: "#65f6d1", fontSize: 20, letterSpacing: 4 }}>
          PABLO ALVAREZ · AI SYSTEMS & PRODUCT ENGINEER
        </span>
        <span style={{ fontSize: 76, fontWeight: 650, letterSpacing: -4, lineHeight: 1.02 }}>
          AI systems that show their work.
        </span>
        <span style={{ color: "#a9bbb5", fontSize: 27, lineHeight: 1.35 }}>
          Grounded retrieval · bounded agents · measurable behavior · honest scope
        </span>
      </div>

      <div style={{ alignItems: "center", display: "flex", gap: 20 }}>
        {["RETRIEVE", "ACT", "COORDINATE", "UNDERSTAND", "OPERATE"].map((item, index) => (
          <div key={item} style={{ alignItems: "center", display: "flex", gap: 11 }}>
            <span
              style={{
                background: index < 2 ? "#65f6d1" : "transparent",
                border: "2px solid #65f6d1",
                borderRadius: 999,
                display: "flex",
                height: 12,
                width: 12,
              }}
            />
            <span style={{ color: index < 2 ? "#f5f4e8" : "#789089", fontSize: 14, letterSpacing: 2 }}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>,
    size,
  );
}
