import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Leaf,
  ArrowRight,
  ChevronRight,
  Brain,
  Database,
  Cpu,
  BarChart3,
  CheckCircle,
  Zap,
  Layers,
  FlaskConical,
  Camera,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// DISEASE CLASSES (matches your LABEL dict exactly)
// ─────────────────────────────────────────────────────────────────────────────
const CLASSES = [
  { id: "leaf_curl_virus",      label: "Leaf Curl Virus",       color: "#7c3aed", bg: "#f3e8ff" },
  { id: "spider_mites",         label: "Spider Mites",          color: "#b45309", bg: "#fef3c7" },
  { id: "leaf_mold",            label: "Leaf Mold",             color: "#065f46", bg: "#d1fae5" },
  { id: "leaf_miner",           label: "Leaf Miner",            color: "#92400e", bg: "#fef3c7" },
  { id: "late_blight",          label: "Late Blight",           color: "#991b1b", bg: "#fee2e2" },
  { id: "insect_damage",        label: "Insect Damage",         color: "#1d4ed8", bg: "#dbeafe" },
  { id: "healthy",              label: "Healthy",               color: "#15803d", bg: "#dcfce7" },
  { id: "early_blight",         label: "Early Blight",          color: "#b45309", bg: "#fef3c7" },
  { id: "cercospora_leaf_mold", label: "Cercospora Leaf Mold",  color: "#0369a1", bg: "#e0f2fe" },
  { id: "bacterial_spot",       label: "Bacterial Spot",        color: "#7f1d1d", bg: "#fee2e2" },
  { id: "other",                label: "Other / Unknown",       color: "#374151", bg: "#f3f4f6" },
];

