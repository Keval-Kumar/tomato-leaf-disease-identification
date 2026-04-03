import { useEffect, useRef, useState } from "react";

const stages = [
  {
    id: 0,
    emoji: "🌱",
    title: "Seed Selection",
    subtitle: "Choosing the right variety",
    color: "#2D5016",
    lightColor: "#f0f7e6",
    accentColor: "#5a8a2a",
    tips: [
      "Choose disease-resistant varieties like Roma, Cherry, or Beefsteak",
      "Check seed expiry date — fresh seeds germinate better",
      "Hybrid seeds offer uniformity; heirlooms offer flavour",
      "Buy from certified suppliers for best germination rates (85%+)",
    ],
    detail:
      "The foundation of a great harvest starts with quality seeds. Look for seeds with high germination rates, resistance to common tomato diseases like blight and wilt, and varieties suited to your local climate. In India, popular choices include Pusa Ruby, Arka Vikas, and CO-3.",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 52, height: 52 }}>
        <ellipse cx="30" cy="38" rx="16" ry="10" fill="#c8e6a0" stroke="#5a8a2a" strokeWidth="1.5" />
        <path d="M30 38 C30 25 20 15 14 10" stroke="#5a8a2a" strokeWidth="2" strokeLinecap="round" />
        <path d="M30 38 C30 25 40 15 46 10" stroke="#5a8a2a" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="14" cy="9" rx="5" ry="3" fill="#8bc34a" opacity="0.8" />
        <ellipse cx="46" cy="9" rx="5" ry="3" fill="#8bc34a" opacity="0.8" />
        <ellipse cx="30" cy="22" rx="4" ry="2.5" fill="#aed581" opacity="0.9" />
      </svg>
    ),
  },
  {
    id: 1,
    emoji: "🪴",
    title: "Nursery & Germination",
    subtitle: "Sprouting your seedlings",
    color: "#1a6b3a",
    lightColor: "#e8f5e9",
    accentColor: "#2e7d32",
    tips: [
      "Sow seeds 5–6 weeks before transplanting",
      "Keep soil moist but not waterlogged",
      "Ideal germination temperature: 21–27°C",
      "Seeds sprout in 5–10 days under proper conditions",
    ],
    detail:
      "Fill trays with well-drained potting mix. Sow seeds 6mm deep. Cover lightly and mist with water. Place in a warm, bright spot. Maintain moisture by covering with plastic wrap until sprouts emerge. Once seedlings have 2 true leaves, they're ready for individual pots.",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 52, height: 52 }}>
        <rect x="18" y="36" width="24" height="16" rx="4" fill="#c8a96e" stroke="#a07840" strokeWidth="1.2" />
        <path d="M30 36 C30 26 22 20 18 14" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="17" cy="13" rx="6" ry="4" fill="#81c784" />
        <path d="M30 30 C30 24 36 20 40 16" stroke="#66bb6a" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="41" cy="15" rx="5" ry="3" fill="#a5d6a7" />
        <circle cx="30" cy="36" r="2" fill="#6d4c41" />
      </svg>
    ),
  },
  {
    id: 2,
    emoji: "🌍",
    title: "Soil Preparation",
    subtitle: "Building healthy ground",
    color: "#5d4037",
    lightColor: "#efebe9",
    accentColor: "#795548",
    tips: [
      "pH should be between 6.0–6.8 for tomatoes",
      "Add compost or well-rotted manure before planting",
      "Ensure well-drained, loamy soil",
      "Deep ploughing (30cm) helps root development",
    ],
    detail:
      "Tomatoes thrive in rich, loamy soil. Test your soil pH and adjust with lime (to raise) or sulphur (to lower). Mix in organic matter: compost, vermicompost, or farmyard manure at 10–15 tonnes/hectare. Raised beds improve drainage and warm up faster in cooler months.",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 52, height: 52 }}>
        <ellipse cx="30" cy="42" rx="22" ry="8" fill="#8d6e63" stroke="#6d4c41" strokeWidth="1.2" />
        <path d="M8 42 Q30 28 52 42" fill="#a1887f" />
        <path d="M12 40 Q30 32 48 40" fill="#bcaaa4" />
        <circle cx="20" cy="38" r="2" fill="#6d4c41" opacity="0.6" />
        <circle cx="35" cy="36" r="1.5" fill="#6d4c41" opacity="0.5" />
        <circle cx="28" cy="40" r="1.2" fill="#4e342e" opacity="0.5" />
        <path d="M30 34 C30 28 34 22 36 18" stroke="#4caf50" strokeWidth="1.8" strokeLinecap="round" />
        <ellipse cx="37" cy="17" rx="5" ry="3" fill="#66bb6a" />
      </svg>
    ),
  },
  {
    id: 3,
    emoji: "🌿",
    title: "Transplanting",
    subtitle: "Moving to the field",
    color: "#2e7d32",
    lightColor: "#e8f5e9",
    accentColor: "#388e3c",
    tips: [
      "Transplant seedlings 25–30 days after sowing",
      "Maintain spacing: 45–60 cm between plants",
      "Water immediately after transplanting",
      "Transplant in evening to reduce transplant shock",
    ],
    detail:
      "When seedlings are 15–20 cm tall with 4–6 leaves, they're ready to transplant. Dig holes slightly deeper than the root ball. Plant deep — tomatoes form roots along buried stems, making plants stronger. Water well and provide shade for 2–3 days to reduce wilting stress.",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 52, height: 52 }}>
        <ellipse cx="30" cy="50" rx="20" ry="5" fill="#8d6e63" opacity="0.5" />
        <path d="M30 50 L30 28" stroke="#5d4037" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="22" cy="36" rx="8" ry="5" fill="#81c784" transform="rotate(-20 22 36)" />
        <ellipse cx="38" cy="34" rx="8" ry="5" fill="#66bb6a" transform="rotate(20 38 34)" />
        <ellipse cx="30" cy="28" rx="7" ry="4" fill="#4caf50" />
        <path d="M20 50 C22 44 26 44 30 50" stroke="#a1887f" strokeWidth="1.5" fill="none" />
        <path d="M40 50 C38 44 34 44 30 50" stroke="#a1887f" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },
  {
    id: 4,
    emoji: "💧",
    title: "Irrigation & Care",
    subtitle: "Watering and feeding",
    color: "#0277bd",
    lightColor: "#e1f5fe",
    accentColor: "#0288d1",
    tips: [
      "Water deeply 2–3 times per week in dry weather",
      "Drip irrigation saves water and reduces disease",
      "Fertilise with NPK 19:19:19 every 2 weeks",
      "Avoid wetting leaves — causes fungal diseases",
    ],
    detail:
      "Tomatoes need consistent moisture — irregular watering causes blossom end rot and cracking. Use drip irrigation for best results. Apply balanced fertiliser (NPK) at planting, then switch to low-nitrogen, high-potassium feed once flowers appear. Mulching conserves moisture and suppresses weeds.",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 52, height: 52 }}>
        <path d="M30 10 C30 10 16 26 16 36 C16 44 22 50 30 50 C38 50 44 44 44 36 C44 26 30 10 30 10Z" fill="#81d4fa" stroke="#0288d1" strokeWidth="1.5" />
        <path d="M24 38 C24 34 28 32 30 32" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <path d="M36 22 L40 14" stroke="#29b6f6" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <path d="M20 18 L16 12" stroke="#29b6f6" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <path d="M44 30 L50 28" stroke="#29b6f6" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 5,
    emoji: "🛡️",
    title: "Pest & Disease Control",
    subtitle: "Protecting your crop",
    color: "#e65100",
    lightColor: "#fff3e0",
    accentColor: "#f57c00",
    tips: [
      "Watch for early blight — remove affected leaves immediately",
      "Use neem oil spray every 10 days as preventive",
      "Set yellow sticky traps for whitefly and aphids",
      "Spray copper fungicide for bacterial leaf spot",
    ],
    detail:
      "Common tomato threats include early blight, late blight, fusarium wilt, aphids, whiteflies, and fruit borers. Integrated Pest Management (IPM) combines cultural, biological, and chemical controls. Inspect plants twice weekly. Remove and destroy diseased plant material. Never compost infected parts.",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 52, height: 52 }}>
        <path d="M30 8 L46 16 L46 34 C46 44 38 50 30 52 C22 50 14 44 14 34 L14 16 Z" fill="#ffcc80" stroke="#f57c00" strokeWidth="1.5" />
        <path d="M22 30 L28 36 L40 24" stroke="#2e7d32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 6,
    emoji: "🍅",
    title: "Harvesting",
    subtitle: "Picking at peak ripeness",
    color: "#c62828",
    lightColor: "#ffebee",
    accentColor: "#e53935",
    tips: [
      "Harvest when fruit is fully coloured and slightly soft",
      "Twist and pull gently — or use clean scissors",
      "Harvest every 2–3 days once fruiting begins",
      "Pick before heavy rains to avoid splitting",
    ],
    detail:
      "Tomatoes are ready 60–85 days after transplanting depending on variety. Harvest when fruits reach full colour (red, yellow, or orange depending on variety) and give slightly to gentle pressure. Morning harvesting, when temperatures are cool, extends shelf life. Handle fruit carefully to prevent bruising.",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 52, height: 52 }}>
        <circle cx="30" cy="36" r="18" fill="#f44336" stroke="#c62828" strokeWidth="1.5" />
        <path d="M24 20 C26 14 34 14 36 20" fill="#4caf50" />
        <path d="M30 18 L30 10" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" />
        <path d="M30 10 C30 10 26 6 22 8" stroke="#4caf50" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <ellipse cx="24" cy="32" rx="4" ry="6" fill="#ef9a9a" opacity="0.4" />
        <path d="M22 38 Q30 46 38 38" stroke="#c62828" strokeWidth="1" fill="none" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: 7,
    emoji: "💰",
    title: "Market & Pricing",
    subtitle: "Selling for the best price",
    color: "#1565c0",
    lightColor: "#e3f2fd",
    accentColor: "#1976d2",
    tips: [
      "Grade tomatoes by size and quality before selling",
      "Local mandis, APMCs, and e-NAM for price discovery",
      "Cold storage can extend shelf life by 2–3 weeks",
      "Direct-to-consumer (farm gates, markets) gives better margins",
    ],
    detail:
      "After harvest, sort tomatoes into grades: Grade A (large, uniform, blemish-free) fetches premium prices. Proper packaging in crates reduces damage during transport. Check daily mandi prices via e-NAM or Agmarknet. Consider farmer producer organisations (FPOs) for collective bargaining power and better margins.",
    icon: (
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 52, height: 52 }}>
        <rect x="10" y="28" width="40" height="24" rx="4" fill="#bbdefb" stroke="#1976d2" strokeWidth="1.5" />
        <path d="M18 28 L18 22 C18 16 42 16 42 22 L42 28" fill="#e3f2fd" stroke="#1976d2" strokeWidth="1.5" />
        <circle cx="30" cy="40" r="8" fill="#1976d2" />
        <text x="30" y="44" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">₹</text>
        <circle cx="18" cy="20" r="2.5" fill="#f44336" />
        <circle cx="42" cy="20" r="2.5" fill="#f44336" />
      </svg>
    ),
  },
];

