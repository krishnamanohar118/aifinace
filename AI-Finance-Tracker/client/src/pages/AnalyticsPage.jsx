import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Money from "../components/Money";
import { ErrorState, Loading } from "../components/States";

const colors = [
  "#137a66",
  "#e78b43",
  "#5865c9",
  "#d35e77",
  "#62a4d4",
  "#a070c6",
];

function Chart({ title, children }) {
  return (
    <article className="card chart-card">
      <h2>{title}</h2>

      <div
        className="chart"
        style={{
          width: "100%",
          height: "280px",
        }}
      >
        {children}
      </div>
    </article>
  );
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("current");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    setData(null);
    setErr("");

    Promise.all([
      api.get("/analytics/summary", {
        params: { period },
      }),

      api.get("/analytics/categories", {
        params: { period },
      }),

      api.get("/analytics/monthly", {
        params: { months: 6 },
      }),

      api.get("/analytics/trends", {
        params: { period },
      }),
    ])
      .then(([s, c, m, t]) => {
        console.log("Summary:", s.data);
        console.log("Categories:", c.data);
        console.log("Monthly:", m.data);
        console.log("Trends:", t.data);

        setData({
          s: s.data.data || {},
          c: c.data.items || [],
          m: m.data.items || [],
          t: t.data.items || [],
        });
      })
      .catch((e) => {
        console.error(e);
        setErr(
          e.response?.data?.message || e.message || "Failed to load analytics",
        );
      });
  }, [period]);

  if (!data) {
    return err ? <ErrorState message={err} /> : <Loading />;
  }

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Meaningful patterns from your recorded transactions."
      />

      <div className="action-row">
        <div className="summary-strip">
          <span>
            Income{" "}
            <b>
              <Money value={data.s.income || 0} />
            </b>
          </span>

          <span>
            Expenses{" "}
            <b>
              <Money value={data.s.expenses || 0} />
            </b>
          </span>

          <span>
            Saved{" "}
            <b>
              <Money value={data.s.savings || 0} />
            </b>
          </span>
        </div>

        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="current">Current month</option>
          <option value="previous">Previous month</option>
          <option value="3m">Last 3 months</option>
          <option value="6m">Last 6 months</option>
          <option value="year">Current year</option>
        </select>
      </div>

      <div className="chart-grid">
        {/* Expense Distribution */}
        <Chart title="Expense distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.c}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
              >
                {data.c.map((item, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Chart>

        {/* Income vs Expenses */}
        <Chart title="Income vs expenses">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.m}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="income" fill="#137a66" name="Income" />

              <Bar dataKey="expenses" fill="#e78b43" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        {/* Spending Trend */}
        <Chart title="Spending trend">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.t}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="amount"
                stroke="#137a66"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Chart>

        {/* Category Comparison */}
        <Chart title="Category comparison">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.c} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis type="number" />

              <YAxis type="category" dataKey="category" width={90} />

              <Tooltip />

              <Bar dataKey="amount" fill="#5865c9" />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </div>
    </>
  );
}
