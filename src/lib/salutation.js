// Build a German salutation line from a user/employee record.
//
//  "Sehr geehrte Frau Müller"   (formal, surname)  ← default we want
//  "Sehr geehrter Herr Müller"
//  "Hallo Anna Müller"           (informal fallback)
//
// We default to formal ("Sehr geehrte/r") per Prime Home Care house style.

export function formalGreeting(person, mode = "formal") {
  if (!person) return "Sehr geehrte Damen und Herren";

  const first = (person.firstName || "").trim();
  const last  = (person.lastName  || "").trim();
  const anrede = (person.anrede || person.salutation || "").toString().trim().toLowerCase();

  // Map common values to gendered formal greetings.
  const isHerr = anrede === "herr" || anrede === "mr" || anrede === "mr.";
  const isFrau = anrede === "frau" || anrede === "mrs" || anrede === "ms" || anrede === "frau ";

  if (mode === "casual") {
    return `Hallo ${[first, last].filter(Boolean).join(" ")}`.trim() || "Hallo";
  }

  if (isHerr) return `Sehr geehrter Herr ${last}`.trim();
  if (isFrau) return `Sehr geehrte Frau ${last}`.trim();

  // No Anrede stored — fall back to full name without gendered form.
  const full = [first, last].filter(Boolean).join(" ");
  return full ? `Guten Tag ${full}` : "Sehr geehrte Damen und Herren";
}
