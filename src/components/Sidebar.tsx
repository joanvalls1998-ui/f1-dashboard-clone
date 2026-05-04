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
  GripVertical,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { useState, useCallback } from "react";

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

/* ═══════════════ Subcomponents ═══════════════ */

/** Tooltip que apareix al passar el ratolí sobre items quan el sidebar està col·lapsat */
function CollapsedTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="group relative isolate">
      {children}
      <span
        className={cn(
          "pointer-events-none absolute left-[calc(100%+12px)] top-1/2 z-[100] -translate-y-1/2",
          "rounded-md bg-[#1a1a1e] px-3 py-1.5 text-xs font-medium text-[#fafafa]",
          "border border-[#27272a] shadow-lg",
          "opacity-0 translate-x-[-4px] transition-all duration-200 ease-out",
          "group-hover:opacity-100 group-hover:translate-x-0",
          "lg:block hidden",
          "whitespace-nowrap"
        )}
        role="tooltip"
      >
        {label}
        {/* Arrow */}
        <span
          className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 -rotate-45 w-1.5 h-1.5 bg-[#1a1a1e] border-l border-b border-[#27272a]"
        />
      </span>
    </div>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors duration-200"
      aria-label="Obrir menú de navegació"
      aria-expanded="false"
      aria-controls="sidebar-navigation"
    >
      <Menu className="w-5 h-5" aria-hidden="true" />
    </button>
  );
}

