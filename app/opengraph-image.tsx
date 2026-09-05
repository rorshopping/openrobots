import { ImageResponse } from "next/og";

import { SITE_NAME, SITE_TAGLINE } from "@/lib/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "OpenRobots — Decide how AI sees your site. Free, open source, 100% in-browser.";

// Renders at build time with NO network access:
// - default bundled font only (no custom font loading — it breaks offline builds)
// - the robot mark is drawn with plain divs instead of the 🤖 emoji, because
//   satori fetches emoji images from a CDN at render time (offline = build error)
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
          backgroundImage:
            "linear-gradient(135deg, #059669 0%, #065f46 55%, #064e3b 100%)",
        }}
      >
        {/* Robot glyph (same design as public/icon.svg), drawn with divs */}
        <div
          style={{
            display: "flex",
            position: "relative",
            width: 192,
            height: 188,
            marginBottom: 40,
          }}
        >
          {/* antenna ball */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              left: 87,
              top: 0,
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: "#ffffff",
            }}
          />
          {/* antenna stem */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              left: 92,
              top: 16,
              width: 8,
              height: 21,
              borderRadius: 4,
              backgroundColor: "#ffffff",
            }}
          />
          {/* left ear */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              left: -21,
              top: 82,
              width: 21,
              height: 48,
              borderRadius: 11,
              backgroundColor: "#ffffff",
            }}
          />
          {/* right ear */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              left: 192,
              top: 82,
              width: 21,
              height: 48,
              borderRadius: 11,
              backgroundColor: "#ffffff",
            }}
          />
          {/* head */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              left: 0,
              top: 36,
              width: 192,
              height: 152,
              borderRadius: 35,
              backgroundColor: "#ffffff",
            }}
          />
          {/* left eye */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              left: 40,
              top: 85,
              width: 36,
              height: 54,
              borderRadius: 18,
              backgroundColor: "#059669",
            }}
          />
          {/* right eye */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              left: 116,
              top: 85,
              width: 36,
              height: 54,
              borderRadius: 18,
              backgroundColor: "#059669",
            }}
          />
          {/* mouth */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              left: 54,
              top: 148,
              width: 84,
              height: 16,
              borderRadius: 8,
              backgroundColor: "#059669",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          {SITE_NAME}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 42,
            color: "#d1fae5",
            marginTop: 22,
          }}
        >
          {SITE_TAGLINE}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#a7f3d0",
            marginTop: 16,
            letterSpacing: 1,
          }}
        >
          Free · Open source · 100% in-browser
        </div>
      </div>
    ),
    size
  );
}
