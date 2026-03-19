import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { clientId } = req.body;

  if (!clientId) {
    return res.status(400).json({ message: "Missing clientId" });
  }

  try {
    // Check if client exists
    const client = await prisma.user.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Update client status to "canceled"
    await prisma.user.update({
      where: { id: clientId },
      data: {
        status: "canceled",
      },
    });

    return res.status(200).json({ success: true, message: "Service canceled" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
