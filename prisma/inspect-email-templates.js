// Read-only inspection of the EmailTemplate table (QA A6).
// Reports: total rows, orphaned legacy rows, and rows still using a raw
// first-name salutation instead of {{greeting}}.
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ORPHANS = ["assignentAccepted", "welcomeEmail"];
const RAW_GREETING = /(Grüezi|Hallo)\s+\{\{\s*firstName\s*\}\}/i;

(async () => {
  const rows = await prisma.emailTemplate.findMany({ select: { id: true, name: true, body: true } });
  console.log(`Total EmailTemplate rows: ${rows.length}\n`);

  const orphansFound = rows.filter((r) => ORPHANS.includes(r.name));
  console.log(`Orphaned legacy rows present: ${orphansFound.length}`);
  orphansFound.forEach((r) => console.log(`  - id=${r.id} name="${r.name}"`));

  const rawGreeting = rows.filter((r) => RAW_GREETING.test(r.body || ""));
  console.log(`\nRows with raw "Grüezi/Hallo {{firstName}}" (should be {{greeting}}): ${rawGreeting.length}`);
  rawGreeting.forEach((r) => {
    const m = (r.body || "").match(RAW_GREETING);
    console.log(`  - id=${r.id} name="${r.name}"  →  "${m ? m[0] : ""}"`);
  });

  console.log(`\nAll template names:`);
  console.log("  " + rows.map((r) => r.name).sort().join(", "));
  await prisma.$disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
