// Update rejection email template
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function updateRejectionTemplate() {
  try {
    const updated = await prisma.emailTemplate.update({
      where: { name: "rejectionEmail" },
      data: {
        subject: "Ihre Bewerbung bei Prime Home Care AG",
        body: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <p style="color: rgb(112, 48, 160); font-weight: 500;">Grüezi {{firstName}}</p>
  
  <p>Vielen Dank für Ihre Bewerbung und Ihr Interesse an der Prime Home Care AG.</p>
  
  <p>Nach sorgfältiger Prüfung haben wir uns entschieden, den Auswahlprozess mit anderen Kandidat*innen fortzusetzen.</p>
  
  <p>Wir danken Ihnen herzlich für Ihre Zeit und wünschen Ihnen für Ihre berufliche Zukunft alles Gute.</p>
  
  <br>
  <p style="margin-bottom: 5px;"><strong>Freundliche Grüsse</strong></p>
  <p style="margin-bottom: 5px;"><strong>Prime Home Care AG</strong></p>
  <p style="margin-bottom: 3px;">Birkenstrasse 49</p>
  <p style="margin-bottom: 3px;">CH-6343 Rotkreuz</p>
  <p style="margin-bottom: 3px;"><a href="mailto:info@phc.ch" style="color: #04436F; text-decoration: none;">info@phc.ch</a></p>
  <p style="margin-bottom: 10px;"><a href="https://www.phc.ch" target="_blank" style="color: #04436F; text-decoration: none;">www.phc.ch</a></p>
  
  <p style="margin-top: 15px; font-size: 12px; color: #666;">
    <a href="https://www.phc.ch/AVB" rel="noopener noreferrer" target="_blank" style="color: #04436F; text-decoration: underline;">AVB</a> und 
    <a href="https://www.phc.ch/nutzungsbedingungen" rel="noopener noreferrer" target="_blank" style="color: #04436F; text-decoration: underline;">Nutzungsbedingungen</a>
  </p>
</div>
        `,
      },
    });

    console.log("✅ Rejection email template updated successfully!");
    console.log("\nNew template:");
    console.log("Subject:", updated.subject);
    console.log("\nBody preview:");
    console.log(updated.body.substring(0, 300) + "...");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateRejectionTemplate();
