import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

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

  // =========================
  // PAGE
  // =========================

  return (
    <>
      <PageHeader
        title="Savings goals"
        description="Give your savings a purpose and track every milestone."
      />

      {error && <div className="error-message">{error}</div>}

      {/* CREATE GOAL BUTTON */}

      <button
        type="button"
        className="button button-primary"
        onClick={() => setShow(true)}
      >
        <Plus size={17} />
        Create goal
      </button>

      {/* GOALS */}

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
                {/* DELETE */}

                <button
                  type="button"
                  className="icon-button danger float"
                  onClick={() => deleteGoal(goal._id)}
                  aria-label={`Delete ${goal.name}`}
                >
                  <Trash2 size={16} />
                </button>

                {/* NAME */}

                <h2>{goal.name}</h2>

                {/* AMOUNT */}

                <p>
                  <Money value={Number(goal.currentAmount) || 0} /> of{" "}
                  <Money value={Number(goal.targetAmount) || 0} />
                </p>

                {/* PROGRESS */}

                <div className="progress">
                  <i
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <b>{progress}% complete</b>

                {/* DETAILS */}

                <small>
                  <Money value={Number(goal.remaining) || 0} /> remaining ·{" "}
                  <Money value={Number(goal.requiredMonthlySaving) || 0} /> per
                  month
                </small>

                {/* ADD SAVINGS */}

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

      {/* CREATE GOAL MODAL */}

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

    </>
  );
}
