import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

const INVOICE_KEYWORDS = ["rechnung", "zahlung", "kosten", "invoice", "bezahlung", "meine zahlung", "mein zahlung"];

const INITIAL_MESSAGE = {
  id: "init",
  type: "bot",
  text: "Hallo! 👋 Willkommen bei der Prime Home Care AG. Wie kann ich Ihnen heute helfen?",
};

function BotAvatar() {
  return (
    <div style={{
      flexShrink: 0,
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #04436F, #06609C)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 8px rgba(4,67,111,0.4)",
      border: "2px solid #B99B5F",
    }}>
      <span style={{
        color: "#B99B5F",
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.5px",
        fontFamily: "sans-serif",
        lineHeight: 1,
      }}>PHC</span>
    </div>
  );
}

function TypingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 4, alignItems: "center", padding: "2px 0" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.8)",
            animation: "phcDot 1.2s infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </span>
  );
}

function DashboardLinkCard() {
  return (
    <div style={{ marginTop: 8, padding: "10px 14px", background: "#f0f7ff", borderRadius: 10, border: "1px solid #c0d9f0", fontSize: 13 }}>
      <p style={{ margin: "0 0 6px", color: "#04436F", fontWeight: 600 }}>🧾 Ihre Rechnungen</p>
      <a href="/client-dashboard" target="_blank" rel="noopener noreferrer"
        style={{ color: "#04436F", fontWeight: "bold", textDecoration: "underline" }}>
        → Zum Dashboard
      </a>
      <span style={{ color: "#555", margin: "0 6px" }}>·</span>
      <a href="/login" target="_blank" rel="noopener noreferrer"
        style={{ color: "#04436F", textDecoration: "underline" }}>
        Login
      </a>
    </div>
  );
}

