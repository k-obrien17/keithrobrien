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
          background: "#E8843C",
          color: "#14120E",
          fontSize: 34,
          fontWeight: 700,
          fontFamily: "serif",
        }}
      >
        K
      </div>
    ),
    { ...size }
  );
}
