"use client";

import { useState, FormEvent } from "react";

/* ── Budget categories (FY 2025 OMB estimates) ── */
const CATEGORIES = [
  { name: "Social Security", pct: 21.2, tip: "Social Security Benefits" },
  { name: "National Defense", pct: 13.4, tip: "Military Personnel, Operation and Maintenance, Procurement, Research and Development, Military Construction, Family Housing, Atomic Energy Defense Activities, Defense-related Activities" },
  { name: "Medicare", pct: 14.3, tip: "Medicare Benefits" },
  { name: "Income Security", pct: 9.4, tip: "General retirement and disability insurance (excluding social security), Federal employee retirement and disability, Unemployment compensation, Housing assistance, Food and nutrition assistance, Other income security" },
  { name: "Health", pct: 10.0, tip: "Health care services, Health research and training, Consumer and occupational health and safety" },
  { name: "Net Interest", pct: 13.1, tip: "Interest on Treasury debt securities (gross), Interest received by on-budget trust funds, Interest received by off-budget trust funds, Other interest, Other investment income" },
  { name: "Veterans Benefits and Services", pct: 4.7, tip: "Income security for veterans, Veterans education, training, and rehabilitation, Hospital and medical care for veterans, Veterans housing, Other veterans benefits and services" },
  { name: "Education, Training, and Employment", pct: 2.1, tip: "Elementary, secondary, and vocational education, Higher education, Research and general education aids, Training and employment, Other labor services, Social services" },
  { name: "Transportation", pct: 2.0, tip: "Ground transportation, Air transportation, Water transportation, Other transportation" },
  { name: "Administration of Justice", pct: 1.1, tip: "Federal law enforcement activities, Federal litigative and judicial activities, Federal correctional activities, Criminal justice assistance" },
  { name: "International Affairs", pct: 1.2, tip: "International development and humanitarian assistance, International security assistance, Conduct of foreign affairs, Foreign information and exchange activities, International financial programs" },
  { name: "Natural Resources and Environment", pct: 0.8, tip: "Water resources, Conservation and land management, Recreational resources, Pollution control and abatement, Other natural resources" },
  { name: "General Science, Space, and Technology", pct: 0.9, tip: "General science and basic research, Space flight, research, and supporting activities" },
  { name: "Community and Regional Development", pct: 0.6, tip: "Community development, Area and regional development, Disaster relief and insurance" },
  { name: "Agriculture", pct: 0.5, tip: "Farm income stabilization, Agricultural research and services" },
  { name: "General Government", pct: 0.5, tip: "Legislative functions, Executive direction and management, Central fiscal operations, General property and records management, Central personnel management, General purpose fiscal assistance, Other general government, Deductions for offsetting receipts" },
  { name: "Energy", pct: 0.2, tip: "Energy supply, Energy conservation, Emergency energy preparedness, Energy information, policy, and regulation" },
  { name: "Other", pct: 4.0, tip: "Allowances, Undistributed offsetting receipts, and other functions" },
];

/* Pie chart legend colors */
const LEGEND_COLORS = [
  "#c0392b", "#2c3e50", "#3498db", "#e67e22", "#27ae60",
  "#f39c12", "#8e44ad", "#1abc9c", "#d35400", "#2980b9",
  "#c0392b", "#16a085", "#7f8c8d", "#f1c40f", "#9b59b6",
  "#34495e", "#e74c3c", "#95a5a6",
];

/* ── 2025 Tax Brackets (single filer) + FICA ── */
const BRACKETS = [
  { min: 0, max: 11925, rate: 0.10 },
  { min: 11925, max: 48475, rate: 0.12 },
  { min: 48475, max: 103350, rate: 0.22 },
  { min: 103350, max: 197300, rate: 0.24 },
  { min: 197300, max: 250525, rate: 0.32 },
  { min: 250525, max: 626350, rate: 0.35 },
  { min: 626350, max: Infinity, rate: 0.37 },
];

const STANDARD_DEDUCTION = 15000;
const SS_WAGE_BASE = 168600;

function calculateTax(income: number): number {
  const ssTax = Math.min(income, SS_WAGE_BASE) * 0.062;
  const medicareTax = income * 0.0145;
  const fica = ssTax + medicareTax;
  const taxable = Math.max(0, income - STANDARD_DEDUCTION);
  let incomeTax = 0;
  for (const b of BRACKETS) {
    if (taxable <= b.min) break;
    incomeTax += (Math.min(taxable, b.max) - b.min) * b.rate;
  }
  return incomeTax + fica;
}

