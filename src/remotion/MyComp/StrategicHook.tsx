import { AbsoluteFill, useVideoConfig, useCurrentFrame, interpolate, spring } from "remotion";
import React from "react";

export const StrategicHook: React.FC<{
  text: string;
  subtext?: string;
  themeColor?: string;
}> = ({ text, subtext, themeColor = "#0070f3" }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  const textEntrance = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            transform: `scale(${entrance})`,
            opacity: entrance,
            background: "rgba(0, 0, 0, 0.85)",
            padding: "60px 40px",
            borderRadius: "40px",
            border: `2px solid ${themeColor}44`,
            boxShadow: `0 20px 80px rgba(0,0,0,0.5), 0 0 40px ${themeColor}22`,
            width: "100%",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: "72px",
              fontWeight: "900",
              margin: 0,
              lineHeight: 1.1,
              fontFamily: "Outfit, sans-serif",
            }}
          >
            {text.toUpperCase()}
          </h1>
          {subtext && (
            <p
              style={{
                color: themeColor,
                fontSize: "32px",
                marginTop: "20px",
                fontWeight: "700",
                opacity: textEntrance,
                transform: `translateY(${interpolate(textEntrance, [0, 1], [20, 0])}px)`,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {subtext}
            </p>
          )}
        </div>
      </div>

      {/* Kwai Progress Bar */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "40px",
          right: "40px",
          height: "12px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(frame / 150) * 100}%`,
            background: `linear-gradient(90deg, ${themeColor}, white)`,
            boxShadow: `0 0 20px ${themeColor}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
