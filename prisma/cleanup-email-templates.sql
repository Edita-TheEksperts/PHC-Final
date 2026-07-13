-- A6 follow-up: remove orphaned legacy e-mail templates (QA 12.07.2026).
-- These names are no longer referenced by the app; the current templates live
-- under different names and are seeded by prisma/seed-email-templates.js.
--
-- SAFETY: run against a BACKUP first. This is a destructive delete on the
-- production EmailTemplate table. Verify the two rows exist before deleting:
--
--   SELECT name FROM "EmailTemplate" WHERE name IN ('assignentAccepted','welcomeEmail');
--
-- Then, once confirmed:

DELETE FROM "EmailTemplate" WHERE name IN ('assignentAccepted', 'welcomeEmail');

-- Note: the {{greeting}} salutation change is handled in the seed
-- (prisma/seed-email-templates.js). To apply it to already-stored rows, either
-- re-run the seed (npm run seed:emails) or update the affected rows' bodies to
-- use {{greeting}} instead of "Grüezi/Hallo {{firstName}}".
