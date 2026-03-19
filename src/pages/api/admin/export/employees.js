import { prisma } from "../../../../lib/prisma";

function esc(v) {
  if (v == null) return "";
  const s = String(v).replace(/"/g, '""');
  return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s}"` : s;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const employees = await prisma.employee.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      firstName: true, lastName: true, email: true, phone: true,
      city: true, status: true, createdAt: true,
      hasLicense: true, availabilityDays: true,
    },
  });

  const headers = ["Vorname", "Nachname", "E-Mail", "Telefon", "Stadt", "Status", "Führerschein", "Verfügbare Tage", "Erstellt am"];
  const rows = employees.map(e => [
    esc(e.firstName), esc(e.lastName), esc(e.email), esc(e.phone),
    esc(e.city), esc(e.status),
    esc(e.hasLicense ? "Ja" : "Nein"),
    esc(Array.isArray(e.availabilityDays) ? e.availabilityDays.join("; ") : ""),
    esc(e.createdAt ? new Date(e.createdAt).toLocaleDateString("de-CH") : ""),
  ]);

  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="mitarbeiter-${new Date().toISOString().slice(0,10)}.csv"`);
  res.end("\uFEFF" + csv);
}
