// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ArrowLeft, RefreshCw, Newspaper, Cloud, TrendingUp, Sprout,
//   Clock, ExternalLink, Search, Filter, Wifi, WifiOff, Zap,
//   Thermometer, Droplets, Wind, Eye, ChevronRight, Star,
//   AlertTriangle, CheckCircle, Info, Bell, Globe
// } from "lucide-react";

// // ── GNEWS API CONFIG ──
// // FREE key from gnews.io (100 requests/day free)
// // Replace with your key: https://gnews.io/
// const GNEWS_API_KEY = "YOUR_GNEWS_API_KEY"; // get free key at gnews.io
// const OPENWEATHER_KEY = "YOUR_OPENWEATHER_KEY"; // get free key at openweathermap.org

// // Curated RSS/JSON sources for agri news (no key needed fallbacks)
// const AGRI_NEWS_TOPICS = [
//   { id: "tomato", label: "Tomato", icon: "🍅", color: "#E63946", query: "tomato farming disease India" },
//   { id: "weather", label: "Weather", icon: "🌦️", color: "#2FA0D8", query: "India monsoon agriculture weather" },
//   { id: "market", label: "Market", icon: "📈", color: "#7FD14F", query: "tomato mandi price India 2025" },
//   { id: "policy", label: "Policy", icon: "📋", color: "#D4A574", query: "India agriculture policy farmer 2025" },
//   { id: "pest", label: "Pest Alert", icon: "🐛", color: "#f59e0b", query: "crop pest disease alert India" },
// ];

// // Curated fallback news when API is not configured
// const FALLBACK_NEWS = [
//   {
//     id: 1, category: "tomato", urgent: true,
//     title: "Early Blight Outbreak Reported Across Karnataka Tomato Belts",
//     summary: "Agricultural officials have issued an advisory for farmers in Hassan, Kolar, and Chikkaballapur districts following widespread early blight (Alternaria solani) reports. Farmers are advised to apply copper-based fungicides immediately.",
//     source: "Karnataka Dept. of Horticulture", time: "2 hours ago",
//     tags: ["Early Blight", "Karnataka", "Advisory"], icon: "🍅",
//     color: "#E63946", bgGrad: "from-red-950 to-red-900",
//   },
//   {
//     id: 2, category: "market", urgent: false,
//     title: "Tomato Prices Surge 34% at Kolar APMC — Farmers Benefit",
//     summary: "Tomato arrivals dropped by 18% this week at Kolar APMC, pushing prices to ₹28–34 per kg. Traders attribute the rise to reduced supply from Andhra Pradesh due to unseasonal rains damaging crops.",
//     source: "Agmarknet / e-NAM", time: "4 hours ago",
//     tags: ["Prices", "Kolar APMC", "Market"], icon: "📈",
//     color: "#7FD14F", bgGrad: "from-green-950 to-green-900",
//   },
//   {
//     id: 3, category: "weather", urgent: false,
//     title: "IMD Issues Yellow Alert: Pre-Monsoon Showers Expected in South India",
//     summary: "The Indian Meteorological Department has forecast pre-monsoon showers across Tamil Nadu, Karnataka, and Andhra Pradesh from April 2–5. Farmers are advised to complete pending harvests and protect stored produce.",
//     source: "IMD India", time: "6 hours ago",
//     tags: ["IMD Alert", "Pre-Monsoon", "Karnataka"], icon: "🌦️",
//     color: "#2FA0D8", bgGrad: "from-blue-950 to-blue-900",
//   },
//   {
//     id: 4, category: "policy", urgent: false,
//     title: "PM-KISAN 18th Installment Released: ₹2,000 Transferred to 9.4 Crore Farmers",
//     summary: "The central government has released the 18th installment of PM-KISAN scheme, transferring ₹2,000 directly to bank accounts of over 9.4 crore eligible farmers. Check your eligibility at pmkisan.gov.in.",
//     source: "Ministry of Agriculture", time: "8 hours ago",
//     tags: ["PM-KISAN", "Direct Benefit", "Scheme"], icon: "📋",
//     color: "#D4A574", bgGrad: "from-amber-950 to-amber-900",
//   },
//   {
//     id: 5, category: "pest", urgent: true,
//     title: "Tomato Leaf Miner (Tuta absoluta) Spreading in Himachal Pradesh",
//     summary: "Horticulture department officials confirmed heavy infestation of Tuta absoluta in Solan and Sirmaur districts. This invasive pest can cause 80–100% crop loss if not controlled early. Recommended: Spinosad or Emamectin benzoate spray.",
//     source: "HP Horticulture Dept.", time: "1 day ago",
//     tags: ["Tuta absoluta", "Himachal", "Pest Alert"], icon: "🐛",
//     color: "#f59e0b", bgGrad: "from-yellow-950 to-yellow-900",
//   },
//   {
//     id: 6, category: "tomato", urgent: false,
//     title: "New Hybrid Tomato Variety 'Arka Samrat' Released by ICAR-IIHR",
//     summary: "ICAR-Indian Institute of Horticultural Research has released a new heat-tolerant hybrid tomato variety Arka Samrat, capable of yielding 70–75 tonnes/hectare. Seeds are available through state government nurseries.",
//     source: "ICAR-IIHR Bengaluru", time: "2 days ago",
//     tags: ["New Variety", "ICAR", "Hybrid"], icon: "🌱",
//     color: "#E63946", bgGrad: "from-red-950 to-red-900",
//   },
//   {
//     id: 7, category: "market", urgent: false,
//     title: "eNAM Expansion: 100 New Mandis Onboarded Across 12 States",
//     summary: "The National Agriculture Market (eNAM) platform has added 100 new mandis across 12 states, enabling farmers to sell produce online with transparent price discovery. The platform now covers over 1,361 mandis.",
//     source: "SFAC / eNAM Portal", time: "3 days ago",
//     tags: ["eNAM", "Digital Market", "Mandis"], icon: "🏪",
//     color: "#7FD14F", bgGrad: "from-green-950 to-green-900",
//   },
//   {
//     id: 8, category: "weather", urgent: false,
//     title: "La Niña Impact: Above-Normal Rainfall Expected for Kharif 2025",
//     summary: "IMD's seasonal forecast indicates above-normal southwest monsoon rainfall (104% of LPA) for 2025 Kharif season. This is favorable for tomato and vegetable cultivation but farmers should prepare for waterlogging risks.",
//     source: "IMD Long Range Forecast", time: "4 days ago",
//     tags: ["La Niña", "Monsoon 2025", "Forecast"], icon: "🌧️",
//     color: "#2FA0D8", bgGrad: "from-blue-950 to-blue-900",
//   },
// ];

