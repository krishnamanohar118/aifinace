import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Money from "../components/Money";
import Modal from "../components/Modal";
import { EmptyState, ErrorState, Loading } from "../components/States";
import { expenseCategories } from "../utils/finance";

export default function BudgetsPage() {
  const [items, setItems] = useState(null);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const now = new Date();

  const load = async () => {
    try {
      setError("");

      const response = await api.get("/budgets");

      setItems(response.data.items || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load budgets.",
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const data = Object.fromEntries(form);

    try {
      setError("");

      await api.post("/budgets", data);

      setShow(false);

      await load();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create budget.",
      );
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this budget?")) {
      return;
    }

    try {
      setError("");

      await api.delete(`/budgets/${id}`);

      await load();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete budget.",
      );
    }
  };

  if (items === null) {
    return error ? <ErrorState message={error} /> : <Loading />;
  }

  return (
    <>
      <PageHeader
        title="Budgets"
        description="Set category limits and keep spending intentional."
      />

      <div className="action-row">
        <span className="muted">
          {now.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>

        <button className="button button-primary" onClick={() => setShow(true)}>
          <Plus size={17} />
          Add budget
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {!items.length ? (
        <EmptyState message="No budgets yet. Set a category limit to stay on track." />
      ) : (
        <div className="stack">
          {items.map((x) => {
            const percentage = Number(x.percentage) || 0;
            const spent = Number(x.spent) || 0;
            const amount = Number(x.amount) || 0;
            const remaining = Number(x.remaining) || 0;

            return (
              <article className="card budget" key={x._id}>
                <div>
                  <h2>{x.category}</h2>

                  <p>
                    <Money value={spent} /> spent of <Money value={amount} />
                  </p>
                </div>

                <b className={percentage >= 100 ? "expense" : ""}>
                  {percentage}%
                </b>

                <div className="progress">
                  <i
                    style={{
                      width: `${Math.min(100, Math.max(0, percentage))}%`,
                    }}
                  />
                </div>

                <small>
                  {remaining < 0 ? (
                    "You exceeded this budget."
                  ) : (
                    <>
                      <Money value={remaining} /> remaining
                    </>
                  )}
                </small>

                <button
                  type="button"
                  className="icon-button danger"
                  onClick={() => del(x._id)}
                  aria-label={`Delete ${x.category} budget`}
                >
                  <Trash2 size={16} />
                </button>
              </article>
            );
          })}
        </div>
      )}

      {show && (
        <Modal title="Create budget" onClose={() => setShow(false)}>
          <form className="form-grid" onSubmit={add}>
            <label>
              Category
              <select name="category" required>
                {expenseCategories.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Monthly amount
              <input name="amount" type="number" min="1" step="0.01" required />
            </label>

            <input type="hidden" name="month" value={now.getMonth() + 1} />

            <input type="hidden" name="year" value={now.getFullYear()} />

            <div className="modal-actions wide">
              <button type="submit" className="button button-primary">
                Save budget
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
