import { CRITICAL_THRESHOLDS } from "../config.js";

export function getRiskLevel(probabilityPercent, type) {
  const p = Number(probabilityPercent);
  const thresholds = CRITICAL_THRESHOLDS[type];

  if (p >= thresholds.high) {
    return "🔴 HIGH RISK";
  }
  if (p >= thresholds.medium) {
    return "🟡 MEDIUM RISK";
  }
  return "🟢 LOW RISK";
}

export function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
