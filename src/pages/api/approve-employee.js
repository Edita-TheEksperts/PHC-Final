import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { sendApprovalEmail } from "../../lib/mailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Not allowed" });
  }

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const employee = await prisma.employee.findUnique({
      where: { email },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const alreadyApproved = employee.invited && employee.status === "approved";

    // Update employee status to approved
    const updated = await prisma.employee.update({
      where: { email },
      data: {
        status: "approved",
        invited: true,
        inviteSentAt: new Date(),
      },
    });

    // Only send email if not already approved/invited before
    if (!alreadyApproved) {
      await sendApprovalEmail(updated);
    }

    return res.status(200).json({
      message: alreadyApproved
        ? "Employee already approved — email not resent"
        : "Employee approved and email with reset link sent",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
