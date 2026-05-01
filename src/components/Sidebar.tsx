"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/lib/sidebar-context";
import {
  Trophy,
  Crown,
  User,
  Users,
  BarChart3,
  Swords,
  Activity,
  Flame,
  CircleDot,
  Wrench,
  Bomb,
  Dna,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Home,
  Radio,
  Clock,
  Cloud,
  Gauge,
  Flag,
  Map,
  TrendingUp,
  AlertTriangle,
  BarChart,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/live", label: "Live Timing", icon: Radio },
  { href: "/calendar", label: "Race Calendar", icon: Calendar },
  { href: "/standings", label: "Standings", icon: Trophy },
  { href: "/drivers", label: "Drivers", icon: User },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/driver-stats", label: "Driver Stats", icon: BarChart3 },
  { href: "/head-to-head", label: "Head to Head", icon: Swords },
  { href: "/driver-comparison", label: "Driver Comparison", icon: Activity },
  { href: "/race-pace", label: "Race Pace", icon: Flame },
  { href: "/sector-times", label: "Sector Times", icon: Clock },
  { href: "/intervals", label: "Intervals", icon: TrendingUp },
  { href: "/pit-stops", label: "Pit Stops", icon: CircleDot },
  { href: "/tyre-strategy", label: "Tyre Strategy", icon: Gauge },
  { href: "/speed-trap", label: "Speed Trap", icon: Gauge },
  { href: "/speed-histogram", label: "Speed Histogram", icon: BarChart },
  { href: "/qualifying", label: "Qualifying", icon: Flag },
  { href: "/starting-grid", label: "Starting Grid", icon: Flag },
  { href: "/race-history", label: "Race History", icon: Map },
  { href: "/weather", label: "Weather", icon: Cloud },
  { href: "/track-map", label: "Track Map", icon: Map },
  { href: "/season-stats", label: "Season Stats", icon: TrendingUp },
  { href: "/dnf", label: "DNF Tracker", icon: AlertTriangle },
  { href: "/tech-updates", label: "Tech Updates", icon: Wrench },
  { href: "/used-elements", label: "Used Elements", icon: Wrench },
  { href: "/destructors", label: "Destructors", icon: Bomb },
  { href: "/track-dna", label: "Track DNA", icon: Dna },
  { href: "/consistency", label: "Consistency", icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebar();

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
              href="https://github.com/joanvalls1998-ui/f1-dashboard-clone"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              title={collapsed ? "GitHub" : undefined}
            >
              <ScrollText className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">GitHub</span>}
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
