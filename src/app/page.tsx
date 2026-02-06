"use client";

import { useState, FormEvent } from "react";
import dynamic from "next/dynamic";

const PieChart = dynamic(() => import("./PieChart"), { ssr: false });

/* ── FY 2026 Budget (OMB estimates) ── */
const CATEGORIES = [
  { name: "Social Security", pct: 21.0, tip: "Social Security retirement, disability, and survivor benefits" },
  { name: "Medicare", pct: 14.8, tip: "Medicare hospital, outpatient, and prescription drug coverage" },
  { name: "Net Interest", pct: 13.5, tip: "Interest payments on the national debt" },
  { name: "National Defense", pct: 13.0, tip: "Military personnel, operations, procurement, and R&D" },
  { name: "Health", pct: 10.2, tip: "Medicaid, CHIP, health care services, and research" },
  { name: "Income Security", pct: 9.0, tip: "Unemployment, housing, food assistance, and disability" },
  { name: "Veterans Benefits", pct: 4.8, tip: "VA healthcare, education, disability compensation" },
  { name: "Education & Training", pct: 2.0, tip: "K-12, higher education, and job training" },
  { name: "Transportation", pct: 1.9, tip: "Highways, aviation, transit, and rail" },
  { name: "International Affairs", pct: 1.2, tip: "Foreign aid, diplomacy, and security assistance" },
  { name: "Administration of Justice", pct: 1.1, tip: "FBI, federal courts, prisons, and law enforcement" },
  { name: "Science & Space", pct: 0.9, tip: "NASA, NSF, and basic research" },
  { name: "Natural Resources", pct: 0.8, tip: "EPA, national parks, conservation, and water" },
  { name: "Community Development", pct: 0.6, tip: "FEMA, regional development, and disaster relief" },
  { name: "Agriculture", pct: 0.5, tip: "Farm subsidies and agricultural research" },
  { name: "General Government", pct: 0.5, tip: "Congress, White House, IRS, and GSA" },
  { name: "Energy", pct: 0.2, tip: "DOE, energy programs, and nuclear security" },
  { name: "Other", pct: 4.0, tip: "Miscellaneous programs and offsetting receipts" },
];

const COLORS = [
  "#c0392b", "#2980b9", "#e67e22", "#2c3e50", "#27ae60",
  "#f39c12", "#8e44ad", "#16a085", "#d35400", "#3498db",
  "#e74c3c", "#1abc9c", "#7f8c8d", "#f1c40f", "#9b59b6",
  "#34495e", "#e74c3c", "#95a5a6",
];

/* ── 2026 Tax Brackets (estimated, single filer) ── */
const BRACKETS = [
  { min: 0, max: 12200, rate: 0.10 },
  { min: 12200, max: 49550, rate: 0.12 },
  { min: 49550, max: 105700, rate: 0.22 },
  { min: 105700, max: 201700, rate: 0.24 },
  { min: 201700, max: 256150, rate: 0.32 },
  { min: 256150, max: 640400, rate: 0.35 },
  { min: 640400, max: Infinity, rate: 0.37 },
];

const STD_DEDUCTION = 15700;
const SS_CAP = 174900;

function calcTax(income: number) {
  const ss = Math.min(income, SS_CAP) * 0.062;
  const med = income * 0.0145;
  const taxable = Math.max(0, income - STD_DEDUCTION);
  let fed = 0;
  for (const b of BRACKETS) {
    if (taxable <= b.min) break;
    fed += (Math.min(taxable, b.max) - b.min) * b.rate;
  }
  return fed + ss + med;
}