// // Weather widget data (mock; replace with real API)
// const WEATHER_MOCK = {
//   city: "Bengaluru", temp: 28, feels: 31, humidity: 62,
//   wind: 14, visibility: 8, condition: "Partly Cloudy",
//   icon: "⛅", advice: "Good conditions for field work",
// };

// // ── FLOATING PARTICLE BG ──
// function ParticleBg() {
//   const canvasRef = useRef(null);
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     canvas.width = canvas.offsetWidth;
//     canvas.height = canvas.offsetHeight;
//     const particles = Array.from({ length: 50 }, () => ({
//       x: Math.random() * canvas.width,
//       y: Math.random() * canvas.height,
//       r: Math.random() * 2 + 0.5,
//       vx: (Math.random() - 0.5) * 0.2,
//       vy: (Math.random() - 0.5) * 0.2,
//       alpha: Math.random() * 0.3 + 0.05,
//       color: ["#7FD14F", "#E63946", "#2FA0D8", "#D4A574", "#ffffff"][Math.floor(Math.random() * 5)],
//     }));
//     let animId;
//     const draw = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       particles.forEach(p => {
//         p.x += p.vx; p.y += p.vy;
//         if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
//         if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
//         ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
//         ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill();
//       });
//       ctx.globalAlpha = 1;
//       animId = requestAnimationFrame(draw);
//     };
//     draw();
//     return () => cancelAnimationFrame(animId);
//   }, []);
//   return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
// }

// // ── 3D TILT CARD ──
// function TiltCard({ children, className = "", style = {} }) {
//   const ref = useRef(null);
//   const handleMove = (e) => {
//     const card = ref.current;
//     if (!card) return;
//     const rect = card.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const cx = rect.width / 2;
//     const cy = rect.height / 2;
//     const rx = ((y - cy) / cy) * -6;
//     const ry = ((x - cx) / cx) * 6;
//     card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
//   };
//   const handleLeave = () => {
//     if (ref.current) ref.current.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateZ(0)";
//   };
//   return (
//     <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave}
//       style={{ transition: "transform 0.15s ease", transformStyle: "preserve-3d", ...style }}
//       className={className}>{children}</div>
//   );
// }

// // ── NEWS CARD ──
// function NewsCard({ item, index }) {
//   const [expanded, setExpanded] = useState(false);
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 40, scale: 0.95 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       transition={{ duration: 0.5, delay: index * 0.07, type: "spring", stiffness: 100 }}
//     >
//       <TiltCard className="relative overflow-hidden rounded-2xl border border-white/8 cursor-pointer group"
//         style={{ background: "rgba(10,20,10,0.7)", backdropFilter: "blur(20px)" }}
//       >
//         {/* top accent bar */}
//         <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${item.color}, transparent)` }} />

//         {/* urgent badge */}
//         {item.urgent && (
//           <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold"
//             style={{ background: "rgba(230,57,70,0.2)", border: "1px solid rgba(230,57,70,0.4)", color: "#E63946" }}>
//             <span className="h-1.5 w-1.5 rounded-full bg-[#E63946] animate-pulse inline-block" />
//             LIVE
//           </div>
//         )}

//         <div className="p-5">
//           {/* header */}
//           <div className="flex items-start gap-3 mb-3">
//             <div className="flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center text-xl"
//               style={{ background: `${item.color}22`, border: `1px solid ${item.color}44` }}>
//               {item.icon}
//             </div>
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2 mb-1">
//                 <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: item.color }}>{item.category}</span>
//                 <span className="text-xs text-white/30">·</span>
//                 <span className="text-xs text-white/40 flex items-center gap-1"><Clock className="h-3 w-3" />{item.time}</span>
//               </div>
//               <h3 className="text-sm font-bold text-white leading-snug group-hover:text-[#7FD14F] transition-colors"
//                 style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
//                 {item.title}
//               </h3>
//             </div>
//           </div>

//           {/* summary */}
//           <p className="text-xs leading-relaxed text-white/60 mb-3 line-clamp-2">
//             {item.summary}
//           </p>

//           {/* expand */}
//           <AnimatePresence>
//             {expanded && (
//               <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }} className="text-xs leading-relaxed text-white/50 mb-3 overflow-hidden">
//                 {item.summary} Additional context: Experts recommend farmers consult their local Krishi Vigyan Kendra (KVK) for region-specific guidance and free soil testing services.
//               </motion.p>
//             )}
//           </AnimatePresence>

//           {/* tags + actions */}
//           <div className="flex items-center justify-between">
//             <div className="flex flex-wrap gap-1.5">
//               {item.tags.map(tag => (
//                 <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full text-white/50"
//                   style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>{tag}</span>
//               ))}
//             </div>
//             <button onClick={() => setExpanded(v => !v)}
//               className="text-xs text-white/40 hover:text-[#7FD14F] transition-colors flex items-center gap-1 ml-2 flex-shrink-0">
//               {expanded ? "Less" : "More"} <ChevronRight className={`h-3 w-3 transition-transform ${expanded ? "rotate-90" : ""}`} />
//             </button>
//           </div>

//           {/* source */}
//           <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
//             <span className="text-[10px] text-white/30 flex items-center gap-1"><Globe className="h-2.5 w-2.5" />{item.source}</span>
//             <ExternalLink className="h-3 w-3 text-white/20 hover:text-white/50 cursor-pointer transition-colors" />
//           </div>
//         </div>
//       </TiltCard>
//     </motion.div>
//   );
// }

// // ── WEATHER STRIP ──
// function WeatherStrip({ data }) {
//   return (
//     <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
//       className="rounded-2xl p-4 border border-white/8 flex flex-wrap gap-4 items-center"
//       style={{ background: "rgba(47,160,216,0.08)", backdropFilter: "blur(20px)" }}>
//       <div className="flex items-center gap-3">
//         <span className="text-3xl">{data.icon}</span>
//         <div>
//           <div className="text-xl font-bold text-white">{data.temp}°C</div>
//           <div className="text-xs text-[#2FA0D8]">{data.city} · {data.condition}</div>
//         </div>
//       </div>
//       <div className="flex gap-4 text-xs text-white/50">
//         <span className="flex items-center gap-1"><Thermometer className="h-3 w-3 text-[#E63946]" />Feels {data.feels}°</span>
//         <span className="flex items-center gap-1"><Droplets className="h-3 w-3 text-[#2FA0D8]" />{data.humidity}%</span>
//         <span className="flex items-center gap-1"><Wind className="h-3 w-3 text-[#7FD14F]" />{data.wind} km/h</span>
//         <span className="flex items-center gap-1"><Eye className="h-3 w-3 text-[#D4A574]" />{data.visibility} km</span>
//       </div>
//       <div className="ml-auto text-xs text-[#7FD14F] flex items-center gap-1">
//         <CheckCircle className="h-3 w-3" />{data.advice}
//       </div>
//     </motion.div>
//   );
// }

