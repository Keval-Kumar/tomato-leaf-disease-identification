

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ModelInfoPage      from "./componentts/ModelInfo.jsx";
import DiseaseDatabasePage from "./componentts/Diseasedatabase.jsx";
import PredictionPage     from "./componentts/Prediction.jsx";
import NewsPage           from "./componentts/NewsPage.jsx";
import MapPage            from "./componentts/MapPage.jsx";
import AccountPage        from "./componentts/AccountPage.jsx";
import AuthPage, { useAuth } from "./componentts/AuthPage.jsx";
import {
  ArrowRight, BadgeCheck, BarChart3, Brain, ChevronRight,
  Database, Leaf, MapPinned, Menu, Microscope,
  Newspaper, ShieldCheck, Sparkles, Trees, X, User,
} from "lucide-react";

// ─── STAGES ──────────────────────────────────────────────────────────────────
const stages = [
  { id:0,emoji:"🌱",title:"Seed Selection",subtitle:"Choosing the right variety",color:"#2D5016",lightColor:"#f0f7e6",accentColor:"#5a8a2a",tips:["Choose disease-resistant varieties like Roma, Cherry, or Beefsteak","Check seed expiry date — fresh seeds germinate better","Hybrid seeds offer uniformity; heirlooms offer flavour","Buy from certified suppliers for best germination rates (85%+)"],detail:"The foundation of a great harvest starts with quality seeds. Look for seeds with high germination rates, resistance to common tomato diseases like blight and wilt, and varieties suited to your local climate.",icon:(<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:52,height:52}}><ellipse cx="30" cy="38" rx="16" ry="10" fill="#c8e6a0" stroke="#5a8a2a" strokeWidth="1.5"/><path d="M30 38 C30 25 20 15 14 10" stroke="#5a8a2a" strokeWidth="2" strokeLinecap="round"/><path d="M30 38 C30 25 40 15 46 10" stroke="#5a8a2a" strokeWidth="2" strokeLinecap="round"/><ellipse cx="14" cy="9" rx="5" ry="3" fill="#8bc34a" opacity="0.8"/><ellipse cx="46" cy="9" rx="5" ry="3" fill="#8bc34a" opacity="0.8"/></svg>)},
  { id:1,emoji:"🪴",title:"Nursery",subtitle:"Sprouting seedlings",color:"#1a6b3a",lightColor:"#e8f5e9",accentColor:"#2e7d32",tips:["Sow seeds 5–6 weeks before transplanting","Keep soil moist but not waterlogged","Ideal germination temperature: 21–27°C","Seeds sprout in 5–10 days"],detail:"Fill trays with well-drained potting mix. Sow seeds 6mm deep. Cover lightly and mist with water. Place in a warm, bright spot.",icon:(<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:52,height:52}}><rect x="18" y="36" width="24" height="16" rx="4" fill="#c8a96e" stroke="#a07840" strokeWidth="1.2"/><path d="M30 36 C30 26 22 20 18 14" stroke="#4caf50" strokeWidth="2" strokeLinecap="round"/><ellipse cx="17" cy="13" rx="6" ry="4" fill="#81c784"/></svg>)},
  { id:2,emoji:"🌍",title:"Soil Prep",subtitle:"Building healthy ground",color:"#5d4037",lightColor:"#efebe9",accentColor:"#795548",tips:["pH should be between 6.0–6.8 for tomatoes","Add compost or well-rotted manure","Ensure well-drained, loamy soil","Deep ploughing (30cm) helps root development"],detail:"Tomatoes thrive in rich, loamy soil. Test your soil pH and adjust with lime or sulphur. Mix in organic matter.",icon:(<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:52,height:52}}><ellipse cx="30" cy="42" rx="22" ry="8" fill="#8d6e63" stroke="#6d4c41" strokeWidth="1.2"/><path d="M8 42 Q30 28 52 42" fill="#a1887f"/><path d="M30 34 C30 28 34 22 36 18" stroke="#4caf50" strokeWidth="1.8" strokeLinecap="round"/></svg>)},
  { id:3,emoji:"🌿",title:"Transplant",subtitle:"Moving to field",color:"#2e7d32",lightColor:"#e8f5e9",accentColor:"#388e3c",tips:["Transplant seedlings 25–30 days after sowing","Maintain spacing: 45–60 cm between plants","Water immediately after transplanting","Transplant in evening to reduce shock"],detail:"When seedlings are 15–20 cm tall with 4–6 leaves, they're ready. Plant deep — tomatoes form roots along buried stems.",icon:(<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:52,height:52}}><ellipse cx="30" cy="50" rx="20" ry="5" fill="#8d6e63" opacity="0.5"/><path d="M30 50 L30 28" stroke="#5d4037" strokeWidth="2.5" strokeLinecap="round"/><ellipse cx="22" cy="36" rx="8" ry="5" fill="#81c784" transform="rotate(-20 22 36)"/><ellipse cx="38" cy="34" rx="8" ry="5" fill="#66bb6a" transform="rotate(20 38 34)"/></svg>)},
  { id:4,emoji:"💧",title:"Irrigation",subtitle:"Watering and feeding",color:"#0277bd",lightColor:"#e1f5fe",accentColor:"#0288d1",tips:["Water deeply 2–3 times per week","Drip irrigation saves water","Fertilise with NPK 19:19:19 every 2 weeks","Avoid wetting leaves"],detail:"Tomatoes need consistent moisture — irregular watering causes blossom end rot. Use drip irrigation for best results.",icon:(<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:52,height:52}}><path d="M30 10 C30 10 16 26 16 36 C16 44 22 50 30 50 C38 50 44 44 44 36 C44 26 30 10 30 10Z" fill="#81d4fa" stroke="#0288d1" strokeWidth="1.5"/><path d="M24 38 C24 34 28 32 30 32" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/></svg>)},
  { id:5,emoji:"🛡️",title:"Protection",subtitle:"Pest & disease control",color:"#e65100",lightColor:"#fff3e0",accentColor:"#f57c00",tips:["Watch for early blight — remove affected leaves","Use neem oil spray every 10 days","Set yellow sticky traps for whitefly","Spray copper fungicide for bacterial spot"],detail:"Common threats include early blight, late blight, fusarium wilt, aphids, and whiteflies. Inspect plants twice weekly.",icon:(<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:52,height:52}}><path d="M30 8 L46 16 L46 34 C46 44 38 50 30 52 C22 50 14 44 14 34 L14 16 Z" fill="#ffcc80" stroke="#f57c00" strokeWidth="1.5"/><path d="M22 30 L28 36 L40 24" stroke="#2e7d32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>)},
  { id:6,emoji:"🍅",title:"Harvest",subtitle:"Picking at peak ripeness",color:"#c62828",lightColor:"#ffebee",accentColor:"#e53935",tips:["Harvest when fully coloured and slightly soft","Twist and pull gently","Harvest every 2–3 days once fruiting begins","Pick before heavy rains to avoid splitting"],detail:"Tomatoes are ready 60–85 days after transplanting. Harvest when fruits reach full colour and give slightly to pressure.",icon:(<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:52,height:52}}><circle cx="30" cy="36" r="18" fill="#f44336" stroke="#c62828" strokeWidth="1.5"/><path d="M24 20 C26 14 34 14 36 20" fill="#4caf50"/><path d="M30 18 L30 10" stroke="#4caf50" strokeWidth="2" strokeLinecap="round"/></svg>)},
  { id:7,emoji:"💰",title:"Market",subtitle:"Selling for best price",color:"#1565c0",lightColor:"#e3f2fd",accentColor:"#1976d2",tips:["Grade tomatoes by size and quality","Local mandis, APMCs, and e-NAM for pricing","Cold storage extends shelf life 2–3 weeks","Direct-to-consumer gives better margins"],detail:"Sort tomatoes into grades. Check daily mandi prices via e-NAM or Agmarknet. Consider FPOs for collective bargaining.",icon:(<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:52,height:52}}><rect x="10" y="28" width="40" height="24" rx="4" fill="#bbdefb" stroke="#1976d2" strokeWidth="1.5"/><path d="M18 28 L18 22 C18 16 42 16 42 22 L42 28" fill="#e3f2fd" stroke="#1976d2" strokeWidth="1.5"/><circle cx="30" cy="40" r="8" fill="#1976d2"/><text x="30" y="44" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">₹</text></svg>)},
];

