# A7 — Serien-Zuweisung & Ersatzregelung (Prozess-Dokumentation)

Verbindliche Beschreibung des Zuweisungsverhaltens für PHC (Anforderung Bettina & Silvain).
Umgesetzt ohne Schema-Migration über die Konvention **`Assignment.scheduleId = null` = Serien-Zuweisung**.

## Grundregel: Serie ist Standard

Weist der Admin einem Kunden einen Mitarbeiter zu, gilt die Anfrage für die **ganze Serie**
(alle zukünftigen Termine dieser Buchung) — nicht nur für einen einzelnen Termin.
Einzeltermin-Zuweisung bleibt für Ersatz/Einmalbuchungen möglich.

## Ablauf

### 1. Serien-Anfrage (Admin → Mitarbeiter)
- Admin öffnet einen offenen Einsatz des Kunden und weist einen Mitarbeiter zu.
- Es entsteht **eine** Serien-Zuweisung (`Assignment`, `scheduleId = null`, `confirmationStatus = "pending"`).
- Die einzelnen Termine (`Schedule.employeeId`) werden **noch nicht** gestempelt.
- Der Mitarbeiter erhält eine Anfrage-Mail, die die Serie benennt:
  **„Serie: Mo/Mi/Fr, je 2 Std, ab 21.07.2026"** (`{{seriesDescription}}`).
- Kunden-Dashboard zeigt für alle Termine **„zugewiesen"** (blau).

### 2. Annahme (Mitarbeiter)
- Nimmt der Mitarbeiter an, werden **alle** zukünftigen, noch unbesetzten Termine des Kunden
  mit seiner `employeeId` gestempelt (`confirm-assignment.js`).
- Kunden-Dashboard: **„bestätigt"** (grün), Betreuer bei allen Terminen sichtbar.
- Kunde erhält die Bestätigungs-Mail.

### 3. Ablehnung (Mitarbeiter, ganze Serie)
- Alle zukünftigen Termine werden wieder freigegeben (`employeeId = null`) → **„Nicht zugewiesen"**,
  neu vergebbar. (Ab 3 Ablehnungen: Warn-Mail an den Mitarbeiter.)

### 4. Absenz pro Termin (Mitarbeiter, Krankheit/Urlaub)
- Der Stamm-Mitarbeiter kann **einen einzelnen Termin** freigeben (Button „Absenz melden" im
  Mitarbeiter-Dashboard → `release-schedule.js`).
- Nur dieser Termin: `employeeId = null`, `status = "ersatz_noetig"`. Die **restliche Serie bleibt**
  beim Stamm-Mitarbeiter.
- Kunden-Dashboard zeigt für dieses Datum **„Ersatz nötig"** (Bernstein).

### 5. Ersatzregelung (Admin → Ersatz-Mitarbeiter)
- Freigegebene Termine (`ersatz_noetig`) erscheinen im Admin unter „Offene Zuweisungen".
- Weist der Admin dort einen Mitarbeiter zu, entsteht eine **Einzel-Zuweisung**
  (`scheduleId` = dieser Termin) — nur für dieses eine Datum.
- Nach Annahme sieht der Kunde an diesem Datum den Ersatz, an allen anderen den Stamm-Mitarbeiter.

## Statuslogik (alle Labels DEUTSCH)

| Ebene | Status |
|-------|--------|
| Serie | angefragt → bestätigt → aktiv (bzw. abgelehnt → neu vergeben) |
| Einzeltermin (Ersatz) | geplant → **Ersatz nötig** → Ersatz bestätigt |

`Schedule`-Status `ersatz_noetig` → Label **„Ersatz nötig"** (`src/lib/statusLabels.js`).

## Betroffene Dateien
- `src/lib/series.js` — Serien-Beschreibung (Mo/Mi/Fr, Stunden, Startdatum)
- `src/pages/api/admin/assign-employee.js` — Serie vs. Einzel (Ersatz)
- `src/pages/api/employee/confirm-assignment.js` — Annahme propagiert / Ablehnung gibt frei
- `src/pages/api/employee/release-schedule.js` — Absenz pro Termin (neu)
- `src/pages/api/employee/pending-assignments.js` — Serien-Beschreibung für die Anfrage
- `src/pages/api/einsaetze/index.js` — `ersatz_noetig` für den Admin sichtbar
- `src/components/AssignmentList.js`, `src/pages/employee-dashboard.js` — „Absenz melden" + Serienname
- `src/pages/client-dashboard.js` — „Ersatz nötig"-Badge
- `src/lib/statusLabels.js`, `prisma/seed-email-templates.js` — Status + E-Mail-Serienzeile

## Verifikation
`prisma/a7-series-test.js` — Integrationstest (isolierter Test-Kunde, echte Mitarbeiter,
Cleanup am Ende). Prüft: Serien-Zuweisung, Annahme-Propagation, Absenz, Ersatz-Einzelzuweisung,
Serien-Ablehnung. **Alle 5 Prüfungen bestanden.** Ausführen: `node prisma/a7-series-test.js`
(Dev-Server muss laufen).
