import { useEffect, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";

import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import Money from "../components/Money";

import { EmptyState, ErrorState, Loading } from "../components/States";

import {
  expenseCategories,
  formatDate,
  incomeCategories,
  methods,
} from "../utils/finance";

const blank = {
  type: "Expense",
  amount: "",
  category: "Food",
  description: "",
  date: new Date().toISOString().slice(0, 10),
  paymentMethod: "UPI",
  notes: "",
};

function TransactionForm({ item, onClose, onSaved }) {
  const [form, setForm] = useState(
    item
      ? {
          ...item,
          date: item.date
            ? new Date(item.date).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
        }
      : { ...blank },
  );

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const categories =
    form.type === "Income" ? incomeCategories : expenseCategories;

  const set = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "type"
        ? {
            category:
              value === "Income"
                ? incomeCategories[0] || "Salary"
                : expenseCategories[0] || "Food",
          }
        : {}),
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (busy) return;

    setBusy(true);
    setError("");

    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
      };

      if (item) {
        await api.put(`/transactions/${item._id}`, payload);
      } else {
        await api.post("/transactions", payload);
      }

      onSaved();
    } catch (err) {
      console.error("Transaction save failed:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save transaction.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      title={item ? "Edit transaction" : "Add transaction"}
      onClose={onClose}
    >
      <form className="form-grid" onSubmit={submit}>
        <label>
          Type
          <select
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
          >
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>
        </label>

        <label>
          Amount
          <input
            type="number"
            min="0.01"
            step="0.01"
            required
            value={form.amount}
            onChange={(e) => set("amount", e.target.value)}
          />
        </label>

        <label>
          Category
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          Date
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
          />
        </label>

        <label className="wide">
          Description
          <input
            required
            maxLength="140"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="What was this for?"
          />
        </label>

        <label>
          Payment method
          <select
            value={form.paymentMethod}
            onChange={(e) => set("paymentMethod", e.target.value)}
          >
            {methods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>

        <label>
          Notes
          <input
            value={form.notes || ""}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Optional"
          />
        </label>

        {error && <p className="form-error wide">{error}</p>}

        <div className="modal-actions wide">
          <button
            type="button"
            className="button button-secondary"
            onClick={onClose}
            disabled={busy}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="button button-primary"
            disabled={busy}
          >
            {busy ? "Saving…" : "Save transaction"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function TransactionsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    type: "",
    category: "",
  });

  const load = async () => {
    try {
      setError("");

      const response = await api.get("/transactions", {
        params: filters,
      });

      setData(response.data);
    } catch (err) {
      console.error("Failed to load transactions:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load transactions.",
      );
    }
  };

  /*
   * IMPORTANT:
   * Do not use:
   *
   * useEffect(load, []);
   *
   * because load() is async and returns a Promise.
   *
   * The effect below returns only the timer cleanup function.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [filters.search, filters.type, filters.category]);

  const deleteItem = async (id) => {
    const confirmed = window.confirm(
      "Delete this transaction? This cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/transactions/${id}`);

      await load();
    } catch (err) {
      console.error("Failed to delete transaction:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete transaction.",
      );
    }
  };

  const openAdd = () => {
    setEdit(null);
    setShow(true);
  };

  const openEdit = (item) => {
    setEdit(item);
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
    setEdit(null);
  };

  const handleSaved = async () => {
    closeModal();
    await load();
  };

  if (!data && !error) {
    return <Loading />;
  }

  if (error && !data) {
    return <ErrorState message={error} />;
  }

  const summary = data?.summary || {
    income: 0,
    expenses: 0,
    balance: 0,
  };

  const items = Array.isArray(data?.items) ? data.items : [];

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Track every income and expense in one clear place."
      />

      <div className="action-row">
        <div className="summary-strip">
          <span>
            Income{" "}
            <b>
              <Money value={summary.income} />
            </b>
          </span>

          <span>
            Expenses{" "}
            <b>
              <Money value={summary.expenses} />
            </b>
          </span>

          <span>
            Balance{" "}
            <b>
              <Money value={summary.balance} />
            </b>
          </span>
        </div>

        <button className="button button-primary" onClick={openAdd}>
          <Plus size={17} />
          Add transaction
        </button>
      </div>

      <div className="card filters">
        <input
          placeholder="Search description or category"
          value={filters.search}
          onChange={(e) =>
            setFilters((current) => ({
              ...current,
              search: e.target.value,
            }))
          }
        />

        <select
          value={filters.type}
          onChange={(e) =>
            setFilters((current) => ({
              ...current,
              type: e.target.value,
            }))
          }
        >
          <option value="">All types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((current) => ({
              ...current,
              category: e.target.value,
            }))
          }
        >
          <option value="">All categories</option>

          {[...incomeCategories, ...expenseCategories]
            .filter(
              (category, index, array) => array.indexOf(category) === index,
            )
            .map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
        </select>
      </div>

      {error && data && <div className="form-error">{error}</div>}

      {!items.length ? (
        <EmptyState message="No transactions yet. Add your first income or expense." />
      ) : (
        <div className="card transaction-list">
          {items.map((item) => (
            <article className="transaction" key={item._id}>
              <div>
                <b>{item.description}</b>

                <small>
                  {formatDate(item.date)} · {item.category} ·{" "}
                  {item.paymentMethod}
                </small>
              </div>

              <span
                className={`amount ${
                  item.type === "Income" ? "income" : "expense"
                }`}
              >
                {item.type === "Income" ? "+" : "−"}

                <Money value={item.amount} />
              </span>

              <div className="row-actions">
                <button
                  className="icon-button"
                  onClick={() => openEdit(item)}
                  aria-label="Edit transaction"
                  type="button"
                >
                  <Edit3 size={16} />
                </button>

                <button
                  className="icon-button danger"
                  onClick={() => deleteItem(item._id)}
                  aria-label="Delete transaction"
                  type="button"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {show && (
        <TransactionForm
          item={edit}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
