import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Medicore | India's Premium Healthcare Platform",
  description: "Next-generation production-grade medical booking, digital prescription systems, and real-time AI-powered diagnostic portals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