// // ── TICKER ──
// function NewsTicker({ items }) {
//   const tickerRef = useRef(null);
//   const texts = items.map(i => `🔴 ${i.title}`).join("   ·   ");
//   return (
//     <div className="overflow-hidden rounded-full py-2 px-4 flex items-center gap-3"
//       style={{ background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.2)" }}>
//       <span className="flex-shrink-0 text-xs font-bold text-[#E63946] flex items-center gap-1">
//         <Zap className="h-3 w-3" /> LIVE
//       </span>
//       <div className="overflow-hidden flex-1">
//         <motion.div animate={{ x: [0, -2000] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
//           className="whitespace-nowrap text-xs text-white/60" style={{ display: "inline-block" }}>
//           {texts} &nbsp;&nbsp;&nbsp; {texts}
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// // ── MAIN NEWS PAGE ──
// export default function NewsPage() {
//   const [news, setNews] = useState(FALLBACK_NEWS);
//   const [loading, setLoading] = useState(false);
//   const [lastUpdated, setLastUpdated] = useState(new Date());
//   const [activeFilter, setActiveFilter] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [onlineStatus, setOnlineStatus] = useState(true);
//   const [refreshCount, setRefreshCount] = useState(0);
//   const [isApiConfigured] = useState(GNEWS_API_KEY !== "YOUR_GNEWS_API_KEY");
//   const timerRef = useRef(null);

//   // ── FETCH NEWS (GNews API or fallback) ──
//   const fetchNews = useCallback(async (topic = "tomato farming India") => {
//     setLoading(true);
//     try {
//       if (isApiConfigured) {
//         const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(topic)}&lang=en&country=in&max=10&apikey=${GNEWS_API_KEY}`;
//         const res = await fetch(url);
//         const data = await res.json();
//         if (data.articles?.length) {
//           const mapped = data.articles.map((a, i) => ({
//             id: i + Date.now(),
//             category: activeFilter === "all" ? AGRI_NEWS_TOPICS[i % AGRI_NEWS_TOPICS.length].id : activeFilter,
//             urgent: i < 2,
//             title: a.title,
//             summary: a.description || a.content?.slice(0, 200),
//             source: a.source?.name || "News Source",
//             time: new Date(a.publishedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
//             tags: [a.source?.name?.split(" ")[0] || "News"],
//             icon: AGRI_NEWS_TOPICS[i % AGRI_NEWS_TOPICS.length].icon,
//             color: AGRI_NEWS_TOPICS[i % AGRI_NEWS_TOPICS.length].color,
//             url: a.url,
//           }));
//           setNews(mapped);
//         }
//       } else {
//         // Shuffle fallback news to simulate refresh
//         setNews(prev => [...prev].sort(() => Math.random() - 0.5));
//       }
//       setLastUpdated(new Date());
//       setRefreshCount(c => c + 1);
//     } catch {
//       setOnlineStatus(false);
//     } finally {
//       setLoading(false);
//     }
//   }, [activeFilter, isApiConfigured]);

//   // Auto-refresh every 10 minutes
//   useEffect(() => {
//     fetchNews();
//     timerRef.current = setInterval(() => fetchNews(), 10 * 60 * 1000);
//     return () => clearInterval(timerRef.current);
//   }, [fetchNews]);

//   // Filter + search
//   const filtered = news.filter(item => {
//     const matchCat = activeFilter === "all" || item.category === activeFilter;
//     const matchSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.summary?.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchCat && matchSearch;
//   });

//   const urgentCount = news.filter(n => n.urgent).length;

//   return (
//     <div className="min-h-screen overflow-x-hidden text-white"
//       style={{
//         background: "linear-gradient(135deg, #030A03 0%, #060F06 40%, #030810 70%, #080308 100%)",
//         fontFamily: "'DM Sans', 'Outfit', sans-serif",
//       }}>

//       {/* Google Fonts */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;900&family=Outfit:wght@300;400;600;700&display=swap');
//         .line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
//         .news-glow{filter:drop-shadow(0 0 30px rgba(127,209,79,0.15));}
//         @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
//         .shimmer{background:linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent);background-size:200% 100%;animation:shimmer 2s infinite;}
//         @keyframes orbit{from{transform:rotate(0deg) translateX(60px) rotate(0deg);}to{transform:rotate(360deg) translateX(60px) rotate(-360deg);}}
//         .orbit-dot{animation:orbit 8s linear infinite;}
//         @keyframes float-slow{0%,100%{transform:translateY(0px);}50%{transform:translateY(-12px);}}
//         .float-slow{animation:float-slow 6s ease-in-out infinite;}
//       `}</style>

//       {/* BG orbs */}
//       <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
//         <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-10"
//           style={{ background: "radial-gradient(circle, #7FD14F, transparent 70%)", filter: "blur(60px)" }} />
//         <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-8"
//           style={{ background: "radial-gradient(circle, #2FA0D8, transparent 70%)", filter: "blur(80px)" }} />
//         <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full opacity-6"
//           style={{ background: "radial-gradient(circle, #E63946, transparent 70%)", filter: "blur(60px)" }} />
//         <ParticleBg />
//       </div>

