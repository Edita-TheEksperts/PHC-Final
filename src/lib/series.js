// A7 — helpers for series ("Serien-Zuweisung"): describing a client's recurring
// einsatz series and finding the future schedules that belong to it.

const DAY_ABBREV = {
  Montag: "Mo", Dienstag: "Di", Mittwoch: "Mi", Donnerstag: "Do",
  Freitag: "Fr", Samstag: "Sa", Sonntag: "So",
};
const DAY_ORDER = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

function abbrevDay(day) {
  if (!day) return "";
  return DAY_ABBREV[day] || day.slice(0, 2);
}

function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "";
  return `${String(dt.getDate()).padStart(2, "0")}.${String(dt.getMonth() + 1).padStart(2, "0")}.${dt.getFullYear()}`;
}

/**
 * Human-readable series description, e.g. "Mo/Mi/Fr, je 2 Std, ab 21.07.2026".
 * Falls back gracefully when data is sparse.
 */
function describeSeries(schedules) {
  const list = Array.isArray(schedules) ? schedules.filter(Boolean) : [];
  if (list.length === 0) return "Einsatz-Serie";

  const days = [...new Set(list.map((s) => abbrevDay(s.day)).filter(Boolean))]
    .sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));

  const hoursSet = [...new Set(list.map((s) => s.hours).filter((h) => h != null))];
  const dates = list.map((s) => s.date).filter(Boolean).map((d) => new Date(d)).sort((a, b) => a - b);

  const parts = [];
  if (days.length) parts.push(days.join("/"));
  if (hoursSet.length === 1) parts.push(`je ${hoursSet[0]} Std`);
  if (dates.length) parts.push(`ab ${formatDate(dates[0])}`);
  return parts.length ? parts.join(", ") : "Einsatz-Serie";
}

module.exports = { abbrevDay, describeSeries, formatDate };
