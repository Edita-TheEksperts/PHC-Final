import { prisma } from "../../../lib/prisma";
import PDFDocument from "pdfkit";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { userId, month } = req.query; // month = "YYYY-MM"
  if (!userId || !month) return res.status(400).json({ error: "userId and month required" });

  // Fetch user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { firstName: true, lastName: true, email: true, street: true, city: true, zip: true },
  });
  if (!user) return res.status(404).json({ error: "User not found" });

  // Fetch transactions for that month
  const [year, mo] = month.split("-").map(Number);
  const start = new Date(year, mo - 1, 1);
  const end = new Date(year, mo, 1);

  const transactions = await prisma.transaction.findMany({
    where: { userId, createdAt: { gte: start, lt: end } },
    select: { amountClient: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const total = transactions.reduce((s, t) => s + (t.amountClient || 0), 0);
  const monthLabel = start.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
  const invoiceNo = `PHC-${year}${String(mo).padStart(2, "0")}-${userId.slice(0, 6).toUpperCase()}`;

  // Generate PDF
  const doc = new PDFDocument({ margin: 50, size: "A4" });
  const chunks = [];
  doc.on("data", c => chunks.push(c));
  doc.on("end", () => {
    const pdf = Buffer.concat(chunks);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="Rechnung-${month}.pdf"`);
    res.setHeader("Content-Length", pdf.length);
    res.end(pdf);
  });

  const BLUE = "#04436F";
  const GOLD = "#B99B5F";
  const GRAY = "#6B7280";

  // Header bar
  doc.rect(0, 0, doc.page.width, 90).fill(BLUE);
  doc.fillColor("#FFFFFF").fontSize(28).font("Helvetica-Bold").text("Prime Home Care AG", 50, 28);
  doc.fontSize(10).font("Helvetica").text("Birkenstrasse 49 · 6343 Rotkreuz · info@phc.ch · phc.ch", 50, 62);

  // Invoice title
  doc.moveDown(3);
  doc.fillColor(BLUE).fontSize(20).font("Helvetica-Bold").text("RECHNUNG", 50, 110);
  doc.moveDown(0.3);
  doc.fillColor(GOLD).fontSize(11).font("Helvetica").text(`Nr. ${invoiceNo}`, 50);

  // Two-column: client info + invoice meta
  const col2 = 350;
  const infoY = 150;

  doc.fillColor(GRAY).fontSize(9).font("Helvetica-Bold").text("RECHNUNGSEMPFÄNGER", 50, infoY);
  doc.fillColor("#111").fontSize(10).font("Helvetica")
    .text(`${user.firstName} ${user.lastName}`, 50, infoY + 14)
    .text(user.email || "", 50)
    .text(user.street ? `${user.street}` : "", 50)
    .text(user.zip || user.city ? `${user.zip || ""} ${user.city || ""}`.trim() : "", 50);

  doc.fillColor(GRAY).fontSize(9).font("Helvetica-Bold").text("RECHNUNGSDATUM", col2, infoY);
  doc.fillColor("#111").fontSize(10).font("Helvetica")
    .text(new Date().toLocaleDateString("de-DE"), col2, infoY + 14);
  doc.fillColor(GRAY).fontSize(9).font("Helvetica-Bold").text("ZEITRAUM", col2, infoY + 40);
  doc.fillColor("#111").fontSize(10).font("Helvetica").text(monthLabel, col2, infoY + 54);

  // Divider
  doc.moveTo(50, 255).lineTo(545, 255).strokeColor(GOLD).lineWidth(1.5).stroke();

  // Table header
  const tableTop = 270;
  doc.rect(50, tableTop, 495, 22).fill("#F3F4F6");
  doc.fillColor(BLUE).fontSize(9).font("Helvetica-Bold")
    .text("DATUM", 60, tableTop + 6)
    .text("BESCHREIBUNG", 180, tableTop + 6)
    .text("BETRAG (CHF)", 430, tableTop + 6, { width: 100, align: "right" });

  // Table rows
  let y = tableTop + 28;
  doc.font("Helvetica").fontSize(10);

  if (transactions.length === 0) {
    doc.fillColor(GRAY).text("Keine Transaktionen in diesem Monat.", 60, y);
    y += 20;
  } else {
    transactions.forEach((t, i) => {
      if (i % 2 === 0) doc.rect(50, y - 4, 495, 20).fill("#FAFAFA");
      doc.fillColor("#111")
        .text(new Date(t.createdAt).toLocaleDateString("de-DE"), 60, y)
        .text("Betreuungsleistung Prime Home Care", 180, y)
        .text(t.amountClient?.toFixed(2) || "0.00", 430, y, { width: 100, align: "right" });
      y += 22;
    });
  }

  // Total row
  doc.moveTo(50, y + 4).lineTo(545, y + 4).strokeColor("#E5E7EB").lineWidth(1).stroke();
  y += 12;
  doc.rect(370, y, 175, 26).fill(BLUE);
  doc.fillColor("#fff").fontSize(11).font("Helvetica-Bold")
    .text("TOTAL CHF", 380, y + 7)
    .text(total.toFixed(2), 430, y + 7, { width: 100, align: "right" });

  // Footer
  const footerY = doc.page.height - 80;
  doc.moveTo(50, footerY).lineTo(545, footerY).strokeColor(GOLD).lineWidth(1).stroke();
  doc.fillColor(GRAY).fontSize(8).font("Helvetica")
    .text("Zahlbar per Kreditkarte · Bei Fragen: info@phc.ch · 043 200 10 20", 50, footerY + 8, { align: "center", width: 495 })
    .text("Prime Home Care AG · Birkenstrasse 49 · 6343 Rotkreuz · Schweiz", 50, footerY + 20, { align: "center", width: 495 });

  doc.end();
}
