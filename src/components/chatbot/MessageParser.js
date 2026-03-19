class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  async parse(message) {
    // Show typing indicator immediately
    this.actionProvider.showTyping();

    // Build conversation history for context
    const history = (this.state.messages || [])
      .filter((m) => m.message && typeof m.message === "string")
      .slice(-10) // last 10 messages for context
      .map((m) => ({
        role: m.type === "user" ? "user" : "bot",
        content: m.message,
      }));

    // Add current user message
    history.push({ role: "user", content: message });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      const reply = data.response || "Entschuldigung, ich konnte Ihre Anfrage nicht verarbeiten.";

      // Check if invoice/dashboard related → show dashboard link widget too
      const lower = message.toLowerCase();
      const invoiceKeywords = ["rechnung", "zahlung", "kosten", "invoice", "bezahlung", "meine zahlung"];
      if (invoiceKeywords.some((k) => lower.includes(k))) {
        this.actionProvider.handleAIResponseWithInvoice(reply);
      } else {
        this.actionProvider.handleAIResponse(reply);
      }
    } catch {
      this.actionProvider.handleAIResponse(
        "Entschuldigung, es gab einen technischen Fehler. Bitte versuchen Sie es erneut oder kontaktieren Sie uns unter 043 200 10 20."
      );
    }
  }
}

export default MessageParser;
