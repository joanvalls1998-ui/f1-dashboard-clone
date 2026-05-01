"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="flex">
          <Sidebar collapsed={false} onToggle={() => {}} />
          <div className="flex-1 ml-64">
            <Header />
            <div className="p-6">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
