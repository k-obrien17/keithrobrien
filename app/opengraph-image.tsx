import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#ffffff",
          padding: "80px",
        }}
      >
        <div style={{ fontSize: 80, color: "#15140f", fontFamily: "monospace", fontWeight: 600 }}>
          Keith O&apos;Brien
        </div>
        <div style={{ fontSize: 36, color: "#b9512a", marginTop: 16, fontFamily: "monospace" }}>
          Content strategist · Big idea tinkerer · Chill dude
        </div>
      </div>
    ),
    { ...size }
  );
}
