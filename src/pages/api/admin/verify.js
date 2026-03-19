import jwt from "jsonwebtoken";

export default function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // 🟩 Merr token-in nga body ose nga header
  const token =
    req.body.token ||
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ valid: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        valid: false,
        message: "Access denied: not an admin account",
      });
    }

    return res.status(200).json({
      valid: true,
      role: decoded.role,
      email: decoded.email,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ valid: false, message: "Invalid or expired token" });
  }
}
