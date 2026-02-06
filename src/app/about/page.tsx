import Link from "next/link";

export default function About() {
  return (
    <>
      <div className="flag-banner" style={{ height: 120 }} />
      <header className="site-header" style={{ marginTop: -50 }}>
        <h1 style={{ fontSize: "2rem" }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            USA<span className="red">Tax</span>Dollars
          </Link>
        </h1>
      </header>
      <div style={{ maxWidth: 650, margin: "0 auto", padding: "40px 20px 80px" }}>
        <h2 style={{ fontFamily: "Merriweather, serif", fontSize: "1.8rem", marginBottom: 24 }}>About</h2>
        <div style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, fontSize: "1rem" }}>
          <p style={{ marginBottom: 16 }}>
            USATaxDollars.com is a simple tool that shows you how the federal
            government spends your tax dollars. Enter your annual income and
            instantly see a breakdown of where your money goes.
          </p>
          <h3 style={{ color: "#fff", fontSize: "1.2rem", marginTop: 32, marginBottom: 12, fontFamily: "Merriweather, serif" }}>
            Where does the data come from?
          </h3>
          <p style={{ marginBottom: 16 }}>
            Budget percentages are based on the{" "}
            <a href="https://www.whitehouse.gov/omb/budget/" target="_blank" rel="noopener noreferrer" style={{ color: "#1a6fb5" }}>
              Office of Management and Budget
            </a>{" "}
            FY 2026 estimates. Tax calculations use estimated 2026 federal income tax brackets
            with the standard deduction for single filers, plus FICA taxes.
          </p>
          <h3 style={{ color: "#fff", fontSize: "1.2rem", marginTop: 32, marginBottom: 12, fontFamily: "Merriweather, serif" }}>
            Is this accurate?
          </h3>
          <p style={{ marginBottom: 16 }}>
            This is a simplified estimate. Your actual tax burden depends on filing status,
            deductions, credits, state taxes, and more. We&apos;re not tax advisors — consult
            a professional for precise calculations.
          </p>
          <h3 style={{ color: "#fff", fontSize: "1.2rem", marginTop: 32, marginBottom: 12, fontFamily: "Merriweather, serif" }}>
            History
          </h3>
          <p>
            USATaxDollars.com was originally built in 2008. This modern version updates
            the data and design while keeping the same simple mission: make government
            spending understandable.
          </p>
        </div>
        <div style={{ marginTop: 40 }}>
          <Link href="/" style={{ color: "#1a6fb5", textDecoration: "none" }}>
            ← Back to calculator
          </Link>
        </div>
      </div>
    </>
  );
}
