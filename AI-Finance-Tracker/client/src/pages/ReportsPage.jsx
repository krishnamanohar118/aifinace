import { useState } from "react";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import Money from "../components/Money";
import { Loading } from "../components/States";
export default function ReportsPage() {
  const [year, setYear] = useState(new Date().getFullYear()),
    [report, setReport] = useState(null),
    [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get("/reports/yearly", { params: { year } });
      setReport(r.data.report);
    } finally {
      setLoading(false);
    }
  };
  const csv = () => {
    const rows = [
      ["Date", "Description", "Type", "Category", "Amount"],
      ...report.transactions.map((x) => [
        new Date(x.date).toISOString().slice(0, 10),
        x.description,
        x.type,
        x.category,
        x.amount,
      ]),
    ];
    const blob = new Blob(
      [
        rows
          .map((r) =>
            r.map((x) => `"${String(x).replaceAll('"', '""')}"`).join(","),
          )
          .join("\n"),
      ],
      { type: "text/csv" },
    );
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: `finance-report-${year}.csv`,
    });
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const pdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(19);
    doc.text("AI Finance Tracker", 14, 18);
    doc.setFontSize(12);
    doc.text(`${year} Financial Report`, 14, 27);
    let y = 40;
    [
      ["Income", report.summary.income],
      ["Expenses", report.summary.expenses],
      ["Savings", report.summary.savings],
    ].forEach(([label, value]) => {
      doc.text(`${label}: INR ${Number(value).toFixed(2)}`, 14, y);
      y += 8;
    });
    doc.text("Category breakdown", 14, y + 5);
    y += 14;
    report.categories.forEach((x) => {
      if (y > 280) {
        doc.addPage();
        y = 18;
      }
      doc.text(`${x.category}: INR ${Number(x.amount).toFixed(2)}`, 16, y);
      y += 7;
    });
    doc.save(`finance-report-${year}.pdf`);
  };
  return (
    <>
      <PageHeader
        title="Reports"
        description="Build a clear record of your financial year."
      />
      <div className="action-row">
        <label>
          Year{" "}
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </label>
        <button className="button button-primary" onClick={load}>
          Generate report
        </button>
      </div>
      {loading && <Loading />}
      {report && (
        <section className="report card">
          <div className="action-row">
            <h2>{year} summary</h2>
            <div>
              <button className="button button-secondary" onClick={csv}>
                <Download size={16} /> CSV
              </button>
              <button className="button button-secondary" onClick={pdf}>
                <Download size={16} /> PDF
              </button>
            </div>
          </div>
          <div className="dashboard-grid">
            {[
              ["Income", report.summary.income],
              ["Expenses", report.summary.expenses],
              ["Savings", report.summary.savings],
            ].map(([x, v]) => (
              <div className="stat-card" key={x}>
                <p>{x}</p>
                <strong>
                  <Money value={v} />
                </strong>
              </div>
            ))}
          </div>
          <h3>Category breakdown</h3>
          {report.categories.map((x) => (
            <p key={x.category}>
              {x.category}: <Money value={x.amount} />
            </p>
          ))}
        </section>
      )}
    </>
  );
}