//       {/* ── HEADER ── */}
//       <header className="relative z-10 sticky top-0"
//         style={{ background: "rgba(3,10,3,0.85)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(127,209,79,0.08)" }}>
//         <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
//           <div className="flex items-center gap-4">
//             <button onClick={() => window.location.href = "/"}
//               className="flex items-center gap-2 text-white/60 hover:text-[#7FD14F] transition-colors text-sm font-medium">
//               <ArrowLeft className="h-4 w-4" /> Home
//             </button>
//             <div className="h-4 w-px bg-white/10" />
//             <div className="flex items-center gap-2">
//               <div className="relative w-8 h-8">
//                 <div className="absolute inset-0 rounded-lg flex items-center justify-center"
//                   style={{ background: "linear-gradient(135deg, #7FD14F, #2D5016)" }}>
//                   <Newspaper className="h-4 w-4 text-white" />
//                 </div>
//                 <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#E63946] flex items-center justify-center text-[6px] font-bold text-white">
//                   {urgentCount}
//                 </div>
//               </div>
//               <div>
//                 <div className="text-xs font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>AgroAI News</div>
//                 <div className="text-[9px] text-white/40">Live Agricultural Intelligence</div>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             {/* Online indicator */}
//             <div className={`flex items-center gap-1 text-xs ${onlineStatus ? "text-[#7FD14F]" : "text-[#E63946]"}`}>
//               {onlineStatus ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
//               <span className="hidden sm:block">{onlineStatus ? "Live" : "Offline"}</span>
//             </div>

//             {/* Last updated */}
//             <span className="text-xs text-white/30 hidden md:block">
//               Updated {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
//             </span>

//             {/* Refresh button */}
//             <button onClick={() => fetchNews()} disabled={loading}
//               className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all hover:scale-105"
//               style={{ background: "rgba(127,209,79,0.15)", border: "1px solid rgba(127,209,79,0.3)", color: "#7FD14F" }}>
//               <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
//               <span className="hidden sm:block">Refresh</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="relative z-10 max-w-7xl mx-auto px-4 py-6">

//         {/* ── HERO SECTION ── */}
//         <div className="relative overflow-hidden rounded-3xl mb-6 p-8"
//           style={{ background: "linear-gradient(135deg, rgba(45,80,22,0.3), rgba(127,209,79,0.05))", border: "1px solid rgba(127,209,79,0.12)" }}>
//           <div className="absolute inset-0 overflow-hidden rounded-3xl">
//             <ParticleBg />
//           </div>
//           <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
//             <div className="flex-1">
//               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
//                 className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-3"
//                 style={{ background: "rgba(127,209,79,0.15)", border: "1px solid rgba(127,209,79,0.3)", color: "#7FD14F" }}>
//                 <span className="h-1.5 w-1.5 rounded-full bg-[#7FD14F] animate-pulse" />
//                 Real-time Agricultural Intelligence
//               </motion.div>
//               <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
//                 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight"
//                 style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
//                 Farm News & <span style={{ color: "#7FD14F" }}>Live Updates</span>
//               </motion.h1>
//               <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
//                 className="text-sm text-white/50 max-w-lg">
//                 Disease alerts, market prices, weather advisories, and government schemes — curated for Indian tomato farmers.
//               </motion.p>
//             </div>

//             {/* Stats */}
//             <div className="flex gap-4">
//               {[
//                 { label: "Live Alerts", value: urgentCount, color: "#E63946", icon: <AlertTriangle className="h-4 w-4" /> },
//                 { label: "Total News", value: news.length, color: "#7FD14F", icon: <Newspaper className="h-4 w-4" /> },
//                 { label: "Refreshes", value: refreshCount, color: "#2FA0D8", icon: <RefreshCw className="h-4 w-4" /> },
//               ].map(stat => (
//                 <TiltCard key={stat.label} className="rounded-2xl p-3 text-center min-w-[72px]"
//                   style={{ background: `${stat.color}10`, border: `1px solid ${stat.color}25` }}>
//                   <div className="flex justify-center mb-1" style={{ color: stat.color }}>{stat.icon}</div>
//                   <div className="text-xl font-bold text-white">{stat.value}</div>
//                   <div className="text-[9px] text-white/40">{stat.label}</div>
//                 </TiltCard>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ── TICKER ── */}
//         <div className="mb-4">
//           <NewsTicker items={news.slice(0, 5)} />
//         </div>

//         {/* ── WEATHER STRIP ── */}
//         <div className="mb-6">
//           <WeatherStrip data={WEATHER_MOCK} />
//         </div>

//         {/* ── SEARCH + FILTERS ── */}
//         <div className="flex flex-col sm:flex-row gap-3 mb-6">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
//             <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
//               placeholder="Search news..."
//               className="w-full rounded-2xl py-2.5 pl-9 pr-4 text-sm text-white placeholder-white/30 outline-none"
//               style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
//           </div>
//           <div className="flex gap-2 overflow-x-auto pb-1">
//             <button onClick={() => setActiveFilter("all")}
//               className={`flex-shrink-0 rounded-full px-3 py-2 text-xs font-semibold transition-all ${activeFilter === "all" ? "bg-white/15 text-white" : "text-white/40 hover:text-white"}`}
//               style={activeFilter === "all" ? { border: "1px solid rgba(255,255,255,0.2)" } : {}}>
//               All
//             </button>
//             {AGRI_NEWS_TOPICS.map(t => (
//               <button key={t.id} onClick={() => setActiveFilter(t.id)}
//                 className="flex-shrink-0 flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all"
//                 style={{
//                   background: activeFilter === t.id ? `${t.color}20` : "transparent",
//                   border: `1px solid ${activeFilter === t.id ? t.color + "50" : "rgba(255,255,255,0.08)"}`,
//                   color: activeFilter === t.id ? t.color : "rgba(255,255,255,0.4)"
//                 }}>
//                 {t.icon} {t.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* ── API NOTE (if not configured) ── */}
//         {!isApiConfigured && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
//             className="mb-5 rounded-2xl p-3 flex items-center gap-3 text-xs"
//             style={{ background: "rgba(212,164,116,0.1)", border: "1px solid rgba(212,164,116,0.2)" }}>
//             <Info className="h-4 w-4 text-[#D4A574] flex-shrink-0" />
//             <span className="text-[#D4A574]">
//               Showing curated sample news. Add your <strong>GNews API key</strong> in NewsPage.jsx for live news (free at gnews.io, 100 req/day).
//             </span>
//           </motion.div>
//         )}

//         {/* ── LOADING SKELETON ── */}
//         {loading && (
//           <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
//             {Array.from({ length: 6 }).map((_, i) => (
//               <div key={i} className="rounded-2xl p-5 shimmer" style={{ background: "rgba(255,255,255,0.03)", height: 200 }} />
//             ))}
//           </div>
//         )}

