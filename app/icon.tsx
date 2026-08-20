import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Matches the "SD" mark in SiteHeader — generated at build time so there's
// no separate image asset to keep in sync with the header logo.
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
          background: "#0a0a0a",
          borderRadius: 7,
          color: "#fff",
          fontSize: 15,
          fontWeight: 700,
          fontFamily: "sans-serif",
          letterSpacing: -0.5,
        }}
      >
        SD
      </div>
    ),
    size,
  );
}
