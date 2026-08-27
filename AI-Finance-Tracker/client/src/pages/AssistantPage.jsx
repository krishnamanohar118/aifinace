import { useEffect, useState } from "react";
import { Plus, Trash2, Send, Bot, MessageCircle, X } from "lucide-react";

import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Money from "../components/Money";
import Modal from "../components/Modal";

import { EmptyState, ErrorState, Loading } from "../components/States";

export default function GoalsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  // AI Chat
  const [chatOpen, setChatOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  // =========================
  // LOAD GOALS
  // =========================

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/goals");

      setItems(response.data?.items || []);
    } catch (err) {
      console.error("Goals load error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load savings goals.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // =========================
  // CREATE GOAL
  // =========================

  const save = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const data = Object.fromEntries(new FormData(e.target));

      await api.post("/goals", data);

      setShow(false);

      await load();
    } catch (err) {
      console.error("Create goal error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create goal.",
      );
    }
  };

  // =========================
  // ADD SAVINGS
  // =========================

  const addSavings = async (goal) => {
    const amount = window.prompt("How much would you like to add?");

    if (!amount || Number(amount) <= 0) {
      return;
    }

    try {
      setError("");

      await api.put(`/goals/${goal._id}`, {
        currentAmount: Number(goal.currentAmount || 0) + Number(amount),
      });

      await load();
    } catch (err) {
      console.error("Add savings error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to add savings.",
      );
    }
  };

  // =========================
  // DELETE GOAL
  // =========================

  const deleteGoal = async (id) => {
    if (!window.confirm("Delete this goal?")) {
      return;
    }

    try {
      setError("");

      await api.delete(`/goals/${id}`);

      await load();
    } catch (err) {
      console.error("Delete goal error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete goal.",
      );
    }
  };

  // =========================
  // AI ASSISTANT
  // =========================

  const askAssistant = async (text) => {
    const questionText = (text || question).trim();

    if (!questionText || chatLoading) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: questionText,
      },
    ]);

    setQuestion("");
    setChatLoading(true);

    try {
      const response = await api.post("/assistant", {
        question: questionText,
        goals: items,
      });
      const answer =
        response.data?.answer ||
        response.data?.message ||
        response.data?.data?.answer;

      if (!answer) {
        throw new Error("The assistant did not return an answer.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (err) {
      console.error("Assistant error:", err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            err?.response?.data?.message ||
            "Unable to connect to the finance assistant.",
          error: true,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    askAssistant();
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return <Loading />;
  }

  // =========================
  // ERROR
  // =========================

  if (error && !items.length) {
    return <ErrorState message={error} />;
  }

  return (
    <>
      {/* =========================
          GOALS PAGE
      ========================= */}

      <PageHeader
        title="Savings goals"
        description="Give your savings a purpose and track every milestone."
      />

      {error && <div className="error-message">{error}</div>}

      <button
        type="button"
        className="button button-primary"
        onClick={() => setShow(true)}
      >
        <Plus size={17} />
        Create goal
      </button>

      {!items.length ? (
        <EmptyState message="No savings goals yet. Start with something that matters to you." />
      ) : (
        <div className="goal-grid">
          {items.map((goal) => {
            const progress = Math.max(
              0,
              Math.min(100, Number(goal.progress) || 0),
            );

            return (
              <article className="card goal" key={goal._id}>
                <button
                  type="button"
                  className="icon-button danger float"
                  onClick={() => deleteGoal(goal._id)}
                  aria-label={`Delete ${goal.name}`}
                >
                  <Trash2 size={16} />
                </button>

                <h2>{goal.name}</h2>

                <p>
                  <Money value={Number(goal.currentAmount) || 0} /> of{" "}
                  <Money value={Number(goal.targetAmount) || 0} />
                </p>

                <div className="progress">
                  <i
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <b>{progress}% complete</b>

                <small>
                  <Money value={Number(goal.remaining) || 0} /> remaining ·{" "}
                  <Money value={Number(goal.requiredMonthlySaving) || 0} /> per
                  month
                </small>

                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => addSavings(goal)}
                >
                  Add savings
                </button>
              </article>
            );
          })}
        </div>
      )}

      {/* =========================
          CREATE GOAL MODAL
      ========================= */}

      {show && (
        <Modal title="Create savings goal" onClose={() => setShow(false)}>
          <form className="form-grid" onSubmit={save}>
            <label>
              Goal name
              <input name="name" required />
            </label>

            <label>
              Target amount
              <input
                name="targetAmount"
                type="number"
                min="1"
                step="0.01"
                required
              />
            </label>

            <label>
              Target date
              <input name="targetDate" type="date" required />
            </label>

            <label>
              Starting amount
              <input
                name="currentAmount"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
              />
            </label>

            <label className="wide">
              Description
              <input name="description" />
            </label>

            <div className="modal-actions wide">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setShow(false)}
              >
                Cancel
              </button>

              <button type="submit" className="button button-primary">
                Save goal
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* =========================
          FLOATING AI CHATBOT
      ========================= */}

      <div className="finance-chatbot">
        {chatOpen && (
          <div className="chatbot-window">
            {/* HEADER */}

            <div className="chatbot-header">
              <div className="chatbot-title">
                <div className="chatbot-avatar">
                  <Bot size={20} />
                </div>

                <div>
                  <h3>Smart Finance Assistant</h3>

                  <span>Your personal finance helper</span>
                </div>
              </div>

              <button
                type="button"
                className="chatbot-close"
                onClick={() => setChatOpen(false)}
                aria-label="Close chatbot"
              >
                <X size={20} />
              </button>
            </div>

            {/* MESSAGES */}

            <div className="chatbot-messages">
              {messages.length === 0 && (
                <div className="chatbot-welcome">
                  <div className="welcome-icon">
                    <Bot size={28} />
                  </div>

                  <h4>How can I help?</h4>

                  <p>Ask me about your savings, spending, income, or goals.</p>

                  <div className="quick-questions">
                    <button
                      type="button"
                      onClick={() =>
                        askAssistant("How much should I save each month?")
                      }
                    >
                      How much should I save each month?
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        askAssistant("Am I on track with my savings goals?")
                      }
                    >
                      Am I on track with my goals?
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        askAssistant("Which savings goal should I focus on?")
                      }
                    >
                      Which goal should I focus on?
                    </button>
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chat-message ${
                    message.role === "user" ? "user-message" : "ai-message"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="message-avatar">
                      <Bot size={14} />
                    </div>
                  )}

                  <div
                    className={`message-bubble ${
                      message.error ? "chat-error" : ""
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="chat-message ai-message">
                  <div className="message-avatar">
                    <Bot size={14} />
                  </div>

                  <div className="message-bubble typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}
            </div>

            {/* INPUT */}

            <form className="chatbot-input" onSubmit={handleChatSubmit}>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about your finances..."
                disabled={chatLoading}
                autoComplete="off"
              />

              <button
                type="submit"
                disabled={chatLoading || !question.trim()}
                aria-label="Send message"
              >
                <Send size={17} />
              </button>
            </form>
          </div>
        )}

        {/* FLOATING BUTTON */}

        <button
          type="button"
          className="chatbot-button"
          onClick={() => setChatOpen((open) => !open)}
          aria-label="Open finance assistant"
        >
          {chatOpen ? <X size={24} /> : <MessageCircle size={25} />}
        </button>
      </div>
    </>
  );
}
