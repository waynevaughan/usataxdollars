"use client";

import { useState, FormEvent } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* ── Budget data (FY 2025 estimates, OMB Historical Table 5.2) ── */
const BUDGET_CATEGORIES = [
  { name: "Social Security", pct: 21.2, desc: "Social Security Benefits" },
  {
    name: "National Defense",
    pct: 13.4,
    desc: "Military Personnel, Operations & Maintenance, Procurement, R&D, Military Construction, Atomic Energy Defense",
  },
  { name: "Medicare", pct: 14.3, desc: "Medicare Benefits" },
  {
    name: "Income Security",
    pct: 9.4,
    desc: "Retirement & disability (non-SS), Unemployment compensation, Housing assistance, Food & nutrition assistance",
  },
  {
    name: "Health",
    pct: 10.0,
    desc: "Medicaid, Health care services, Health research & training, Consumer safety",
  },
  {
    name: "Net Interest",
    pct: 13.1,
    desc: "Interest on Treasury debt securities",
  },
  {
    name: "Veterans Benefits",
    pct: 4.7,
    desc: "Income security, Education & training, Hospital & medical care, Housing",
  },
  {
    name: "Education & Training",
    pct: 2.1,
    desc: "Elementary, secondary, higher education, Research, Training & employment",
  },
  {
    name: "Transportation",
    pct: 2.0,
    desc: "Ground, Air, Water transportation",
  },
  {
    name: "International Affairs",
    pct: 1.2,
    desc: "Development & humanitarian assistance, Security assistance, Foreign affairs",
  },
  {
    name: "Science, Space & Technology",
    pct: 0.9,
    desc: "General science, Basic research, Space flight & research",
  },
  {
    name: "Natural Resources & Environment",
    pct: 0.8,
    desc: "Water resources, Conservation, Recreation, Pollution control",
  },
  {
    name: "Administration of Justice",
    pct: 1.1,
    desc: "Law enforcement, Judicial activities, Corrections, Criminal justice assistance",
  },
  {
    name: "Community & Regional Development",
    pct: 0.6,
    desc: "Community development, Area & regional development, Disaster relief",
  },
  {
    name: "Agriculture",
    pct: 0.5,
    desc: "Farm income stabilization, Agricultural research & services",
  },
  {
    name: "General Government",
    pct: 0.5,
    desc: "Legislative functions, Executive direction, Fiscal operations, Personnel management",
  },
  {
    name: "Energy",
    pct: 0.2,
    desc: "Energy supply, Conservation, Emergency preparedness, Regulation",
  },
  {
    name: "Other",
    pct: 4.0,
    desc: "Allowances, Undistributed offsetting receipts, and other functions",
  },
];

const PIE_COLORS = [
  "#e74c3c", "#2c3e50", "#3498db", "#e67e22", "#27ae60",
  "#f39c12", "#8e44ad", "#1abc9c", "#d35400", "#2980b9",
  "#c0392b", "#16a085", "#7f8c8d", "#f1c40f", "#9b59b6",
  "#34495e", "#e74c3c", "#95a5a6",
];

/* ── 2025 Federal Income Tax Brackets (single filer, simplified) ── */
const TAX_BRACKETS = [
  { min: 0, max: 11925, rate: 0.10 },
  { min: 11925, max: 48475, rate: 0.12 },
  { min: 48475, max: 103350, rate: 0.22 },
  { min: 103350, max: 197300, rate: 0.24 },
  { min: 197300, max: 250525, rate: 0.32 },
  { min: 250525, max: 626350, rate: 0.35 },
  { min: 626350, max: Infinity, rate: 0.37 },
];

const STANDARD_DEDUCTION = 15000;

function calculateTax(income: number): number {
  const taxable = Math.max(0, income - STANDARD_DEDUCTION);
  let tax = 0;
  for (const bracket of TAX_BRACKETS) {
    if (taxable <= bracket.min) break;
    const amount = Math.min(taxable, bracket.max) - bracket.min;
    tax += amount * bracket.rate;
  }
  return tax;
}

function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

/* ── Custom tooltip for the pie chart ── */
function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { pct: number } }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-gray-900/95 border border-gray-600 rounded-lg px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold">{d.name}</p>
      <p className="text-gray-300">
        {formatCurrency(d.value)} ({d.payload.pct}%)
      </p>
    </div>
  );
}

