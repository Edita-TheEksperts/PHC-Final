import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { base64, filename } = req.body;
  if (!base64 || !filename) return res.status(400).json({ error: "Missing data" });

  const ext = path.extname(filename) || ".jpg";
  const name = Date.now() + ext;
  const dir = path.join(process.cwd(), "public", "uploads", "blog");

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const data = base64.replace(/^data:image\/\w+;base64,/, "");
  fs.writeFileSync(path.join(dir, name), Buffer.from(data, "base64"));

  return res.status(200).json({ url: `/uploads/blog/${name}` });
}
