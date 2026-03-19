import { prisma } from "../lib/prisma.js";

async function main() {
  await prisma.emailTemplate.update({
    where: { name: "welcomeEmail" },
    data: {
      body: `
 <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
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
               border-radius:6px;text-decoration:none;">
        Passwort erstellen
     </a>
   </p>
   <p>Freundliche Grüsse<br>Prime Home Care AG<br>Birkenstrasse 49<br>CH-6343 Rotkreuz<br>info@phc.ch<br>www.phc.ch</p>
   <p>
     <a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">AVB</a> und 
     <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">Nutzungsbedingungen</a>
   </p>
 </div>
            font-weight:bold;">
    Passwort erstellen
  </a>
</p>
<p>Ihr Prime Home Care Team</p>

      `,
    },
  });

}

main()
  .catch((e) => {
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
