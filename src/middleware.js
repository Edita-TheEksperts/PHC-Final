import { NextResponse } from "next/server";

// ── Helpers ────────────────────────────────────────────────────────────────

function base64urlDecode(str) {
  // Convert base64url → base64, pad, decode
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/**
 * Verify an HS256 JWT using the Web Crypto API (Edge Runtime compatible).
 * Returns the decoded payload or throws on invalid / expired token.
 */
async function verifyJWT(token, secret) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Malformed JWT");

  const [headerB64, payloadB64, sigB64] = parts;

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const signature = base64urlDecode(sigB64);
  const data = encoder.encode(`${headerB64}.${payloadB64}`);

  const valid = await crypto.subtle.verify("HMAC", key, signature, data);
  if (!valid) throw new Error("Invalid signature");

  const payload = JSON.parse(new TextDecoder().decode(base64urlDecode(payloadB64)));

  if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
    throw new Error("Token expired");
  }

  return payload;
}

// ── Middleware ─────────────────────────────────────────────────────────────

export async function middleware(request) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    // Misconfigured server — fail closed
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  // Extract token: prefer Authorization header, fall back to HttpOnly cookie
  const authHeader = request.headers.get("authorization");
  let token =
    authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    token = request.cookies.get("adminToken")?.value ?? null;
  }

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifyJWT(token, secret);

    if (payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Pass verified identity to the route handler via headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-admin-id", payload.id ?? "");
    requestHeaders.set("x-admin-email", payload.email ?? "");

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: "/api/admin/:path*",
};
