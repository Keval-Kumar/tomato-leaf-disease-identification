import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Activity, Leaf, ShieldAlert, Star, Clock, Trash2, ChevronRight } from "lucide-react";
import { getScans, getStats, clearScans } from "../utils/scanHistory";

// ─── tiny helpers ─────────────────────────────────────────────────────────────
function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days  > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins  > 0) return `${mins}m ago`;
  return "Just now";
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ─── stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, value, label, color, bg, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ background: "white", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <div className="text-2xl font-black" style={{ color: "#1a1a1a" }}>
          {value ?? <span style={{ color: "#b2bec3" }}>—</span>}
        </div>
        <div className="text-xs font-medium mt-0.5" style={{ color: "#9e9e9e" }}>{label}</div>
      </div>
    </motion.div>
  );
}

// ─── scan history row ─────────────────────────────────────────────────────────
function ScanRow({ scan, index }) {
  const isHealthy = scan.disease?.toLowerCase().includes("healthy");
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.01]"
      style={{ background: "white", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
    >
      {/* Icon */}
      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: `${scan.color || "#27ae60"}18`, border: `1.5px solid ${scan.color || "#27ae60"}30` }}>
        {scan.icon || "🍅"}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate" style={{ color: "#2d3436" }}>{scan.disease}</div>
        <div className="text-[11px] flex items-center gap-2 mt-0.5">
          <span style={{ color: "#b2bec3" }}>{timeAgo(scan.timestamp)}</span>
          <span style={{ color: "#ecf0f1" }}>·</span>
          <span className="font-medium" style={{ color: scan.color || "#27ae60" }}>
            {scan.confidence ?? "—"}% confidence
          </span>
        </div>
      </div>

      {/* Badge */}
      <div className="flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold"
        style={{
          background: isHealthy ? "rgba(39,174,96,0.1)" : "rgba(231,76,60,0.08)",
          color: isHealthy ? "#27ae60" : "#e74c3c",
        }}>
        {isHealthy ? "✅ Healthy" : "⚠️ Disease"}
      </div>
    </motion.div>
  );
}