export default function Home() {
  const [incomeStr, setIncomeStr] = useState("");
  const [result, setResult] = useState<{
    income: number;
    tax: number;
    items: { name: string; pct: number; amount: number; desc: string }[];
  } | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const income = parseFloat(incomeStr.replace(/[^0-9.]/g, ""));
    if (isNaN(income) || income <= 0) return;

    const tax = calculateTax(income);
    const items = BUDGET_CATEGORIES.map((c) => ({
      ...c,
      amount: (c.pct / 100) * tax,
    }));
    setResult({ income, tax, items });
  }

  const pieData = result?.items.map((item) => ({
    name: item.name,
    value: Math.round(item.amount * 100) / 100,
    pct: item.pct,
  }));

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2744] via-[#1e2d4d] to-[#243456]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-8 pb-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            USA<span className="text-red-500">Tax</span>Dollars
          </h1>
          <div className="mt-1 h-0.5 w-16 bg-red-500 mx-auto" />
          <nav className="mt-3 flex justify-center gap-6 text-sm uppercase tracking-widest text-gray-300">
            <a href="/about" className="hover:text-white transition">
              About
            </a>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        {/* Tagline + Form */}
        <section className="bg-[#1e2d4d] py-8">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-lg md:text-xl italic text-gray-200 mb-6">
              Find out how the Government{" "}
              <span className="text-red-400 font-semibold">
                spends all those taxes
              </span>{" "}
              they take out of your paycheck!
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-[#0f1b33] rounded-xl p-4 border border-gray-700"
            >
              <label className="font-bold uppercase tracking-wide text-sm text-gray-300 shrink-0">
                Your Annual Income:
              </label>
              <div className="relative flex-1 w-full sm:w-auto">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                  $
                </span>
                <input
                  type="text"
                  value={incomeStr}
                  onChange={(e) => setIncomeStr(e.target.value)}
                  placeholder="100,000"
                  className="w-full pl-8 pr-4 py-3 rounded-lg bg-white text-gray-900 text-lg font-medium"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-lg rounded-lg uppercase tracking-wide transition shrink-0 cursor-pointer"
              >
                Go!
              </button>
            </form>
          </div>
        </section>

        {/* Results */}
        {result && (
          <section className="py-10">
            <div className="max-w-4xl mx-auto px-4">
              {/* Summary */}
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-light">
                  Your Estimated Federal Taxes:{" "}
                  <span className="font-bold text-red-400 bg-red-950/40 px-3 py-1 rounded-lg">
                    {formatCurrency(result.tax)}
                  </span>{" "}
                  <span className="text-gray-400">each year</span>
                </h2>
                <p className="mt-3 text-gray-400">
                  That&apos;s{" "}
                  <span className="text-white font-semibold">
                    {formatCurrency(result.tax / 52)}
                  </span>{" "}
                  each week or{" "}
                  <span className="text-white font-semibold">
                    {formatCurrency(result.tax / 12)}
                  </span>{" "}
                  per month.
                </p>
              </div>

              {/* Pie Chart + Legend */}
              <div className="bg-[#0f1b33] rounded-2xl border border-gray-700 p-6 mb-8">
                <h3 className="text-center font-bold uppercase tracking-wide text-sm text-gray-300 mb-6">
                  How the Federal Government Spends Your Money
                </h3>
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  <div className="w-full lg:w-1/2" style={{ height: 360 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={140}
                          innerRadius={50}
                          dataKey="value"
                          stroke="#1a2744"
                          strokeWidth={2}
                        >
                          {pieData?.map((_, i) => (
                            <Cell
                              key={i}
                              fill={PIE_COLORS[i % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    {result.items
                      .sort((a, b) => b.pct - a.pct)
                      .map((item, i) => (
                        <div
                          key={item.name}
                          className="flex items-center gap-2 py-1"
                        >
                          <span
                            className="w-3 h-3 rounded-sm shrink-0"
                            style={{
                              backgroundColor:
                                PIE_COLORS[
                                  BUDGET_CATEGORIES.findIndex(
                                    (c) => c.name === item.name
                                  ) % PIE_COLORS.length
                                ],
                            }}
                          />
                          <span className="text-gray-300">{item.name}</span>
                          <span className="ml-auto font-semibold text-white">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Detailed Table */}
              <div className="bg-[#0f1b33] rounded-2xl border border-gray-700 overflow-hidden mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-red-700 text-white uppercase text-xs tracking-wide">
                      <th className="text-left px-4 py-3">
                        Detailed Breakdown
                      </th>
                      <th className="text-center px-4 py-3 hidden sm:table-cell">Percentage</th>
                      <th className="text-right px-4 py-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.items.map((item, i) => (
                      <tr
                        key={item.name}
                        className={`border-t border-gray-800 ${
                          i % 2 === 0 ? "bg-[#0f1b33]" : "bg-[#152040]"
                        } hover:bg-[#1a2a55] transition group`}
                        title={item.desc}
                      >
                        <td className="px-4 py-2.5">
                          {item.name}
                          <span className="ml-1 text-gray-500 text-xs hidden group-hover:inline">
                            ⓘ {item.desc}
                          </span>
                        </td>
                        <td className="text-center px-4 py-2.5 text-gray-400 hidden sm:table-cell">
                          {item.pct.toFixed(1)}%
                        </td>
                        <td className="text-right px-4 py-2.5 font-medium">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-red-900/50 border-t-2 border-red-700 font-bold">
                      <td className="px-4 py-3">Total</td>
                      <td className="text-center px-4 py-3 hidden sm:table-cell">100%</td>
                      <td className="text-right px-4 py-3">
                        {formatCurrency(result.tax)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Source */}
              <div className="text-center text-gray-400 text-sm max-w-2xl mx-auto">
                <h3 className="text-white font-semibold text-lg mb-2">
                  Where do these numbers come from?
                </h3>
                <p>
                  Budget percentages are based on the{" "}
                  <a
                    href="https://www.whitehouse.gov/omb/budget/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Office of Management and Budget (OMB)
                  </a>{" "}
                  FY 2025 estimates. Tax calculations use 2025 federal income
                  tax brackets with the standard deduction. This is a simplified
                  estimate — actual taxes depend on filing status, deductions,
                  and credits.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-4 mb-4">
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent("https://usataxdollars.com")}&text=${encodeURIComponent("See how the government spends your tax dollars")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition"
            >
              Share on 𝕏
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://usataxdollars.com")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition"
            >
              Share on Facebook
            </a>
          </div>
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} USATaxDollars.com. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
