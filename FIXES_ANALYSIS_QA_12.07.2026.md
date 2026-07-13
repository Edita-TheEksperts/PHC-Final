# PHC — QA-Paket 12.07.2026 · Fixes-Analyse

Umsetzung der Bug-Fix-Liste (Teil A) aus dem QA-Paket. **A1–A6 erledigt und lokal
gegen den laufenden Dev-Server verifiziert.** A7 (Serien-Zuweisung) ist ein
separater Feature-Build und hier nur als Konzept/Plan festgehalten.

Deliverables:
- `PHC_QA-Umsetzung_12.07.2026.docx` — Abnahmedokument (Teil A Fixes + Teil B 11-Prozess-Testplan mit Screenshots)
- `tests/e2e/process-screenshots.spec.js` — Playwright-Capture der Prozess-Screenshots
- `build_qa_doc.py` — Generator des Abnahmedokuments

---

## Übersicht

| ID | Titel | Prio | Status |
|----|-------|------|--------|
| A1 | Neubuchung crasht Kunden-Dashboard | P0 | ✅ Erledigt |
| A2 | Admin kann keinen MA zuweisen (Matching blockiert) | P0 | ✅ Erledigt |
| A3 | Admin-Profil: fremder Benutzer + tote PW-Änderung | P0/P1 | ✅ Erledigt |
| A4 | Kunde sieht keine Quittungen (Stripe) | P1 | ✅ Erledigt |
| A5 | Funnel: Häufigkeits-Fehlermeldung bleibt stehen | P2 | ✅ Erledigt |
| A6 | Stornogrenze + Politur | P2/P3 | ✅ Kern erledigt · Follow-ups dokumentiert |
| A7 | Serien-Zuweisung & Ersatz | P0 Konzept | 📋 Konzept/Plan (separater Build) |

---

## A1 — Neubuchung crasht das Kunden-Dashboard  (P0)

**Ursache:** `Cannot read properties of null (reading 'id')` in der Render-Funktion;
nach der Zahlung wurde `paymentIntent.id` ungeschützt gelesen, und ein Render-Fehler
brachte die ganze Seite zum dauerhaften Absturz.

**Änderung:**
- `src/pages/client-dashboard.js` — `handleStripePayment()`: Guard `if (error || !paymentIntent) return;` vor dem Zugriff auf `paymentIntent.id`.
- `src/components/ErrorBoundary.js` (neu) — umschließt das gesamte Kunden-Dashboard (`ClientDashboardPage`), zeigt bei Render-Fehlern eine deutsche Fallback-Seite mit „Seite neu laden" statt des schwarzen „Application error".

**Verifiziert:** `/client-dashboard` → HTTP 200; kompiliert; Fallback greift bei Render-Fehler.
**Offen (Live):** exakte `.id`-Zeile per Source-Map final pinnen; defekten Schedule-Datensatz löschen (`npx prisma studio`).

## A2 — Admin kann keinem Einsatz einen Mitarbeiter zuweisen  (P0)

**Ursache A (Auth):** 5 Admin-Fetches in `src/components/Einsaetze.js` sendeten
`Bearer localStorage.userToken` (Client-Token). Admins authentifizieren per
HttpOnly-Cookie → 401/403, Listen leer.
**Ursache B (Filter):** `src/pages/api/admin/matchmaking.js` filterte `status:"available"`;
genehmigte MA haben `"approved"` → Kandidatenmenge immer 0.

**Änderung:**
- Alle 5 Einsaetze-Fetches → `credentials: "include"` (Cookie-Fallback der Middleware).
- matchmaking: `where: { status: { in: ["approved","accepted","available"] } }`.
- Gleiche `userToken`-Falle zusätzlich in `src/pages/admin/clients/[id].js` (set-status) behoben.

**Verifiziert:** `/api/admin/profile` → 401 ohne Cookie (Middleware ok); Fetches nutzen jetzt den Cookie.

## A3 — Admin-Einstellungen: fremder Benutzer + tote Passwortänderung  (P0/P1)

**Ursache:** `src/pages/api/admin/profile.js` nutzte `findFirst({role:"admin"})`
(→ irgendein Admin) und akzeptierte nur GET (PATCH → 405).

**Änderung:** Datei neu — identifiziert den Admin über den Middleware-Header
`x-admin-email` (aus dem verifizierten `adminToken`). GET liefert den eingeloggten
Admin; PATCH ändert das Passwort mit bcrypt (aktuelles PW prüfen, min. 6 Zeichen).

**Verifiziert:** GET/PATCH-Zweige vorhanden; 401 ohne Header.

## A4 — Kunde sieht keine Quittungen  (P1)

**Ursache:** Finanzen-Tab ohne Zahlungsliste; `invoice-pdf.js` verwaist und las
Stripe-Invoices, obwohl nur PaymentIntents existieren.

**Änderung (Option A):**
- `src/pages/api/client/receipts.js` (neu) — listet Stripe-Charges des Kunden mit `receipt_url`; unbekannter Kunde → `200 []` (kein Fehler).
- `src/pages/dashboard/finanzen.js` — Abschnitt „Meine Zahlungen / Quittungen" (Datum, Betrag, „Quittung öffnen", Lade-/Leerzustand).

**Verifiziert:** `/api/client/receipts?userId=nonexistent` → `200 []`; Tab lädt.
**Offen (Option B):** echte Stripe-Invoices im Buchungs-Flow → PDF-Downloads.

## A5 — Funnel: Häufigkeits-Fehlermeldung bleibt stehen  (P2)

**Änderung:** `src/pages/register-client.js` — Häufigkeits-Button löscht zusätzlich
`errors.frequency` (`setErrors((prev) => ({ ...prev, frequency: "" }))`).

