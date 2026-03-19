
import { prisma } from "./src/lib/prisma.js";


async function main() {
  await prisma.emailTemplate.update({
    where: { name: "welcomeEmail" },
    data: {
      body: `
<p>Hallo {{firstName}} {{lastName}}</p>
<p>Vielen Dank für Ihre Registrierung bei Prime Home Care AG.</p>
<p>Ihr Zugang zum Kundenportal wurde erfolgreich eingerichtet:</p>
<ul>
  <li>Buchungen verwalten</li>
  <li>Mit uns kommunizieren</li>
</ul>
<p><strong>Bitte erstellen Sie Ihr Passwort über den folgenden Button:</strong></p>
<p>
  <a href="{{resetLink}}"
     style="display:inline-block;padding:12px 24px;
            background-color:#B99B5F;color:#ffffff;
            border-radius:6px;text-decoration:none;
            font-weight:bold;">
    Passwort erstellen
  </a>
</p>
<p>Ihr Prime Home Care Team</p>

      `,
    },
  });

  console.log("✅ 'welcomeEmail' template updated successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error updating template:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
