"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Trophy,
  Crown,
  IdCard,
  Users,
  BarChart3,
  Swords,
  Activity,
  Flame,
  Wrench,
  CircleDot,
  Bomb,
  Dna,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Home,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/calendar", label: "Race Calendar", icon: Calendar },
  { href: "/standings", label: "Driver Standings", icon: Trophy },
  { href: "/constructors", label: "Constructor Standings", icon: Crown },
  { href: "/drivers", label: "Drivers", icon: IdCard },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/driver-stats", label: "Driver Stats", icon: BarChart3 },
  { href: "/head-to-head", label: "Head To Head", icon: Swords },
  { href: "/consistency", label: "Consistency", icon: Activity },
  { href: "/race-pace", label: "Race Pace", icon: Flame },
  { href: "/pit-stops", label: "Pit Stops", icon: CircleDot },
  { href: "/tech-updates", label: "Tech Updates", icon: Wrench },
  { href: "/used-elements", label: "Used Elements", icon: Wrench },
  { href: "/destructors", label: "Destructors Championship", icon: Bomb },
  { href: "/track-dna", label: "Track DNA", icon: Dna },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
            <span className="text-white font-bold text-sm">F1</span>
          </div>
          {!collapsed && (
            <span className="font-bold text-sidebar-foreground whitespace-nowrap">
              F1 Dashboard
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border py-4 px-2">
        <ul className="space-y-1">
          <li>
            <a
              href="https://formula1dashboard.canny.io/feature-requests"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              title={collapsed ? "Feedback" : undefined}
            >
              <ScrollText className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">Feedback</span>}
            </a>
          </li>
        </ul>

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full mt-2 p-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </aside>
  );
}
