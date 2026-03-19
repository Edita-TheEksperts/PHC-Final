// Check if rejection email template exists
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkTemplate() {
  try {
    const template = await prisma.emailTemplate.findUnique({
      where: { name: "rejectionEmail" },
    });

    if (template) {
      console.log("✅ Rejection email template exists:");
      console.log("Name:", template.name);
      console.log("Subject:", template.subject);
      console.log("\nBody:");
      console.log(template.body);
    } else {
      console.log("❌ Rejection email template NOT found!");
      console.log("\nCreating default template...");
      
      const newTemplate = await prisma.emailTemplate.create({
        data: {
          name: "rejectionEmail",
          subject: "Bewerbung bei Prime Home Care AG",
          body: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <p>Grüezi {{firstName}}</p>
  
  <p>Vielen Dank für Ihr Interesse an einer Zusammenarbeit mit der Prime Home Care AG.</p>
  
  <p>Nach sorgfältiger Prüfung Ihrer Bewerbungsunterlagen müssen wir Ihnen leider mitteilen, dass wir uns für andere Kandidaten entschieden haben.</p>
  
  <p>Diese Entscheidung bedeutet nicht, dass Ihre Qualifikationen nicht wertvoll sind. Wir haben einfach Kandidaten gefunden, deren Profile besser zu unseren aktuellen Anforderungen passen.</p>
  
  <p>Wir wünschen Ihnen alles Gute für Ihre berufliche Zukunft und viel Erfolg bei Ihrer weiteren Stellensuche.</p>
  
  <br>
  <p>Freundliche Grüsse</p>
  <p>Prime Home Care AG<br>
  Birkenstrasse 49<br>
  CH-6343 Rotkreuz<br>
  info@phc.ch<br>
  www.phc.ch</p>
</div>
          `,
        },
      });
      
      console.log("✅ Template created successfully!");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTemplate();