// ─── MAIN ACCOUNT PAGE ────────────────────────────────────────────────────────
export default function AccountPage() {
  const [tab,    setTab]    = useState("overview");   // "overview" | "history"
  const [scans,  setScans]  = useState([]);
  const [stats,  setStats]  = useState({ total:0, healthy:0, diseases:0, avgConf:null });
  const [showConfirm, setShowConfirm] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setScans(getScans());
    setStats(getStats());
  }

  function handleClear() {
    clearScans();
    refresh();
    setShowConfirm(false);
  }

  // Pull user info from localStorage (set by auth / profile save)
  const userName  = localStorage.getItem("agroai_username")  || "Farmer";
  const userEmail = localStorage.getItem("agroai_email")     || "Not set";

  return (
    <div className="min-h-screen" style={{ background:"linear-gradient(180deg,#f0f9eb,#ffffff)", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-20 px-4 py-4 flex items-center gap-3"
        style={{ background:"rgba(255,255,255,0.9)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(39,174,96,0.1)" }}>
        <button onClick={() => window.location.href = "/"} className="p-2 rounded-xl hover:bg-black/5 transition-colors">
          <ArrowLeft className="h-5 w-5" style={{ color:"#636e72" }} />
        </button>
        <h1 className="font-bold text-lg" style={{ color:"#1a1a1a" }}>My Account</h1>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">

        {/* ── USER CARD ── */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          className="rounded-3xl p-5 text-white relative overflow-hidden"
          style={{ background:"linear-gradient(135deg,#27ae60,#7FD14F)", boxShadow:"0 12px 40px rgba(39,174,96,0.3)" }}>
          {/* Decorative circles */}
          <div style={{ position:"absolute", right:-20, top:-20, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }} />
          <div style={{ position:"absolute", right:40, bottom:-30, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />

          <div className="relative flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0"
              style={{ background:"rgba(255,255,255,0.25)", backdropFilter:"blur(8px)" }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-xl truncate">{userName}</div>
              <div className="text-sm opacity-80 truncate">{userEmail}</div>
              <div className="flex items-center gap-1.5 mt-2">
                <div className="w-2 h-2 rounded-full bg-white opacity-80 animate-pulse" />
                <span className="text-xs font-semibold opacity-90">AgroAI Farmer Account</span>
              </div>
            </div>
            <div className="flex-shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold"
              style={{ background:"rgba(255,255,255,0.25)", backdropFilter:"blur(8px)" }}>
              🌟 Active
            </div>
          </div>
        </motion.div>

        {/* ── TABS ── */}
        <div className="flex rounded-2xl p-1" style={{ background:"rgba(0,0,0,0.04)" }}>
          {[
            { id:"overview", label:"Overview",          icon:<Activity className="h-4 w-4" /> },
            { id:"history",  label:"Prediction History",icon:<Clock    className="h-4 w-4" /> },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all"
              style={{
                background: tab === t.id ? "white" : "transparent",
                color:      tab === t.id ? "#27ae60" : "#9e9e9e",
                boxShadow:  tab === t.id ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              }}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        <AnimatePresence mode="wait">
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="space-y-4">

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard icon={<Activity className="h-5 w-5" />} value={stats.total}    label="Total Scans"     color="#2FA0D8" bg="rgba(47,160,216,0.1)"  delay={0.05} />
                <StatCard icon={<Leaf     className="h-5 w-5" />} value={stats.healthy}  label="Healthy Leaves"  color="#27ae60" bg="rgba(39,174,96,0.1)"   delay={0.1}  />
                <StatCard icon={<ShieldAlert className="h-5 w-5"/>}value={stats.diseases} label="Diseases Found"  color="#e74c3c" bg="rgba(231,76,60,0.08)"  delay={0.15} />
                <StatCard icon={<Star     className="h-5 w-5" />}
                  value={stats.avgConf != null ? `${stats.avgConf}%` : null}
                  label="Avg Confidence" color="#e67e22" bg="rgba(230,126,34,0.1)"  delay={0.2}  />
              </div>

              {/* Recent scans preview */}
              {scans.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color:"#b2bec3" }}>
                      Recent Scans
                    </span>
                    <button onClick={() => setTab("history")}
                      className="flex items-center gap-1 text-xs font-semibold" style={{ color:"#27ae60" }}>
                      See all <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {scans.slice(0, 3).map((s, i) => <ScanRow key={s.id} scan={s} index={i} />)}
                  </div>
                </div>
              )}

              {scans.length === 0 && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                  className="rounded-3xl p-8 text-center"
                  style={{ background:"white", border:"1px solid rgba(0,0,0,0.05)" }}>
                  <div className="text-5xl mb-3">🍅</div>
                  <div className="font-bold text-base mb-1" style={{ color:"#2d3436" }}>No scans yet</div>
                  <div className="text-sm" style={{ color:"#9e9e9e" }}>
                    Upload a tomato leaf photo to detect diseases and track your farm health.
                  </div>
                  <button onClick={() => window.location.href = "/predictions"}
                    className="mt-4 rounded-2xl px-5 py-2.5 text-sm font-bold text-white"
                    style={{ background:"linear-gradient(135deg,#27ae60,#7FD14F)" }}>
                    Start First Scan →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── HISTORY TAB ── */}
          {tab === "history" && (
            <motion.div key="history" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="space-y-3">

              {scans.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color:"#b2bec3" }}>
                    {scans.length} scan{scans.length !== 1 ? "s" : ""} recorded
                  </span>
                  <button onClick={() => setShowConfirm(true)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all hover:scale-105"
                    style={{ background:"rgba(231,76,60,0.08)", color:"#e74c3c" }}>
                    <Trash2 className="h-3.5 w-3.5" /> Clear All
                  </button>
                </div>
              )}

              {scans.length === 0 ? (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                  className="rounded-3xl p-10 text-center"
                  style={{ background:"white", border:"1px solid rgba(0,0,0,0.05)" }}>
                  <div className="text-5xl mb-3">📋</div>
                  <div className="font-bold text-base mb-1" style={{ color:"#2d3436" }}>No predictions yet</div>
                  <div className="text-sm" style={{ color:"#9e9e9e" }}>
                    Your scan history will appear here after you analyze a leaf.
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-2">
                  {scans.map((s, i) => <ScanRow key={s.id} scan={s} index={i} />)}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── CONFIRM CLEAR DIALOG ── */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-end justify-center pb-8 px-4"
            style={{ background:"rgba(0,0,0,0.4)", backdropFilter:"blur(4px)" }}
            onClick={() => setShowConfirm(false)}>
            <motion.div initial={{ y:60, opacity:0 }} animate={{ y:0, opacity:1 }}
              exit={{ y:60, opacity:0 }}
              className="w-full max-w-sm rounded-3xl p-6"
              style={{ background:"white" }}
              onClick={(e) => e.stopPropagation()}>
              <div className="text-xl mb-1 font-black" style={{ color:"#1a1a1a" }}>Clear all history?</div>
              <p className="text-sm mb-5" style={{ color:"#636e72" }}>
                This will permanently delete all {scans.length} scan records. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)}
                  className="flex-1 rounded-2xl py-3 text-sm font-bold"
                  style={{ background:"rgba(0,0,0,0.05)", color:"#636e72" }}>
                  Cancel
                </button>
                <button onClick={handleClear}
                  className="flex-1 rounded-2xl py-3 text-sm font-bold text-white"
                  style={{ background:"linear-gradient(135deg,#e74c3c,#c0392b)" }}>
                  Delete All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}