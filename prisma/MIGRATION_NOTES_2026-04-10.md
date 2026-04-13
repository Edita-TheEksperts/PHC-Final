# Schema changes — 2026-04-10 (PHC feedback 09.04)

The following columns were added to `prisma/schema.prisma` as part of the
09.04.2026 feedback fixes. They must be pushed to the database before the
updated UI will work (reading/writing these fields).

## Employee
- `bankUpdatedAt  DateTime?`  — timestamp of last Bankdaten save, shown on the employee Finanzen page and admin detail page.
- `birthDate      DateTime?`  — Geburtsdatum.
- `maritalStatus  String?`    — Zivilstand (Verheiratet / Geschieden / Ledig / Verwitwet — enforced in UI).
- `ahvNumber      String?`    — AHV-Nummer.
- `hasChildren    Boolean?`   — Kinder Ja/Nein.

## InternalNote
- `readByAdmin    Boolean @default(true)`
  - Messages authored by clients or employees are stored with `readByAdmin=false`,
    existing admin-authored notes default to `true`.
  - New PATCH route on `/api/admin/notes` flips this flag to `true` when the admin
    opens an unread message from the new "Neue Nachrichten" alert card on
    `admin-dashboard.js`.

## How to apply

This repo uses `prisma db push` style deployments (the `prisma/migrations`
folder is several months behind the current schema). To apply:

```
npx prisma db push
npx prisma generate
```

If you prefer tracked migrations, run `npx prisma migrate dev --name
feedback_0904_personal_info_and_read_flag` instead. Note that this will try
to baseline all the drifted columns, so only do it if you are also prepared
to reconcile the existing migration history.

## Equivalent raw SQL
For reference, the raw SQL is:

```sql
ALTER TABLE "Employee"
  ADD COLUMN "bankUpdatedAt" TIMESTAMP(3),
  ADD COLUMN "birthDate"     TIMESTAMP(3),
  ADD COLUMN "maritalStatus" TEXT,
  ADD COLUMN "ahvNumber"     TEXT,
  ADD COLUMN "hasChildren"   BOOLEAN;

ALTER TABLE "InternalNote"
  ADD COLUMN "readByAdmin"   BOOLEAN NOT NULL DEFAULT true;
```
