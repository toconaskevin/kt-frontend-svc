import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Squircle-ish radius (~iOS app icon proportion). */
const RADIUS = "22%";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #ffffff 0%, #f2f2f7 45%, #e5e5ea 100%)",
          borderRadius: RADIUS,
          border: "1px solid rgba(60, 60, 67, 0.12)",
        }}
      >
        <span
          style={{
            fontSize: 104,
            fontWeight: 600,
            color: "#1d1d1f",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
            letterSpacing: -4,
          }}
        >
          K
        </span>
      </div>
    ),
    { ...size }
  );
}