const features = [
  { title:"Tomato Cultivation Guide", btnLabel:"🌱 Open Cultivation Guide", description:"A practical growth companion with seasonal guidance, field-ready tips, and visual planting support for healthier harvests.", route:"/tomato-cultivation", icon:<Trees className="h-5 w-5"/>, accent:"from-[#D4A574] to-[#B8C4A8]", bullets:["Planting stages","Soil & irrigation","Seasonal care"], sceneType:"sunrise" },
  { title:"Disease Database", btnLabel:"🦠 Browse Disease Database", description:"Browse disease categories, symptoms, prevention notes, and sample visuals in a structured knowledge hub.", route:"/diseases", icon:<Database className="h-5 w-5"/>, accent:"from-[#7FD14F] to-[#B8C4A8]", bullets:["Symptoms","Treatment","Prevention"], sceneType:"disease" },
  { title:"Model Information", btnLabel:"🧠 View Model Info", description:"Explore the model pipeline, training overview, class mapping, and deployment notes — powered by your local ResNet-18 model.", route:"/model-info", icon:<Brain className="h-5 w-5"/>, accent:"from-[#2D5016] to-[#1a3a0a]", bullets:["ResNet-18","Vision model","Deployment"], sceneType:"neural" },
  { title:"News & Updates", btnLabel:"📰 Read Latest News", description:"A clean space for agriculture news, weather guidance, and actionable updates for tomato growers.", route:"/news", icon:<Newspaper className="h-5 w-5"/>, accent:"from-[#2FA0D8] to-[#4DB8E8]", bullets:["Farm updates","Weather alerts","Policy news"], sceneType:"market" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 3D ANIMATED HERO CANVAS
// ═══════════════════════════════════════════════════════════════════════════════
function HeroCanvas3D({ mouseX, mouseY }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const mouseRef  = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    mouseRef.current = { x: mouseX, y: mouseY };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const clouds = Array.from({ length: 7 }, (_, i) => ({
      x: (i / 7) * 1.4 * canvas.width,
      y: canvas.height * (0.05 + (i % 3) * 0.06),
      w: 80 + i * 25,
      h: 22 + i * 6,
      speed: 0.08 + (i % 3) * 0.04,
      alpha: 0.55 + (i % 2) * 0.25,
      layer: i % 3,
    }));

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random(), y: Math.random() * 0.6,
      r: Math.random() * 1.2, twinkle: Math.random() * Math.PI * 2,
    }));

    const makeRows = (W, H) => {
      const HZ = H * 0.52;
      const VP = { x: W * 0.5, y: HZ };
      return Array.from({ length: 11 }, (_, i) => ({
        xBottom: VP.x - W * 0.65 + i * (W * 1.3 / 10),
        phase: i * 0.6, VP,
      }));
    };

    const fireflies = Array.from({ length: 18 }, () => ({
      x: Math.random(), y: 0.45 + Math.random() * 0.5,
      vx: (Math.random() - 0.5) * 0.0008,
      vy: (Math.random() - 0.5) * 0.0008,
      phase: Math.random() * Math.PI * 2,
      r: 1.5 + Math.random() * 2,
      color: Math.random() > 0.5 ? "#f9a825" : "#7FD14F",
    }));

    const birds = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * 1.2 - 0.1,
      y: 0.08 + Math.random() * 0.2,
      speed: 0.0004 + Math.random() * 0.0003,
      size: 3 + Math.random() * 3,
      wing: Math.random() * Math.PI * 2,
    }));

    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random(), y: 0.4 + Math.random() * 0.6,
      r: 0.5 + Math.random() * 1.5,
      vy: -0.0003 - Math.random() * 0.0003,
      vx: (Math.random() - 0.5) * 0.0002,
      alpha: 0.1 + Math.random() * 0.3,
    }));

    let t = 0;
    const draw = () => {
      t += 0.008;
      const W = canvas.width, H = canvas.height;
      if (!W || !H) { animRef.current = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const HZ = H * 0.52;
      const rows = makeRows(W, H);
      const VP = rows[0].VP;

      const dayProgress = (Math.sin(t * 0.04) + 1) / 2;
      const skyGrad = ctx.createLinearGradient(0, 0, 0, HZ);
      skyGrad.addColorStop(0, `hsl(${200 + dayProgress * 10},${55 + dayProgress * 20}%,${12 + dayProgress * 22}%)`);
      skyGrad.addColorStop(0.4, `hsl(${25 + dayProgress * 20},${70 + dayProgress * 10}%,${28 + dayProgress * 20}%)`);
      skyGrad.addColorStop(1, `hsl(${38 + dayProgress * 10},80%,${45 + dayProgress * 20}%)`);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, HZ + 2);

      const starAlpha = Math.max(0, 1 - dayProgress * 2.5);
      stars.forEach(s => {
        const blink = 0.5 + 0.5 * Math.sin(t * 1.5 + s.twinkle);
        ctx.beginPath();
        ctx.arc(s.x * W + (0.5 - mx) * 6, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,235,255,${starAlpha * blink})`;
        ctx.fill();
      });

      const sunX = W * (0.68 + (0.5 - mx) * 0.04);
      const sunY = HZ * (0.25 + (1 - dayProgress) * 0.45 + (0.5 - my) * 0.04);
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, H * 0.45);
      sunGlow.addColorStop(0, `rgba(255,${180 + dayProgress * 40},60,${0.3 + dayProgress * 0.25})`);
      sunGlow.addColorStop(0.35, `rgba(255,140,20,0.12)`);
      sunGlow.addColorStop(1, "transparent");
      ctx.fillStyle = sunGlow;
      ctx.fillRect(0, 0, W, HZ);
      ctx.beginPath();
      ctx.arc(sunX, sunY, 10 + dayProgress * 6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,${210 + dayProgress * 30},80,${0.65 + dayProgress * 0.3})`;
      ctx.fill();

      clouds.forEach(cloud => {
        cloud.x -= cloud.speed * 0.4;
        if (cloud.x < -cloud.w * 2) cloud.x = W + cloud.w;
        const px = cloud.x + (0.5 - mx) * (14 + cloud.layer * 16);
        const py = cloud.y + (0.5 - my) * (6 + cloud.layer * 4);
        ctx.beginPath();
        ctx.ellipse(px, py, cloud.w, cloud.h, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,240,220,${cloud.alpha * (0.5 + dayProgress * 0.5)})`;
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(px - cloud.w * 0.3, py + cloud.h * 0.15, cloud.w * 0.6, cloud.h * 0.7, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,235,210,${cloud.alpha * 0.8 * (0.5 + dayProgress * 0.5)})`;
        ctx.fill();
      });

      const hillOffX = (0.5 - mx) * 30;
      const hillOffY = (0.5 - my) * 10;
      ctx.beginPath();
      ctx.moveTo(0, HZ);
      for (let hx = 0; hx <= W; hx += 6) {
        const hy = HZ - 18 - 14 * Math.sin(hx * 0.007 + 0.5) - 10 * Math.sin(hx * 0.013 + 1.2);
        ctx.lineTo(hx + hillOffX, hy + hillOffY);
      }
      ctx.lineTo(W, HZ); ctx.closePath();
      const hillGrad = ctx.createLinearGradient(0, HZ - 30, 0, HZ);
      hillGrad.addColorStop(0, `hsl(120,${30+dayProgress*20}%,${15+dayProgress*8}%)`);
      hillGrad.addColorStop(1, `hsl(120,35%,${18+dayProgress*10}%)`);
      ctx.fillStyle = hillGrad;
      ctx.fill();

      const groundGrad = ctx.createLinearGradient(0, HZ, 0, H);
      groundGrad.addColorStop(0, `hsl(110,${40+dayProgress*15}%,${14+dayProgress*8}%)`);
      groundGrad.addColorStop(0.35, `hsl(105,30%,${10+dayProgress*5}%)`);
      groundGrad.addColorStop(1, "#050d05");
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, HZ, W, H - HZ);

      const gGlow = ctx.createRadialGradient(W * 0.5, HZ, 0, W * 0.5, HZ, W * 0.55);
      gGlow.addColorStop(0, `rgba(127,209,79,${0.06 + dayProgress * 0.04})`);
      gGlow.addColorStop(1, "transparent");
      ctx.fillStyle = gGlow;
      ctx.fillRect(0, HZ - 40, W, H - HZ + 40);

      const rowOffX = (0.5 - mx) * 20;
      rows.forEach(row => {
        ctx.beginPath();
        ctx.moveTo(VP.x + rowOffX, VP.y);
        ctx.lineTo(row.xBottom + rowOffX * 0.3, H);
        ctx.strokeStyle = `rgba(45,80,22,0.25)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      const cropOffX = (0.5 - mx) * 12;
      const cropOffY = (0.5 - my) * 8;
      rows.forEach((row) => {
        for (let pi = 0; pi < 7; pi++) {
          const tP = (pi + 0.5) / 7;
          const tD = 0.08 + tP * 0.88;
          const py = HZ + tD * (H - HZ) + cropOffY * tD;
          const px = VP.x + (row.xBottom - VP.x) * tD + cropOffX * tD;
          const sc = 0.25 + tD * 1.35;
          const sway = Math.sin(t * 1.1 + row.phase + pi * 0.7) * 1.8 * sc;
          const sh = 11 * sc;

          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.quadraticCurveTo(px + sway * 0.5, py - sh * 0.5, px + sway, py - sh);
          ctx.strokeStyle = `rgba(74,175,50,${0.5 + tD * 0.45})`;
          ctx.lineWidth = sc * 0.9;
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(px + sway - 4.5 * sc, py - sh * 0.55, 5 * sc, 1.8 * sc, -0.45, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100,185,55,${0.55 + tD * 0.4})`;
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(px + sway + 4.5 * sc, py - sh * 0.55, 5 * sc, 1.8 * sc, 0.45, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(80,165,45,${0.5 + tD * 0.4})`;
          ctx.fill();

          if (tD > 0.5 && pi % 2 === 0) {
            ctx.beginPath();
            ctx.arc(px + sway + 5 * sc, py - sh * 0.35, 2.5 * sc, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(230,57,70,${0.6 + tD * 0.3})`;
            ctx.fill();
          }
        }
      });

      birds.forEach(b => {
        b.x += b.speed;
        b.wing += 0.1;
        if (b.x > 1.15) b.x = -0.1;
        const bx = b.x * W + (0.5 - mx) * 18;
        const by = b.y * H + (0.5 - my) * 8;
        ctx.strokeStyle = `rgba(20,30,10,${0.45 + dayProgress * 0.3})`;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(bx - b.size, by + Math.sin(b.wing) * b.size * 0.5);
        ctx.quadraticCurveTo(bx, by - b.size * 0.3, bx + b.size, by + Math.sin(b.wing) * b.size * 0.5);
        ctx.stroke();
      });

      fireflies.forEach(f => {
        f.x += f.vx; f.y += f.vy;
        f.phase += 0.04;
        if (f.x < 0 || f.x > 1) f.vx *= -1;
        if (f.y < 0.4 || f.y > 1) f.vy *= -1;
        const glow = (0.5 + 0.5 * Math.sin(f.phase)) * (1 - dayProgress * 0.8);
        if (glow < 0.05) return;
        const fx = f.x * W + (0.5 - mx) * 8;
        const fy = f.y * H + (0.5 - my) * 5;
        const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, f.r * 5);
        fg.addColorStop(0, f.color + "aa");
        fg.addColorStop(1, "transparent");
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.arc(fx, fy, f.r * 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(fx, fy, f.r, 0, Math.PI * 2);
        ctx.fillStyle = f.color;
        ctx.globalAlpha = glow;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      particles.forEach(p => {
        p.y += p.vy; p.x += p.vx;
        if (p.y < 0) { p.y = 0.95; p.x = Math.random(); }
        ctx.beginPath();
        ctx.arc(p.x * W + (0.5 - mx) * 6, p.y * H + (0.5 - my) * 4, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,230,160,${p.alpha})`;
        ctx.fill();
      });

      const mistGrad = ctx.createLinearGradient(0, HZ - 20, 0, HZ + 40);
      mistGrad.addColorStop(0, "transparent");
      mistGrad.addColorStop(0.5, `rgba(200,220,180,${0.06 + dayProgress * 0.04})`);
      mistGrad.addColorStop(1, "transparent");
      ctx.fillStyle = mistGrad;
      ctx.fillRect(0, HZ - 20, W, 60);

      const vig = ctx.createRadialGradient(W * 0.5, H * 0.5, H * 0.25, W * 0.5, H * 0.5, H * 0.85);
      vig.addColorStop(0, "transparent");
      vig.addColorStop(1, "rgba(0,0,0,0.52)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", display:"block" }}/>;
}

// ─── CANVAS SCENES ────────────────────────────────────────────────────────────
function RootGrowthScene({ height = 200 }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth||400; canvas.height = canvas.offsetHeight||height;
    const W = canvas.width, H = canvas.height;
    const SURFACE = H * 0.28;
    const roots = [];
    roots.push({ x1:W*0.5,y1:SURFACE,x2:W*0.5,y2:H*0.72,w:3.5 });
    [[-0.7,0.22,2.2],[0.7,0.22,2.2],[-0.55,0.20,1.8],[0.55,0.20,1.8],[-0.4,0.32,1.4],[0.4,0.32,1.4]].forEach(([ang,oy,w])=>{
      const len=W*0.26;
      roots.push({x1:W*0.5,y1:SURFACE+H*oy,x2:W*0.5+Math.cos(Math.PI/2+ang)*len*0.6,y2:SURFACE+H*oy+len,cx:W*0.5+Math.cos(Math.PI/2+ang)*len*0.3+(Math.random()-0.5)*20,cy:SURFACE+H*oy+len*0.4,w});
    });
    const nutrients = Array.from({length:25},()=>{const r=roots[Math.floor(Math.random()*roots.length)];return{t:Math.random(),speed:0.003+Math.random()*0.004,root:r,r:2+Math.random()*2,color:`hsl(${90+Math.random()*60},80%,55%)`};});
    const water = Array.from({length:16},()=>({x:Math.random()*W,y:SURFACE+Math.random()*(H-SURFACE-10),r:1.5+Math.random()*3,alpha:0.3+Math.random()*0.4,drift:(Math.random()-0.5)*0.08}));
    const grass = Array.from({length:22},(_, i)=>({x:(i/21)*W+(Math.random()-0.5)*8,h:8+Math.random()*14,phase:Math.random()*Math.PI*2,w:1+Math.random()*2}));
    let t=0;
    const draw=()=>{
      t+=0.012; ctx.clearRect(0,0,W,H);
      const skyGrad=ctx.createLinearGradient(0,0,0,SURFACE);
      skyGrad.addColorStop(0,"#87ceeb"); skyGrad.addColorStop(0.6,"#c8e6a0"); skyGrad.addColorStop(1,"#8bc34a");
      ctx.fillStyle=skyGrad; ctx.fillRect(0,0,W,SURFACE);
      [[SURFACE,H*0.18,"#5d4037","#6d4c41"],[SURFACE+H*0.18,H*0.22,"#4e342e","#5d4037"],[SURFACE+H*0.40,H*0.35,"#3e2723","#4e342e"]].forEach(([y,h,c,c2])=>{
        const lg=ctx.createLinearGradient(0,y,W,y+h); lg.addColorStop(0,c); lg.addColorStop(0.5,c2); lg.addColorStop(1,c);
        ctx.fillStyle=lg; ctx.fillRect(0,y,W,h);
      });
      ctx.beginPath(); ctx.moveTo(0,SURFACE);
      for(let sx=0;sx<=W;sx+=4) ctx.lineTo(sx,SURFACE+Math.sin(sx*0.05+t*0.3)*2);
      ctx.lineTo(W,0); ctx.lineTo(0,0); ctx.closePath(); ctx.fillStyle="#8bc34a"; ctx.fill();
      roots.forEach(root=>{
        const rg=ctx.createLinearGradient(root.x1,root.y1,root.x2,root.y2);
        rg.addColorStop(0,"rgba(141,110,99,0.9)"); rg.addColorStop(1,"rgba(78,52,46,0.6)");
        ctx.beginPath();
        if(root.cx!==undefined){ctx.moveTo(root.x1,root.y1);ctx.quadraticCurveTo(root.cx,root.cy,root.x2,root.y2);}
        else{ctx.moveTo(root.x1,root.y1);ctx.lineTo(root.x2,root.y2);}
        ctx.strokeStyle=rg; ctx.lineWidth=root.w; ctx.lineCap="round"; ctx.stroke();
      });
      water.forEach(d=>{d.x+=d.drift;if(d.x<0||d.x>W)d.drift*=-1;const wg=ctx.createRadialGradient(d.x,d.y,0,d.x,d.y,d.r);wg.addColorStop(0,`rgba(135,206,235,${d.alpha})`);wg.addColorStop(1,"transparent");ctx.fillStyle=wg;ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fill();});
      nutrients.forEach(n=>{n.t-=n.speed;if(n.t<0)n.t=1;const root=n.root;let px,py;if(root.cx!==undefined){const t2=n.t;px=(1-t2)*(1-t2)*root.x1+2*(1-t2)*t2*root.cx+t2*t2*root.x2;py=(1-t2)*(1-t2)*root.y1+2*(1-t2)*t2*root.cy+t2*t2*root.y2;}else{px=root.x1+(root.x2-root.x1)*n.t;py=root.y1+(root.y2-root.y1)*n.t;}const ng=ctx.createRadialGradient(px,py,0,px,py,n.r*2.5);ng.addColorStop(0,n.color);ng.addColorStop(1,"transparent");ctx.fillStyle=ng;ctx.beginPath();ctx.arc(px,py,n.r*2.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(px,py,n.r,0,Math.PI*2);ctx.fillStyle=n.color;ctx.fill();});
      grass.forEach(g=>{const sway=Math.sin(t*1.3+g.phase)*4;ctx.beginPath();ctx.moveTo(g.x,SURFACE+2);ctx.quadraticCurveTo(g.x+sway*0.5,SURFACE-g.h*0.5,g.x+sway,SURFACE-g.h);ctx.strokeStyle="rgba(76,175,80,0.8)";ctx.lineWidth=g.w;ctx.lineCap="round";ctx.stroke();});
      const stemSway=Math.sin(t*0.8)*2;
      ctx.beginPath();ctx.moveTo(W*0.5,SURFACE-2);ctx.quadraticCurveTo(W*0.5+stemSway,SURFACE-H*0.12,W*0.5+stemSway*1.5,SURFACE-H*0.22);ctx.strokeStyle="#4caf50";ctx.lineWidth=3;ctx.lineCap="round";ctx.stroke();
      ctx.beginPath();ctx.arc(W*0.5+stemSway*1.5+8,SURFACE-H*0.22-6,5,0,Math.PI*2);ctx.fillStyle="#e53935";ctx.fill();
      animRef.current=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(animRef.current);
  },[height]);
  return <canvas ref={canvasRef} style={{width:"100%",height,display:"block",borderRadius:14}}/>;
}

function SunriseScene({ height = 180 }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas)return;
    const ctx=canvas.getContext("2d");
    canvas.width=canvas.offsetWidth||400; canvas.height=canvas.offsetHeight||height;
    const W=canvas.width,H=canvas.height,HZ=H*0.42;
    const birds=Array.from({length:7},(_,i)=>({x:Math.random()*W,y:HZ*0.3+Math.random()*HZ*0.5,speed:0.4+Math.random()*0.6,size:3+Math.random()*4,wingPhase:Math.random()*Math.PI*2}));
    const VP={x:W*0.5,y:HZ};
    const rows=Array.from({length:11},(_,i)=>({xBottom:W*0.5-W*0.6+i*(W*1.2/10),phase:i*0.5}));
    const motes=Array.from({length:20},()=>({x:Math.random()*W,y:HZ+Math.random()*(H-HZ),r:0.5+Math.random()*1.5,speed:0.1+Math.random()*0.25,alpha:0.1+Math.random()*0.3}));
    let t=0;
    const draw=()=>{
      t+=0.008; ctx.clearRect(0,0,W,H);
      const sp=(Math.sin(t*0.15)+1)/2;
      const sky=ctx.createLinearGradient(0,0,0,HZ);
      sky.addColorStop(0,`hsl(${240-sp*180},60%,${8+sp*12}%)`); sky.addColorStop(0.55,`hsl(${20+sp*20},80%,${30+sp*20}%)`); sky.addColorStop(1,`hsl(${35+sp*10},90%,${55+sp*15}%)`);
      ctx.fillStyle=sky; ctx.fillRect(0,0,W,HZ);
      const sunX=W*0.62,sunY=HZ*(0.8-sp*0.55);
      const sg=ctx.createRadialGradient(sunX,sunY,0,sunX,sunY,H*0.55);
      sg.addColorStop(0,`rgba(255,200,60,${0.35+sp*0.25})`); sg.addColorStop(1,"transparent");
      ctx.fillStyle=sg; ctx.fillRect(0,0,W,HZ);
      ctx.beginPath(); ctx.arc(sunX,sunY,11+sp*4,0,Math.PI*2); ctx.fillStyle=`rgba(255,220,80,${0.7+sp*0.3})`; ctx.fill();
      birds.forEach(b=>{b.x+=b.speed;if(b.x>W+20)b.x=-20;b.wingPhase+=0.08;ctx.strokeStyle="rgba(20,30,10,0.6)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(b.x-b.size,b.y+Math.sin(b.wingPhase)*b.size*0.5);ctx.quadraticCurveTo(b.x,b.y-b.size*0.3,b.x+b.size,b.y+Math.sin(b.wingPhase)*b.size*0.5);ctx.stroke();});
      const ground=ctx.createLinearGradient(0,HZ,0,H);
      ground.addColorStop(0,"#2d5016"); ground.addColorStop(0.5,"#1e3d0d"); ground.addColorStop(1,"#0f1e07");
      ctx.fillStyle=ground; ctx.fillRect(0,HZ,W,H-HZ);
      rows.forEach(row=>{
        for(let pi=0;pi<5;pi++){const tP=(pi+0.5)/5,tD=0.15+tP*0.8,py=HZ+tD*(H-HZ),px=VP.x+(row.xBottom-VP.x)*tD,sc=0.3+tD*1.2,sway=Math.sin(t*1.1+row.phase+pi)*1.2*sc,sh=8*sc;
        ctx.beginPath();ctx.moveTo(px,py);ctx.quadraticCurveTo(px+sway*0.5,py-sh*0.5,px+sway,py-sh);ctx.strokeStyle=`rgba(90,180,50,${0.5+tD*0.4})`;ctx.lineWidth=sc*0.8;ctx.stroke();
        ctx.beginPath();ctx.ellipse(px+sway-3*sc,py-sh*0.6,4*sc,1.5*sc,-0.4,0,Math.PI*2);ctx.fillStyle=`rgba(127,209,79,${0.5+tD*0.4})`;ctx.fill();}
      });
      motes.forEach(p=>{p.y-=p.speed;p.x+=Math.sin(t+p.alpha*10)*0.2;if(p.y<HZ){p.y=H;p.x=Math.random()*W;}ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(200,230,160,${p.alpha})`;ctx.fill();});
      const vig=ctx.createRadialGradient(W/2,H/2,H*0.25,W/2,H/2,H*0.75);
      vig.addColorStop(0,"transparent"); vig.addColorStop(1,"rgba(0,0,0,0.38)");
      ctx.fillStyle=vig; ctx.fillRect(0,0,W,H);
      animRef.current=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(animRef.current);
  },[height]);
  return <canvas ref={canvasRef} style={{width:"100%",height,display:"block",borderRadius:14}}/>;
}

