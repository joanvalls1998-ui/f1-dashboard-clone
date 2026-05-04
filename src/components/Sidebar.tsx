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
import { useState, useCallback, useEffect } from "react";

/* ═══════════════ Dades de navegació ═══════════════ */

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
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

/* ═══════════════ Tooltip desktop col·lapsat ═══════════════ */

function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="group/tooltip relative">
      {children}
      <span
        className={cn(
          "pointer-events-none absolute left-full top-1/2 z-[100] ml-2 -translate-y-1/2",
          "rounded-md bg-[#1a1a1e] px-3 py-1.5 text-xs font-medium text-white",
          "border border-[#27272a] shadow-xl",
          "opacity-0 translate-x-[-4px] transition-all duration-200",
          "group-hover/tooltip:opacity-100 group-hover/tooltip:translate-x-0",
          "hidden lg:block whitespace-nowrap"
        )}
        role="tooltip"
      >
        {label}
        <span className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 -rotate-45 w-1.5 h-1.5 bg-[#1a1a1e] border-l border-b border-[#27272a]" />
      </span>
    </div>
  );
}

/* ═══════════════ Botó mòbil ═══════════════ */

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

/* ═══════════════ Sidebar ═══════════════ */

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  /* ── Overlay mòbil ── */
  const showOverlay = !collapsed;

  /* ── Classe de l'aside segons estat ── */
  // Mòbil: obert = w-screen (tota pantalla), tancat = fora pantalla
  // Desktop: col·lapsat (w-16) o expandit (w-64)
  const asideClass = cn(
    "fixed left-0 top-0 z-40 h-dvh flex flex-col",
    "bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)]",
    "transition-transform duration-300 ease-out lg:transition-[width]",
    // Mòbil:
    collapsed ? "-translate-x-full w-screen" : "translate-x-0 w-screen",
    // Desktop:
    "lg:translate-x-0",
    collapsed ? "lg:w-16" : "lg:w-64"
  );

  return (
    <>
      {/* Overlay */}
      {showOverlay && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onToggle}
        />
      )}

      <aside className={asideClass} aria-label="Navegació principal">
        {/* Capçalera */}
        <div className="flex items-center h-16 px-4 border-b border-[var(--sidebar-border)] shrink-0">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            {/* Logo */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#E10600] to-[#b00500] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(225,6,0,0.25)]">
              <span className="text-white font-extrabold text-[10px] tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                F1
              </span>
            </div>
            {/* Títol — amagat només al desktop col·lapsat */}
            <span
              className={cn(
                "font-bold text-[15px] tracking-tight text-[var(--text-primary)] whitespace-nowrap transition-opacity duration-300",
                collapsed ? "lg:opacity-0 lg:w-0" : "opacity-100"
              )}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              F1 Dashboard
            </span>
          </Link>

          {/* Tancar (mòbil només) */}
          {!collapsed && (
            <button
              onClick={onToggle}
              className="ml-auto p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--sidebar-accent)] transition-colors lg:hidden"
              aria-label="Tancar menú"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navegació */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-3" aria-label="Navegació per categories">
          <ul className="space-y-5">
            {navSections.map((section) => {
              const isOpen = expandedSections[section.label] ?? true;
              return (
                <li key={section.label}>
                  {/* Títol secció — amagat al desktop col·lapsat */}
                  <button
                    onClick={() => toggleSection(section.label)}
                    className={cn(
                      "flex items-center justify-between w-full text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors mb-1",
                      collapsed ? "lg:hidden" : ""
                    )}
                    aria-expanded={isOpen}
                  >
                    <span>{section.label}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", isOpen ? "" : "-rotate-90")} />
                  </button>

                  {/* Items */}
                  <ul
                    className={cn(
                      "space-y-0.5 overflow-hidden transition-all duration-300",
                      isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    {section.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.href}>
                          <Tooltip label={item.label}>
                            <Link
                              href={item.href}
                              className={cn(
                                "group relative flex items-center rounded-lg transition-all duration-200",
                                isActive
                                  ? "bg-[var(--sidebar-accent)] text-[var(--text-primary)] font-semibold"
                                  : "text-[var(--sidebar-fg)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--text-primary)]",
                              // Mòbil sempre expandit:
                              "gap-3 px-3 py-2.5",
                              // Desktop col·lapsat: només icona centrada
                              collapsed && "lg:justify-center lg:px-2 lg:py-2.5 lg:gap-0"
                              )}
                              aria-current={isActive ? "page" : undefined}
                              onClick={() => {
                                if (window.innerWidth < 1024) onToggle();
                              }}
                            >
                              {/* Indicador actiu */}
                              {isActive && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-[#E10600] to-[#ff3b33] shadow-[0_0_8px_rgba(225,6,0,0.4)]" />
                              )}

                              <item.icon
                                className={cn(
                                  "shrink-0 transition-colors",
                                  isActive ? "text-[var(--accent-red)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]",
                                  "w-[18px] h-[18px]"
                                )}
                              />

                              {/* Text — amagat al desktop col·lapsat */}
                              <span
                                className={cn(
                                  "text-[13.5px] leading-snug truncate transition-opacity duration-200",
                                  collapsed ? "lg:hidden" : ""
                                )}
                              >
                                {item.label}
                              </span>
                            </Link>
                          </Tooltip>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-[var(--sidebar-border)] py-3 px-3">
          <Tooltip label="GitHub">
            <a
              href="https://github.com/joanvalls1998-ui/f1-dashboard-clone"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-3 rounded-lg text-sm text-[var(--sidebar-fg)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--text-primary)] transition-all duration-200",
                collapsed ? "lg:justify-center lg:px-2 lg:py-2.5" : "px-3 py-2"
              )}
            >
              <Github className="w-5 h-5 shrink-0" />
              <span className={cn("truncate", collapsed ? "lg:hidden" : "")}>GitHub</span>
            </a>
          </Tooltip>
        </div>
      </aside>
    </>
  );
}
