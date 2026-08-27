import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Money from "../components/Money";
import { ErrorState, Loading, EmptyState } from "../components/States";
import { formatDate } from "../utils/finance";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setError("");

        const response = await api.get("/dashboard");

        if (mounted) {
          setData(response.data?.data || null);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load dashboard.",
          );
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  if (!data) {
    return error ? <ErrorState message={error} /> : <Loading />;
  }

  const recent = Array.isArray(data.recent) ? data.recent : [];

  return (
    <>
      <PageHeader
        title="Your financial overview"
        description="A live view based on your recorded activity."
      />

      <section className="dashboard-grid">
        {[
          ["Total income", data.income],
          ["Total expenses", data.expenses],
          ["Available balance", data.balance],
          ["Goal savings", data.totalSavings],
        ].map(([name, value]) => (
          <article className="card stat-card" key={name}>
            <p>{name}</p>

            <strong>
              <Money value={Number(value) || 0} />
            </strong>

            <small>Current month</small>
          </article>
        ))}
      </section>

      <section className="two-col">
        <article className="card panel">
          <h2>Financial insight</h2>

          <p className="insight">
            <Wallet size={20} />

            {data.insight || "No financial insight available yet."}
          </p>

          <p className="muted">Savings rate: {data.savingsPercentage || 0}%</p>
        </article>

        <article className="card panel">
          <h2>Recent activity</h2>

          {recent.length > 0 ? (
            recent.map((x) => (
              <div className="mini-row" key={x._id}>
                <span>
                  <b>{x.description}</b>

                  <small>{formatDate(x.date)}</small>
                </span>

                <b className={x.type === "Income" ? "income" : "expense"}>
                  <Money value={Number(x.amount) || 0} />
                </b>
              </div>
            ))
          ) : (
            <EmptyState message="Your recent transactions will appear here." />
          )}
        </article>
      </section>
    </>
  );
}