//         {/* ── NEWS GRID ── */}
//         {!loading && (
//           <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
//             {filtered.length > 0 ? filtered.map((item, i) => (
//               <NewsCard key={item.id} item={item} index={i} />
//             )) : (
//               <div className="col-span-full text-center py-16 text-white/30">
//                 <Newspaper className="h-10 w-10 mx-auto mb-3 opacity-30" />
//                 <p>No news found for this filter.</p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ── AUTO REFRESH INFO ── */}
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
//           className="rounded-2xl p-4 flex items-center justify-between text-xs"
//           style={{ background: "rgba(47,160,216,0.05)", border: "1px solid rgba(47,160,216,0.12)" }}>
//           <div className="flex items-center gap-2 text-white/40">
//             <Bell className="h-3.5 w-3.5 text-[#2FA0D8]" />
//             News auto-refreshes every 10 minutes. Last: {lastUpdated.toLocaleTimeString("en-IN")}
//           </div>
//           <button onClick={() => fetchNews()}
//             className="text-[#2FA0D8] hover:text-white transition-colors font-semibold flex items-center gap-1">
//             <RefreshCw className="h-3 w-3" /> Refresh now
//           </button>
//         </motion.div>
//       </main>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, RefreshCw, Newspaper, TrendingUp, Sprout,
  Clock, ExternalLink, Filter, Zap, Thermometer,
  Droplets, Wind, Eye, ChevronRight, AlertTriangle,
  CheckCircle, Info, Bell, Globe, Brain, Sparkles,
} from "lucide-react";

// ─── AGRI TOPICS ─────────────────────────────────────────────────────────────
const AGRI_NEWS_TOPICS = [
  { id:"tomato",  label:"Tomato",     icon:"🍅", color:"#E63946", bg:"#fff0f1" },
  { id:"weather", label:"Weather",    icon:"🌦️", color:"#2FA0D8", bg:"#f0f7ff" },
  { id:"market",  label:"Market",     icon:"📈", color:"#16a34a", bg:"#f0fdf4" },
  { id:"policy",  label:"Policy",     icon:"📋", color:"#D4A574", bg:"#fffbf4" },
  { id:"pest",    label:"Pest Alert", icon:"🐛", color:"#f59e0b", bg:"#fffbeb" },
];

// ─── STATIC NEWS DATA (rich agricultural content) ────────────────────────────
const STATIC_NEWS = [
  {
    id:1, category:"tomato", urgent:true,
    title:"Early Blight Outbreak Across Karnataka Tomato Belts",
    summary:"Agricultural officials issued an advisory for Hassan, Kolar, and Chikkaballapur districts after widespread early blight (Alternaria solani) reports. Farmers are urged to apply copper-based fungicides immediately and remove infected leaves to prevent spread.",
    source:"Karnataka Dept. of Horticulture", time:"2 hours ago",
    tags:["Early Blight","Karnataka","Advisory"], icon:"🍅", color:"#E63946", bg:"#fff0f1",
  },
  {
    id:2, category:"market", urgent:false,
    title:"Tomato Prices Surge 34% at Kolar APMC — Farmers Benefit",
    summary:"Tomato arrivals dropped 18% this week at Kolar APMC, pushing prices to ₹28–34/kg. Traders attribute the rise to reduced supply from Andhra Pradesh after unseasonal rains damaged crops in key growing regions.",
    source:"Agmarknet / e-NAM", time:"4 hours ago",
    tags:["Prices","Kolar APMC","Market"], icon:"📈", color:"#16a34a", bg:"#f0fdf4",
  },
  {
    id:3, category:"weather", urgent:false,
    title:"IMD Issues Yellow Alert: Pre-Monsoon Showers Expected",
    summary:"The Indian Meteorological Department forecasts pre-monsoon showers across Tamil Nadu, Karnataka, and Andhra Pradesh from April 2–5. Farmers should complete pending harvests and protect stored produce before rain arrives.",
    source:"IMD India", time:"6 hours ago",
    tags:["IMD Alert","Pre-Monsoon","South India"], icon:"🌦️", color:"#2FA0D8", bg:"#f0f7ff",
  },
  {
    id:4, category:"policy", urgent:false,
    title:"PM-KISAN 18th Installment: ₹2,000 to 9.4 Crore Farmers",
    summary:"The central government released the 18th PM-KISAN installment, transferring ₹2,000 directly to accounts of over 9.4 crore eligible farmers. Verify eligibility at pmkisan.gov.in using your Aadhaar number.",
    source:"Ministry of Agriculture", time:"8 hours ago",
    tags:["PM-KISAN","Direct Benefit","Scheme"], icon:"📋", color:"#D4A574", bg:"#fffbf4",
  },
  {
    id:5, category:"pest", urgent:true,
    title:"Tomato Leaf Miner (Tuta absoluta) Spreading in Himachal Pradesh",
    summary:"Horticulture officials confirmed heavy Tuta absoluta infestation in Solan and Sirmaur districts. This invasive pest can cause 80–100% crop loss if unchecked. Recommended: Spinosad 45 SC @ 0.3 ml/L or Emamectin benzoate 5 SG @ 0.4 g/L.",
    source:"HP Horticulture Dept.", time:"1 day ago",
    tags:["Tuta absoluta","Himachal","Pest Alert"], icon:"🐛", color:"#f59e0b", bg:"#fffbeb",
  },
  {
    id:6, category:"tomato", urgent:false,
    title:"New ICAR-IIHR Hybrid 'Arka Samrat' Released — 70 T/Ha Yield",
    summary:"ICAR-Indian Institute of Horticultural Research released Arka Samrat, a heat-tolerant hybrid tomato capable of yielding 70–75 tonnes/hectare. Seeds are available through state government nurseries at subsidised rates.",
    source:"ICAR-IIHR Bengaluru", time:"2 days ago",
    tags:["New Variety","ICAR","Hybrid"], icon:"🌱", color:"#E63946", bg:"#fff0f1",
  },
  {
    id:7, category:"market", urgent:false,
    title:"eNAM Expansion: 100 New Mandis Across 12 States",
    summary:"The National Agriculture Market (eNAM) added 100 new mandis, bringing the total to over 1,361. Farmers can now sell produce digitally with transparent price discovery. Register free at enam.gov.in.",
    source:"SFAC / eNAM Portal", time:"3 days ago",
    tags:["eNAM","Digital Market","Mandis"], icon:"🏪", color:"#16a34a", bg:"#f0fdf4",
  },
  {
    id:8, category:"weather", urgent:false,
    title:"Above-Normal Kharif Rainfall Expected — La Niña Impact",
    summary:"IMD's seasonal forecast indicates 104% of LPA southwest monsoon for Kharif 2025, favourable for tomato cultivation. Farmers should plan for water management and prepare raised-bed systems to handle potential waterlogging.",
    source:"IMD Long Range Forecast", time:"4 days ago",
    tags:["La Niña","Monsoon 2025","Forecast"], icon:"🌧️", color:"#2FA0D8", bg:"#f0f7ff",
  },
];

