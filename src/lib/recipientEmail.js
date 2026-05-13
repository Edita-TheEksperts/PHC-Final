// Pick the correct destination for customer-facing email.
//
// In PHC, the "User" row represents the person receiving care, but the booking
// is usually made by a relative (the Auftraggeber). That requester's email is
// stored in `User.requestEmail`. Customer-facing mail (booking confirmation,
// assignment, cancellation, welcome, etc.) must go to the requester first, and
// fall back to the user's own email only when no requester was named.
//
// Pass either a Prisma User object or any object that carries the same fields.
export function recipientEmail(user) {
  if (!user) return null;
  const req = typeof user.requestEmail === "string" ? user.requestEmail.trim() : "";
  if (req) return req;
  const own = typeof user.email === "string" ? user.email.trim() : "";
  return own || null;
}