function fmt(n: number) {
  return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{
    income: number;
    tax: number;
    items: { name: string; pct: number; amount: number; tip: string }[];
  } | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const income = parseFloat(input.replace(/[^0-9.]/g, ""));
    if (isNaN(income) || income <= 0) return;
    setInput(income.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
    const tax = calcTax(income);
    setResult({
      income,
      tax,
      items: CATEGORIES.map((c) => ({ ...c, amount: (c.pct / 100) * tax })),
    });
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  const pieData = result?.items.map((item, i) => ({
    name: item.name,
    value: item.amount,
    pct: item.pct,
    color: COLORS[i],
  }));

  /* Top 7 for legend, rest collapsed */
  const topItems = result
    ? [...result.items].sort((a, b) => b.amount - a.amount).slice(0, 7)
    : [];
  const otherTotal = result
    ? result.tax - topItems.reduce((s, i) => s + i.amount, 0)
    : 0;

  return (
    <>
      {/* Flag */}
      <div className="flag-banner" />

      {/* Star ribbon */}
      <div className="star-ribbon">★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★</div>

      {/* Header */}
      <header className="site-header">
        <div className="header-badge">
          <h1>USATaxDollars</h1>
          <span className="star-accent">★</span>
        </div>
        <br />
        <nav className="header-nav">
          <a href="/about">About</a>
        </nav>
      </header>

      {/* Content Panel */}
      <div className="content-panel">
        {/* Tagline */}
        <p className="tagline">
          Find out how the Government{" "}
          <span className="accent">spends all those taxes</span>{" "}
          they take out of your paycheck!
        </p>

        {/* Form */}
        <div className="form-wrapper">
          <form onSubmit={onSubmit} className="income-form">
            <label>Your Annual Income:</label>
            <span className="dollar-sign">$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="100,000"
            />
            <button type="submit" className="btn-go">GO!</button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="results-section" id="results">
            <div className="tax-summary">
              <h2>
                Your Estimated Federal Taxes:{" "}
                <span className="tax-amount">{fmt(result.tax)}</span>{" "}
                each year
              </h2>
              <p className="sub">
                That&apos;s <strong>{fmt(result.tax / 52)}</strong> each week
                {" "}or <strong>{fmt(result.tax / 12)}</strong> per month
              </p>
            </div>

            <div className="star-separator">☆ ☆ ☆</div>

            {/* Chart */}
            <div className="content-inner">
              <div className="chart-section">
                <div className="section-header">
                  How the Federal Government Spends Your Money
                </div>
                <div className="chart-body">
                  <div className="chart-container">
                    {pieData && <PieChart data={pieData} />}
                  </div>
                  <div className="chart-legend">
                    {topItems.map((item) => (
                      <div key={item.name} className="legend-item">
                        <span
                          className="legend-swatch"
                          style={{ backgroundColor: COLORS[CATEGORIES.findIndex(c => c.name === item.name)] }}
                        />
                        <span className="legend-name">{item.name}</span>
                        <span className="legend-value">{fmt(item.amount)}</span>
                      </div>
                    ))}
                    <div className="legend-item">
                      <span className="legend-swatch" style={{ backgroundColor: "#bdc3c7" }} />
                      <span className="legend-name">Everything Else</span>
                      <span className="legend-value">{fmt(otherTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="breakdown-section">
                <div className="section-header">Detailed Breakdown</div>
                <table className="breakdown-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Percentage</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.items.map((item) => (
                      <tr key={item.name}>
                        <td>
                          {item.name}
                          <span className="tip" title={item.tip}>?</span>
                        </td>
                        <td>{item.pct.toFixed(2)}%</td>
                        <td>{fmt(item.amount)}</td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td>Total</td>
                      <td>100%</td>
                      <td>{fmt(result.tax)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Source */}
            <div className="source-note">
              <h3>Wait a minute! Where are you getting your numbers?</h3>
              <p>
                From the{" "}
                <a href="https://www.whitehouse.gov/omb/budget/" target="_blank" rel="noopener noreferrer">
                  Office of Management and Budget
                </a>{" "}
                (they put out{" "}
                <a href="https://www.gpo.gov/fdsys/browse/collectionGPO.action?collectionCode=BUDGET" target="_blank" rel="noopener noreferrer">
                  official budget numbers
                </a>
                ). We&apos;ve taken their data, simplified it, and done the math for you
                so it&apos;s easy. We understand it&apos;s not 100% accurate but we&apos;re just
                trying to give everyone an idea of where their money&apos;s going.
              </p>
            </div>

            <div className="star-separator">☆ ☆ ☆</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <div className="share-links">
          <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent("https://usataxdollars.com")}&text=${encodeURIComponent("See how the government spends your tax dollars →")}`} target="_blank" rel="noopener noreferrer">
            Share on 𝕏
          </a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://usataxdollars.com")}`} target="_blank" rel="noopener noreferrer">
            Share on Facebook
          </a>
        </div>
        <p className="copyright">© {new Date().getFullYear()} USATaxDollars.com. All rights reserved.</p>
      </footer>
    </>
  );
}
