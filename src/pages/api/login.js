// pages/api/login.js
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" })
  }

  try {
    // 👤 USER LOGIN
    const user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      // 🔒 BLOCK TERMINATED USERS
      if (user.status === "gekuendigt") {
        return res.status(403).json({
          message: "Ihr Konto wurde gekündigt. Zugriff gesperrt.",
        })
      }

      const isValid = await bcrypt.compare(password, user.passwordHash)
      if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password" })
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      )

      // Set an HttpOnly cookie for admin users so the middleware can
      // authenticate browser-based requests to /api/admin/* automatically.
      if (user.role === "admin") {
        res.setHeader("Set-Cookie", [
          `adminToken=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 3600}${
            process.env.NODE_ENV === "production" ? "; Secure" : ""
          }`,
        ]);
      }

      return res.status(200).json({ token, role: user.role })
    }

    // 👷 EMPLOYEE LOGIN
    const employee = await prisma.employee.findUnique({ where: { email } })

    if (employee && employee.password) {
      if (employee.status !== "approved") {
        return res.status(403).json({
          message: "Your employee account is not approved.",
        })
      }

      const isValid = await bcrypt.compare(password, employee.password)
      if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password" })
      }

      const token = jwt.sign(
        { id: employee.id, email: employee.email, role: "employee" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      )

      return res.status(200).json({ token, role: "employee" })
    }

    return res.status(401).json({ message: "Invalid email or password" })
  } catch (error) {
    return res.status(500).json({ message: "Server error" })
  }
}