const ParticleField = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;
    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 3 + 1,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      color: ["#c8e6a0", "#a5d6a7", "#f9a825", "#ef9a9a"][Math.floor(Math.random() * 4)],
    }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
};

const StageCard = ({ stage, isActive, onClick, index, total }) => {
  const pct = (index / (total - 1)) * 100;
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        minWidth: 80,
        transition: "transform 0.25s ease",
        transform: isActive ? "translateY(-6px) scale(1.08)" : "none",
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: "50%",
          background: isActive ? stage.color : "#f0f0f0",
          border: isActive ? `3px solid ${stage.accentColor}` : "2px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          boxShadow: isActive ? `0 6px 20px ${stage.color}55` : "none",
          transition: "all 0.3s ease",
        }}
      >
        {stage.emoji}
      </div>
      <span
        style={{
          fontSize: 10,
          fontWeight: isActive ? 700 : 400,
          color: isActive ? stage.color : "#9e9e9e",
          textAlign: "center",
          maxWidth: 72,
          lineHeight: 1.2,
          transition: "color 0.3s",
        }}
      >
        {stage.title}
      </span>
    </div>
  );
};

export default function TomatoGuide() {
  const [activeStage, setActiveStage] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const stage = stages[activeStage];

  const goTo = (i) => {
    setActiveStage(i);
    setAnimKey((k) => k + 1);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #f9f6f0 0%, #eef5e8 50%, #f5f0eb 100%)",
        fontFamily: "'Georgia', 'Palatino', serif",
        overflowX: "hidden",
      }}
    >
      {/* ─── HERO ─── */}
      <header
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #1b3a0f 0%, #2d5016 60%, #1a4a2e 100%)",
          padding: "64px 24px 80px",
          textAlign: "center",
        }}
      >
        <ParticleField />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 12, letterSpacing: 4, color: "#a5d6a7", textTransform: "uppercase", marginBottom: 12, fontFamily: "sans-serif" }}>
            🌿 /tomato-cultivation
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 6vw, 3.8rem)",
              fontWeight: 900,
              color: "#ffffff",
              margin: "0 0 16px",
              lineHeight: 1.1,
              textShadow: "0 4px 24px rgba(0,0,0,0.3)",
            }}
          >
            Tomato Cultivation
            <br />
            <span style={{ color: "#f9a825" }}>Complete Guide</span>
          </h1>
          <p
            style={{
              fontSize: 17,
              color: "#c8e6a0",
              maxWidth: 520,
              margin: "0 auto 32px",
              lineHeight: 1.7,
              fontFamily: "sans-serif",
              fontWeight: 400,
            }}
          >
            From seed selection to market — a farmer's complete journey to a healthier, more profitable harvest.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            {["Planting stages", "Soil & irrigation", "Seasonal care", "Market pricing"].map((tag) => (
              <span
                key={tag}
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 999,
                  padding: "6px 16px",
                  fontSize: 13,
                  color: "#e8f5e9",
                  fontFamily: "sans-serif",
                  backdropFilter: "blur(8px)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        {/* wave */}
        <svg viewBox="0 0 1440 60" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", display: "block" }} preserveAspectRatio="none">
          <path d="M0 60 Q360 0 720 40 Q1080 80 1440 20 L1440 60 Z" fill="#f9f6f0" />
        </svg>
      </header>

      {/* ─── JOURNEY STEPPER ─── */}
      <section style={{ padding: "40px 16px 0", maxWidth: 960, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 13, letterSpacing: 3, color: "#9e9e9e", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 28 }}>
          The Growing Journey
        </h2>
        <div style={{ overflowX: "auto", paddingBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 0, position: "relative", minWidth: 640 }}>
            {/* progress line */}
            <div
              style={{
                position: "absolute",
                top: 26,
                left: 40,
                right: 40,
                height: 3,
                background: "#e0e0e0",
                borderRadius: 4,
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 26,
                left: 40,
                width: `${(activeStage / (stages.length - 1)) * (100 - (80 / (stages.length * 80 + (stages.length - 1) * 8)) * 100)}%`,
                height: 3,
                background: `linear-gradient(90deg, #2d5016, ${stage.accentColor})`,
                borderRadius: 4,
                zIndex: 1,
                transition: "width 0.5s ease",
              }}
            />
            {stages.map((s, i) => (
              <div key={s.id} style={{ flex: 1, zIndex: 2, display: "flex", justifyContent: "center" }}>
                <StageCard stage={s} isActive={activeStage === i} onClick={() => goTo(i)} index={i} total={stages.length} />
              </div>
            ))}
          </div>
        </div>

        {/* navigation arrows */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 24 }}>
          <button
            onClick={() => goTo(Math.max(0, activeStage - 1))}
            disabled={activeStage === 0}
            style={{
              background: activeStage === 0 ? "#f0f0f0" : stage.color,
              color: activeStage === 0 ? "#bdbdbd" : "white",
              border: "none",
              borderRadius: 999,
              padding: "10px 24px",
              fontSize: 14,
              cursor: activeStage === 0 ? "not-allowed" : "pointer",
              fontFamily: "sans-serif",
              fontWeight: 600,
              transition: "all 0.2s",
            }}
          >
            ← Previous
          </button>
          <button
            onClick={() => goTo(Math.min(stages.length - 1, activeStage + 1))}
            disabled={activeStage === stages.length - 1}
            style={{
              background: activeStage === stages.length - 1 ? "#f0f0f0" : stage.color,
              color: activeStage === stages.length - 1 ? "#bdbdbd" : "white",
              border: "none",
              borderRadius: 999,
              padding: "10px 24px",
              fontSize: 14,
              cursor: activeStage === stages.length - 1 ? "not-allowed" : "pointer",
              fontFamily: "sans-serif",
              fontWeight: 600,
              transition: "all 0.2s",
            }}
          >
            Next →
          </button>
        </div>
      </section>

      {/* ─── ACTIVE STAGE DETAIL ─── */}
      <section style={{ padding: "40px 16px 60px", maxWidth: 960, margin: "0 auto" }}>
        <div
          key={animKey}
          style={{
            background: "white",
            borderRadius: 28,
            overflow: "hidden",
            boxShadow: `0 20px 60px ${stage.color}22, 0 4px 16px rgba(0,0,0,0.06)`,
            animation: "slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          <style>{`
            @keyframes slideUp { from { opacity:0; transform:translateY(32px) scale(0.97); } to { opacity:1; transform:none; } }
            @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
            @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
          `}</style>
          {/* Stage header */}
          <div
            style={{
              background: `linear-gradient(135deg, ${stage.color} 0%, ${stage.accentColor} 100%)`,
              padding: "40px 48px",
              display: "flex",
              alignItems: "center",
              gap: 32,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: 24,
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "float 3s ease-in-out infinite",
                flexShrink: 0,
              }}
            >
              {stage.icon}
            </div>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 3, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 6 }}>
                Stage {activeStage + 1} of {stages.length}
              </div>
              <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 900, color: "white", margin: "0 0 6px", lineHeight: 1.2 }}>
                {stage.title}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.8)", margin: 0, fontSize: 15, fontFamily: "sans-serif" }}>{stage.subtitle}</p>
            </div>
          </div>

          {/* Stage body */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            {/* Detail text */}
            <div style={{ padding: "36px 40px", borderRight: "1px solid #f0f0f0" }}>
              <h3 style={{ fontSize: 13, letterSpacing: 2, color: "#9e9e9e", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 14 }}>
                About This Stage
              </h3>
              <p style={{ fontSize: 16, color: "#3d3d3a", lineHeight: 1.85, margin: 0 }}>{stage.detail}</p>
            </div>
            {/* Tips */}
            <div style={{ padding: "36px 40px", background: stage.lightColor }}>
              <h3 style={{ fontSize: 13, letterSpacing: 2, color: stage.color, textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 16 }}>
                Key Tips
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {stage.tips.map((tip, i) => (
                  <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: stage.color,
                        color: "white",
                        fontSize: 11,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontFamily: "sans-serif",
                        marginTop: 1,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 14.5, color: "#4a4a47", lineHeight: 1.6, fontFamily: "sans-serif" }}>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ALL STAGES OVERVIEW (toggle) ─── */}
      <section style={{ padding: "0 16px 80px", maxWidth: 960, margin: "0 auto" }}>
        <button
          onClick={() => setShowAll((v) => !v)}
          style={{
            display: "block",
            margin: "0 auto 32px",
            background: "transparent",
            border: `2px solid ${stage.color}`,
            borderRadius: 999,
            padding: "10px 28px",
            color: stage.color,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "sans-serif",
            transition: "all 0.2s",
          }}
        >
          {showAll ? "Hide" : "View"} Full Journey Overview ↕
        </button>

        {showAll && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16,
              animation: "fadeIn 0.4s ease both",
            }}
          >
            {stages.map((s, i) => (
              <div
                key={s.id}
                onClick={() => { goTo(i); setShowAll(false); window.scrollTo({ top: 300, behavior: "smooth" }); }}
                style={{
                  background: "white",
                  borderRadius: 18,
                  padding: 20,
                  cursor: "pointer",
                  border: `2px solid ${activeStage === i ? s.accentColor : "transparent"}`,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${s.color}33`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: s.color, fontFamily: "sans-serif", marginBottom: 2 }}>Stage {i + 1}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#2d2d2a" }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "#9e9e9e", fontFamily: "sans-serif", marginTop: 4 }}>{s.subtitle}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        style={{
          background: "#1b3a0f",
          padding: "40px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 10 }}>🍅</div>
        <p style={{ color: "#a5d6a7", fontFamily: "sans-serif", fontSize: 14, margin: 0 }}>
          Tomato Cultivation Guide · Built for Indian farmers · Happy growing!
        </p>
      </footer>
    </div>
  );
}