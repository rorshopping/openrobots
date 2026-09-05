import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "OpenRobots — Free robots.txt & llms.txt generator for AI crawlers",
  description:
    "Allow, block, or audit 50+ AI crawlers — GPTBot, ClaudeBot, PerplexityBot & more. " +
    "Free, open source, 100% in-browser, no signup. Generate robots.txt and llms.txt in seconds.",
  keywords: [
    "robots.txt generator",
    "block GPTBot",
    "AI crawler list",
    "llms.txt generator",
    "block AI bots",
    "robots.txt ai crawlers",
    "OpenRobots",
  ],
  openGraph: { type: "website", siteName: "OpenRobots", url: SITE_URL },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
