import crypto from "crypto";
import { prisma } from "../../lib/prisma";
import { sendApprovalEmail } from "../../lib/mailer";

// F-16: when admin approves a candidate, generate a single-use resetToken
// (48h validity) and embed it in the welcome email's "Passwort erstellen" link.
// The candidate then lands on /set-password, which posts back to
// /api/set-password — that endpoint already supports the token path
// (see src/pages/api/set-password.js).
const TOKEN_TTL_MS = 48 * 60 * 60 * 1000;

function buildPasswordLink(email, token) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://phc.ch";
  const url = new URL("/set-password", base);
  url.searchParams.set("email", email);
  url.searchParams.set("token", token);
  return url.toString();
}

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

    const updateData = {
      status: "approved",
      invited: true,
      inviteSentAt: new Date(),
    };

    // Only mint a new token on the first approval — re-running approve on an
    // already-approved row must not invalidate a token the employee may still
    // be trying to use.
    let passwordLink = null;
    if (!alreadyApproved) {
      const token = crypto.randomBytes(32).toString("hex");
      updateData.resetToken = token;
      updateData.resetTokenExpiry = new Date(Date.now() + TOKEN_TTL_MS);
      passwordLink = buildPasswordLink(email, token);
    }

    const updated = await prisma.employee.update({
      where: { email },
      data: updateData,
    });

    if (!alreadyApproved) {
      await sendApprovalEmail(updated, passwordLink);
    }

    return res.status(200).json({
      message: alreadyApproved
        ? "Employee already approved — email not resent"
        : "Employee approved and welcome email with password-create link sent",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
