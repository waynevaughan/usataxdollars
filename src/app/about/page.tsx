import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#1a2744] py-8 text-center">
        <Link href="/" className="text-3xl font-bold hover:opacity-80 transition">
          USA<span className="text-red-500">Tax</span>Dollars
        </Link>
      </header>
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">About</h1>
        <div className="space-y-4 text-gray-300 leading-relaxed">
          <p>
            USATaxDollars.com is a simple tool that shows you how the federal
            government spends your tax dollars. Enter your annual income and
            instantly see a breakdown of where your money goes.
          </p>
          <h2 className="text-xl font-semibold text-white pt-4">
            Where does the data come from?
          </h2>
          <p>
            Our budget percentages are based on the{" "}
            <a
              href="https://www.whitehouse.gov/omb/budget/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Office of Management and Budget (OMB)
            </a>{" "}
            FY 2025 estimates. Tax calculations use the 2025 federal income tax
            brackets with the standard deduction for single filers.
          </p>
          <h2 className="text-xl font-semibold text-white pt-4">
            Is this accurate?
          </h2>
          <p>
            This is a simplified estimate designed to give you a general idea of
            where your tax dollars go. Your actual tax burden depends on your
            filing status, deductions, credits, state taxes, and other factors.
            We&apos;re not tax advisors — consult a professional for precise
            calculations.
          </p>
          <h2 className="text-xl font-semibold text-white pt-4">History</h2>
          <p>
            USATaxDollars.com was originally built by{" "}
            <strong className="text-white">Fuscient</strong> and{" "}
            <strong className="text-white">FortySevenMedia</strong>. This modern
            version updates the data and design while keeping the same simple
            mission: make government spending understandable.
          </p>
        </div>
        <div className="mt-8">
          <Link
            href="/"
            className="text-blue-400 hover:underline"
          >
            ← Back to calculator
          </Link>
        </div>
      </main>
      <footer className="border-t border-gray-800 py-6">
        <p className="text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} USATaxDollars.com. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
