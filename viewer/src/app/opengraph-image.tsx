import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          background: "linear-gradient(135deg, #6b5cff 0%, #06b6d4 100%)",
          color: "white",
          fontSize: 64,
        }}
      >
        <div style={{ fontWeight: 700 }}>TweetCurator</div>
        <div style={{ fontSize: 28, opacity: 0.9, marginTop: 8 }}>
          Beautiful views of curated conversations
        </div>
      </div>
    ),
    { ...size }
  );
}