/* ═══════════════ Sidebar Principal ═══════════════ */

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Per defecte totes les seccions obertes excepte les últimes quan hi ha molts items
  const isExpanded = useCallback((label: string, itemCount: number) => {
    if (expandedSections[label] !== undefined) return expandedSections[label];
    return true; // Per defecte obertes
  }, [expandedSections]);

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <>
      {/* ── Overlay mòbil ── */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar base ── */}
      <aside
        id="sidebar-navigation"
        className={cn(
          "fixed left-0 top-0 z-40 h-dvh flex flex-col",
          "bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)]",
          "transition-[width] duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
          collapsed ? "w-[4.5rem]" : "w-[17rem]"
        )}
        aria-label="Barra lateral de navegació principal"
        role="navigation"
      >
        {/* ═══════ Capçalera / Logo ═══════ */}
        <div
          className={cn(
            "flex items-center shrink-0 border-b border-[var(--sidebar-border)]",
            collapsed ? "h-16 justify-center px-0" : "h-16 px-5"
          )}
        >
          <Link href="/" className="flex items-center gap-3 overflow-hidden" aria-label="F1 Dashboard - Inici">
            {/* Logo mark — sempre visible */}
            <div className="relative flex items-center justify-center shrink-0">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#E10600] to-[#b00500] flex items-center justify-center shadow-[0_0_12px_rgba(225,6,0,0.25)]">
                <span
                  className="text-white font-extrabold text-[10px] tracking-wider"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  F1
                </span>
              </div>
            </div>

            {/* Logo text */}
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                collapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-3"
              )}
            >
              <span
                className="font-bold text-[15px] tracking-tight text-[var(--text-primary)] whitespace-nowrap"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                F1 Dashboard
              </span>
            </div>

            {/* Botón cerrar móvil */}
            {!collapsed && (
              <button
                onClick={onToggle}
                className="ml-auto p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--sidebar-accent)] transition-all duration-200 lg:hidden"
                aria-label="Tancar menú"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            )}

            {/* Toggle desktop (solo cuando colapsado) */}
            {collapsed && (
              <button
                onClick={onToggle}
                className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-50 w-6 h-6 rounded-full bg-[#1a1a1e] border border-[var(--sidebar-border)] items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] hover:bg-[#27272a] transition-all duration-200 shadow-md"
                aria-label="Ampliar barra lateral"
                title="Ampliar barra lateral"
              >
                <Maximize2 className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
          </Link>
        </div>

        {/* ═══════ Botón colapsar/expandir (solo desktop cuando expandido) ═══════ */}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="hidden lg:flex mx-4 mt-2 mb-1 items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--sidebar-accent)] transition-all duration-200 border border-transparent hover:border-[var(--sidebar-border)]"
            aria-label="Colapsar barra lateral"
            title="Colapsar barra lateral (⌘ + [)"
          >
            <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="sr-only">Colapsar</span>
          </button>
        )}

        {/* ═══════ Navegació ═══════ */}
        <nav
          className="flex-1 overflow-y-auto overflow-x-hidden py-2 custom-scrollbar"
          aria-label="Navegació per categories"
        >
          <ul className={cn("space-y-4", collapsed ? "px-2" : "px-3")}>
            {navSections.map((section) => {
              const sectionExpanded = isExpanded(section.label, section.items.length);
              return (
                <li key={section.label}>
                  {/* Títol de secció (amagat quan col·lapsat) */}
                  {!collapsed && (
                    <button
                      onClick={() => toggleSection(section.label)}
                      className={cn(
                        "flex items-center justify-between w-full group/section",
                        "px-2.5 py-1.5 mb-1.5 text-[11px] font-semibold uppercase tracking-widest",
                        "text-[var(--text-muted)] hover:text-[var(--text-secondary)]",
                        "rounded-md transition-colors duration-200",
                        "focus-visible:outline-2 focus-visible:outline-[var(--accent-red)] focus-visible:outline-offset-0"
                      )}
                      aria-expanded={sectionExpanded}
                      aria-controls={`section-${section.label}`}
                    >
                      <span className="leading-none">{section.label}</span>
                      <span className="sr-only">
                        {sectionExpanded ? "Contraure secció" : "Expandir secció"}
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 opacity-60 group-hover/section:opacity-100 transition-transform duration-300",
                          sectionExpanded ? "rotate-0" : "-rotate-90"
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  )}

                  {/* Items de la secció */}
                  <ul
                    id={`section-${section.label}`}
                    className={cn(
                      "space-y-0.5",
                      collapsed ? "mt-0" : "mt-0",
                      sectionExpanded || collapsed ? "opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                    )}
                    style={
                      !collapsed
                        ? {
                            maxHeight: sectionExpanded ? `${section.items.length * 44 + 20}px` : "0px",
                            opacity: sectionExpanded ? 1 : 0,
                            overflow: "hidden",
                            transition: "max-height 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.25s ease-out",
                          }
                        : undefined
                    }
                  >
                    {section.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.href}>
                          <NavItemLink
                            item={item}
                            isActive={isActive}
                            collapsed={collapsed}
                            onNavigate={() => {
                              if (window.innerWidth < 1024) onToggle();
                            }}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ═══════ Footer ═══════ */}
        <div className="shrink-0 border-t border-[var(--sidebar-border)] py-3">
          <ul className={cn("space-y-0.5", collapsed ? "px-2" : "px-3")}>
            <li>
              <CollapsedTooltip label="Repositori GitHub">
                <a
                  href="https://github.com/joanvalls1998-ui/f1-dashboard-clone"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-3 rounded-lg text-sm font-medium",
                    "text-[var(--sidebar-fg)] hover:text-[var(--text-primary)]",
                    "hover:bg-[var(--sidebar-accent)] transition-all duration-200",
                    collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2"
                  )}
                  aria-label="Visita el repositori a GitHub (s'obre en una pestanya nova)"
                  title="GitHub"
                >
                  <Github className="w-5 h-5 shrink-0" aria-hidden="true" />
                  {!collapsed && (
                    <span className="truncate">GitHub</span>
                  )}
                </a>
              </CollapsedTooltip>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}

/* ═══════════════ NavItemLink ═══════════════ */

function NavItemLink({
  item,
  isActive,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  return (
    <CollapsedTooltip label={item.label}>
      <Link
        href={item.href}
        className={cn(
          "group relative flex items-center rounded-lg transition-all duration-200 outline-none",
          isActive
            ? "bg-[var(--sidebar-accent)] text-[var(--text-primary)] font-semibold"
            : "text-[var(--sidebar-fg)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--text-primary)]",
          collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
        )}
        aria-current={isActive ? "page" : undefined}
        aria-label={collapsed ? item.label : undefined}
        title={collapsed ? item.label : undefined}
        onClick={onNavigate}
      >
        {/* Indicador lateral actiu */}
        {isActive && (
          <span
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2",
              "w-[3px] rounded-r-full",
              "bg-gradient-to-b from-[#E10600] to-[#ff3b33]",
              "shadow-[0_0_10px_rgba(225,6,0,0.5)]",
              collapsed ? "h-5" : "h-6"
            )}
            aria-hidden="true"
          />
        )}

        {/* Glow subtle de fons per al actiu */}
        {isActive && !collapsed && (
          <span
            className="absolute inset-0 rounded-lg bg-[var(--accent-red-subtle)]"
            aria-hidden="true"
          />
        )}

        {/* Icona */}
        <item.icon
          className={cn(
            "shrink-0 transition-colors duration-200",
            isActive ? "text-[var(--accent-red)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]",
            collapsed ? "w-5 h-5" : "w-[18px] h-[18px]"
          )}
          aria-hidden="true"
        />

        {/* Text */}
        {!collapsed && (
          <span className="relative text-[13.5px] leading-snug truncate z-[1]">
            {item.label}
          </span>
        )}
      </Link>
    </CollapsedTooltip>
  );
}
