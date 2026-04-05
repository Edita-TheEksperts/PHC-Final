import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../../../lib/emails";  // 🟢 SIGUROHU QË PATH ËSHTË I SAKTË

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { appointmentId, userId, employeeId } = req.body;

  if (!userId || !employeeId) {
    return res.status(400).json({ message: "Missing userId or employeeId" });
  }

  try {
    let appointment = null;
    let updatedSchedule = null;

    // Fetch appointment if passed
    if (appointmentId) {
      appointment = await prisma.schedule.findUnique({
        where: { id: Number(appointmentId) }
      });

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
    }

    // 1️⃣ Create assignment record
    const assignment = await prisma.assignment.create({
      data: {
        userId,
        employeeId,
        scheduleId: appointment?.id || null,
        serviceName: appointment?.serviceName || "",
      },
      include: {
        user: true,
        employee: true,
      }
    });

    // 2️⃣ If appointment exists, update it
    if (appointment) {
      updatedSchedule = await prisma.schedule.update({
        where: { id: appointment.id },
        data: { employeeId },
        include: {
          employee: true,
          user: true,
        },
      });
    }

    // 3️⃣ SEND EMAIL TO EMPLOYEE WITH ACCEPT & REJECT LINKS
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  
    const employee = assignment.employee;
    const user = assignment.user;
const dashboardUrl = "https://phc.ch/employee-dashboard";

const html = `
<p>Hallo ${employee.firstName}</p>

<p>Sie haben einen neuen Einsatz für den Kunden 
<strong>${user.firstName} ${user.lastName}</strong>.</p>

<p>Um den Einsatz anzunehmen oder abzulehnen, melden Sie sich bitte im Dashboard an:</p>

<p>
  <a href="${dashboardUrl}"
     style="display:inline-block;padding:12px 20px;background:#04436F;color:white;border-radius:8px;text-decoration:none;font-weight:bold;">
      Zum Mitarbeiter-Dashboard
  </a>
</p>

<p>Prime Home Care</p>
`;


let emailWarning = null;

try {
  await sendEmail({
    to: employee.email,
    subject: "Neuer Einsatz – Bitte bestätigen",
    html,
  });
} catch (mailError) {
  emailWarning = "Mitarbeiter zugewiesen, aber E-Mail konnte nicht gesendet werden.";
}

// Notify the client that an employee has been assigned
try {
  await sendEmail({
    to: user.email,
    subject: "Ihr Betreuer wurde zugewiesen",
    html: `
<p>Hallo ${user.firstName} ${user.lastName}</p>

<p>Wir freuen uns Ihnen mitzuteilen, dass Ihnen eine Betreuungsperson zugewiesen wurde:</p>

<p><strong>${employee.firstName} ${employee.lastName}</strong></p>

<p>Ihr nächster Termin ist in Ihrem Dashboard ersichtlich.</p>

<p>
  <a href="https://phc.ch/client-dashboard"
     style="display:inline-block;padding:12px 20px;background:#B99B5F;color:white;border-radius:8px;text-decoration:none;font-weight:bold;">
      Zum Dashboard
  </a>
</p>

<br>
<p>Freundliche Grüsse<br>Prime Home Care AG<br>Birkenstrasse 49<br>CH-6343 Rotkreuz<br>info@phc.ch<br>www.phc.ch</p>
    `,
  });
} catch (clientMailError) {
  // Don't fail if client email fails
}


return res.status(200).json({
  message: "Mitarbeiter wurde erfolgreich zugewiesen.",
  warning: emailWarning, // null ose string
  schedule: updatedSchedule,
});


  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}
