import { prisma } from "../../../../lib/prisma";

function esc(v) {
  if (v == null) return "";
  const s = String(v).replace(/"/g, '""');
  return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s}"` : s;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const clients = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      firstName: true, lastName: true, email: true, phone: true,
      careStreet: true, careCity: true, carePostalCode: true, status: true,
      createdAt: true, firstDate: true,
    },
  });

  const headers = ["Vorname", "Nachname", "E-Mail", "Telefon", "Strasse", "Stadt", "PLZ", "Status", "Erstellt am", "Erstes Datum"];
  const rows = clients.map(c => [
    esc(c.firstName), esc(c.lastName), esc(c.email), esc(c.phone),
    esc(c.careStreet), esc(c.careCity), esc(c.carePostalCode), esc(c.status),
    esc(c.createdAt ? new Date(c.createdAt).toLocaleDateString("de-CH") : ""),
    esc(c.firstDate ? new Date(c.firstDate).toLocaleDateString("de-CH") : ""),
  ]);

  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="kunden-${new Date().toISOString().slice(0,10)}.csv"`);
  res.end("\uFEFF" + csv); // BOM for Excel
}
