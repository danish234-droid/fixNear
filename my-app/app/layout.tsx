import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FixNear — Local Services Marketplace",
  description:
    "Find and book trusted local professionals for electrician, plumbing, AC, and computer repair services.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-fixnear-bg text-fixnear-text font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