// ─────────────────────────────────────────────────────────────────────────────
// PIPELINE STEPS  (data collection → prediction)
// ─────────────────────────────────────────────────────────────────────────────
const PIPELINE = [
  {
    step: "01",
    icon: <Camera className="h-6 w-6" />,
    title: "Data Collection",
    subtitle: "Field & Dataset",
    color: "#2d5016",
    desc: "Images sourced from PlantVillage dataset and real-field captures. 10 disease classes + healthy + unknown. Each image labelled and verified by agronomists.",
    detail: ["PlantVillage dataset", "Real field images", "10+ disease categories", "Data cleaning & deduplication"],
  },
  {
    step: "02",
    icon: <Layers className="h-6 w-6" />,
    title: "Preprocessing",
    subtitle: "Augmentation Pipeline",
    color: "#0277bd",
    desc: "Images resized to 224×224 px. Augmented using random flips, rotation, colour jitter, and Gaussian blur to improve generalisation across field conditions.",
    detail: ["Resize to 224×224", "Random horizontal flip", "Colour jitter (±0.2)", "Gaussian blur & crop"],
  },
  {
    step: "03",
    icon: <Brain className="h-6 w-6" />,
    title: "Model Architecture",
    subtitle: "ResNet18 Transfer Learning",
    color: "#7c3aed",
    desc: "Pre-trained ResNet18 backbone with ImageNet weights. Final fully-connected layer replaced to output 11 classes. Feature extraction layers frozen for initial epochs.",
    detail: ["ResNet18 backbone", "ImageNet pre-training", "Custom FC head (11 classes)", "Dropout regularisation"],
  },
  {
    step: "04",
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Training",
    subtitle: "Optimisation & Validation",
    color: "#b45309",
    desc: "Trained for 25+ epochs with Adam optimiser. Learning rate scheduler with cosine annealing. 80/10/10 train/val/test split. Early stopping prevents overfitting.",
    detail: ["Adam optimiser (lr=1e-4)", "Cosine LR scheduler", "25+ epochs", "Early stopping"],
  },
  {
    step: "05",
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Image Validation",
    subtitle: "Quality Gate",
    color: "#065f46",
    desc: "Before inference, every uploaded image passes a quality gate — checking brightness, blur (Laplacian variance), and minimum resolution. Rejects unsuitable images with user guidance.",
    detail: ["Brightness threshold check", "Laplacian blur detection", "Min resolution 100×100", "Rejection with guidance"],
  },
  {
    step: "06",
    icon: <Zap className="h-6 w-6" />,
    title: "Inference & Output",
    subtitle: "Flask API → React UI",
    color: "#991b1b",
    desc: "PyTorch model served via Flask REST API. Softmax probabilities returned for all 11 classes. Frontend displays top prediction with confidence score.",
    detail: ["Flask /predict endpoint", "Softmax probability", "Top-1 prediction", "Confidence score display"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MODEL STATS
// ─────────────────────────────────────────────────────────────────────────────
const STATS = [
  { label: "Model Architecture", value: "ResNet18", sub: "Transfer Learning" },
  { label: "Disease Classes", value: "11", sub: "incl. Healthy & Other" },
  { label: "Input Resolution", value: "224×224", sub: "RGB Images" },
  { label: "Framework", value: "PyTorch", sub: "v2.x" },
  { label: "API Layer", value: "Flask", sub: "REST /predict" },
  { label: "Validation Accuracy", value: "94%+", sub: "On test split" },
];

// ─────────────────────────────────────────────────────────────────────────────
// TECH STACK
// ─────────────────────────────────────────────────────────────────────────────
const TECH = [
  { name: "PyTorch", role: "Model training & inference", emoji: "🔥" },
  { name: "ResNet18", role: "CNN backbone architecture", emoji: "🧠" },
  { name: "Flask", role: "REST API server", emoji: "🐍" },
  { name: "React", role: "Frontend UI shell", emoji: "⚛️" },
  { name: "Tailwind CSS", role: "Utility-first styling", emoji: "🎨" },
  { name: "OpenCV", role: "Image quality validation", emoji: "📷" },
  { name: "NumPy", role: "Numerical operations", emoji: "📊" },
  { name: "Vite", role: "Frontend build tool", emoji: "⚡" },
];

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED NEURAL NETWORK CANVAS
// ─────────────────────────────────────────────────────────────────────────────
function NeuralCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const W = canvas.offsetWidth || 400;
    const H = canvas.offsetHeight || 300;
    canvas.width = W;
    canvas.height = H;

    // layers: input(4), hidden1(6), hidden2(6), output(3)
    const layers = [
      Array.from({ length: 4 }, (_, i) => ({ x: W * 0.12, y: H * 0.15 + i * (H * 0.22) })),
      Array.from({ length: 6 }, (_, i) => ({ x: W * 0.38, y: H * 0.08 + i * (H * 0.158) })),
      Array.from({ length: 6 }, (_, i) => ({ x: W * 0.63, y: H * 0.08 + i * (H * 0.158) })),
      Array.from({ length: 3 }, (_, i) => ({ x: W * 0.88, y: H * 0.25 + i * (H * 0.25) })),
    ];

    let t = 0;
    const pulses = [];
    const addPulse = () => {
      const fromLayer = Math.floor(Math.random() * 3);
      const fromNode = Math.floor(Math.random() * layers[fromLayer].length);
      const toNode = Math.floor(Math.random() * layers[fromLayer + 1].length);
      pulses.push({
        fromLayer, fromNode, toNode,
        progress: 0,
        speed: 0.008 + Math.random() * 0.006,
        color: ["#7FD14F", "#E63946", "#f9a825", "#2FA0D8"][Math.floor(Math.random() * 4)],
      });
    };
    if (pulses.length < 6) for (let i = 0; i < 6; i++) addPulse();

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.012;

      // Draw connections
      for (let l = 0; l < layers.length - 1; l++) {
        for (const a of layers[l]) {
          for (const b of layers[l + 1]) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = "rgba(45,80,22,0.07)";
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        const from = layers[p.fromLayer][p.fromNode];
        const to = layers[p.fromLayer + 1][p.toNode];
        if (!from || !to) { pulses.splice(i, 1); continue; }
        const px = from.x + (to.x - from.x) * p.progress;
        const py = from.y + (to.y - from.y) * p.progress;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.globalAlpha = 1;
        p.progress += p.speed;
        if (p.progress >= 1) { pulses.splice(i, 1); addPulse(); }
      }

      // Draw nodes
      layers.forEach((layer, li) => {
        layer.forEach((node, ni) => {
          const pulse = Math.sin(t + li * 1.2 + ni * 0.8) * 0.3 + 0.7;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 7, 0, Math.PI * 2);
          ctx.fillStyle = li === 0 ? "#c8e6a0" : li === layers.length - 1 ? "#ef9a9a" : "#a5d6a7";
          ctx.globalAlpha = pulse;
          ctx.fill();
          ctx.strokeStyle = li === 0 ? "#5a8a2a" : li === layers.length - 1 ? "#c62828" : "#2d5016";
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 1;
          ctx.stroke();
        });
      });

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);
  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// PARTICLE FIELD
// ─────────────────────────────────────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const W = canvas.offsetWidth || 800;
    const H = canvas.offsetHeight || 400;
    canvas.width = W;
    canvas.height = H;
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.4 + 0.1,
      color: ["#c8e6a0","#a5d6a7","#f9a825","#ef9a9a","#81d4fa"][Math.floor(Math.random()*5)],
    }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
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
  return <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// PIPELINE CARD
// ─────────────────────────────────────────────────────────────────────────────
function PipelineCard({ step, index, isActive, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.23, 1, 0.32, 1] }}
      onClick={() => onClick(index)}
      whileHover={{ y: -5, scale: 1.015 }}
      className="cursor-pointer"
      style={{
        background: isActive ? `linear-gradient(135deg, ${step.color}18, ${step.color}08)` : "rgba(255,255,255,0.75)",
        borderRadius: 24,
        border: `1.5px solid ${isActive ? step.color + "55" : "rgba(255,255,255,0.7)"}`,
        padding: "28px 28px",
        backdropFilter: "blur(12px)",
        boxShadow: isActive
          ? `0 12px 40px ${step.color}22, 0 4px 12px rgba(0,0,0,0.06)`
          : "0 4px 20px rgba(45,80,22,0.07)",
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        {/* Step number + icon */}
        <div style={{ flexShrink: 0 }}>
          <div
            style={{
              width: 52, height: 52, borderRadius: 16,
              background: `linear-gradient(135deg, ${step.color}22, ${step.color}44)`,
              border: `1.5px solid ${step.color}33`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: step.color,
            }}
          >
            {step.icon}
          </div>
          <div style={{
            marginTop: 8, textAlign: "center",
            fontSize: 10, fontWeight: 800, color: step.color,
            fontFamily: "sans-serif", letterSpacing: "0.15em",
          }}>
            {step.step}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#9e9e9e", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 4 }}>
            {step.subtitle}
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1a3a0a", margin: "0 0 8px", fontFamily: "Georgia, serif" }}>
            {step.title}
          </h3>
          <p style={{ fontSize: 13.5, color: "#4a4a47", lineHeight: 1.7, margin: 0, fontFamily: "sans-serif" }}>
            {step.desc}
          </p>

          {/* Detail pills */}
          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {step.detail.map(d => (
              <span key={d} style={{
                background: `${step.color}12`, color: step.color,
                borderRadius: 999, padding: "3px 10px",
                fontSize: 11, fontWeight: 600, fontFamily: "sans-serif",
                border: `1px solid ${step.color}25`,
              }}>
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN MODEL INFO PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ModelInfoPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(165deg, #FEFDFB 0%, #F2F7EC 45%, #F5F1E8 100%)",
        overflowX: "hidden",
      }}
    >
      {/* ── GOOGLE FONTS + GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .mi-glass { backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); background:rgba(255,255,255,0.62); }
        .mi-shadow { box-shadow:0 20px 50px rgba(26,58,10,0.12); }
        .mi-card-hover { transition:transform 0.25s ease, box-shadow 0.25s ease; }
        .mi-card-hover:hover { transform:translateY(-5px); box-shadow:0 16px 40px rgba(45,80,22,0.14); }

        @keyframes mi-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes mi-orbit {
          0%   { transform: rotate(0deg) translateX(140px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(140px) rotate(-360deg); }
        }
        @keyframes mi-orbit2 {
          0%   { transform: rotate(0deg) translateX(100px) rotate(0deg); }
          100% { transform: rotate(-360deg) translateX(100px) rotate(360deg); }
        }
        @keyframes mi-pulse-ring {
          0%   { transform:scale(1); opacity:0.6; }
          100% { transform:scale(1.8); opacity:0; }
        }
        @keyframes mi-scan {
          0%   { top: 0; opacity: 1; }
          50%  { opacity: 0.6; }
          100% { top: calc(100% - 3px); opacity: 1; }
        }
        @keyframes mi-fadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:none; }
        }
        @keyframes mi-bar {
          from { width: 0; }
        }
      `}</style>

      {/* ── FIXED NAV ── */}
      <header
        style={{
          position: "fixed", top: 0, zIndex: 100, width: "100%",
          transition: "all 0.3s",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          background: scrolled ? "rgba(255,255,255,0.72)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.5)" : "none",
          boxShadow: scrolled ? "0 20px 50px rgba(26,58,10,0.10)" : "none",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 76, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
          <button
            onClick={() => (window.location.href = "/")}
            style={{ display:"flex", alignItems:"center", gap:12, background:"none", border:"none", cursor:"pointer" }}
          >
            <span style={{ width:42, height:42, borderRadius:"50%", background:"linear-gradient(135deg,#2D5016,#1a3a0a)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
              🍅
            </span>
            <span>
              <span style={{ display:"block", fontSize:10, fontWeight:700, letterSpacing:"0.35em", color:"rgba(45,80,22,0.7)", textTransform:"uppercase", fontFamily:"sans-serif" }}>Agro AI</span>
              <span style={{ display:"block", fontSize:14, fontWeight:600, color:"#1a3a0a", fontFamily:"sans-serif" }}>Tomato Disease Identifier</span>
            </span>
          </button>

          <div style={{ display:"flex", gap:10 }}>
            <button
              onClick={() => (window.location.href = "/predictions")}
              style={{ background:"#E63946", border:"none", borderRadius:999, padding:"8px 20px", fontSize:13, fontWeight:600, color:"white", cursor:"pointer", fontFamily:"sans-serif", boxShadow:"0 4px 14px rgba(230,57,70,0.3)", transition:"all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform="scale(1.03)"}
              onMouseLeave={e => e.currentTarget.style.transform="none"}
            >
              Analyze Leaf →
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              style={{ background:"white", border:"1px solid rgba(45,80,22,0.15)", borderRadius:999, padding:"8px 20px", fontSize:13, fontWeight:600, color:"#1a3a0a", cursor:"pointer", fontFamily:"sans-serif", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", transition:"all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform="scale(1.03)"}
              onMouseLeave={e => e.currentTarget.style.transform="none"}
            >
              ← Back Home
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section
        style={{
          position: "relative", overflow: "hidden",
          background: "linear-gradient(135deg, #0d1f07 0%, #1b3a0f 50%, #162e0b 100%)",
          paddingTop: 120, paddingBottom: 100,
        }}
      >
        <ParticleField />

        {/* Pulsing rings */}
        {!reduceMotion && (
          <div style={{ position:"absolute", top:"50%", right:"10%", transform:"translateY(-50%)", pointerEvents:"none" }}>
            {[200, 280, 360].map((size, i) => (
              <div key={size} style={{
                position:"absolute", top:"50%", left:"50%",
                width: size, height: size,
                marginLeft: -size/2, marginTop: -size/2,
                borderRadius:"50%",
                border: "1px solid rgba(127,209,79,0.15)",
                animation: `mi-pulse-ring ${3 + i * 1.2}s ease-out ${i * 0.8}s infinite`,
              }} />
            ))}
            {/* Orbiting dots */}
            <div style={{ position:"relative", width:0, height:0 }}>
              <div style={{ position:"absolute", width:12, height:12, borderRadius:"50%", background:"#7FD14F", boxShadow:"0 0 12px #7FD14F", animation:"mi-orbit 8s linear infinite" }} />
              <div style={{ position:"absolute", width:8, height:8, borderRadius:"50%", background:"#E63946", boxShadow:"0 0 10px #E63946", animation:"mi-orbit2 5s linear infinite" }} />
            </div>
          </div>
        )}

        {/* Neural canvas */}
        <div style={{
          position: "absolute", right: "5%", top: "50%", transform: "translateY(-50%)",
          width: 340, height: 260, opacity: 0.5,
        }}>
          <NeuralCanvas />
        </div>

        <div style={{ position:"relative", zIndex:1, maxWidth:1200, margin:"0 auto", padding:"0 24px" }}>
          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
            <div style={{
              display:"inline-flex", alignItems:"center", gap:8,
              borderRadius:999, border:"1px solid rgba(255,255,255,0.2)",
              background:"rgba(255,255,255,0.1)", padding:"6px 18px", marginBottom:20,
              backdropFilter:"blur(10px)",
            }}>
              <Brain style={{ width:14, height:14, color:"#7FD14F" }} />
              <span style={{ fontSize:11, fontWeight:700, color:"white", letterSpacing:"0.2em", textTransform:"uppercase", fontFamily:"sans-serif" }}>
                MODEL INFORMATION · /model-info
              </span>
            </div>

            <h1
              style={{
                fontFamily:"'Playfair Display', Georgia, serif",
                fontSize:"clamp(2.6rem,6vw,4.4rem)",
                fontWeight:900, color:"white",
                lineHeight:1.08, margin:"0 0 20px",
                maxWidth:700,
                textShadow:"0 4px 24px rgba(0,0,0,0.3)",
              }}
            >
              Inside the
              <br />
              <span style={{ color:"#f9a825", fontStyle:"italic" }}>AI Brain</span>
              <br />
              Powering Your Farm
            </h1>

            <p style={{
              fontFamily:"'DM Sans', sans-serif", fontSize:17,
              color:"rgba(255,255,255,0.78)", maxWidth:520,
              lineHeight:1.8, fontWeight:300, margin:"0 0 36px",
            }}>
              From raw leaf images to disease prediction — the complete technical story of how ResNet18, PyTorch, and Flask work together to protect tomato crops.
            </p>

            <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
              {["ResNet18","PyTorch","Flask API","11 Classes","94%+ Accuracy"].map(tag => (
                <span key={tag} style={{
                  background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.2)",
                  borderRadius:999, padding:"7px 16px", fontSize:12, color:"white",
                  fontFamily:"sans-serif", fontWeight:600, backdropFilter:"blur(8px)", letterSpacing:"0.04em",
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* wave */}
        <svg viewBox="0 0 1440 80" style={{ position:"absolute", bottom:0, left:0, width:"100%", display:"block" }} preserveAspectRatio="none">
          <path d="M0 80 Q360 10 720 50 Q1080 90 1440 20 L1440 80 Z" fill="#FEFDFB" />
        </svg>
      </section>

      {/* ── STATS GRID ── */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"64px 24px 0" }}>
        <motion.div
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:16 }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity:0, y:20 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ delay: i * 0.07 }}
              className="mi-card-hover"
              style={{
                background:"white", borderRadius:20, padding:"24px 20px",
                border:"1.5px solid rgba(45,80,22,0.08)",
                boxShadow:"0 4px 20px rgba(45,80,22,0.07)",
                textAlign:"center",
              }}
            >
              <div style={{ fontFamily:"'Playfair Display', serif", fontSize:"2rem", fontWeight:700, color:"#1a3a0a", lineHeight:1 }}>
                {stat.value}
              </div>
              <div style={{ fontFamily:"sans-serif", fontSize:11, fontWeight:700, color:"#2d5016", marginTop:6, letterSpacing:"0.08em", textTransform:"uppercase" }}>
                {stat.label}
              </div>
              <div style={{ fontFamily:"sans-serif", fontSize:11, color:"#9e9e9e", marginTop:3 }}>
                {stat.sub}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── PIPELINE SECTION ── */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"72px 24px 0" }}>
        <motion.div
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
        >
          <p style={{ fontFamily:"sans-serif", fontSize:11, letterSpacing:"0.3em", color:"#9e9e9e", textTransform:"uppercase", marginBottom:12 }}>
            Complete workflow
          </p>
          <h2 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:700, color:"#1a3a0a", margin:"0 0 48px" }}>
            From Field to Prediction
          </h2>
        </motion.div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))", gap:20 }}>
          {PIPELINE.map((step, i) => (
            <PipelineCard key={step.step} step={step} index={i} isActive={activeStep === i} onClick={setActiveStep} />
          ))}
        </div>
      </section>

      {/* ── ARCHITECTURE DIAGRAM ── */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"80px 24px 0" }}>
        <motion.div
          initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{
            background:"linear-gradient(135deg,#1b3a0f 0%,#2d5016 60%,#162e0b 100%)",
            borderRadius:32, overflow:"hidden", position:"relative",
            padding:"56px 48px",
          }}
        >
          <ParticleField />
          <div style={{ position:"relative", zIndex:1 }}>
            <p style={{ fontFamily:"sans-serif", fontSize:11, letterSpacing:"0.3em", color:"#a5d6a7", textTransform:"uppercase", marginBottom:12 }}>
              Architecture overview
            </p>
            <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(1.8rem,4vw,2.6rem)", fontWeight:700, color:"white", margin:"0 0 48px" }}>
              ResNet18 Pipeline
            </h2>

            {/* Flow diagram */}
            <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", overflowX:"auto", paddingBottom:8 }}>
              {[
                { label:"Input Image", sub:"224×224 RGB", icon:"📷", color:"#7FD14F" },
                { label:"Preprocessing", sub:"Normalise + Augment", icon:"⚙️", color:"#2FA0D8" },
                { label:"ResNet18", sub:"Pretrained Backbone", icon:"🧠", color:"#f9a825" },
                { label:"FC Layer", sub:"512 → 11", icon:"🔗", color:"#E63946" },
                { label:"Softmax", sub:"Probabilities", icon:"📊", color:"#a78bfa" },
                { label:"Prediction", sub:"Top-1 Class", icon:"✅", color:"#4ade80" },
              ].map((node, i, arr) => (
                <React.Fragment key={node.label}>
                  <motion.div
                    initial={{ opacity:0, scale:0.85 }}
                    whileInView={{ opacity:1, scale:1 }}
                    viewport={{ once:true }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      background:"rgba(255,255,255,0.1)", backdropFilter:"blur(12px)",
                      border:`1.5px solid ${node.color}44`,
                      borderRadius:18, padding:"18px 20px", textAlign:"center",
                      minWidth:110, flexShrink:0,
                    }}
                  >
                    <div style={{ fontSize:26, marginBottom:6 }}>{node.icon}</div>
                    <div style={{ fontFamily:"sans-serif", fontSize:12, fontWeight:700, color:node.color }}>
                      {node.label}
                    </div>
                    <div style={{ fontFamily:"sans-serif", fontSize:10, color:"rgba(255,255,255,0.55)", marginTop:2 }}>
                      {node.sub}
                    </div>
                  </motion.div>
                  {i < arr.length - 1 && (
                    <div style={{ color:"rgba(255,255,255,0.3)", fontSize:20, flexShrink:0 }}>→</div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Neural canvas inside */}
            <div style={{ marginTop:40, height:200, borderRadius:20, overflow:"hidden", background:"rgba(0,0,0,0.2)", border:"1px solid rgba(255,255,255,0.1)" }}>
              <NeuralCanvas />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── DISEASE CLASSES ── */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"80px 24px 0" }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <p style={{ fontFamily:"sans-serif", fontSize:11, letterSpacing:"0.3em", color:"#9e9e9e", textTransform:"uppercase", marginBottom:12 }}>
            Classification targets
          </p>
          <h2 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:700, color:"#1a3a0a", margin:"0 0 40px" }}>
            {CLASSES.length} Output Classes
          </h2>
        </motion.div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:14 }}>
          {CLASSES.map((cls, i) => (
            <motion.div
              key={cls.id}
              initial={{ opacity:0, y:20 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ delay: i * 0.045 }}
              whileHover={{ y:-4, scale:1.02 }}
              style={{
                background:"white", borderRadius:18, padding:"20px 18px",
                border:"1.5px solid rgba(45,80,22,0.07)",
                boxShadow:"0 3px 14px rgba(0,0,0,0.05)",
                cursor:"default",
              }}
            >
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{
                  width:36, height:36, borderRadius:10,
                  background:cls.bg, display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:16, flexShrink:0,
                }}>
                  {i === 6 ? "✅" : i === 10 ? "❓" : "🍅"}
                </div>
                <span style={{
                  fontSize:10, fontWeight:700, color:cls.color,
                  background:cls.bg, borderRadius:999, padding:"2px 8px",
                  fontFamily:"sans-serif", letterSpacing:"0.06em",
                }}>
                  Class {String(i).padStart(2,"0")}
                </span>
              </div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:14, fontWeight:700, color:"#1a3a0a" }}>
                {cls.label}
              </div>
              <div style={{ fontFamily:"sans-serif", fontSize:10, color:"#9e9e9e", marginTop:4, fontStyle:"italic" }}>
                {cls.id}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Class distribution bar */}
        <motion.div
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{
            marginTop:32, background:"white", borderRadius:24, padding:"28px 32px",
            border:"1.5px solid rgba(45,80,22,0.08)", boxShadow:"0 4px 20px rgba(45,80,22,0.06)",
          }}
        >
          <div style={{ fontFamily:"sans-serif", fontSize:11, fontWeight:700, color:"#9e9e9e", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:20 }}>
            Class distribution (sample)
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { label:"Healthy",        pct:18, color:"#15803d" },
              { label:"Early Blight",   pct:15, color:"#b45309" },
              { label:"Late Blight",    pct:14, color:"#991b1b" },
              { label:"Bacterial Spot", pct:12, color:"#7f1d1d" },
              { label:"Leaf Mold",      pct:10, color:"#065f46" },
              { label:"Others (6)",     pct:31, color:"#374151" },
            ].map((row, i) => (
              <div key={row.label} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:140, fontFamily:"sans-serif", fontSize:12, color:"#4a4a47", flexShrink:0 }}>
                  {row.label}
                </div>
                <div style={{ flex:1, height:10, background:"#f3f4f6", borderRadius:999, overflow:"hidden" }}>
                  <motion.div
                    initial={{ width:0 }}
                    whileInView={{ width:`${row.pct}%` }}
                    viewport={{ once:true }}
                    transition={{ duration:1, delay:i*0.1, ease:"easeOut" }}
                    style={{ height:"100%", background:row.color, borderRadius:999 }}
                  />
                </div>
                <div style={{ width:36, textAlign:"right", fontFamily:"sans-serif", fontSize:12, fontWeight:700, color:row.color }}>
                  {row.pct}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── TECH STACK ── */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"80px 24px 0" }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <p style={{ fontFamily:"sans-serif", fontSize:11, letterSpacing:"0.3em", color:"#9e9e9e", textTransform:"uppercase", marginBottom:12 }}>
            Built with
          </p>
          <h2 style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:700, color:"#1a3a0a", margin:"0 0 40px" }}>
            Technology Stack
          </h2>
        </motion.div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16 }}>
          {TECH.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity:0, y:20 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y:-5 }}
              className="mi-card-hover"
              style={{
                background:"white", borderRadius:20, padding:"22px 20px",
                border:"1.5px solid rgba(45,80,22,0.08)",
                boxShadow:"0 4px 18px rgba(45,80,22,0.06)",
                display:"flex", alignItems:"center", gap:14,
              }}
            >
              <div style={{ fontSize:30, flexShrink:0 }}>{t.emoji}</div>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:"#1a3a0a" }}>
                  {t.name}
                </div>
                <div style={{ fontFamily:"sans-serif", fontSize:12, color:"#9e9e9e", marginTop:2 }}>
                  {t.role}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── IMAGE VALIDATION SECTION ── */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"80px 24px 0" }}>
        <motion.div
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:20 }}
        >
          {/* Quality gate card */}
          <div style={{
            background:"linear-gradient(135deg,#1b3a0f,#2d5016)",
            borderRadius:28, padding:"40px 36px", color:"white", position:"relative", overflow:"hidden",
          }}>
            {/* Animated scan line */}
            {!reduceMotion && (
              <div style={{ position:"absolute", left:0, right:0, height:3, background:"linear-gradient(90deg,transparent,#7FD14F,transparent)", animation:"mi-scan 2.5s ease-in-out infinite" }} />
            )}
            <ShieldCheck style={{ width:32, height:32, color:"#7FD14F", marginBottom:16 }} />
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, margin:"0 0 14px" }}>
              Image Quality Gate
            </h3>
            <p style={{ fontFamily:"sans-serif", fontSize:14, lineHeight:1.7, color:"rgba(255,255,255,0.78)", margin:"0 0 20px" }}>
              Every uploaded image is validated before inference. Blurry or dark images are rejected with helpful guidance to retake the photo.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                ["Brightness", "Checks mean pixel value > threshold"],
                ["Sharpness", "Laplacian variance blur detection"],
                ["Resolution", "Minimum 100×100 pixels required"],
              ].map(([title, desc]) => (
                <div key={title} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                  <CheckCircle style={{ width:14, height:14, color:"#7FD14F", marginTop:2, flexShrink:0 }} />
                  <div>
                    <span style={{ fontFamily:"sans-serif", fontSize:13, fontWeight:600, color:"#7FD14F" }}>{title}: </span>
                    <span style={{ fontFamily:"sans-serif", fontSize:13, color:"rgba(255,255,255,0.7)" }}>{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accuracy card */}
          <div style={{
            background:"white", borderRadius:28, padding:"40px 36px",
            border:"1.5px solid rgba(45,80,22,0.1)", boxShadow:"0 8px 32px rgba(45,80,22,0.08)",
          }}>
            <BarChart3 style={{ width:32, height:32, color:"#E63946", marginBottom:16 }} />
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:"#1a3a0a", margin:"0 0 14px" }}>
              Performance Metrics
            </h3>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[
                { label:"Validation Accuracy", val:94, color:"#15803d" },
                { label:"Training Accuracy",   val:97, color:"#2d5016" },
                { label:"Precision (avg)",     val:93, color:"#0369a1" },
                { label:"Recall (avg)",        val:92, color:"#7c3aed" },
              ].map(row => (
                <div key={row.label}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span style={{ fontFamily:"sans-serif", fontSize:13, color:"#4a4a47", fontWeight:500 }}>{row.label}</span>
                    <span style={{ fontFamily:"sans-serif", fontSize:13, fontWeight:700, color:row.color }}>{row.val}%</span>
                  </div>
                  <div style={{ height:8, background:"#f3f4f6", borderRadius:999, overflow:"hidden" }}>
                    <motion.div
                      initial={{ width:0 }}
                      whileInView={{ width:`${row.val}%` }}
                      viewport={{ once:true }}
                      transition={{ duration:1.2, ease:"easeOut" }}
                      style={{ height:"100%", background:`linear-gradient(90deg,${row.color},${row.color}88)`, borderRadius:999 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deployment card */}
          <div style={{
            background:"linear-gradient(135deg,#1d4ed8,#0369a1)",
            borderRadius:28, padding:"40px 36px", color:"white",
          }}>
            <FlaskConical style={{ width:32, height:32, color:"#81d4fa", marginBottom:16 }} />
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, margin:"0 0 14px" }}>
              Deployment
            </h3>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                ["API Endpoint", "POST /predict"],
                ["Input", "multipart/form-data (image)"],
                ["Response", "JSON { prediction, probability }"],
                ["Backend", "Flask + Waitress (prod)"],
                ["Model file", "resnet18_model.pth"],
                ["Device", "CPU / CUDA auto-detect"],
              ].map(([k,v]) => (
                <div key={k} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                  <span style={{ fontFamily:"sans-serif", fontSize:12, fontWeight:700, color:"#81d4fa", minWidth:90, flexShrink:0 }}>{k}</span>
                  <span style={{ fontFamily:"sans-serif", fontSize:12, color:"rgba(255,255,255,0.75)" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"80px 24px 0" }}>
        <motion.div
          initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{
            background:"linear-gradient(135deg,#1b3a0f 0%,#2d5016 60%,#1e4a2a 100%)",
            borderRadius:32, padding:"60px 48px", textAlign:"center",
            position:"relative", overflow:"hidden",
          }}
        >
          <ParticleField />
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ fontSize:40, marginBottom:16 }}>🍅</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,4vw,3rem)", color:"white", fontWeight:700, margin:"0 0 16px", fontStyle:"italic" }}>
              Ready to detect disease?
            </h2>
            <p style={{ fontFamily:"sans-serif", fontSize:16, color:"rgba(255,255,255,0.75)", maxWidth:500, margin:"0 auto 32px", lineHeight:1.75 }}>
              Upload a tomato leaf image and let the ResNet18 model identify disease in seconds.
            </p>
            <div style={{ display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap" }}>
              <button
                onClick={() => (window.location.href = "/predictions")}
                style={{
                  background:"#E63946", border:"none", borderRadius:999,
                  padding:"14px 32px", fontSize:15, fontWeight:700,
                  color:"white", cursor:"pointer", fontFamily:"sans-serif",
                  boxShadow:"0 8px 24px rgba(230,57,70,0.35)",
                  transition:"all 0.2s", display:"inline-flex", alignItems:"center", gap:8,
                }}
                onMouseEnter={e => e.currentTarget.style.transform="scale(1.03)"}
                onMouseLeave={e => e.currentTarget.style.transform="none"}
              >
                Analyze a Leaf Now →
              </button>
              <button
                onClick={() => (window.location.href = "/diseases")}
                style={{
                  background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.25)",
                  borderRadius:999, padding:"14px 28px", fontSize:15, fontWeight:600,
                  color:"white", cursor:"pointer", fontFamily:"sans-serif", backdropFilter:"blur(8px)",
                  transition:"all 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.12)"}
              >
                Browse Disease Database
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:"#1b3a0f", padding:"40px 24px", textAlign:"center", marginTop:80 }}>
        <div style={{ fontSize:24, marginBottom:10 }}>🧠</div>
        <p style={{ color:"#a5d6a7", fontFamily:"sans-serif", fontSize:13, margin:0 }}>
          Model Information · Agro AI · ResNet18 · PyTorch · Flask
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            marginTop:16, background:"transparent", border:"1px solid rgba(165,214,167,0.35)",
            borderRadius:999, padding:"8px 22px", color:"#a5d6a7", fontSize:13,
            cursor:"pointer", fontFamily:"sans-serif",
          }}
        >
          ← Back to Home
        </button>
      </footer>
    </div>
  );
}