function YesNoWidget({ onYes, onNo }) {
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
      <button onClick={onYes}
        style={{ background: "#B99B5F", color: "#fff", border: "none", borderRadius: 20, padding: "8px 20px", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
        Ja
      </button>
      <button onClick={onNo}
        style={{ background: "#e0e0e0", color: "#333", border: "none", borderRadius: 20, padding: "8px 20px", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
        Nein
      </button>
    </div>
  );
}

export default function ChatbotWidget() {
  const pathname = usePathname();
  const hiddenPaths = ["/register-client", "/employee-register"];
  const isHidden = hiddenPaths.includes(pathname);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showIdlePrompt, setShowIdlePrompt] = useState(false);

  const messagesEndRef = useRef(null);
  const idleTimerRef = useRef(null);
  const inputRef = useRef(null);

  // Welcome bubble after 5s
  useEffect(() => {
    const t = setTimeout(() => { if (!isOpen) setShowWelcome(true); }, 5000);
    return () => clearTimeout(t);
  }, [isOpen]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  // Idle timer
  const resetIdleTimer = useCallback(() => {
    clearTimeout(idleTimerRef.current);
    setShowIdlePrompt(false);
    idleTimerRef.current = setTimeout(() => setShowIdlePrompt(true), 30000);
  }, []);

  useEffect(() => {
    if (isOpen) resetIdleTimer();
    return () => clearTimeout(idleTimerRef.current);
  }, [isOpen, resetIdleTimer]);

  const addBotMessage = useCallback((text, extra = {}) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), type: "bot", text, ...extra },
    ]);
  }, []);

  async function sendMessage(text) {
    if (!text.trim() || loading) return;
    setInput("");
    setShowIdlePrompt(false);
    resetIdleTimer();

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), type: "user", text },
    ]);

    // Add typing indicator
    const typingId = "typing-" + Date.now();
    setMessages((prev) => [...prev, { id: typingId, type: "typing" }]);
    setLoading(true);

    try {
      // Build history (exclude typing messages)
      const history = messages
        .filter((m) => m.type !== "typing" && m.type !== "yesno")
        .slice(-12)
        .map((m) => ({ role: m.type === "user" ? "user" : "bot", content: m.text }));

      history.push({ role: "user", content: text });

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      const reply = data.response || "Entschuldigung, ich konnte Ihre Anfrage nicht verarbeiten.";

      // Remove typing, add real response
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== typingId);
        const isInvoice = INVOICE_KEYWORDS.some((k) => text.toLowerCase().includes(k));
        return [
          ...filtered,
          { id: Date.now(), type: "bot", text: reply, showDashboard: isInvoice },
        ];
      });
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== typingId),
        {
          id: Date.now(), type: "bot",
          text: "Entschuldigung, technischer Fehler. Bitte rufen Sie uns an: 043 200 10 20.",
        },
      ]);
    } finally {
      setLoading(false);
      resetIdleTimer();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleIdleYes() {
    setShowIdlePrompt(false);
    addBotMessage("Sehr gut! 😊 Was kann ich für Sie tun?");
    resetIdleTimer();
  }

  function handleIdleNo() {
    setShowIdlePrompt(false);
    addBotMessage("Vielen Dank für Ihr Vertrauen in die Prime Home Care AG. Auf Wiedersehen! 👋");
    clearTimeout(idleTimerRef.current);
  }

  if (isHidden) return <div style={{ display: "none" }} />;

  return (
    <>
      <style>{`
        @keyframes phcDot {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div className="chatbot-container">
        {isOpen ? (
          <div className="chatbot-box">
            {/* Header */}
            <div className="chatbot-header">
              <span className="chatbot-title">💬 PHC Support Agent</span>
              <button onClick={() => setIsOpen(false)} className="chatbot-close">✕</button>
            </div>

            {/* Messages */}
            <div className="chatbot-content">
              <div
                className="react-chatbot-kit-chat-message-container"
                style={{ flex: 1, overflowY: "auto", padding: "12px 16px", background: "#f9f9f9" }}
              >
                {messages.map((msg) => {
                  if (msg.type === "typing") {
                    return (
                      <div key={msg.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                        <BotAvatar />
                        <div className="react-chatbot-kit-chat-bot-message" style={{ padding: "10px 16px" }}>
                          <TypingDots />
                        </div>
                      </div>
                    );
                  }

                  if (msg.type === "bot") {
                    return (
                      <div key={msg.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                        <BotAvatar />
                        <div style={{ flex: 1, minWidth: 0, maxWidth: "calc(100% - 46px)" }}>
                          <div className="react-chatbot-kit-chat-bot-message">
                            {msg.text}
                          </div>
                          {msg.showDashboard && <DashboardLinkCard />}
                        </div>
                      </div>
                    );
                  }

                  if (msg.type === "user") {
                    return (
                      <div key={msg.id} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
                        <div className="react-chatbot-kit-user-chat-message">{msg.text}</div>
                      </div>
                    );
                  }

                  return null;
                })}

                {/* Idle prompt */}
                {showIdlePrompt && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                    <BotAvatar />
                    <div>
                      <div className="react-chatbot-kit-chat-bot-message">Haben Sie noch Fragen?</div>
                      <YesNoWidget onYes={handleIdleYes} onNo={handleIdleNo} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <form
              className="react-chatbot-kit-chat-input-form"
              onSubmit={handleSubmit}
              style={{ display: "flex", alignItems: "center", padding: "10px 12px", borderTop: "1px solid #eee", background: "#fff", gap: 8 }}
            >
              <input
                ref={inputRef}
                className="react-chatbot-kit-chat-input"
                placeholder="Ihre Nachricht eingeben..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                style={{ flex: 1 }}
              />
              <button
                type="submit"
                className="react-chatbot-kit-chat-btn-send"
                disabled={loading || !input.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="white">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                </svg>
              </button>
            </form>
          </div>
        ) : (
          <>
            {showWelcome && (
              <div className="chatbot-welcome">Haben Sie Fragen?</div>
            )}
            <button onClick={() => { setIsOpen(true); setShowWelcome(false); }} className="chatbot-toggle">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                <circle cx="9" cy="10" r="0.8" fill="white"/>
                <circle cx="12" cy="10" r="0.8" fill="white"/>
                <circle cx="15" cy="10" r="0.8" fill="white"/>
              </svg>
            </button>
          </>
        )}
      </div>
    </>
  );
}
