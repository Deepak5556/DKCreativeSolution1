import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(247,165,0,0.25) 0%, rgba(5,5,5,0) 50%), radial-gradient(circle at 85% 80%, rgba(214,208,203,0.18) 0%, rgba(5,5,5,0) 50%)",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: "50%",
            border: "3px solid #F7A500",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 36,
            background: "#0a0a0a",
          }}
        >
          <span style={{ fontSize: 46, fontWeight: 700, color: "#F7A500", letterSpacing: -2 }}>
            DK
          </span>
        </div>

        <div
          style={{
            fontSize: 58,
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: -1.5,
            textAlign: "center",
            display: "flex",
          }}
        >
          {siteConfig.name}
        </div>

        <div
          style={{
            marginTop: 18,
            fontSize: 28,
            color: "#A3A3A3",
            textAlign: "center",
            maxWidth: 860,
            display: "flex",
          }}
        >
          {siteConfig.tagline}
        </div>

        <div
          style={{
            marginTop: 44,
            display: "flex",
            gap: 16,
          }}
        >
          {["Web Development", "Video Editing", "UI/UX Design", "Poster Design"].map(
            (label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  padding: "10px 22px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#FFB800",
                  fontSize: 18,
                }}
              >
                {label}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
