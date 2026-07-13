-- A6 follow-up: remove orphaned legacy e-mail templates (QA 12.07.2026).
--
-- ✅ APPLIED 13.07.2026 via prisma/apply-email-cleanup.js against the DB:
--    - Deleted 2 orphaned rows: assignentAccepted, welcomeEmail
--    - Switched 6 templates from raw "Grüezi/Hallo {{firstName}}" to {{greeting}}
--    - Result: 18 rows, 0 orphans, 0 raw greetings (verified via inspect-email-templates.js)
--
-- This SQL is kept for reference / re-use on another environment. Run against a
-- BACKUP first; verify the rows exist before deleting:
--
--   SELECT name FROM "EmailTemplate" WHERE name IN ('assignentAccepted','welcomeEmail');

DELETE FROM "EmailTemplate" WHERE name IN ('assignentAccepted', 'welcomeEmail');

-- The {{greeting}} salutation change on already-stored rows was applied by
-- prisma/apply-email-cleanup.js (targeted UPDATE). The seed
-- (prisma/seed-email-templates.js) also uses {{greeting}} for new rows.
