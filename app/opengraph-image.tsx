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
          background: "#14120E",
          padding: "80px",
        }}
      >
        <div style={{ fontSize: 80, color: "#F5F1E8", fontFamily: "serif" }}>
          Keith R. O&apos;Brien
        </div>
        <div style={{ fontSize: 36, color: "#E8843C", marginTop: 16 }}>
          Ghostwriter · Builder · Writer
        </div>
      </div>
    ),
    { ...size }
  );
}