function fmt(n: number): string {
  return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Home() {
  const [incomeStr, setIncomeStr] = useState("");
  const [result, setResult] = useState<{
    tax: number;
    items: { name: string; pct: number; amount: number; tip: string }[];
  } | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const income = parseFloat(incomeStr.replace(/[^0-9.]/g, ""));
    if (isNaN(income) || income <= 0) return;
    setIncomeStr(income.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    const tax = calculateTax(income);
    setResult({
      tax,
      items: CATEGORIES.map((c) => ({ ...c, amount: (c.pct / 100) * tax })),
    });
  }

  /* Top 7 for pie legend */
  const legendItems = result
    ? [...result.items].sort((a, b) => b.pct - a.pct).slice(0, 7)
    : [];
  const legendOther = result
    ? result.tax - legendItems.reduce((s, i) => s + i.amount, 0)
    : 0;

  return (
    <>
      {/* Header */}
      <header>
        <div className="container wrap">
          <h1>
            <span className="hide-text">USATaxDollars.com - Your Tax Dollars at Work</span>
            <a className="logo" href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="img-responsive" src="/Content/images/logo.png" alt="USATaxDollars" />
            </a>
          </h1>
          <ul className="navigation">
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
      </header>

      {/* Main */}
      <div className="container main-content">
        <form onSubmit={onSubmit}>
          <div className="income-form">
            <div className="message">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="finger" src="/Content/images/finger.png" alt="" />
              Find out how the Government <span>spends all those taxes</span> they take out of your paycheck!
            </div>
            <div className="outer">
              <div className="inner">
                <span className="income-label">YOUR ANNUAL INCOME:</span>
                <span className="dollar-sign">$</span>
                <input
                  className="income-field"
                  type="text"
                  value={incomeStr}
                  onChange={(e) => setIncomeStr(e.target.value)}
                  placeholder=""
                />
                <button type="submit" className="btn-go" />
              </div>
            </div>
          </div>
        </form>

        {result && (
          <div className="results" id="resultdiv">
            <h2 className="estimated">
              Your Estimated Federal Taxes:
              <span className="total-tax">{fmt(result.tax)}</span>
              <span className="each-year">each year</span>
            </h2>
            <h4 className="rundown">
              That&apos;s <span>{fmt(result.tax / 52)}</span> each week or{" "}
              <span>{fmt(result.tax / 12)}</span> per month.
            </h4>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="three-stars" src="/Content/images/three-stars.png" alt="" />

            <div>
              <div className="pie-header">
                <span>How the federal government spends your money</span>
              </div>
              <div className="pie-box">
                <div className="chart-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/Content/images/chart.png" alt="Budget pie chart" />
                </div>
                <div className="legend">
                  <table>
                    <tbody>
                      {legendItems.map((item, i) => (
                        <tr key={item.name}>
                          <td width="25">
                            <span style={{
                              display: "inline-block",
                              width: 14,
                              height: 14,
                              backgroundColor: LEGEND_COLORS[CATEGORIES.findIndex(c => c.name === item.name)],
                              borderRadius: 2,
                            }} />
                          </td>
                          <td>
                            {item.name}
                            <span className="cost"> {fmt(item.amount)}</span>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td>
                          <span style={{
                            display: "inline-block",
                            width: 14,
                            height: 14,
                            backgroundColor: "#95a5a6",
                            borderRadius: 2,
                          }} />
                        </td>
                        <td>
                          Everything Else
                          <span className="cost"> {fmt(legendOther)}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="breakdown">
                <table className="breakdown-table">
                  <tbody>
                    <tr className="tablehead">
                      <td style={{ width: "51%" }}>Detailed Breakdown</td>
                      <td className="percentage" style={{ width: "16%" }}>Percentage</td>
                      <td className="col-amount" style={{ width: "33%" }}>Amount</td>
                    </tr>
                    {result.items.map((item, i) => (
                      <tr key={item.name} className={i % 2 === 0 ? "oddrow" : "evenrow"}>
                        <td>
                          {item.name}{" "}
                          <span className="tooltip-link" title={item.tip}>?</span>
                        </td>
                        <td className="percentage">{item.pct.toFixed(2)}%</td>
                        <td className="col-amount">{fmt(item.amount)}</td>
                      </tr>
                    ))}
                    <tr className="totalrow">
                      <td>Total</td>
                      <td className="percentage">100%</td>
                      <td className="col-amount">{fmt(result.tax)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="waitamin">
                <h3>Wait a minute! Where are you getting your numbers?</h3>
                <p>
                  From the <a href="https://www.whitehouse.gov/omb/budget/" target="_blank" rel="noopener noreferrer">Office of Management and Budget</a> (OMB FY 2025 estimates).
                  We&apos;ve taken their numbers, simplified them and done the math for you so it&apos;s easy.
                  We understand it&apos;s not 100% accurate but we&apos;re just trying to give everyone
                  an idea of where their money&apos;s going.
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="three-stars" src="/Content/images/three-stars.png" alt="" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="container">
        <div className="footer">
          <div className="wrap">
            <a className="fuscient" href="http://www.fuscient.com" target="_blank" rel="noopener noreferrer">Fuscient</a>
            <a className="fortyseven" href="http://www.fortysevenmedia.com" target="_blank" rel="noopener noreferrer">FortySevenMedia</a>
          </div>
        </div>
        <div className="sub-footer">
          <div className="share-buttons">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://usataxdollars.com")}`} target="_blank" rel="noopener noreferrer"><img className="share-button" src="/Content/images/btn-facebook-lg.png" alt="Share on Facebook" /></a>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent("https://usataxdollars.com")}&text=${encodeURIComponent("See how the government spends your tax dollars")}`} target="_blank" rel="noopener noreferrer"><img className="share-button" src="/Content/images/btn-twitter-lg.png" alt="Share on X" /></a>
          </div>
          <p className="copyright">&copy; {new Date().getFullYear()} USATaxDollars.com. All rights reserved.</p>
        </div>
      </div>
    </>
  );
}
