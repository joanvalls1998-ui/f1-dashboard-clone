"use client";

import { useState } from "react";
import { Sidebar, MobileMenuButton } from "@/components/Sidebar";

export default function SidebarWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Mobile header bar */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="flex items-center h-14 px-4 border-b border-[var(--bg-overlay)] bg-[var(--bg-base)] lg:hidden">
          <MobileMenuButton onClick={() => setCollapsed(false)} />
          <span
            className="ml-3 font-bold text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            F1 Dashboard
          </span>
          <div className="ml-auto flex items-center gap-2">
            <div className="live-dot" />
            <span className="text-xs text-[var(--status-live)] font-medium">Live</span>
          </div>
        </header>

        {/* Main content */}
        <div
          className={`flex-1 transition-all duration-300 ${
            collapsed ? "lg:ml-16" : "lg:ml-64"
          } ml-0`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
