import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, X, AlertTriangle } from "lucide-react";

const TOMATO_HOTSPOTS = [
  {
    id: 1, name: "Kolar", state: "Karnataka", lat: 13.1367, lng: 78.1303, type: "market",
    icon: "📊", color: "#27ae60",
    title: "Kolar APMC — Major Market Hub",
    details: {
      Area: "~12,000 ha under tomato",
      Production: "4.2 lakh MT/year",
      "Current Price": "₹28–34/kg",
      "Daily Arrivals": "8,000+ tonnes/day",
      Variety: "Hybrid F1 (COTH2, Arka Samrat)",
      Season: "Aug–Nov, Jan–Apr",
      Soil: "Red loamy",
      Irrigation: "Drip & furrow",
      Contact: "APMC Kolar: 08152-222555",
    },
    alert: null, score: 92,
    advice: "Good selling window — prices stable. Consider grading produce for premium rates.",
  },
  {
    id: 2, name: "Nashik", state: "Maharashtra", lat: 19.9975, lng: 73.7898, type: "cultivation",
    icon: "🍅", color: "#e05d44",
    title: "Nashik — Largest Tomato Belt",
    details: {
      Area: "~45,000 ha under tomato",
      Production: "8.5 lakh MT/year",
      "Mandi Price": "₹22–28/kg",
      "Daily Arrivals": "15,000+ tonnes/day",
      Variety: "Namdhari NS585, Syngenta",
      Season: "Oct–Feb, Mar–Jun",
      Soil: "Black cotton (Vertisol)",
      Irrigation: "Drip irrigation (90%)",
      Contact: "APMC Nashik: 0253-2503030",
    },
    alert: null, score: 88,
    advice: "Strong cultivation zone. Use disease-resistant varieties for summer crop.",
  },
  {
    id: 3, name: "Madanapalle", state: "Andhra Pradesh", lat: 13.5543, lng: 78.5057, type: "market",
    icon: "📈", color: "#27ae60",
    title: "Madanapalle — 2nd Largest Tomato Market",
    details: {
      Area: "~20,000 ha under tomato",
      Production: "6 lakh MT/year",
      Price: "₹18–32/kg (fluctuating)",
      "Daily Arrivals": "10,000+ tonnes/day",
      Variety: "Rashmi, Kashi Vishwanath",
      Season: "Year-round (3 crops)",
      Soil: "Sandy loam, red soil",
      Irrigation: "Drip & sprinkler",
      Contact: "APMC Madanapalle: 08571-220100",
    },
    alert: null, score: 85,
    advice: "Export-quality produce possible. Connect with aggregators for better rates.",
  },
  {
    id: 4, name: "Chikkaballapur", state: "Karnataka", lat: 13.4355, lng: 77.7278, type: "cultivation",
    icon: "🌱", color: "#e67e22",
    title: "Chikkaballapur — Premium Tomato Belt",
    details: {
      Area: "~8,500 ha under tomato",
      Production: "2.8 lakh MT/year",
      Price: "₹30–40/kg (premium)",
      "Daily Arrivals": "3,500 tonnes/day",
      Variety: "Arka Samrat, Pusa Ruby",
      Season: "Sep–Dec, Feb–May",
      Soil: "Sandy red soil",
      Irrigation: "Drip irrigation",
      Contact: "APMC Chikkaballapur: 08156-272227",
    },
    alert: null, score: 78,
    advice: "High-altitude zone produces premium quality. Target export markets.",
  },
  {
    id: 5, name: "Solan", state: "Himachal Pradesh", lat: 30.9077, lng: 77.0967, type: "pest_alert",
    icon: "⚠️", color: "#e74c3c",
    title: "⚠️ PEST ALERT — Solan",
    details: {
      Area: "~3,200 ha under tomato",
      Production: "85,000 MT/year",
      Price: "₹15–22/kg",
      "Daily Arrivals": "800 tonnes/day",
      Variety: "Himachal Local, Solan Hybrid",
      Season: "Apr–Jul (main), Sep–Nov",
      Soil: "Loamy hill soil",
      Irrigation: "Rainwater + sprinkler",
      Contact: "KVK Solan: 01792-230541",
    },
    alert: "⚠️ ACTIVE: Tuta absoluta (Tomato Leaf Miner) infestation confirmed. Can cause 80–100% crop loss.",
    score: 38,
    advice: "Apply Spinosad 45SC @ 0.3ml/L immediately. Set pheromone traps (8/acre). Contact KVK urgently.",
  },
  {
    id: 6, name: "Pune (ICAR)", state: "Maharashtra", lat: 18.5204, lng: 73.8567, type: "research",
    icon: "🔬", color: "#2FA0D8",
    title: "ICAR-IIHR Research Station — Pune",
    details: {
      Area: "Research campus (200 acres)",
      Production: "Demo plots only",
      "Seed Cost": "₹800–2000/100g",
      Arrivals: "N/A",
      Variety: "Arka Samrat, Arka Rakshak (new)",
      Season: "Year-round trials",
      Soil: "All soil type trials",
      Irrigation: "All methods tested",
      Contact: "ICAR-IIHR: 080-23086100",
    },
    alert: null, score: 95,
    advice: "New disease-resistant variety Arka Rakshak available. Visit nursery for F1 seeds.",
  },
  {
    id: 7, name: "Tirupati", state: "Andhra Pradesh", lat: 13.6288, lng: 79.4192, type: "cultivation",
    icon: "🍅", color: "#e05d44",
    title: "Tirupati Region — Red Sandy Belt",
    details: {
      Area: "~18,000 ha under tomato",
      Production: "5.2 lakh MT/year",
      Price: "₹20–30/kg",
      "Daily Arrivals": "7,500 tonnes/day",
      Variety: "Pusa Hybrid 1, Rashmi",
      Season: "3 crops/year possible",
      Soil: "Red sandy loam (ideal)",
      Irrigation: "Drip + flood",
      Contact: "APMC Tirupati: 0877-2287001",
    },
    alert: null, score: 82,
    advice: "3-crop rotation possible. Time planting to avoid summer peak pricing crash.",
  },
  {
    id: 8, name: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lng: 82.9739, type: "cultivation",
    icon: "🌿", color: "#e67e22",
    title: "Varanasi — Gangetic Tomato Belt",
    details: {
      Area: "~9,000 ha under tomato",
      Production: "1.8 lakh MT/year",
      Price: "₹14–22/kg",
      "Daily Arrivals": "2,000 tonnes/day",
      Variety: "Kashi Vishwanath, Pusa Ruby",
      Season: "Oct–Mar (main rabi season)",
      Soil: "Alluvial (Gangetic plain)",
      Irrigation: "Tube well + canal",
      Contact: "APMC Varanasi: 0542-2502345",
    },
    alert: null, score: 70,
    advice: "Good for rabi season. Connect with UP Horticulture Dept. for MSP support schemes.",
  },
  {
    id: 9, name: "Hassan", state: "Karnataka", lat: 13.0067, lng: 76.1006, type: "disease_alert",
    icon: "🦠", color: "#e74c3c",
    title: "🦠 DISEASE ALERT — Hassan District",
    details: {
      Area: "~6,500 ha under tomato",
      Production: "1.5 lakh MT/year",
      Price: "₹18–26/kg",
      "Daily Arrivals": "2,500 tonnes/day",
      Variety: "Namdhari NS585, Arka Samrat",
      Season: "Aug–Nov, Jan–Apr",
      Soil: "Red loamy",
      Irrigation: "Drip irrigation",
      Contact: "District Horticulture: 08172-268510",
    },
    alert: "🦠 ACTIVE: Early Blight (Alternaria solani) outbreak across 1,200+ hectares. Spread rate HIGH.",
    score: 35,
    advice: "Apply Mancozeb 75WP @ 2.5g/L OR Copper Oxychloride. Reduce irrigation frequency. Remove infected leaves.",
  },
  {
    id: 10, name: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lng: 76.9558, type: "market",
    icon: "📊", color: "#27ae60",
    title: "Coimbatore — Organic Export Hub",
    details: {
      Area: "~7,200 ha under tomato",
      Production: "1.9 lakh MT/year",
      "Organic Price": "₹32–45/kg (premium)",
      "Daily Arrivals": "3,200 tonnes/day",
      Variety: "Bhavani Local, CO3",
      Season: "Oct–Jan, Mar–May",
      Soil: "Red loam + clay mix",
      Irrigation: "Drip (micro-irrigation subsidy available)",
      Contact: "APMC Coimbatore: 0422-2344567",
    },
    alert: null, score: 80,
    advice: "Organic certification can double your income. Contact TNAU for certification support.",
  },
  {
    id: 11, name: "Belgaum", state: "Karnataka", lat: 15.8497, lng: 74.4977, type: "cultivation",
    icon: "🌱", color: "#e67e22",
    title: "Belgaum — Northern Karnataka Belt",
    details: {
      Area: "~5,800 ha under tomato",
      Production: "1.1 lakh MT/year",
      Price: "₹16–24/kg",
      "Daily Arrivals": "1,800 tonnes/day",
      Variety: "Hybrid Roadster, Arka Samrat",
      Season: "Jun–Oct, Dec–Mar",
      Soil: "Black cotton soil",
      Irrigation: "Drip + sprinkler",
      Contact: "APMC Belgaum: 0831-2425454",
    },
    alert: null, score: 72,
    advice: "Double cropping recommended. New drip subsidy scheme available from Karnataka govt.",
  },
];