function DiseaseScene({ height = 180 }) {
  const canvasRef=useRef(null);const animRef=useRef(null);
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");
    canvas.width=canvas.offsetWidth||400;canvas.height=canvas.offsetHeight||height;
    const W=canvas.width,H=canvas.height;
    const rain=Array.from({length:60},()=>({x:Math.random()*W*1.2-W*0.1,y:Math.random()*H,speed:3+Math.random()*5,len:8+Math.random()*14,alpha:0.15+Math.random()*0.35}));
    const spores=Array.from({length:25},()=>({x:Math.random()*W,y:Math.random()*H,r:1+Math.random()*3,vx:(Math.random()-0.5)*0.5,vy:(Math.random()-0.5)*0.5,pulse:Math.random()*Math.PI*2,color:`hsl(${Math.random()>0.5?"0,80%,50%":"30,90%,45%"})`}));
    let t=0;
    const draw=()=>{
      t+=0.015;ctx.clearRect(0,0,W,H);
      const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,"#1a0505");bg.addColorStop(0.4,"#2d0f0a");bg.addColorStop(1,"#0a0f05");ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
      ctx.save();ctx.translate(W*0.5,H*0.58);ctx.beginPath();ctx.moveTo(0,-60);ctx.bezierCurveTo(40,-40,55,0,45,35);ctx.bezierCurveTo(35,60,10,65,0,55);ctx.bezierCurveTo(-10,65,-35,60,-45,35);ctx.bezierCurveTo(-55,0,-40,-40,0,-60);ctx.fillStyle="#1e4a10";ctx.fill();
      [[- 15,-20,8],[20,5,10],[-5,25,7],[15,-40,5],[-22,10,6]].forEach(([sx,sy,sr],si)=>{const pulse=0.7+0.3*Math.sin(t*2+si*0.8);ctx.beginPath();ctx.arc(sx,sy,sr*pulse,0,Math.PI*2);ctx.fillStyle="rgba(80,20,5,0.9)";ctx.fill();});
      ctx.restore();
      rain.forEach(r=>{r.y+=r.speed;if(r.y>H+r.len){r.y=-r.len;r.x=Math.random()*W;}ctx.beginPath();ctx.moveTo(r.x,r.y);ctx.lineTo(r.x-r.len*0.15,r.y-r.len);ctx.strokeStyle=`rgba(100,150,200,${r.alpha})`;ctx.lineWidth=0.7;ctx.stroke();});
      spores.forEach(s=>{s.x+=s.vx;s.y+=s.vy;s.pulse+=0.05;if(s.x<0||s.x>W)s.vx*=-1;if(s.y<0||s.y>H)s.vy*=-1;ctx.beginPath();ctx.arc(s.x,s.y,s.r*(0.8+Math.sin(s.pulse)*0.4),0,Math.PI*2);ctx.fillStyle=s.color;ctx.fill();});
      const vig=ctx.createRadialGradient(W/2,H/2,H*0.2,W/2,H/2,H*0.8);vig.addColorStop(0,"transparent");vig.addColorStop(1,"rgba(0,0,0,0.5)");ctx.fillStyle=vig;ctx.fillRect(0,0,W,H);
      animRef.current=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(animRef.current);
  },[height]);
  return <canvas ref={canvasRef} style={{width:"100%",height,display:"block",borderRadius:14}}/>;
}

