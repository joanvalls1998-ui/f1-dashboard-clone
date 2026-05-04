"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Trophy,
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
  Zap,
  Star,
  Settings,
  X,
  ChevronDown,
  Github,
  Menu,
} from "lucide-react";
import { useState } from "react";

/* ────────────────────── dades ────────────────────── */

const navItems = [
  {
    label: "Inici",
    items: [
      { href: "/", label: "Inici", icon: Home },
      { href: "/news", label: "Notícies", icon: ScrollText },
      { href: "/calendar", label: "Calendari", icon: Calendar },
    ],
  },
  {
    label: "Classificació",
    items: [
      { href: "/standings", label: "Pilots", icon: Trophy },
      { href: "/constructors", label: "Constructors", icon: Gauge },
    ],
  },
  {
    label: "Temps Real",
    items: [
      { href: "/live", label: "Directe", icon: Radio },
      { href: "/speed-trap", label: "Radar", icon: Gauge },
      { href: "/intervals", label: "Intervals", icon: TrendingUp },
      { href: "/pit-stops", label: "Parades", icon: CircleDot },
      { href: "/tyre-strategy", label: "Estratègia", icon: Flame },
    ],
  },
  {
    label: "Anàlisi",
    items: [
      { href: "/race-pace", label: "Ritme", icon: Flame },
      { href: "/sector-times", label: "Sectors", icon: Clock },
      { href: "/qualifying", label: "Quali", icon: Flag },
      { href: "/starting-grid", label: "Grill Sortida", icon: Flag },
      { href: "/race-history", label: "Històric", icon: Map },
      { href: "/weather", label: "Temps", icon: Cloud },
      { href: "/track-map", label: "Circuit", icon: Map },
    ],
  },
  {
    label: "Estadístiques",
    items: [
      { href: "/drivers", label: "Pilots", icon: User },
      { href: "/teams", label: "Equips", icon: Users },
      { href: "/driver-stats", label: "Stats Pilots", icon: BarChart3 },
      { href: "/head-to-head", label: "Cara a Cara", icon: Swords },
      { href: "/driver-comparison", label: "Comparativa", icon: Activity },
      { href: "/season-stats", label: "Temporada", icon: TrendingUp },
      { href: "/dnf", label: "Abandonaments", icon: AlertTriangle },
    ],
  },
  {
    label: "Especials",
    items: [
      { href: "/predictions", label: "Prediccions", icon: Zap },
      { href: "/favorito", label: "Favorit", icon: Star },
      { href: "/home-intel", label: "Intel·ligència", icon: Settings },
      { href: "/engineer", label: "Enginyer", icon: Wrench },
      { href: "/race-mode", label: "Mode Cursa", icon: Flag },
      { href: "/speed-histogram", label: "Histograma", icon: BarChart },
      { href: "/tech-updates", label: "Tecnologia", icon: Wrench },
      { href: "/used-elements", label: "Elements", icon: Wrench },
      { href: "/destructors", label: "Destructors", icon: Bomb },
      { href: "/track-dna", label: "ADN Circuit", icon: Dna },
      { href: "/consistency", label: "Consistència", icon: Activity },
    ],
  },
];

/* ────────────────── subcomponents ────────────────── */

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
      aria-label="Obrir menú"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}

/* ──────────────────── sidebar ────────────────────── */

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen flex flex-col transition-all duration-300",
          "bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)]",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-[var(--sidebar-border)]">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-red)] flex items-center justify-center shrink-0">
              <span
                className="text-white font-bold text-xs"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                F1
              </span>
            </div>
            {!collapsed && (
              <span
                className="font-bold text-[var(--text-primary)] whitespace-nowrap"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                F1 Dashboard
              </span>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={onToggle}
              className="ml-auto p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--sidebar-accent)] transition-colors lg:hidden"
              aria-label="Tancar menú"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 overflow-y-auto py-2 px-2"
          aria-label="Navegació principal"
        >
          <ul className="space-y-2">
            {navItems.map((section) => (
              <li key={section.label}>
                {!collapsed && (
                  <button
                    onClick={() => toggleSection(section.label)}
                    className="flex items-center justify-between w-full px-2 py-1 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hover:text-[var(--text-primary)] transition-colors"
                    aria-expanded={expandedSections[section.label] ?? true}
                  >
                    <span>{section.label}</span>
                    <ChevronDown
                      className={cn(
                        "w-3 h-3 transition-transform",
                        expandedSections[section.label] === false
                          ? "-rotate-90"
                          : ""
                      )}
                    />
                  </button>
                )}
                <ul
                  className={cn(
                    "space-y-0.5",
                    collapsed ? "mt-2" : "mt-1",
                    expandedSections[section.label] === false && !collapsed
                      ? "hidden"
                      : ""
                  )}
                >
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                            "hover:bg-[var(--sidebar-accent)]",
                            isActive
                              ? "bg-[var(--sidebar-accent)] text-[var(--text-primary)] font-medium"
                              : "text-[var(--sidebar-fg)] hover:text-[var(--text-primary)]"
                          )}
                          title={collapsed ? item.label : undefined}
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => {
                            if (window.innerWidth < 1024) onToggle();
                          }}
                        >
                          <item.icon
                            className={cn(
                              "w-5 h-5 shrink-0 transition-colors",
                              isActive ? "text-[var(--accent-red)]" : ""
                            )}
                          />
                          {!collapsed && (
                            <span className="truncate">{item.label}</span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-[var(--sidebar-border)] py-3 px-2">
          <ul className="space-y-0.5">
            <li>
              <a
                href="https://github.com/joanvalls1998-ui/f1-dashboard-clone"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--sidebar-fg)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--text-primary)] transition-all duration-150"
                title={collapsed ? "GitHub" : undefined}
              >
                <Github className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="truncate">GitHub</span>}
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
