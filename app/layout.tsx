import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "R&D Engine - Autonomous Research",
  description:
    "AI-powered autonomous research and development engine with adversarial verification",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}