function NeuralScene({ height = 180 }) {
  const canvasRef=useRef(null);const animRef=useRef(null);
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");
    canvas.width=canvas.offsetWidth||400;canvas.height=canvas.offsetHeight||height;
    const W=canvas.width,H=canvas.height;
    const layers=[3,5,5,3];
    const layerX=layers.map((_,i)=>W*0.12+i*(W*0.76/(layers.length-1)));
    const nodes=layers.map((count,li)=>Array.from({length:count},(_,ni)=>({x:layerX[li],y:H*0.15+ni*((H*0.7)/(count-1||1)),layer:li,active:0})));
    const pulses=[];
    const addPulse=()=>{const fl=Math.floor(Math.random()*(layers.length-1));pulses.push({fromLayer:fl,fromNode:Math.floor(Math.random()*layers[fl]),toNode:Math.floor(Math.random()*layers[fl+1]),progress:0,speed:0.008+Math.random()*0.012,color:`hsl(${130+Math.random()*80},80%,55%)`});};
    for(let i=0;i<8;i++)addPulse();
    let t=0;
    const draw=()=>{
      t+=0.01;ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#020814";ctx.fillRect(0,0,W,H);
      for(let li=0;li<layers.length-1;li++)for(let ni=0;ni<layers[li];ni++)for(let nj=0;nj<layers[li+1];nj++){const from=nodes[li][ni],to=nodes[li+1][nj];ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(to.x,to.y);ctx.strokeStyle="rgba(0,180,100,0.07)";ctx.lineWidth=0.5;ctx.stroke();}
      pulses.forEach(p=>{p.progress+=p.speed;if(p.progress>=1){p.progress=0;p.fromLayer=Math.floor(Math.random()*(layers.length-1));p.fromNode=Math.floor(Math.random()*layers[p.fromLayer]);p.toNode=Math.floor(Math.random()*layers[p.fromLayer+1]);}const from=nodes[p.fromLayer][p.fromNode],to=nodes[p.fromLayer+1][p.toNode];const px=from.x+(to.x-from.x)*p.progress,py=from.y+(to.y-from.y)*p.progress;const pg=ctx.createRadialGradient(px,py,0,px,py,8);pg.addColorStop(0,p.color.replace("hsl(","hsla(").replace(")",",0.8)"));pg.addColorStop(1,"transparent");ctx.fillStyle=pg;ctx.beginPath();ctx.arc(px,py,8,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(px,py,2.5,0,Math.PI*2);ctx.fillStyle=p.color;ctx.fill();if(p.progress>0.95)nodes[p.fromLayer+1][p.toNode].active=0.8;});
      nodes.flat().forEach(node=>{node.active=Math.max(0,node.active-0.015);const pulse=0.7+0.3*Math.sin(t*1.5+node.x*0.02+node.y*0.02);const glow=node.active>0?node.active:pulse*0.4;const ng=ctx.createRadialGradient(node.x,node.y,0,node.x,node.y,14);ng.addColorStop(0,`rgba(0,230,130,${glow*0.5})`);ng.addColorStop(1,"transparent");ctx.fillStyle=ng;ctx.beginPath();ctx.arc(node.x,node.y,14,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(node.x,node.y,5,0,Math.PI*2);ctx.fillStyle=`rgba(0,200,100,${0.3+glow*0.5})`;ctx.fill();ctx.beginPath();ctx.arc(node.x,node.y,5,0,Math.PI*2);ctx.strokeStyle=`rgba(0,230,130,${0.5+glow*0.5})`;ctx.lineWidth=1.5;ctx.stroke();});
      animRef.current=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(animRef.current);
  },[height]);
  return <canvas ref={canvasRef} style={{width:"100%",height,display:"block",borderRadius:14}}/>;
}

function MarketScene({ height = 180 }) {
  const canvasRef=useRef(null);const animRef=useRef(null);
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");
    canvas.width=canvas.offsetWidth||400;canvas.height=canvas.offsetHeight||height;
    const W=canvas.width,H=canvas.height,GY=H*0.72;
    const lanterns=Array.from({length:8},(_,i)=>({x:W*0.1+i*W*0.12,y:GY-20-Math.random()*15,phase:Math.random()*Math.PI*2,r:4+Math.random()*3}));
    const people=Array.from({length:6},()=>({x:W*0.05+Math.random()*W*0.9,y:GY-2,h:16+Math.random()*10,speed:(Math.random()-0.5)*0.4}));
    const prices=[{x:W*0.18,y:GY*0.55,text:"₹24/kg",phase:0},{x:W*0.45,y:GY*0.45,text:"₹31/kg",phase:1},{x:W*0.72,y:GY*0.55,text:"₹18/kg",phase:2}];
    let t=0;
    const draw=()=>{
      t+=0.01;ctx.clearRect(0,0,W,H);
      const sky=ctx.createLinearGradient(0,0,0,GY);sky.addColorStop(0,"#0d0a1a");sky.addColorStop(0.4,"#2a1020");sky.addColorStop(0.75,"#5c2a10");sky.addColorStop(1,"#8a3a10");ctx.fillStyle=sky;ctx.fillRect(0,0,W,GY);
      [0.12,0.38,0.64].forEach((sx,si)=>{const stx=W*sx,stallW=W*0.25,stallH=H*0.25,sty=GY-stallH;const colors=["#c0392b","#2980b9","#27ae60"];ctx.beginPath();ctx.moveTo(stx-stallW*0.1,sty);ctx.lineTo(stx+stallW*1.1,sty);ctx.lineTo(stx+stallW,sty+stallH*0.28);ctx.lineTo(stx,sty+stallH*0.28);ctx.closePath();ctx.fillStyle=colors[si];ctx.fill();for(let tp=0;tp<5;tp++){ctx.beginPath();ctx.arc(stx+stallW*0.12+tp*stallW*0.18,sty+stallH*0.2,5,0,Math.PI*2);ctx.fillStyle=`hsl(${5+tp*8},85%,${45+tp*5}%)`;ctx.fill();}});
      const ground=ctx.createLinearGradient(0,GY,0,H);ground.addColorStop(0,"#3e2a1a");ground.addColorStop(1,"#1a0f0a");ctx.fillStyle=ground;ctx.fillRect(0,GY,W,H-GY);
      lanterns.forEach(ln=>{const sway=Math.sin(t*0.9+ln.phase)*3,lx=ln.x+sway,ly=ln.y;const lg=ctx.createRadialGradient(lx,ly,0,lx,ly,ln.r*5);lg.addColorStop(0,"rgba(255,200,50,0.5)");lg.addColorStop(1,"transparent");ctx.fillStyle=lg;ctx.beginPath();ctx.arc(lx,ly,ln.r*5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(lx,ly,ln.r,ln.r*1.4,0,0,Math.PI*2);ctx.fillStyle=`rgba(255,${160+Math.sin(t*2+ln.phase)*30},40,0.9)`;ctx.fill();});
      prices.forEach(p=>{const py=p.y+Math.sin(t*0.7+p.phase)*4;const tw=ctx.measureText(p.text).width+10;ctx.fillStyle="rgba(30,15,5,0.7)";ctx.beginPath();ctx.roundRect(p.x-tw/2,py-9,tw,16,4);ctx.fill();ctx.fillStyle="rgba(255,200,60,0.9)";ctx.font="bold 10px sans-serif";ctx.textAlign="center";ctx.fillText(p.text,p.x,py+2);});
      people.forEach(p=>{p.x+=p.speed;if(p.x<-10)p.x=W+10;if(p.x>W+10)p.x=-10;ctx.fillStyle="rgba(10,5,3,0.75)";ctx.beginPath();ctx.ellipse(p.x,p.y-p.h*0.35,3.5,5.5,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(p.x,p.y-p.h*0.82,3.5,0,Math.PI*2);ctx.fill();});
      const vig=ctx.createRadialGradient(W/2,H/2,H*0.2,W/2,H/2,H*0.75);vig.addColorStop(0,"transparent");vig.addColorStop(1,"rgba(0,0,0,0.45)");ctx.fillStyle=vig;ctx.fillRect(0,0,W,H);
      animRef.current=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(animRef.current);
  },[height]);
  return <canvas ref={canvasRef} style={{width:"100%",height,display:"block",borderRadius:14}}/>;
}

function SceneForType({ type, height }) {
  switch(type) {
    case "sunrise": return <SunriseScene height={height}/>;
    case "disease": return <DiseaseScene height={height}/>;
    case "neural":  return <NeuralScene  height={height}/>;
    case "market":  return <MarketScene  height={height}/>;
    default:        return <SunriseScene height={height}/>;
  }
}

function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");
    let animId;
    const W=canvas.offsetWidth,H=canvas.offsetHeight;
    canvas.width=W;canvas.height=H;
    const particles=Array.from({length:30},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*3+1,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,alpha:Math.random()*0.5+0.1,color:["#c8e6a0","#a5d6a7","#f9a825","#ef9a9a"][Math.floor(Math.random()*4)]}));
    const draw=()=>{ctx.clearRect(0,0,W,H);particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.color;ctx.globalAlpha=p.alpha;ctx.fill();});ctx.globalAlpha=1;animId=requestAnimationFrame(draw);};
    draw();return()=>cancelAnimationFrame(animId);
  },[]);
  return <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}/>;
}