## A6 — Stornogrenze + Politur  (P2/P3)

**Erledigt:**
- Stornogrenze `src/pages/client-dashboard.js` auf `>= 14` / `>= 7` angeglichen (Backend nutzt `>=`). Bei exakt 14 Tagen jetzt konsistent 0 % Gebühr.
- Kraftausdruck-Kommentar in `src/pages/api/create-payment-intent.js` entfernt.
- Kundenprofil-Status als deutsches Label (`src/pages/admin/clients/[id].js`); gespeicherter Wert unverändert.

**Follow-ups — jetzt umgesetzt bzw. bereitgestellt:**
1. **E-Mail-Vorlagen:** Die Seed-Vorlagen nutzen bereits `{{greeting}}`; die eine verbliebene Rohanrede (`interviewReminder`) wurde in `prisma/seed-email-templates.js` auf `{{greeting}}` umgestellt. Die Bereinigung verwaister Zeilen liegt als **`prisma/cleanup-email-templates.sql`** bereit (bewusst NICHT ausgeführt — destruktive Prod-DB-Operation, nur nach Backup ausführen).
2. **alert() → Inline:** Kartenwechsel (`dashboard/finanzen.js`) auf eine Inline-Meldung im Modal umgestellt. Die Re-Booking-`alert()`s im 1930-Zeilen-`client-dashboard.js` (kritische Zahlungslogik) wurden bewusst belassen — sie funktionieren; ein Umbau ist reine P3-Politur mit Bruchrisiko.
3. **Rohstatus-Audit durchgeführt:** Kunden-Dashboard, Mitarbeiter-Dashboard und Kundenliste rendern bereits deutsche Labels (`labelFor` / Badge-Logik). Einziger Rohstatus (Admin-Kundendetail-Dropdown) wurde auf deutsche Labels umgestellt.

## A7 — Serien-Zuweisung & Ersatz  (P0 Konzept — separater Build)

Entscheid: **Serie ist Standard.** Ist-Zustand: `assign-employee.js` erzeugt das
Assignment mit `scheduleId` = genau ein Termin; parallel wird `scheduleId=null` im
Kunden-Dashboard als „alle Termine" interpretiert → Doppelmodell ohne klare Regel,
keine Ersatzlogik. Zielbild (Serien-Assignment, Absenz pro Termin, Ersatz-Matching,
Statuslogik, Doku) siehe Teil A7 im Abnahmedokument. **Nicht in diesem Pass gebaut.**

---

## Live-Verifikation (read-only, gegen die echte DB · 13.07.2026)

Gegen den laufenden Dev-Server mit den echten Test-Accounts geprüft — ohne
Datenmutation:

| Fix | Prüfung | Ergebnis |
|-----|---------|----------|
| A1 | `/client-dashboard` lädt eingeloggt | HTTP 200, rendert (keine Absturzschleife) |
| A2 | `/api/admin/matchmaking?clientId=…` mit Admin-Auth | Liefert **Kandidaten mit Score** (z. B. Sebastian Müller, Score 74) — vorher immer `[]` |
| A2 | `/api/admin/employees` mit Admin-Auth | 10 genehmigte MA geladen (vorher 401/leer) |
| A3 | `GET /api/admin/profile` mit Admin-Token | Liefert **„PHC Admin / admin@phc.local"** — nicht „Sandra Keller" |
| A3 | `PATCH /api/admin/profile` mit falschem aktuellem PW | „Aktuelles Passwort ist falsch." (deutsch), **keine Änderung** |
| A4 | `GET /api/client/receipts?userId=…` | `200 []` sauberer Leerzustand (Kunde ohne Charges) |

Für die noch offenen Screenshots (befüllte Quittungsliste, abgeschlossene Zahlung,
E-Mails) ist ein Kunde mit echten Stripe-Charges bzw. ein Posteingang nötig.

---

## Zusätzlicher Befund (nicht im QA-Paket) — ✅ behoben

`src/pages/admin/clients/[id].js` (~Z. 800) sendete beim Speichern eines Kundenprofils
`PUT /api/clients/[id]` mit `Bearer userToken` (für Admins null). Der Endpoint verifizierte
nur den Bearer-JWT und konnte das HttpOnly-`adminToken`-Cookie nicht lesen → Admin-Speichern
lief in 401.

**Behoben:** `src/pages/api/clients/[id].js` (PUT) akzeptiert jetzt Bearer **oder** das
`adminToken`-Cookie (probiert beide, ignoriert „null"/„undefined"); das Frontend sendet
`credentials:"include"` statt des Bearer-Tokens. Der/die Kund*in kann weiterhin das eigene
Profil bearbeiten, Admins jedes.

---

## Screenshots / Abnahme

`npm run dev` starten, dann:

```bash
npx playwright test tests/e2e/process-screenshots.spec.js
python build_qa_doc.py
```

**25 von 46** Teil-B-Screenshots werden automatisch aufgenommen. Die restlichen 21
sind Platzhalter mit Begründung im Dokument und **live nachzureichen**:
- **E-Mails** (61–67, 28, 38b) — echter Posteingang nötig.
- **Abgeschlossene Stripe-Zahlung** (15, 16, 22) — Karteneingabe im CardElement live.
- **A7-Serie/Ersatz** (38–45) — nach dem A7-Build.
- **Datenabhängig** (31, 37, 42, 46, 57, 58) — live mit passendem DB-Zustand.

Test-Accounts: `tests/e2e/credentials.js` (Admin/Kunde/Mitarbeiter) · Stripe-Testkarte `4242 4242 4242 4242`.
