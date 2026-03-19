import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const templates = await prisma.emailTemplate.findMany();
  console.log('All email templates in DB:');
  for (const t of templates) {
    console.log(`\nID: ${t.id}\nName: ${t.name}\nSubject: ${t.subject}\nBody: ${t.body}\nCreated: ${t.createdAt}\nUpdated: ${t.updatedAt}`);
  }
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
