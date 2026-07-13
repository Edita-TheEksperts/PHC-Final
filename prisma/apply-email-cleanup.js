// A6 apply: delete orphaned templates + switch raw first-name salutations to
// {{greeting}}. Prints before/after for every change. Authorized cleanup on a
// non-production DB.
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ORPHANS = ["assignentAccepted", "welcomeEmail"];
const RAW_GREETING = /(?:Grüezi|Hallo)\s+\{\{\s*firstName\s*\}\}\s*,?/i;

(async () => {
  // 1) Delete orphaned legacy rows.
  const del = await prisma.emailTemplate.deleteMany({ where: { name: { in: ORPHANS } } });
  console.log(`Deleted ${del.count} orphaned rows: ${ORPHANS.join(", ")}\n`);

  // 2) Fix raw greetings on the remaining rows.
  const rows = await prisma.emailTemplate.findMany({ select: { id: true, name: true, body: true } });
  let updated = 0;
  for (const r of rows) {
    if (!RAW_GREETING.test(r.body || "")) continue;
    const before = (r.body.match(RAW_GREETING) || [])[0];
    const newBody = r.body.replace(new RegExp(RAW_GREETING, "gi"), "{{greeting}}");
    await prisma.emailTemplate.update({ where: { id: r.id }, data: { body: newBody } });
    updated++;
    console.log(`Updated "${r.name}": "${before}" → "{{greeting}}"`);
  }
  console.log(`\n${updated} template(s) greeting-fixed.`);

  // 3) Verify nothing raw remains.
  const after = await prisma.emailTemplate.findMany({ select: { name: true, body: true } });
  const stillRaw = after.filter((r) => RAW_GREETING.test(r.body || ""));
  console.log(`\nRemaining rows with raw greeting: ${stillRaw.length}`);
  console.log(`Total rows now: ${after.length}`);
  await prisma.$disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
