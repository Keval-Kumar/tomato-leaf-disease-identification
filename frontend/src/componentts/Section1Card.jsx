/**
 * Section1Card.jsx
 *
 * Drop this component anywhere in your project.
 * It renders the "Tomato Cultivation Guide" card shown in the screenshot.
 *
 * Usage:
 *   import Section1Card from "./Section1Card";
 *   <Section1Card onOpen={() => navigate("/tomato-guide")} />
 *
 * If you're using React Router, pass:
 *   import { useNavigate } from "react-router-dom";
 *   const navigate = useNavigate();
 *   <Section1Card onOpen={() => navigate("/tomato-guide")} />
 */

import { useState } from "react";

const TomatoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="15" r="7" fill="white" opacity="0.9" />
    <path d="M9 9C9 7 10.5 5.5 12 5.5C13.5 5.5 15 7 15 9" stroke="white" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    <path d="M12 5.5 L12 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M12 3 C12 3 9.5 1.5 8 2.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
  </svg>
);

const tags = ["Planting stages", "Soil & irrigation", "Seasonal care"];

export default function Section1Card({ onOpen }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 0,
        background: "#f4f1eb",
        borderRadius: 28,
        overflow: "hidden",
        maxWidth: 900,
        width: "100%",
        boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
        fontFamily: "'Georgia', serif",
      }}
    >
      {/* ── LEFT: Card preview (like the screenshot's left card) ── */}
      <div
        style={{
          background: "white",
          padding: "28px 28px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          borderRight: "1px solid #ece9e3",
        }}
      >
        {/* Top row: icon + section badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "#2d5016",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TomatoIcon />
          </div>
          <span
            style={{
              background: "#f4f1eb",
              borderRadius: 999,
              padding: "5px 14px",
              fontSize: 12,
              fontWeight: 600,
              color: "#6b6b68",
              fontFamily: "sans-serif",
              letterSpacing: 0.3,
            }}
          >
            Section 1
          </span>
        </div>

        {/* Skeleton text lines */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ height: 10, borderRadius: 6, background: "#e8e5df", width: "78%" }} />
          <div style={{ height: 10, borderRadius: 6, background: "#e8e5df", width: "92%" }} />
          <div style={{ height: 10, borderRadius: 6, background: "#e8e5df", width: "65%" }} />
        </div>

        {/* Tag pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                background: "#f4f1eb",
                border: "1px solid #e0dcd4",
                borderRadius: 999,
                padding: "5px 12px",
                fontSize: 12,
                color: "#4a4a47",
                fontFamily: "sans-serif",
                fontWeight: 500,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Illustration placeholder box */}
        <div
          style={{
            border: "1.5px dashed #d6d2ca",
            borderRadius: 14,
            padding: "24px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#faf9f6",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🍅</div>
            <span style={{ fontSize: 12, color: "#b0ada6", fontFamily: "sans-serif", lineHeight: 1.5 }}>
              Parallax illustration placeholder<br />with 3D-ready composition.
            </span>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Description + CTA ── */}
      <div
        style={{
          padding: "40px 40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {/* Path badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 14 }}>🌿</span>
          <span style={{ fontSize: 13, color: "#e53935", fontFamily: "sans-serif", fontWeight: 600 }}>
            tomato-cultivation
          </span>
        </div>

        {/* Heading */}
        <h2
          style={{
            fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
            fontWeight: 900,
            color: "#1b3a0f",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Tomato Cultivation Guide
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: 15.5,
            color: "#5a5a57",
            lineHeight: 1.75,
            margin: 0,
            fontFamily: "sans-serif",
            fontWeight: 400,
          }}
        >
          A practical growth companion with seasonal guidance, field-ready tips,
          and visual planting support for healthier harvests.
        </p>

        {/* Tag pills (right side — outlined style) */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                border: "1.5px solid #d6d2ca",
                borderRadius: 999,
                padding: "5px 14px",
                fontSize: 13,
                color: "#6b6b68",
                fontFamily: "sans-serif",
                background: "transparent",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Open page button */}
        <button
          onClick={onOpen}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: hovered ? "#1a4010" : "#2d5016",
            color: "white",
            border: "none",
            borderRadius: 999,
            padding: "14px 28px",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "sans-serif",
            cursor: "pointer",
            alignSelf: "flex-start",
            transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
            transform: hovered ? "translateY(-2px)" : "none",
            boxShadow: hovered ? "0 8px 24px rgba(45,80,22,0.35)" : "0 4px 12px rgba(45,80,22,0.2)",
            letterSpacing: 0.3,
          }}
        >
          Open page
          <span style={{ fontSize: 18, transition: "transform 0.2s", transform: hovered ? "translateX(4px)" : "none" }}>→</span>
        </button>
      </div>
    </div>
  );
}