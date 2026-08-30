import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import api from "../services/api";

const suggestions = [
  "How much should I save each month?",
  "Am I on track with my savings goals?",
  "Help me plan for a big purchase",
];

export default function FinanceChatbot() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [goalsLoaded, setGoalsLoaded] = useState(false);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);
  const requestInFlightRef = useRef(false);
  const goalsRef = useRef([]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const messagesNode = messagesRef.current;

    if (!messagesNode) return;

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    messagesNode.scrollTo({
      top: messagesNode.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (!open || goalsLoaded) return undefined;

    let cancelled = false;

    api
      .get("/goals")
      .then((response) => {
        if (cancelled) return;

        goalsRef.current = response.data?.items || [];
      })
      .catch(() => {
        goalsRef.current = [];
      })
      .finally(() => {
        if (!cancelled) setGoalsLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [open, goalsLoaded]);

  const askAssistant = async (text) => {
    const sourceText = typeof text === "string" ? text : question;
    const questionText = sourceText.trim();

    if (!questionText || requestInFlightRef.current) return;

    requestInFlightRef.current = true;
    setMessages((current) => [...current, { role: "user", content: questionText }]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await api.post("/assistant", {
        question: questionText,
        goals: goalsRef.current,
      });
      const answer =
        response.data?.answer ||
        response.data?.message ||
        response.data?.data?.answer;

      if (!answer) throw new Error("The finance assistant returned no answer.");
      setMessages((current) => [
        ...current,
        { role: "assistant", content: String(answer) },
      ]);
    } catch (err) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            err?.response?.data?.message ||
            "Sorry, I could not connect to the finance assistant.",
          error: true,
        },
      ]);
    } finally {
      requestInFlightRef.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="finance-chatbot">
      {open && (
        <section className="chatbot-window" aria-label="Smart Finance Assistant">
          <header className="chatbot-header">
            <div className="chatbot-title">
              <div className="chatbot-avatar"><Bot size={19} /></div>
              <div>
                <h3>Smart Finance Assistant</h3>
                <span><i /> Ready when you are</span>
              </div>
            </div>
            <button type="button" className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close chatbot">
              <X size={19} />
            </button>
          </header>

          <div className="chatbot-messages" ref={messagesRef} aria-busy={loading}>
            {messages.length === 0 && (
              <div className="chatbot-welcome">
                <div className="welcome-icon"><Sparkles size={22} /></div>
                <h4>Make your next money move clearer.</h4>
                <p>Ask about spending, saving, income, or a goal. I’ll keep the answer practical.</p>
                <div className="quick-questions">
                  {suggestions.map((suggestion) => (
                    <button
                      type="button"
                      key={suggestion}
                      onClick={() => askAssistant(suggestion)}
                      disabled={loading}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div className={`chat-message ${message.role === "user" ? "user-message" : "ai-message"}`} key={`${message.role}-${index}`}>
                {message.role === "assistant" && <div className="message-avatar"><Bot size={13} /></div>}
                <div className={`message-bubble ${message.error ? "chat-error" : ""}`}>{message.content}</div>
              </div>
            ))}

            {loading && (
              <div className="chat-message ai-message">
                <div className="message-avatar"><Bot size={13} /></div>
                <div className="message-bubble typing"><span /><span /><span /></div>
              </div>
            )}
          </div>

          <form className="chatbot-input" onSubmit={(event) => { event.preventDefault(); askAssistant(); }}>
            <input ref={inputRef} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about your finances..." disabled={loading} autoComplete="off" aria-label="Ask the finance assistant" />
            <button type="submit" disabled={loading || !question.trim()} aria-label="Send message"><Send size={16} /></button>
          </form>
        </section>
      )}

      <button type="button" className="chatbot-button" onClick={() => setOpen((current) => !current)} aria-label={open ? "Close finance assistant" : "Open finance assistant"}>
        {open ? <X size={22} /> : <MessageCircle size={23} />}
      </button>
    </div>
  );
}