const TYPE_COLORS = {
  market: "#27ae60",
  cultivation: "#e67e22",
  pest_alert: "#e74c3c",
  disease_alert: "#e74c3c",
  research: "#2FA0D8",
};

const TYPE_LABELS = {
  market: "Market Hub",
  cultivation: "Cultivation Zone",
  pest_alert: "⚠️ Pest Alert",
  disease_alert: "🦠 Disease Alert",
  research: "Research Station",
};

const FILTER_TYPES = [
  { id: "all", label: "All", icon: "🗺️" },
  { id: "market", label: "Markets", icon: "📊" },
  { id: "cultivation", label: "Cultivation", icon: "🌱" },
  { id: "pest_alert", label: "Pest Alerts", icon: "⚠️" },
  { id: "disease_alert", label: "Disease", icon: "🦠" },
  { id: "research", label: "Research", icon: "🔬" },
];

// ── INFO PANEL ────────────────────────────────────────────────────────────────
function MarkerInfoPanel({ spot, onClose }) {
  if (!spot) return null;
  const isAlert = spot.type === "pest_alert" || spot.type === "disease_alert";

  return (
    <motion.div
      key={spot.id}
      initial={{ x: 340, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 340, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute top-3 right-3 bottom-3 w-80 rounded-2xl overflow-hidden z-30 flex flex-col"
      style={{
        background: "rgba(255,255,255,0.98)",
        backdropFilter: "blur(20px)",
        border: `2px solid ${spot.color}35`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
      }}
    >
      {/* Header */}
      <div
        className="p-4 flex items-start justify-between flex-shrink-0"
        style={{
          background: `linear-gradient(135deg,${spot.color}18,${spot.color}06)`,
          borderBottom: `1px solid ${spot.color}20`,
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={isAlert ? { scale: [1, 1.12, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: `${spot.color}15`, border: `1.5px solid ${spot.color}30` }}
          >
            {spot.icon}
          </motion.div>
          <div>
            <div className="font-bold text-sm" style={{ color: "#2d3436" }}>{spot.name}</div>
            <div className="text-[11px] font-medium" style={{ color: "#636e72" }}>{spot.state}</div>
            <div
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold mt-0.5"
              style={{ background: `${spot.color}15`, color: spot.color }}
            >
              {TYPE_LABELS[spot.type]}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="rounded-full p-1 transition-colors hover:bg-black/5">
          <X className="h-4 w-4" style={{ color: "#636e72" }} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: "thin" }}>
        <h3 className="text-sm font-bold mb-3" style={{ color: "#2d3436" }}>{spot.title}</h3>

        {/* Alert Banner */}
        {spot.alert && (
          <motion.div
            animate={{ opacity: [1, 0.75, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="rounded-xl p-3 mb-4 text-xs font-medium"
            style={{
              background: "rgba(231,76,60,0.08)",
              border: "1.5px solid rgba(231,76,60,0.3)",
              color: "#c0392b",
            }}
          >
            {spot.alert}
          </motion.div>
        )}

        {/* Health Score */}
        <div className="mb-4 p-3 rounded-xl" style={{ background: "rgba(0,0,0,0.03)" }}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold" style={{ color: "#636e72" }}>Farm Health Score</span>
            <span
              className="font-black text-sm"
              style={{ color: spot.score > 70 ? "#27ae60" : spot.score > 40 ? "#e67e22" : "#e74c3c" }}
            >
              {spot.score}/100
            </span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#ecf0f1" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${spot.score}%` }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="h-full rounded-full"
              style={{
                background:
                  spot.score > 70
                    ? "linear-gradient(90deg,#27ae60,#7FD14F)"
                    : spot.score > 40
                    ? "linear-gradient(90deg,#e67e22,#f39c12)"
                    : "linear-gradient(90deg,#e74c3c,#c0392b)",
              }}
            />
          </div>
          <div className="text-[10px] mt-1 font-medium" style={{ color: "#b2bec3" }}>
            {spot.score > 70 ? "✅ Excellent conditions" : "⚠️ Attention required"}
          </div>
        </div>

        {/* Details */}
        <div className="mb-4">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#b2bec3" }}>
            Agricultural Details
          </div>
          {Object.entries(spot.details).map(([key, val]) => (
            <div
              key={key}
              className="flex items-start justify-between py-2"
              style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
            >
              <span className="text-[11px] font-semibold" style={{ color: "#b2bec3", minWidth: 90 }}>{key}</span>
              <span className="text-[11px] font-medium text-right flex-1 ml-2" style={{ color: "#2d3436" }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Expert Advice */}
        <div
          className="rounded-xl p-3"
          style={{ background: `${spot.color}08`, border: `1px solid ${spot.color}20` }}
        >
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: spot.color }}>
            💡 Expert Advice
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "#636e72" }}>{spot.advice}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ── HELPER: build a marker icon HTML string ───────────────────────────────────
function makeIconHtml(spot, isSelected) {
  const isAlert = spot.type === "pest_alert" || spot.type === "disease_alert";

  const pulseRing = isAlert
    ? `<div style="position:absolute;inset:-8px;border-radius:50%;border:2px solid ${spot.color};opacity:0.5;animation:agro-ring 1.8s ease-out infinite;"></div>`
    : "";

  const badge = isAlert
    ? `<span style="position:absolute;top:-4px;right:-4px;width:11px;height:11px;background:#e74c3c;border-radius:50%;border:2px solid white;box-shadow:0 0 6px rgba(231,76,60,0.8);"></span>`
    : "";

  const ring = isSelected
    ? `<div style="position:absolute;inset:-6px;border-radius:50%;border:3px solid ${spot.color};opacity:0.8;"></div>`
    : "";

  return `
    <div style="position:relative;width:48px;height:48px;">
      ${pulseRing}${ring}
      <div style="
        position:absolute;inset:0;border-radius:50%;
        background:${spot.color}28;
        border:2.5px solid ${spot.color};
        display:flex;align-items:center;justify-content:center;
        font-size:22px;cursor:pointer;
        box-shadow:0 4px 14px ${spot.color}55;
        ${isAlert ? "animation:agro-pulse 1.6s ease-in-out infinite;" : ""}
        ${isSelected ? `transform:scale(1.22);box-shadow:0 6px 20px ${spot.color}88;` : ""}
      ">${spot.icon}</div>
      ${badge}
    </div>`;
}

// ── LEAFLET MAP ───────────────────────────────────────────────────────────────
function TomatoMap({ hotspots, activeFilter, onMarkerClick, selectedId }) {
  const mapRef = useRef(null);
  const mapInst = useRef(null);
  const markersMapRef = useRef({}); // id → { marker, spot }
  const leafletReady = useRef(false);
  const prevSelectedId = useRef(null);

  // ── Build all markers (called only when filter changes or map first loads) ──
  const buildMarkers = useCallback(
    (map, L) => {
      // Remove existing markers
      Object.values(markersMapRef.current).forEach(({ marker }) => marker.remove());
      markersMapRef.current = {};

      const visible =
        activeFilter === "all" ? hotspots : hotspots.filter((h) => h.type === activeFilter);

      visible.forEach((spot) => {
        const isSelected = spot.id === selectedId;
        const html = makeIconHtml(spot, isSelected);
        const icon = L.divIcon({ html, className: "", iconSize: [48, 48], iconAnchor: [24, 24] });
        const mk = L.marker([spot.lat, spot.lng], { icon }).addTo(map);

        mk.on("click", () => onMarkerClick(spot));
        mk.bindTooltip(
          `<b style="font-size:13px">${spot.icon} ${spot.name}</b><br/>
           <span style="font-size:11px;color:#636e72">${spot.state} · ${TYPE_LABELS[spot.type]}</span>`,
          { direction: "top", offset: [0, -26], className: "agro-tooltip" }
        );

        markersMapRef.current[spot.id] = { marker: mk, spot };
      });

      prevSelectedId.current = selectedId;
    },
    [activeFilter, hotspots, onMarkerClick, selectedId]
  );

  // ── Update only the two affected markers when selection changes ──
  const updateSelection = useCallback(
    (L, newId) => {
      const oldId = prevSelectedId.current;

      // Deselect old
      if (oldId && markersMapRef.current[oldId]) {
        const { marker, spot } = markersMapRef.current[oldId];
        const html = makeIconHtml(spot, false);
        marker.setIcon(L.divIcon({ html, className: "", iconSize: [48, 48], iconAnchor: [24, 24] }));
      }

      // Select new
      if (newId && markersMapRef.current[newId]) {
        const { marker, spot } = markersMapRef.current[newId];
        const html = makeIconHtml(spot, true);
        marker.setIcon(L.divIcon({ html, className: "", iconSize: [48, 48], iconAnchor: [24, 24] }));
      }

      prevSelectedId.current = newId;
    },
    []
  );

  // ── Init map once ──
  useEffect(() => {
    if (mapInst.current || !mapRef.current) return;

    const init = (L) => {
      if (mapInst.current) return;
      const map = L.map(mapRef.current, {
        zoomControl: false,
        center: [20.5937, 78.9629],
        zoom: 5,
        preferCanvas: true,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap © CartoDB",
        subdomains: "abcd",
        maxZoom: 19,
        keepBuffer: 4,
      }).addTo(map);

      mapInst.current = map;
      leafletReady.current = true;

      const bounds = L.latLngBounds(TOMATO_HOTSPOTS.map((h) => [h.lat, h.lng]));
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 7 });

      buildMarkers(map, L);
    };

    if (window.L) {
      init(window.L);
    } else {
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      const s = document.createElement("script");
      s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      s.onload = () => init(window.L);
      document.head.appendChild(s);
    }

    return () => {
      if (mapInst.current) {
        mapInst.current.remove();
        mapInst.current = null;
        leafletReady.current = false;
        markersMapRef.current = {};
      }
    };
  }, []); // eslint-disable-line

  // ── Rebuild markers ONLY when filter changes ──
  useEffect(() => {
    if (mapInst.current && window.L && leafletReady.current) {
      buildMarkers(mapInst.current, window.L);
    }
  }, [activeFilter]); // eslint-disable-line

  // ── Update selection instantly (no full rebuild) ──
  useEffect(() => {
    if (mapInst.current && window.L && leafletReady.current) {
      updateSelection(window.L, selectedId);
    }
  }, [selectedId, updateSelection]);

  return (
    <div ref={mapRef} style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center",
          justifyContent: "center", background: "#eef6e8", fontSize: 14,
          color: "#636e72", zIndex: 0,
        }}
      >
        🗺️ Loading map…
      </div>
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function MapPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showHint, setShowHint] = useState(true);

  const alertCount = TOMATO_HOTSPOTS.filter(
    (h) => h.type === "pest_alert" || h.type === "disease_alert"
  ).length;

  // Instant click handler — no delays
  const handleMarkerClick = useCallback((spot) => {
    setShowHint(false);
    setSelectedMarker(spot);
  }, []);

  return (
    <div
      className="h-screen overflow-hidden flex flex-col"
      style={{ background: "#eef6e8", fontFamily: "'DM Sans','Outfit',sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .leaflet-container { background:#ddf0d4 !important; }
        .leaflet-control-attribution { display:none !important; }
        .agro-tooltip {
          background:white !important; border:1px solid rgba(39,174,96,0.3) !important;
          border-radius:10px !important; padding:7px 12px !important;
          font-family:'DM Sans',sans-serif !important; font-size:12px !important;
          box-shadow:0 4px 14px rgba(0,0,0,0.12) !important; white-space:nowrap !important;
        }
        .agro-tooltip::before { display:none !important; }
        @keyframes agro-pulse {
          0%,100% { transform:scale(1); opacity:1; }
          50% { transform:scale(1.14); opacity:0.8; }
        }
        @keyframes agro-ring {
          0% { transform:scale(0.8); opacity:0.6; }
          100% { transform:scale(1.5); opacity:0; }
        }
      `}</style>

      {/* HEADER */}
      <header
        className="flex-shrink-0 z-20 flex items-center justify-between px-4 py-3"
        style={{
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(39,174,96,0.15)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: "#636e72" }}
          >
            <ArrowLeft className="h-4 w-4" /> Home
          </button>
          <div style={{ height: 18, width: 1, background: "#ecf0f1" }} />
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#27ae60,#7FD14F)" }}
            >
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: "#2d3436" }}>Tomato Cultivation Map</div>
              <div className="text-[9px] font-medium" style={{ color: "#27ae60" }}>
                India · Live Agricultural Intelligence
              </div>
            </div>
          </div>
          {alertCount > 0 && (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold"
              style={{
                background: "rgba(231,76,60,0.1)",
                border: "1px solid rgba(231,76,60,0.3)",
                color: "#e74c3c",
              }}
            >
              <AlertTriangle className="h-3.5 w-3.5" /> {alertCount} Active Alerts
            </motion.div>
          )}
        </div>
        <div className="text-xs font-semibold" style={{ color: "#27ae60" }}>
          {TOMATO_HOTSPOTS.length} Locations · Click marker for details
        </div>
      </header>

      {/* MAP AREA */}
      <div className="flex-1 relative">
        {/* Filter Bar */}
        <div className="absolute top-3 left-3 z-20">
          <div
            className="flex flex-wrap gap-1.5 p-2 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              border: "1px solid rgba(255,255,255,0.9)",
            }}
          >
            {FILTER_TYPES.map((f) => (
              <motion.button
                key={f.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setActiveFilter(f.id); setSelectedMarker(null); }}
                className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-bold transition-all"
                style={{
                  background: activeFilter === f.id ? `${TYPE_COLORS[f.id] || "#27ae60"}15` : "transparent",
                  border: `1.5px solid ${activeFilter === f.id ? (TYPE_COLORS[f.id] || "#27ae60") + "40" : "transparent"}`,
                  color: activeFilter === f.id ? TYPE_COLORS[f.id] || "#27ae60" : "#636e72",
                }}
              >
                {f.icon} {f.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Hint toast */}
        <AnimatePresence>
          {showHint && !selectedMarker && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 2 }}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 rounded-xl px-4 py-2 text-xs font-semibold"
              style={{
                background: "rgba(39,174,96,0.12)",
                border: "1px solid rgba(39,174,96,0.4)",
                color: "#27ae60",
                backdropFilter: "blur(8px)",
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              👆 Click any marker on the map to see full details
            </motion.div>
          )}
        </AnimatePresence>

        {/* THE MAP */}
        <div className="absolute inset-0">
          <TomatoMap
            hotspots={TOMATO_HOTSPOTS}
            activeFilter={activeFilter}
            onMarkerClick={handleMarkerClick}
            selectedId={selectedMarker?.id ?? null}
          />
        </div>

        {/* Info Panel */}
        <AnimatePresence>
          {selectedMarker && (
            <MarkerInfoPanel
              spot={selectedMarker}
              onClose={() => setSelectedMarker(null)}
            />
          )}
        </AnimatePresence>

        {/* Legend */}
        <div
          className="absolute bottom-4 left-4 z-20 rounded-2xl p-3"
          style={{
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: "#b2bec3" }}>Legend</div>
          {[
            { icon: "📊", label: "Market Hub", color: "#27ae60" },
            { icon: "🌱", label: "Cultivation", color: "#e67e22" },
            { icon: "⚠️", label: "Pest Alert", color: "#e74c3c" },
            { icon: "🦠", label: "Disease Alert", color: "#e74c3c" },
            { icon: "🔬", label: "Research", color: "#2FA0D8" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2 mb-1.5">
              <span className="text-sm">{l.icon}</span>
              <span className="text-[11px] font-semibold" style={{ color: l.color }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="absolute bottom-4 right-4 z-20 flex gap-2">
          {[
            { label: `${TOMATO_HOTSPOTS.length} Locations`, icon: "📍", color: "#27ae60" },
            { label: `${alertCount} Active Alerts`, icon: "🚨", color: "#e74c3c" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold"
              style={{
                background: "rgba(255,255,255,0.96)",
                border: `1px solid ${s.color}20`,
                color: s.color,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              {s.icon} {s.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