// ─── WEATHER DATA (static demo) ───────────────────────────────────────────────
const WEATHER_DATA = {
  city:"Bengaluru", temp:28, feels:31, humidity:62,
  wind:14, visibility:8, condition:"Partly Cloudy", icon:"⛅",
  advice:"Good conditions for field work today",
};

// ─── ANIMATED LEAF CANVAS ────────────────────────────────────────────────────
function LeafCanvas({ height = 120 }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth || 600; canvas.height = height;
    const W = canvas.width, H = canvas.height;
    const leaves = Array.from({ length: 12 }, (_, i) => ({
      x: (i / 11) * W * 1.1 - W * 0.05,
      y: H * (0.2 + (i % 3) * 0.25),
      size: 12 + (i % 4) * 8,
      rot: (Math.random() - 0.5) * 1.2,
      vx: -0.15 - (i % 3) * 0.1,
      vy: Math.sin(i) * 0.08,
      phase: Math.random() * Math.PI * 2,
      color: [`rgba(45,80,22,0.08)`, `rgba(127,209,79,0.1)`, `rgba(34,139,34,0.07)`][i % 3],
    }));
    const particles = Array.from({ length: 20 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 1 + Math.random() * 2,
      vx: (Math.random() - 0.5) * 0.3, vy: -0.2 - Math.random() * 0.3,
      alpha: 0.08 + Math.random() * 0.12,
    }));
    let t = 0;
    const draw = () => {
      t += 0.01; ctx.clearRect(0, 0, W, H);
      leaves.forEach(l => {
        l.x += l.vx; l.phase += 0.02;
        l.y += Math.sin(l.phase) * 0.3;
        if (l.x < -l.size * 2) l.x = W + l.size;
        ctx.save(); ctx.translate(l.x, l.y); ctx.rotate(l.rot + Math.sin(l.phase * 0.5) * 0.15);
        ctx.beginPath();
        ctx.moveTo(0, -l.size);
        ctx.bezierCurveTo(l.size * 0.8, -l.size * 0.5, l.size * 0.9, l.size * 0.3, 0, l.size);
        ctx.bezierCurveTo(-l.size * 0.9, l.size * 0.3, -l.size * 0.8, -l.size * 0.5, 0, -l.size);
        ctx.fillStyle = l.color; ctx.fill();
        ctx.restore();
      });
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(45,80,22,${p.alpha})`; ctx.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [height]);
  return <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height, pointerEvents:"none" }}/>;
}

// ─── NEWS CARD ────────────────────────────────────────────────────────────────
function NewsCard({ item, index }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity:0, y:24, scale:0.97 }}
      animate={{ opacity:1, y:0, scale:1 }}
      transition={{ duration:0.45, delay:index*0.06, type:"spring", stiffness:120 }}>
      <div
        className="group relative rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden"
        style={{
          background:"white",
          borderColor: `${item.color}20`,
          boxShadow:`0 2px 12px rgba(0,0,0,0.04),0 0 0 1px ${item.color}10`,
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 8px 32px ${item.color}20,0 0 0 1.5px ${item.color}30`; e.currentTarget.style.transform="translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow=`0 2px 12px rgba(0,0,0,0.04),0 0 0 1px ${item.color}10`; e.currentTarget.style.transform="translateY(0)"; }}
      >
        {/* Accent top border */}
        <div style={{ height:3, background:`linear-gradient(90deg,${item.color},${item.color}44,transparent)` }}/>

        {/* Urgent badge */}
        {item.urgent && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold"
            style={{ background:`${item.color}15`, border:`1px solid ${item.color}30`, color:item.color }}>
            <span className="h-1.5 w-1.5 rounded-full animate-pulse inline-block" style={{ background:item.color }}/>
            URGENT
          </div>
        )}

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-shrink-0 h-11 w-11 rounded-2xl flex items-center justify-center text-xl"
              style={{ background:item.bg, border:`1.5px solid ${item.color}20` }}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color:item.color }}>{item.category}</span>
                <span className="text-[#9e9e9e]">·</span>
                <span className="text-xs text-[#9e9e9e] flex items-center gap-1"><Clock className="h-3 w-3"/>{item.time}</span>
              </div>
              <h3 className="text-[13.5px] font-bold leading-snug text-[#1a1a1a] group-hover:text-[#2D5016] transition-colors"
                style={{ fontFamily:"Georgia,serif" }}>
                {item.title}
              </h3>
            </div>
          </div>

          {/* Summary */}
          <p className="text-xs leading-relaxed text-[#5a5a5a] mb-3" style={{ lineClamp:2, WebkitLineClamp:2, display:"-webkit-box", WebkitBoxOrient:"vertical", overflow: expanded?"visible":"hidden" }}>
            {item.summary}
          </p>

          {/* Tags + expand */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map(tag=>(
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background:item.bg, color:item.color, border:`1px solid ${item.color}25` }}>{tag}</span>
              ))}
            </div>
            <button onClick={()=>setExpanded(v=>!v)}
              className="text-xs font-semibold flex items-center gap-1 ml-2 flex-shrink-0 transition-colors"
              style={{ color:item.color }}>
              {expanded?"Less":"More"}<ChevronRight className={`h-3 w-3 transition-transform ${expanded?"rotate-90":""}`}/>
            </button>
          </div>

          {/* Source */}
          <div className="mt-3 pt-3 border-t border-[#f0f0f0] flex items-center justify-between">
            <span className="text-[10px] text-[#b0b0b0] flex items-center gap-1"><Globe className="h-2.5 w-2.5"/>{item.source}</span>
            <ExternalLink className="h-3 w-3 text-[#ccc] hover:text-[#888] cursor-pointer transition-colors"/>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── WEATHER STRIP ────────────────────────────────────────────────────────────
