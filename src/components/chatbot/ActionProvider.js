// --- Idle Timer state (module-level) ---
let idleTimer;
let hasEndedSession = false;

function resetIdleTimer(addMessage, createChatBotMessage) {
  clearTimeout(idleTimer);
  if (hasEndedSession) return;
  idleTimer = setTimeout(() => {
    const msg = createChatBotMessage("Haben Sie noch Fragen?", {
      widget: "yesNoOptions",
    });
    addMessage(msg);
  }, 30000);
}

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  // ── Core message sender ─────────────────────────────────
  addMessage = (message) => {
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  // ── Remove typing indicator ──────────────────────────────
  removeTyping = () => {
    this.setState((prev) => ({
      ...prev,
      messages: prev.messages.filter((m) => m.id !== "typing-indicator"),
    }));
  };

  // ── Show typing indicator ────────────────────────────────
  showTyping = () => {
    const typingMsg = this.createChatBotMessage("…", {});
    typingMsg.id = "typing-indicator";
    this.addMessage(typingMsg);
  };

  // ── AI response handler ──────────────────────────────────
  handleAIResponse = (text) => {
    this.removeTyping();
    const message = this.createChatBotMessage(text);
    this.addMessage(message);
    resetIdleTimer(this.addMessage, this.createChatBotMessage);
  };

  // ── AI response + dashboard link ─────────────────────────
  handleAIResponseWithInvoice = (text) => {
    this.removeTyping();
    const message = this.createChatBotMessage(text);
    this.addMessage(message);
    // Also show dashboard link widget
    const linkMsg = this.createChatBotMessage(
      "Sie finden Ihre Rechnungen direkt hier:",
      { widget: "dashboardLink" }
    );
    this.addMessage(linkMsg);
    resetIdleTimer(this.addMessage, this.createChatBotMessage);
  };

  // ── Category / FAQ navigation (kept for widgets) ─────────
  handleCategory = (category) => {
    const message = this.createChatBotMessage(
      `Sie haben die Kategorie **${category}** gewählt. Bitte wählen Sie eine Frage:`,
      { widget: "questionOptions", payload: { category } }
    );
    this.addMessage(message);
  };

  handleCategorySelection = () => {
    const message = this.createChatBotMessage(
      "Bitte wählen Sie eine Kategorie:",
      { widget: "categoryOptions" }
    );
    this.addMessage(message);
  };

  handleQuestion = (category, question, answer) => {
    const message = this.createChatBotMessage(`❓ ${question}\n\n${answer}`);
    this.addMessage(message);
  };

  giveAnswer = (answer) => {
    const message = this.createChatBotMessage(answer);
    this.addMessage(message);
  };

  handleMoreQuestions = () => {
    const message = this.createChatBotMessage(
      "Gerne helfe ich Ihnen weiter! Was möchten Sie wissen? 😊",
      { widget: "categoryOptions" }
    );
    this.addMessage(message);
  };

  handleGoodbye = () => {
    const message = this.createChatBotMessage(
      "Vielen Dank für Ihr Vertrauen in Prime Home Care AG. Auf Wiedersehen! 👋"
    );
    hasEndedSession = true;
    this.addMessage(message);
  };

  handleInvoice = () => {
    const message = this.createChatBotMessage(
      "Hier können Sie Ihre Rechnungen einsehen:",
      { widget: "dashboardLink" }
    );
    this.addMessage(message);
  };
}

export default ActionProvider;
