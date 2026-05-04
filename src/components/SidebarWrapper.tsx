"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Sidebar, MobileMenuButton } from "@/components/Sidebar";

export default function SidebarWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  return (
    <div className="flex min-h-[100dvh]">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={toggle} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="flex items-center h-16 px-4 border-b border-[var(--bg-overlay)] bg-[var(--bg-base)] lg:hidden">
          <MobileMenuButton onClick={() => setCollapsed(false)} />
          <Link href="/">
            <span
              className="ml-3 font-bold text-[15px] text-[var(--text-primary)] tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              F1 Dashboard
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-2.5">
            <div className="live-dot" aria-hidden="true" />
            <span className="text-[11px] font-semibold text-[var(--status-live)] tracking-wide uppercase">Live</span>
          </div>
        </header>

        {/* Main content */}
        <main
          className={cn(
            "flex-1 min-w-0 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
            collapsed ? "lg:ml-[4.5rem]" : "lg:ml-[17rem]",
            "ml-0"
          )}
          role="main"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