function WeatherStrip({ data }) {
  return (
    <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
      className="rounded-2xl p-4 border flex flex-wrap gap-4 items-center"
      style={{ background:"linear-gradient(135deg,#f0f7ff,#e8f5e9)", border:"1.5px solid rgba(47,160,216,0.15)" }}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{data.icon}</span>
        <div>
          <div className="text-xl font-bold text-[#1a3a0a]">{data.temp}°C</div>
          <div className="text-xs font-medium text-[#2FA0D8]">{data.city} · {data.condition}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-[#5a5a5a]">
        <span className="flex items-center gap-1"><Thermometer className="h-3 w-3 text-[#E63946]"/>Feels {data.feels}°C</span>
        <span className="flex items-center gap-1"><Droplets className="h-3 w-3 text-[#2FA0D8]"/>{data.humidity}%</span>
        <span className="flex items-center gap-1"><Wind className="h-3 w-3 text-[#16a34a]"/>{data.wind} km/h</span>
        <span className="flex items-center gap-1"><Eye className="h-3 w-3 text-[#D4A574]"/>{data.visibility} km</span>
      </div>
      <div className="ml-auto text-xs text-[#16a34a] flex items-center gap-1 font-semibold">
        <CheckCircle className="h-3.5 w-3.5"/>{data.advice}
      </div>
    </motion.div>
  );
}

// ─── TICKER ──────────────────────────────────────────────────────────────────
function NewsTicker({ items }) {
  const texts = items.filter(i=>i.urgent).map(i=>`🔴 ${i.title}`).join("   ·   ");
  if (!texts) return null;
  return (
    <div className="overflow-hidden rounded-2xl py-2.5 px-5 flex items-center gap-3"
      style={{ background:"linear-gradient(135deg,#fff0f1,#ffe0e2)", border:"1.5px solid rgba(230,57,70,0.18)" }}>
      <span className="flex-shrink-0 text-xs font-bold text-[#E63946] flex items-center gap-1.5">
        <Zap className="h-3.5 w-3.5"/> LIVE ALERTS
      </span>
      <div className="overflow-hidden flex-1">
        <motion.div animate={{ x:[0,-2000] }} transition={{ duration:28, repeat:Infinity, ease:"linear" }}
          className="whitespace-nowrap text-xs font-medium text-[#991b1b]" style={{ display:"inline-block" }}>
          {texts} &nbsp;&nbsp;&nbsp; {texts}
        </motion.div>
      </div>
    </div>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────
function StatCard({ icon, value, label, color }) {
  return (
    <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
      className="rounded-2xl p-4 text-center border"
      style={{ background:"white", borderColor:`${color}20`, boxShadow:`0 2px 12px ${color}12` }}>
      <div className="flex justify-center mb-2" style={{ color }}>{icon}</div>
      <div className="text-2xl font-bold text-[#1a1a1a]">{value}</div>
      <div className="text-[10px] text-[#9e9e9e] font-medium mt-0.5">{label}</div>
    </motion.div>
  );
}

// ─── AI INSIGHTS BANNER ───────────────────────────────────────────────────────
function AIInsightBanner({ visible, insight, loading, color }) {
  if (!visible && !loading) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity:0, y:8, scale:0.98 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:8 }}
        className="rounded-2xl p-5 border"
        style={{ background:"linear-gradient(135deg,#fafff7,#f0fdf4)", border:"1.5px solid rgba(45,80,22,0.15)", boxShadow:"0 4px 20px rgba(45,80,22,0.08)" }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-7 w-7 rounded-xl flex items-center justify-center" style={{ background:"linear-gradient(135deg,#7c3aed,#2D5016)" }}>
            <Brain className="h-3.5 w-3.5 text-white"/>
          </div>
          <span className="text-xs font-bold text-[#2D5016] uppercase tracking-wider">Claude AI Farm Insight</span>
          <Sparkles className="h-3.5 w-3.5 text-[#f9a825]"/>
        </div>
        {loading ? (
          <div className="flex items-center gap-3">
            <div style={{ width:16, height:16, border:"2.5px solid rgba(45,80,22,0.15)", borderTopColor:"#2D5016", borderRadius:"50%", animation:"news-spin 0.8s linear infinite" }}/>
            <span className="text-sm text-[#2D5016]/70">Generating agricultural insight…</span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-[#2d2d2a]">{insight}</p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── MAIN NEWS PAGE ───────────────────────────────────────────────────────────
export default function NewsPage() {
  const [news, setNews] = useState(STATIC_NEWS);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  // AI Insight state
  const [showInsight, setShowInsight] = useState(false);
  const [insightLoading, setInsightLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState("");

  const urgentCount = news.filter(n => n.urgent).length;

  // ── Filter news by category ───────────────────────────────────────────────
  const filtered = news.filter(item =>
    activeFilter === "all" || item.category === activeFilter
  );

  // ── Simulate refresh ─────────────────────────────────────────────────────
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setNews([...STATIC_NEWS].sort(() => Math.random() - 0.45));
      setLastUpdated(new Date());
      setRefreshing(false);
    }, 900);
  };

  // ── Generate AI Insight using Claude ─────────────────────────────────────
  const generateInsight = async () => {
    setShowInsight(true);
    setInsightLoading(true);
    setAiInsight("");
    try {
      const topStories = news.slice(0, 4).map(n => n.title).join("; ");
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 250,
          messages: [{
            role: "user",
            content: `You are an expert agricultural advisor for Indian tomato farmers. Based on these recent news headlines: "${topStories}" — provide a 2-3 sentence practical insight for tomato farmers today. Focus on actionable advice. Keep it warm, professional, and specific to Indian farming conditions. Start directly with the insight.`
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "Unable to generate insight.";
      setAiInsight(text.trim());
    } catch {
      setAiInsight("Based on current alerts, prioritize checking your crops for early blight and pest activity. Monitor mandi prices via e-NAM for the best selling window this week.");
    } finally {
      setInsightLoading(false);
    }
  };

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const timer = setInterval(handleRefresh, 10 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background:"linear-gradient(160deg,#FEFDFB 0%,#F5F1E8 50%,#F3EFE4 100%)",
        fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",
        color:"#1a1a1a",
      }}>
      <style>{`
        @keyframes news-spin{to{transform:rotate(360deg)}}
        @keyframes leaf-drift{0%,100%{transform:translateY(0) rotate(-2deg);}50%{transform:translateY(-8px) rotate(2deg);}}
        .news-card-hover{transition:all 0.25s ease;}
      `}</style>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50"
        style={{ background:"rgba(254,253,251,0.88)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(45,80,22,0.08)", boxShadow:"0 1px 16px rgba(0,0,0,0.05)" }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => window.location.href = "/"} className="flex items-center gap-2 text-[#2D5016]/70 hover:text-[#2D5016] transition-colors text-sm font-semibold">
              <ArrowLeft className="h-4 w-4"/> Home
            </button>
            <div className="h-4 w-px bg-[#2D5016]/10"/>
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9">
                <div className="absolute inset-0 rounded-xl flex items-center justify-center"
                  style={{ background:"linear-gradient(135deg,#7FD14F,#2D5016)" }}>
                  <Newspaper className="h-4 w-4 text-white"/>
                </div>
                {urgentCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E63946] flex items-center justify-center text-[8px] font-bold text-white">
                    {urgentCount}
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-[#1a3a0a]" style={{ fontFamily:"Georgia,serif" }}>AgroAI News</div>
                <div className="text-[9px] text-[#9e9e9e] font-medium">Agricultural Intelligence</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#b0b0b0] hidden md:block">
              Updated {lastUpdated.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}
            </span>
            <button onClick={generateInsight}
              className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all hover:scale-105"
              style={{ background:"linear-gradient(135deg,#7c3aed22,#2D501615)", border:"1.5px solid rgba(124,58,237,0.2)", color:"#7c3aed" }}>
              <Brain className="h-3 w-3"/> AI Insight
            </button>
            <button onClick={handleRefresh} disabled={refreshing}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all hover:scale-105"
              style={{ background:"rgba(45,80,22,0.08)", border:"1.5px solid rgba(45,80,22,0.15)", color:"#2D5016" }}>
              <RefreshCw className={`h-3 w-3 ${refreshing?"animate-spin":""}`}/>
              <span className="hidden sm:block">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* ── HERO SECTION ── */}
        <div className="relative overflow-hidden rounded-3xl mb-6 p-7"
          style={{ background:"linear-gradient(135deg,#2D5016,#1a6b3a,#2D5016)", boxShadow:"0 8px 32px rgba(45,80,22,0.2)" }}>
          <LeafCanvas height={120}/>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-3"
                style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)", color:"white" }}>
                <span className="h-1.5 w-1.5 rounded-full bg-[#7FD14F] animate-pulse"/>
                Live Agricultural Updates
              </motion.div>
              <motion.h1 initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
                className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight"
                style={{ fontFamily:"Georgia,serif", textShadow:"0 2px 12px rgba(0,0,0,0.3)" }}>
                Farm News & <span style={{ color:"#7FD14F" }}>Smart Alerts</span>
              </motion.h1>
              <motion.p initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
                className="text-sm text-white/70 max-w-lg">
                Disease alerts, market prices, weather advisories, and government schemes — curated for Indian tomato farmers.
              </motion.p>
            </div>

            {/* Stats */}
            <div className="flex gap-3">
              {[
                { icon:<AlertTriangle className="h-4 w-4"/>, value:urgentCount, label:"Live Alerts", color:"#E63946" },
                { icon:<Newspaper className="h-4 w-4"/>, value:news.length, label:"Total News", color:"#7FD14F" },
                { icon:<Brain className="h-4 w-4"/>, value:"AI", label:"Powered", color:"#7c3aed" },
              ].map(stat => (
                <div key={stat.label} className="rounded-2xl p-3 text-center min-w-[72px]"
                  style={{ background:"rgba(255,255,255,0.12)", border:`1px solid ${stat.color}40`, backdropFilter:"blur(10px)" }}>
                  <div className="flex justify-center mb-1" style={{ color:stat.color }}>{stat.icon}</div>
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-[9px] text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TICKER ── */}
        <div className="mb-4">
          <NewsTicker items={news}/>
        </div>

        {/* ── WEATHER ── */}
        <div className="mb-5">
          <WeatherStrip data={WEATHER_DATA}/>
        </div>

        {/* ── AI INSIGHT BANNER ── */}
        <div className="mb-5">
          <AIInsightBanner visible={showInsight} insight={aiInsight} loading={insightLoading} color="#2D5016"/>
        </div>

        {/* ── FILTERS ── */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
          <button onClick={() => setActiveFilter("all")}
            className="flex-shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all"
            style={{
              background: activeFilter==="all" ? "#2D5016" : "white",
              color: activeFilter==="all" ? "white" : "#5a5a5a",
              border: activeFilter==="all" ? "none" : "1.5px solid rgba(45,80,22,0.12)",
              boxShadow: activeFilter==="all" ? "0 2px 8px rgba(45,80,22,0.25)" : "none",
            }}>
            🌿 All
          </button>
          {AGRI_NEWS_TOPICS.map(t => (
            <button key={t.id} onClick={() => setActiveFilter(t.id)}
              className="flex-shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all"
              style={{
                background: activeFilter===t.id ? t.color : "white",
                color: activeFilter===t.id ? "white" : "#5a5a5a",
                border: activeFilter===t.id ? "none" : `1.5px solid ${t.color}25`,
                boxShadow: activeFilter===t.id ? `0 2px 8px ${t.color}40` : "none",
              }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── NEWS GRID ── */}
        <AnimatePresence mode="wait">
          <motion.div key={activeFilter}
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
            {filtered.length > 0 ? filtered.map((item, i) => (
              <NewsCard key={item.id} item={item} index={i}/>
            )) : (
              <div className="col-span-full text-center py-16 text-[#b0b0b0]">
                <Newspaper className="h-10 w-10 mx-auto mb-3 opacity-30"/>
                <p className="text-sm">No news in this category yet.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── BOTTOM BAR ── */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
          className="rounded-2xl p-4 flex items-center justify-between"
          style={{ background:"white", border:"1.5px solid rgba(45,80,22,0.08)", boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-2 text-xs text-[#b0b0b0]">
            <Bell className="h-3.5 w-3.5 text-[#2FA0D8]"/>
            Auto-refreshes every 10 minutes · Last: {lastUpdated.toLocaleTimeString("en-IN")}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={generateInsight}
              className="text-xs font-semibold flex items-center gap-1 transition-colors hover:scale-105"
              style={{ color:"#7c3aed" }}>
              <Brain className="h-3 w-3"/> AI Insight
            </button>
            <button onClick={handleRefresh} disabled={refreshing}
              className="text-xs font-semibold flex items-center gap-1 transition-colors"
              style={{ color:"#2D5016" }}>
              <RefreshCw className={`h-3 w-3 ${refreshing?"animate-spin":""}`}/> Refresh
            </button>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <p className="text-center text-[10px] text-[#c0c0c0] mt-4">
          Sample news for demonstration. Add GNews API key for live feeds.
        </p>
      </main>
    </div>
  );
}