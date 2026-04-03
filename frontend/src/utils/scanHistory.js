// src/utils/scanHistory.js
// ─── Persists scan history in localStorage ────────────────────────────────

const STORAGE_KEY = "agroai_scan_history";

/**
 * Save a new scan to history.
 * @param {{ disease: string, confidence: number, icon: string, color: string, cropType?: string, imageName?: string }} scan
 */
export function saveScan(scan) {
  const existing = getScans();
  const entry = {
    id: `scan_${Date.now()}`,
    timestamp: new Date().toISOString(),
    cropType: "tomato",
    ...scan,
  };
  const updated = [entry, ...existing].slice(0, 100); // keep last 100
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("scanHistory: localStorage write failed", e);
  }
  return entry;
}

/** Return all saved scans (newest first). */
export function getScans() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Delete all scan history. */
export function clearScans() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Derived stats from scan history.
 * @returns {{ total: number, healthy: number, diseases: number, avgConf: number|null }}
 */
export function getStats() {
  const scans = getScans();
  const total = scans.length;
  if (!total) return { total: 0, healthy: 0, diseases: 0, avgConf: null };

  const healthy = scans.filter((s) =>
    s.disease?.toLowerCase().includes("healthy")
  ).length;

  const avgConf = Math.round(
    scans.reduce((sum, s) => sum + (s.confidence || 0), 0) / total
  );

  return { total, healthy, diseases: total - healthy, avgConf };
}