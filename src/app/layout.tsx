import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "USATaxDollars.com — See How The Government Spends Your Tax Dollars",
  description:
    "Find out how the federal government spends the taxes they take out of your paycheck.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
