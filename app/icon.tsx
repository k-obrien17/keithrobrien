import { ImageResponse } from "next/og";

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#b9512a",
          color: "#ffffff",
          fontSize: 34,
          fontWeight: 600,
          fontFamily: "monospace",
        }}
      >
        K
      </div>
    ),
    { ...size }
  );
}