function StageStep({stage,isActive,onClick}){
  return(
    <div onClick={onClick} style={{cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6,minWidth:72,transition:"transform 0.25s ease",transform:isActive?"translateY(-6px) scale(1.08)":"none"}}>
      <div style={{width:50,height:50,borderRadius:"50%",background:isActive?stage.color:"#f0f0f0",border:isActive?`3px solid ${stage.accentColor}`:"2px solid #e0e0e0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:isActive?`0 6px 20px ${stage.color}55`:"none",transition:"all 0.3s ease"}}>{stage.emoji}</div>
      <span style={{fontSize:9,fontWeight:isActive?700:400,color:isActive?stage.color:"#9e9e9e",textAlign:"center",maxWidth:66,lineHeight:1.2,fontFamily:"sans-serif"}}>{stage.title}</span>
    </div>
  );
}

function TomatoGuidePage(){
  const [activeStage,setActiveStage]=useState(0);
  const [animKey,setAnimKey]=useState(0);
  const [scrolled,setScrolled]=useState(false);
  const stage=stages[activeStage];
  useEffect(()=>{const onScroll=()=>setScrolled(window.scrollY>16);window.addEventListener("scroll",onScroll,{passive:true});return()=>window.removeEventListener("scroll",onScroll);},[]);
  const goTo=(i)=>{setActiveStage(i);setAnimKey(k=>k+1);};
  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#f9f6f0 0%,#eef5e8 50%,#f5f0eb 100%)",fontFamily:"'Georgia','Palatino',serif",overflowX:"hidden"}}>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(32px) scale(0.97);}to{opacity:1;transform:none;}}@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
      <header style={{position:"fixed",top:0,zIndex:100,width:"100%",transition:"all 0.3s",backdropFilter:scrolled?"blur(18px)":"none",background:scrolled?"rgba(255,255,255,0.72)":"transparent",borderBottom:scrolled?"1px solid rgba(255,255,255,0.5)":"none",boxShadow:scrolled?"0 20px 50px rgba(26,58,10,0.10)":"none"}}>
        <div style={{maxWidth:1120,margin:"0 auto",height:72,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px"}}>
          <button onClick={()=>window.location.href="/"} style={{display:"flex",alignItems:"center",gap:12,background:"none",border:"none",cursor:"pointer"}}><span style={{width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,#2D5016,#1a3a0a)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🍅</span><span><span style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:"0.35em",color:"rgba(145,180,22,0.9)",textTransform:"uppercase",fontFamily:"sans-serif"}}>Agro AI</span><span style={{display:"block",fontSize:14,fontWeight:600,color:"#8BC34A",fontFamily:"sans-serif"}}>Tomato Disease Identifier</span></span></button>
          <button onClick={()=>window.location.href="/"} style={{background:"white",border:"1px solid rgba(45,80,22,0.15)",borderRadius:999,padding:"8px 20px",fontSize:13,fontWeight:600,color:"#1a3a0a",cursor:"pointer",fontFamily:"sans-serif",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>← Back Home</button>
        </div>
      </header>
      <header style={{position:"relative",overflow:"hidden",background:"linear-gradient(135deg,#1b3a0f 0%,#2d5016 60%,#1a4a2e 100%)",padding:"100px 24px 90px",textAlign:"center"}}>
        <ParticleField/>
        <div style={{position:"relative",zIndex:1}}>
          <h1 style={{fontSize:"clamp(2rem,6vw,3.8rem)",fontWeight:900,color:"#ffffff",margin:"0 0 18px",lineHeight:1.1,textShadow:"0 4px 24px rgba(0,0,0,0.3)"}}>Tomato Cultivation<br/><span style={{color:"#f9a825"}}>Complete Guide</span></h1>
          <p style={{fontSize:17,color:"#c8e6a0",maxWidth:520,margin:"0 auto 36px",lineHeight:1.75,fontFamily:"sans-serif",fontWeight:400}}>From seed selection to market — a farmer's complete journey to a healthier, more profitable harvest.</p>
        </div>
        <svg viewBox="0 0 1440 60" style={{position:"absolute",bottom:0,left:0,width:"100%",display:"block"}} preserveAspectRatio="none"><path d="M0 60 Q360 0 720 40 Q1080 80 1440 20 L1440 60 Z" fill="#f9f6f0"/></svg>
      </header>
      <section style={{padding:"48px 16px 0",maxWidth:960,margin:"0 auto"}}>
        <div style={{overflowX:"auto",paddingBottom:12}}><div style={{display:"flex",alignItems:"flex-start",position:"relative",minWidth:600}}><div style={{position:"absolute",top:24,left:36,right:36,height:3,background:"#e0e0e0",borderRadius:4,zIndex:0}}/><div style={{position:"absolute",top:24,left:36,width:`${(activeStage/(stages.length-1))*100}%`,height:3,background:`linear-gradient(90deg,#2d5016,${stage.accentColor})`,borderRadius:4,zIndex:1,transition:"width 0.5s ease"}}/>{stages.map((s,i)=>(<div key={s.id} style={{flex:1,zIndex:2,display:"flex",justifyContent:"center"}}><StageStep stage={s} isActive={activeStage===i} onClick={()=>goTo(i)}/></div>))}</div></div>
        <div style={{display:"flex",justifyContent:"center",gap:12,marginTop:28}}>{[{label:"← Previous",target:Math.max(0,activeStage-1),disabled:activeStage===0},{label:"Next →",target:Math.min(stages.length-1,activeStage+1),disabled:activeStage===stages.length-1}].map(({label,target,disabled})=>(<button key={label} onClick={()=>goTo(target)} disabled={disabled} style={{background:disabled?"#f0f0f0":stage.color,color:disabled?"#bdbdbd":"white",border:"none",borderRadius:999,padding:"10px 26px",fontSize:13,cursor:disabled?"not-allowed":"pointer",fontFamily:"sans-serif",fontWeight:700}}>{label}</button>))}</div>
      </section>
      <section style={{padding:"40px 16px 60px",maxWidth:960,margin:"0 auto"}}>
        <div key={animKey} style={{background:"white",borderRadius:28,overflow:"hidden",boxShadow:`0 20px 60px ${stage.color}22,0 4px 16px rgba(0,0,0,0.06)`,animation:"slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1) both"}}>
          <div style={{background:`linear-gradient(135deg,${stage.color} 0%,${stage.accentColor} 100%)`,padding:"36px 44px",display:"flex",alignItems:"center",gap:28,flexWrap:"wrap"}}>
            <div style={{width:84,height:84,borderRadius:22,background:"rgba(255,255,255,0.15)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",animation:"float 3s ease-in-out infinite",flexShrink:0}}>{stage.icon}</div>
            <div><div style={{fontSize:10,letterSpacing:3,color:"rgba(255,255,255,0.65)",textTransform:"uppercase",fontFamily:"sans-serif",marginBottom:6}}>Stage {activeStage+1} of {stages.length}</div><h2 style={{fontSize:"clamp(1.4rem,3.5vw,2rem)",fontWeight:900,color:"white",margin:"0 0 6px",lineHeight:1.2}}>{stage.title}</h2><p style={{color:"rgba(255,255,255,0.8)",margin:0,fontSize:14,fontFamily:"sans-serif"}}>{stage.subtitle}</p></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))"}}>
            <div style={{padding:"32px 36px",borderRight:"1px solid #f0f0f0"}}><p style={{fontSize:11,letterSpacing:2,color:"#9e9e9e",textTransform:"uppercase",fontFamily:"sans-serif",marginBottom:14}}>About This Stage</p><p style={{fontSize:15.5,color:"#3d3d3a",lineHeight:1.85,margin:0}}>{stage.detail}</p></div>
            <div style={{padding:"32px 36px",background:stage.lightColor}}><p style={{fontSize:11,letterSpacing:2,color:stage.color,textTransform:"uppercase",fontFamily:"sans-serif",marginBottom:18}}>Key Tips</p><ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:14}}>{stage.tips.map((tip,i)=>(<li key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}><span style={{width:22,height:22,borderRadius:"50%",background:stage.color,color:"white",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"sans-serif",marginTop:2}}>{i+1}</span><span style={{fontSize:14,color:"#4a4a47",lineHeight:1.65,fontFamily:"sans-serif"}}>{tip}</span></li>))}</ul></div>
          </div>
        </div>
      </section>
      <footer style={{background:"#1b3a0f",padding:"40px 24px",textAlign:"center"}}><div style={{fontSize:26,marginBottom:10}}>🍅</div><p style={{color:"#a5d6a7",fontFamily:"sans-serif",fontSize:13,margin:0}}>Tomato Cultivation Guide · Built for Indian farmers · Happy growing!</p><button onClick={()=>window.location.href="/"} style={{marginTop:20,background:"transparent",border:"1px solid rgba(165,214,167,0.4)",borderRadius:999,padding:"8px 22px",color:"#a5d6a7",fontSize:13,cursor:"pointer",fontFamily:"sans-serif"}}>← Back to Home</button></footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const { user, isSignedIn } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive:true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMouseMove = (e) => {
    setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden text-[#1A1A1A]"
      style={{ fontFamily:"Inter,ui-sans-serif,system-ui,-apple-system,sans-serif", background:"linear-gradient(180deg,#FEFDFB 0%,#F5F1E8 48%,#F3EFE4 100%)", scrollBehavior:"smooth" }}
      onMouseMove={handleMouseMove}
    >
      <style>{`
        :root{--forest:#2D5016;--forest-deep:#1a3a0a;--tomato:#E63946;--cream:#F5F1E8;}
        .glass{backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);background:rgba(255,255,255,0.58);}
        .shadow-soft{box-shadow:0 20px 50px rgba(26,58,10,0.12);}
        .text-3d{text-shadow:0 1px 0 rgba(255,255,255,0.16),0 10px 28px rgba(26,58,10,0.18),0 2px 0 rgba(26,58,10,0.12);}
        .ring-glow{box-shadow:0 0 0 1px rgba(45,80,22,0.09),0 12px 28px rgba(45,80,22,0.10),0 0 35px rgba(127,209,79,0.12);}
        .nav-link{position:relative;background:none;border:none;cursor:pointer;font-family:inherit;padding:4px 0;font-size:14px;font-weight:500;color:rgba(44,44,44,0.8);transition:color 0.2s;text-decoration:none;display:inline-block;}
        .nav-link::after{content:'';position:absolute;left:0;bottom:-3px;width:0;height:2px;border-radius:999px;background:linear-gradient(90deg,#E63946,#D4A574);transition:width .25s ease;}
        .nav-link:hover{color:#2D5016;} .nav-link:hover::after{width:100%;}
        @keyframes heroFloat{0%,100%{transform:translateY(0) rotate(-1deg);}50%{transform:translateY(-14px) rotate(1deg);}}
        @keyframes badge-enter{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:none;}}
        @keyframes float-y{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
      `}</style>

      {/* HEADER */}
      <header
        className="fixed top-0 z-[100] w-full transition-all duration-300"
        style={{
          backdropFilter: scrolled ? "blur(22px)" : "blur(0px)",
          WebkitBackdropFilter: scrolled ? "blur(22px)" : "blur(0px)",
          background: scrolled ? "rgba(254,253,251,0.82)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(45,80,22,0.08)" : "none",
          boxShadow: scrolled ? "0 2px 32px rgba(26,58,10,0.10)" : "none",
        }}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button className="flex items-center gap-3" onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}
            style={{ background:"none", border:"none", cursor:"pointer", padding:0 }}>
            <span style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#2D5016,#1a3a0a)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 12px rgba(45,80,22,0.3)" }}>
              <Leaf style={{ width:18, height:18, color:"white" }}/>
            </span>
            <span>
              <span style={{ display:"block", fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.32em", color:"rgba(45,80,22,0.65)", textTransform:"uppercase" }}>Agro AI</span>
              <span style={{ display:"block", fontSize:"0.85rem", fontWeight:600, color:"#1a3a0a", letterSpacing:"-0.01em" }}>Tomato Disease Identifier</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#home" className="nav-link">🏠 Home</a>
            <a href="#features" className="nav-link">🌿 Features</a>
            <button onClick={() => window.location.href = "/model-info"} className="nav-link">🧠 Model</button>
            <button onClick={() => window.location.href = "/diseases"} className="nav-link">🦠 Diseases</button>
            <button onClick={() => window.location.href = "/news"} className="nav-link">📰 News</button>
            <div style={{ width:1, height:22, background:"rgba(45,80,22,0.15)" }}/>
            {isSignedIn ? (
              <button onClick={() => window.location.href = "/account"}
                style={{ display:"flex", alignItems:"center", gap:8, background:"white", border:"1.5px solid rgba(45,80,22,0.15)", borderRadius:999, padding:"6px 14px 6px 8px", cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", transition:"all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="#2D5016"; e.currentTarget.style.boxShadow="0 4px 16px rgba(45,80,22,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(45,80,22,0.15)"; e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.06)"; }}>
                {user?.picture
                  ? <img src={user.picture} alt="" style={{ width:26, height:26, borderRadius:"50%", objectFit:"cover" }}/>
                  : <span style={{ width:26, height:26, borderRadius:"50%", background:"#2D5016", display:"flex", alignItems:"center", justifyContent:"center" }}><User style={{ width:14, height:14, color:"white" }}/></span>
                }
                <span style={{ fontSize:13, fontWeight:600, color:"#1a3a0a" }}>{user?.name?.split(" ")[0]}</span>
              </button>
            ) : (
              <button onClick={() => window.location.href = "/account"}
                style={{ display:"flex", alignItems:"center", gap:6, background:"white", border:"1.5px solid rgba(45,80,22,0.15)", borderRadius:999, padding:"7px 16px", fontSize:13, fontWeight:600, color:"#1a3a0a", cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", transition:"all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background="#f0f7e6"; e.currentTarget.style.borderColor="#2D5016"; }}
                onMouseLeave={e => { e.currentTarget.style.background="white"; e.currentTarget.style.borderColor="rgba(45,80,22,0.15)"; }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:"#E63946", flexShrink:0 }}/>
                Sign In
              </button>
            )}
            <button onClick={() => window.location.href = "/predictions"}
              style={{ background:"linear-gradient(135deg,#E63946,#c0392b)", color:"white", border:"none", borderRadius:999, padding:"8px 20px", fontSize:13, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 16px rgba(230,57,70,0.35)", transition:"all 0.2s", display:"flex", alignItems:"center", gap:6 }}
              onMouseEnter={e => { e.currentTarget.style.transform="scale(1.03)"; e.currentTarget.style.boxShadow="0 6px 20px rgba(230,57,70,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.boxShadow="0 4px 16px rgba(230,57,70,0.35)"; }}>
              🍅 Analyze Leaf
            </button>
          </nav>

          <button className="flex md:hidden h-10 w-10 items-center justify-center rounded-full border border-[#2D5016]/15 bg-white text-[#1a3a0a] shadow-sm transition hover:scale-105"
            onClick={() => setMobileMenuOpen(v => !v)}>
            {mobileMenuOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{opacity:0,y:-16,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-16,scale:0.97}}
              transition={{type:"spring",stiffness:280,damping:24}}
              className="mx-3 mb-3 rounded-3xl border border-white/60 bg-white/95 p-4 shadow-2xl md:hidden"
              style={{backdropFilter:"blur(20px)"}}>
              <div className="flex flex-col gap-2">
                {[
                  {label:"🏠 Home",action:()=>window.scrollTo({top:0,behavior:"smooth"})},
                  {label:"🌿 Features",action:()=>document.getElementById("features")?.scrollIntoView({behavior:"smooth"})},
                  {label:"🧠 Model",action:()=>window.location.href="/model-info"},
                  {label:"🦠 Diseases",action:()=>window.location.href="/diseases"},
                  {label:"📰 News",action:()=>window.location.href="/news"},
                  {label:"🗺️ Map",action:()=>window.location.href="/map"},
                ].map(item=>(
                  <button key={item.label} onClick={()=>{item.action();setMobileMenuOpen(false);}}
                    style={{textAlign:"left",background:"none",border:"none",borderRadius:16,padding:"10px 14px",fontSize:14,fontWeight:500,color:"#1a3a0a",cursor:"pointer",transition:"background 0.15s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#f0f7e6"}
                    onMouseLeave={e=>e.currentTarget.style.background="none"}>{item.label}</button>
                ))}
                <div style={{borderTop:"1px solid rgba(45,80,22,0.1)",marginTop:4,paddingTop:8}}>
                  <button onClick={()=>{window.location.href="/predictions";setMobileMenuOpen(false);}}
                    style={{width:"100%",background:"linear-gradient(135deg,#E63946,#c0392b)",color:"white",border:"none",borderRadius:16,padding:"12px 16px",fontSize:14,fontWeight:700,cursor:"pointer"}}>
                    🍅 Analyze a Leaf →
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main id="home" className="relative pt-[72px]">

        {/* HERO */}
        <section className="relative min-h-[calc(100vh-72px)] overflow-hidden">
          <HeroCanvas3D mouseX={mouse.x} mouseY={mouse.y}/>
          <div className="absolute inset-0"
            style={{background:"linear-gradient(90deg,rgba(5,12,3,0.78) 0%,rgba(5,12,3,0.46) 40%,rgba(5,12,3,0.15) 68%,rgba(5,12,3,0.05) 100%)"}}/>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div style={{position:"absolute",right:"12%",top:"22%",fontSize:"clamp(48px,6vw,80px)",filter:"drop-shadow(0 8px 24px rgba(230,57,70,0.4))",animation:"float-y 4s ease-in-out infinite",transform:`translate(${(0.5-mouse.x)*-18}px,${(0.5-mouse.y)*-12}px)`,transition:"transform 0.3s ease"}}>🍅</div>
            <div style={{position:"absolute",right:"22%",top:"55%",fontSize:"clamp(28px,3vw,44px)",filter:"drop-shadow(0 4px 12px rgba(127,209,79,0.5))",animation:"float-y 5.5s ease-in-out 1s infinite",transform:`translate(${(0.5-mouse.x)*-28}px,${(0.5-mouse.y)*-18}px)`,transition:"transform 0.3s ease"}}>🌿</div>
            <div style={{position:"absolute",right:"6%",top:"40%",fontSize:"22px",filter:"drop-shadow(0 2px 8px rgba(249,168,37,0.6))",animation:"float-y 3.8s ease-in-out 0.5s infinite",transform:`translate(${(0.5-mouse.x)*-35}px,${(0.5-mouse.y)*-22}px)`,transition:"transform 0.3s ease"}}>✨</div>
          </div>
          <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
            <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.7}} className="relative z-10 max-w-3xl">
              <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-medium text-white shadow-sm"
                style={{backdropFilter:"blur(12px)"}}>
                <BadgeCheck className="h-4 w-4 text-[#7FD14F]"/>
                AGRO AI Model  · 10 disease classes
              </motion.div>
              <motion.h1 className="max-w-4xl font-serif text-5xl font-bold leading-[0.98] tracking-tight text-white text-3d sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
                initial="hidden" animate="visible"
                variants={{hidden:{},visible:{transition:{staggerChildren:0.06,delayChildren:0.25}}}}>
                {"Identify Tomato Diseases. Instantly.".split(" ").map((word,i)=>(
                  <motion.span key={`${word}-${i}`} className="mr-4 inline-block"
                    variants={{hidden:{opacity:0,y:32,rotateX:-75},visible:{opacity:1,y:0,rotateX:0}}}
                    transition={{type:"spring",stiffness:120,damping:16}}>{word}</motion.span>
                ))}
              </motion.h1>
              <motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.5,duration:0.6}}
                className="mt-6 max-w-2xl text-lg leading-8 text-white/90 sm:text-xl">
                <strong className="text-[#7FD14F]">AI</strong>-powered disease detection — for modern farmers, with warm agricultural interface and careful backend that protects against dark or blurry uploads.
              </motion.p>
              <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.62,duration:0.6}}
                className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button onClick={()=>window.location.href="/predictions"}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E63946] px-7 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:bg-[#C86432]">
                  🍅 Analyze Leaf <ArrowRight className="h-4 w-4"/>
                </button>
                <button onClick={()=>document.getElementById("features")?.scrollIntoView({behavior:"smooth"})}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/12 px-7 py-4 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:scale-[1.03] hover:bg-white/20"
                  style={{backdropFilter:"blur(12px)"}}>
                  Explore Features <ChevronRight className="h-4 w-4"/>
                </button>
              </motion.div>
              <div className="mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
                {[["94%+","Accuracy"],["10 classes","Tomato diseases"],["blur/dark","image validation"]].map(([value,label],idx)=>(
                  <motion.div key={label} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.72+idx*0.1,duration:0.45}}
                    className="glass ring-glow rounded-3xl border border-white/20 p-5 text-white">
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="mt-1 text-sm text-white/85">{label}</div>
                  </motion.div>
                ))}
              </div>
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2}}
                className="mt-10 flex items-center gap-2 text-white/40 text-xs"
                style={{animation:"float-y 2s ease-in-out infinite"}}>
                <div style={{width:1,height:28,background:"rgba(255,255,255,0.2)"}}/>
                Scroll to explore
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* INTRO */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2D5016]/70">Explore the platform</p>
            <h2 className="mt-3 font-serif text-4xl font-bold text-[#1a3a0a] sm:text-5xl">A modern tomato-tech experience built for clarity.</h2>
            <p className="mt-4 text-base leading-7 text-[#2C2C2C]/75">Complete agricultural toolkit — from AI disease detection to cultivation guides, market news, model information, and multi-language support.</p>
          </div>
        </section>

        {/* ANALYZE SECTION */}
        <section id="analyze" className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div initial={{opacity:0,x:-18}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
              className="glass shadow-soft rounded-[2rem] border border-white/70 p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#2D5016]/70">Leaf analysis</p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-[#1a3a0a]">AGRO AI — Analyze with our Trained AI Model</h2>
              <p className="mt-4 text-sm leading-7 text-[#2C2C2C]/75">Upload a leaf image and our AI model analyses it locally — instant results with proper image validation.</p>
              <div className="mt-6">
                <button onClick={()=>window.location.href="/predictions"}
                  className="inline-flex items-center gap-2 rounded-full bg-[#E63946] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.03] hover:bg-[#C86432]">
                  🍅 Analyze Disease Now <ArrowRight className="h-4 w-4"/>
                </button>
              </div>
              <div className="mt-6 overflow-hidden rounded-[1.4rem] border border-[#2D5016]/10" style={{boxShadow:"inset 0 0 20px rgba(0,0,0,0.2)"}}>
                <RootGrowthScene height={200}/>
              </div>
            </motion.div>
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <motion.div initial={{opacity:0,x:18}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
                  className="glass shadow-soft rounded-[2rem] border border-white/70 p-6 sm:p-8">
                  <div className="flex items-center gap-3 text-sm font-semibold text-[#1a3a0a]"><Brain className="h-4 w-4 text-[#7c3aed]"/> AGRO AI Model</div>
                  <p className="mt-3 text-sm leading-7 text-[#2C2C2C]/75">our trained model classifies 10 tomato diseases directly from the image — with treatment recommendations, all running on our machine.</p>
                </motion.div>
                <motion.div initial={{opacity:0,x:18}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
                  className="glass shadow-soft rounded-[2rem] border border-white/70 p-6 sm:p-8">
                  <div className="flex items-center gap-3 text-sm font-semibold text-[#1a3a0a]"><ShieldCheck className="h-4 w-4 text-[#2FA0D8]"/>Trustworthy by design</div>
                  <div className="mt-4 space-y-3 text-sm text-[#2C2C2C]/75">
                    {[["#7FD14F","No API key or internet needed"],["#E63946","Clear confidence percentage"],["#D4A574","Professional agriculture theme"]].map(([c,t])=>(
                      <div key={t} className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full" style={{background:c}}/>{t}</div>
                    ))}
                  </div>
                </motion.div>
              </div>
              <motion.div initial={{opacity:0,x:18}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
                className="glass shadow-soft rounded-[2rem] border border-white/70 p-6 sm:p-8">
                <div className="flex items-center gap-3 text-sm font-semibold text-[#1a3a0a]"><BarChart3 className="h-4 w-4 text-[#E63946]"/>Tech stack</div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-[#2C2C2C]/75">
                  {[["React","Frontend shell"],["ResNet-18","Disease classifier"],["Vite","Build system"],["Flask","Local server"]].map(([a,b])=>(
                    <div key={a} className="rounded-2xl bg-white/75 p-3"><div className="font-semibold text-[#1a3a0a]">{a}</div><div className="mt-1">{b}</div></div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.article key={feature.title}
                initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}}
                viewport={{once:true,margin:"-120px"}}
                transition={{duration:0.6,delay:index*0.05}}
                className="glass shadow-soft overflow-hidden rounded-[2rem] border border-white/70">
                <div className="grid lg:grid-cols-2">
                  <div className={`relative min-h-[320px] overflow-hidden bg-[linear-gradient(135deg,rgba(245,241,232,0.96),rgba(255,255,255,0.65))] p-8 lg:min-h-[440px] ${index%2===1?"lg:order-last":""}`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-10`}/>
                    <div className="relative flex h-full items-center justify-center">
                      <div className="relative w-full max-w-[420px] rounded-[2rem] border border-[#2D5016]/10 bg-white/80 p-6 ring-glow">
                        <div className="flex items-center justify-between">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2D5016] text-white shadow-lg">{feature.icon}</div>
                          {/* ── feature title tag (replaces "Section N") ── */}
                          <div className="rounded-full bg-[#F5F1E8] px-3 py-1 text-xs font-semibold text-[#2D5016]">{feature.title}</div>
                        </div>
                        <div className="mt-5 overflow-hidden rounded-[1rem]" style={{border:"1.5px solid rgba(45,80,22,0.12)"}}>
                          <SceneForType type={feature.sceneType} height={180}/>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          {feature.bullets.map(item=>(
                            <div key={item} className="rounded-2xl bg-[#F5F1E8] p-2 text-center text-[11px] font-medium text-[#1a3a0a]">{item}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#2D5016]/8 px-3 py-1 text-xs font-semibold text-[#2D5016]">
                      <Sparkles className="h-3.5 w-3.5 text-[#E63946]"/>{feature.route}
                    </div>
                    <h3 className="mt-4 font-serif text-3xl font-bold text-[#1a3a0a] sm:text-4xl">{feature.title}</h3>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-[#2C2C2C]/75">{feature.description}</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {feature.bullets.map(item=>(
                        <span key={item} className="rounded-full border border-[#2D5016]/12 bg-white px-4 py-2 text-sm text-[#2C2C2C]/70">{item}</span>
                      ))}
                    </div>
                    {/* ── specific button label per feature ── */}
                    <button onClick={() => window.location.href = feature.route}
                      className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#2D5016] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.03] hover:bg-[#1a3a0a]">
                      {feature.btnLabel} <ArrowRight className="h-4 w-4"/>
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-soft sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#2D5016]/70">Agricultural AI platform</p>
                <h3 className="mt-2 font-serif text-2xl font-bold text-[#1a3a0a]">Built for farmers, designed for trust.</h3>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-[#2C2C2C]/75">
                {["ResNet-18 Local","Responsive","Multi-language"].map(t=>(
                  <span key={t} className="rounded-full bg-[#F5F1E8] px-4 py-2">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Floating Map Button */}
      <div className="fixed bottom-4 right-4 z-[90] hidden flex-col gap-3 md:flex">
        <button onClick={()=>window.location.href="/map"}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2FA0D8] text-white shadow-lg shadow-[#2FA0D8]/30 transition hover:scale-110">
          <MapPinned className="h-5 w-5"/>
        </button>
      </div>
      <div className="fixed bottom-4 left-1/2 z-[90] flex -translate-x-1/2 gap-3 md:hidden">
        <button onClick={()=>window.location.href="/map"}
          className="flex items-center gap-2 rounded-full bg-[#2FA0D8] px-4 py-3 text-sm font-semibold text-white shadow-lg">
          <MapPinned className="h-4 w-4"/>Map
        </button>
      </div>
    </div>
  );
}

// ROOT ROUTER
export default function App() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  if (pathname === "/tomato-cultivation") return <TomatoGuidePage />;
  if (pathname === "/predictions")        return <PredictionPage />;
  if (pathname === "/diseases")           return <DiseaseDatabasePage />;
  if (pathname === "/model-info")         return <ModelInfoPage />;
  if (pathname === "/news")               return <NewsPage />;
  if (pathname === "/map")                return <MapPage />;
  if (pathname === "/account")            return <AccountPage />;
  return <HomePage />;
}