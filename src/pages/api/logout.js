export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Clear the admin HttpOnly cookie
  res.setHeader("Set-Cookie", [
    `adminToken=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`,
  ]);

  return res.status(200).json({ success: true });
}
