// Central German status labels — single source of truth so we don't repeat
// the same "pending → Ausstehend" mapping in every page.
//
// Each map is a plain object keyed by the raw status string we store in the
// DB. Use the helpers (`labelFor`, `colorFor`) when rendering, so unknown
// statuses degrade gracefully instead of throwing.

const COLOR_AMBER  = "bg-amber-50 text-amber-700 border-amber-200";
const COLOR_BLUE   = "bg-blue-50 text-blue-700 border-blue-200";
const COLOR_GREEN  = "bg-emerald-50 text-emerald-700 border-emerald-200";
const COLOR_RED    = "bg-red-50 text-red-700 border-red-200";
const COLOR_GRAY   = "bg-gray-50 text-gray-600 border-gray-200";
const COLOR_PURPLE = "bg-purple-50 text-purple-700 border-purple-200";
const COLOR_CYAN   = "bg-cyan-50 text-cyan-700 border-cyan-200";

export const EMPLOYEE_STATUS = {
  pending:    { label: "Neu",                   color: COLOR_AMBER },
  geprueft:   { label: "Geprüft",               color: COLOR_CYAN },
  invited:    { label: "Eingeladen",            color: COLOR_BLUE },
  interview:  { label: "Interview durchgeführt", color: COLOR_BLUE },
  entscheid:  { label: "Entscheid offen",       color: COLOR_PURPLE },
  approved:   { label: "Genehmigt",             color: COLOR_GREEN },
  rejected:   { label: "Abgelehnt",             color: COLOR_RED },
  available:  { label: "Verfügbar",             color: COLOR_GREEN },
  inactive:   { label: "Inaktiv",               color: COLOR_GRAY },
};

export const ASSIGNMENT_STATUS = {
  pending:    { label: "Ausstehend",            color: COLOR_AMBER },
  active:     { label: "Aktiv",                 color: COLOR_BLUE },
  completed:  { label: "Abgeschlossen",         color: COLOR_GREEN },
  rejected:   { label: "Abgelehnt",             color: COLOR_RED },
  terminated: { label: "Beendet",               color: COLOR_GRAY },
};

export const SCHEDULE_STATUS = {
  pending:    { label: "Ausstehend",            color: COLOR_AMBER },
  organizing: { label: "Wird organisiert",      color: COLOR_AMBER },
  // F-20: a Mitarbeiter has been assigned but has not yet accepted.
  // Falls between "wird organisiert" and "bestätigt".
  assigned:   { label: "Zugewiesen",            color: COLOR_BLUE },
  zugewiesen: { label: "Zugewiesen",            color: COLOR_BLUE },
  active:     { label: "Aktiv",                 color: COLOR_BLUE },
  confirmed:  { label: "Bestätigt",             color: COLOR_GREEN },
  ersatz_noetig: { label: "Ersatz nötig",       color: COLOR_AMBER },
  ersatz_bestaetigt: { label: "Ersatz bestätigt", color: COLOR_GREEN },
  done:       { label: "Erledigt",              color: COLOR_GREEN },
  cancelled:  { label: "Storniert",             color: COLOR_RED },
  canceled:   { label: "Storniert",             color: COLOR_RED },
  storniert:  { label: "Storniert",             color: COLOR_RED },
  terminated: { label: "Beendet",               color: COLOR_GRAY },
};

export const VACATION_STATUS = {
  pending:    { label: "Ausstehend",            color: COLOR_AMBER },
  approved:   { label: "Genehmigt",             color: COLOR_GREEN },
  declined:   { label: "Abgelehnt",             color: COLOR_RED },
  rejected:   { label: "Abgelehnt",             color: COLOR_RED },
};

export const CLIENT_STATUS = {
  open:        { label: "Offen",                color: COLOR_AMBER },
  active:      { label: "Aktiv",                color: COLOR_GREEN },
  gekuendigt:  { label: "Gekündigt",            color: COLOR_RED },
  canceled:    { label: "Storniert",            color: COLOR_RED },
  cancelled:   { label: "Storniert",            color: COLOR_RED },
};

// Generic confirmation-status used on Assignment rows
export const CONFIRMATION_STATUS = {
  pending:   { label: "Wartet auf Bestätigung", color: COLOR_AMBER },
  confirmed: { label: "Bestätigt",              color: COLOR_GREEN },
  rejected:  { label: "Abgelehnt",              color: COLOR_RED },
};

export function labelFor(map, status) {
  if (!status) return "—";
  return map?.[status]?.label || status;
}

export function colorFor(map, status) {
  return map?.[status]?.color || COLOR_GRAY;
}
