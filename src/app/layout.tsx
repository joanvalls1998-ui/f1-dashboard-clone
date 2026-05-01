"use client";

import { useState } from "react";
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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="flex">
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
          <div className={`flex-1 transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
            <Header />
            <div className="p-6">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
