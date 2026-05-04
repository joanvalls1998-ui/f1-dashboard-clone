# F1 Dashboard — Design Specification

## 1. Visual Theme & Atmosphere

**Direction:** Premium F1 Data Terminal — dark, precise, data-rich. Inspired by the F1 TV app meets Linear's clean density. Dark-first with team color accents that shift by context. Every surface feels like a broadcast graphics package: bold typography, purposeful color, zero clutter.

**Adjective pairs:** Precise / Bold · Data-rich / Readable · Dark / Vibrant
**Anti-AI-slop rule:** No purple gradients. No rounded-pill everything. F1 means sharp edges, red accents, carbon-fibre texture hints.

---

## 2. Color Palette & Roles

```css
/* === BASE === */
--bg-base: #09090b;           /* zinc-950 — deepest background */
--bg-surface: #18181b;        /* zinc-900 — cards, panels */
--bg-elevated: #27272a;       /* zinc-800 — hover states, active */
--bg-overlay: #3f3f46;         /* zinc-700 — borders, dividers */

/* === TEXT === */
--text-primary: #fafafa;       /* zinc-50 */
--text-secondary: #a1a1aa;     /* zinc-400 */
--text-muted: #52525b;         /* zinc-600 */

/* === F1 BRAND ACCENT === */
--accent-red: #E10600;         /* F1 official red */
--accent-red-dim: #E1060040;  /* F1 red @ 25% alpha — backgrounds */

/* === STATUS === */
--status-live: #22c55e;        /* green-500 */
--status-upcoming: #3b82f6;   /* blue-500 */
--status-completed: #a1a1aa;   /* zinc-400 */

/* === PODIUM === */
--podium-gold: #eab308;       /* yellow-500 */
--podium-silver: #d4d4d8;      /* zinc-300 */
--podium-bronze: #cd7f32;     /* bronze */

/* === TYRE COLOURS === */
--tyre-hard: #f5f5f5;
--tyre-medium: #facc15;
--tyre-soft: #ef4444;
--tyre-inter: #2563eb;
--tyre-wet: #06b6d4;
```

### Team Colors (CSS variables)
```css
--team-mercedes: #27F4D2;
--team-ferrari: #FF1800;
--team-mclaren: #FF8700;
--team-redbull: #3671C6;
--team-haas: #C92D28;
--team-rb: #203F94;
--team-alpine: #FF87BC;
--team-audi: #E11A2B;
--team-williams: #64C4FF;
--team-cadillac: #C80029;
--team-aston: #0072FF;
```

**Usage rule:** All color values MUST be CSS variables. Zero hardcoded hex in components except `teamColors` map in `f1-assets.ts`.

---

## 3. Typography Rules

**Font families (via Google Fonts):**
- Headings: `"Plus Jakarta Sans"` — weights 600, 700, 800
- Body/Data: `"Inter"` — weights 400, 500, 600
- Monospace (numbers, codes): `"JetBrains Mono"` — weight 500

```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
```

**Type scale:**
| Element | Size | Weight | Font |
|---------|------|--------|------|
| Page title | 2.5rem | 800 | Plus Jakarta Sans |
| Section heading | 1.5rem | 700 | Plus Jakarta Sans |
| Card title | 1.125rem | 600 | Plus Jakarta Sans |
| Body | 0.875rem | 400 | Inter |
| Data/number | 0.875rem | 500 | JetBrains Mono |
| Label/caption | 0.75rem | 500 | Inter |
| Eyebrow | 0.75rem | 600 | Inter, uppercase, tracking-widest |

**Forbidden fonts:** Arial, Roboto, system-ui defaults.

---

## 4. Component Stylings

### Card (base)
```css
.card {
  background: var(--bg-surface);
  border: 1px solid var(--bg-overlay);
  border-radius: 12px;      /* NOT 9999px — keep slight rounding, not pill */
  padding: 1.25rem;         /* 20px */
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  border-color: var(--accent-red-dim);
  box-shadow: 0 0 0 1px var(--accent-red-dim);
}
```

### Button (primary)
```css
.btn-primary {
  background: var(--accent-red);
  color: white;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: opacity 0.15s ease, transform 0.1s ease;
}
.btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-primary:active { transform: translateY(0); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
```

### Button (ghost/secondary)
```css
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--bg-overlay);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}
.btn-ghost:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
  border-color: var(--text-muted);
}
```

### Tab navigation
```css
.tab-item {
  padding: 0.75rem 1rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-secondary);
  border-bottom: 2px solid transparent;
  transition: color 0.15s ease, border-color 0.15s ease;
}
.tab-item:hover { color: var(--text-primary); }
.tab-item.active {
  color: var(--text-primary);
  border-bottom-color: var(--accent-red);
}
```

### Stat number (JetBrains Mono)
```css
.stat-number {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  font-size: 1.25rem;
  color: var(--text-primary);
}
.stat-label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}
```

### Team color dot
```css
.team-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
```

### Podium block
```css
.podium-block {
  background: linear-gradient(to top, var(--bg-elevated), var(--bg-surface));
  border-top: 3px solid var(--podium-color);
  border-radius: 8px 8px 0 0;
  padding: 0.5rem;
  text-align: center;
}
```

---

## 5. Layout Principles

**Sidebar:** Fixed 256px (desktop), 64px (collapsed), 0px (mobile overlay). Sidebar bg = `--bg-surface`.

**Main content offset:** `pl-64` on desktop (sidebar open), transitions smoothly.

**Page max-width:** `max-w-7xl mx-auto` centered in main area.

**Grid system:**
- Quick stats: `grid-cols-2 md:grid-cols-4`
- Team cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Driver grid: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6`

**Spacing scale:** 4px base unit. Use `gap-3` (12px), `gap-4` (16px), `gap-6` (24px), `p-6` (24px) consistently.

**Card padding:** `p-5` (20px) standard, `p-6` (24px) for larger cards.

---

## 6. Depth & Elevation

**Shadow system (Tailwind custom):**
```css
/* soft card shadow */
shadow-card: 0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3);

/* elevated (modals, dropdowns) */
shadow-elevated: 0 10px 15px -3px rgba(0,0,0,0.5), 0 4px 6px -2px rgba(0,0,0,0.3);

/* glow for live indicator */
shadow-live: 0 0 12px rgba(34, 197, 94, 0.4);
```

**Border:** `1px solid var(--bg-overlay)` — no harsh white borders, no pure black borders.

**Dividers:** `border-t border-[var(--bg-overlay)]` on section separators.

---

## 7. Animation & Interaction

**Level: L1 (精致静态) — minimum for all pages**

### Entrance animation (page load)
```css
/* Staggered fadeInUp for list items */
.animate-enter {
  animation: fadeInUp 0.4s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Stagger delay: nth-child(1) = 0ms, nth-child(2) = 50ms, nth-child(3) = 100ms, etc. */
.animate-enter:nth-child(1) { animation-delay: 0ms; }
.animate-enter:nth-child(2) { animation-delay: 50ms; }
.animate-enter:nth-child(3) { animation-delay: 100ms; }
.animate-enter:nth-child(4) { animation-delay: 150ms; }
.animate-enter:nth-child(5) { animation-delay: 200ms; }
.animate-enter:nth-child(6) { animation-delay: 250ms; }
```

### Hover micro-interactions
```css
/* Card lift on hover */
.card-interactive {
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.card-interactive:hover {
  transform: translateY(-2px);
  box-shadow: shadow-card;
  border-color: var(--accent-red-dim);
}

/* Button press */
.btn-press:active { transform: scale(0.97); }

/* Live pulse dot */
.live-dot {
  animation: livePulse 2s ease-in-out infinite;
}
@keyframes livePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Tab underline slide
```css
/* Underline slides between tabs — use CSS translate on a pseudo-element */
.tab-nav { position: relative; }
.tab-indicator {
  position: absolute;
  bottom: 0;
  height: 2px;
  background: var(--accent-red);
  transition: left 0.2s ease, width 0.2s ease;
}
```

### `prefers-reduced-motion` fallback
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Do's and Don'ts

### Do's
- ✅ Use `var(--bg-surface)` for cards, `var(--bg-base)` for page background
- ✅ Use `Plus Jakarta Sans` for all headings
- ✅ Use `JetBrains Mono` for all numbers and driver codes (abbreviation, points, laps)
- ✅ Show live indicator with `shadow-live` glow + `live-dot` pulse animation
- ✅ Apply `animate-enter` stagger to all list items (driver rows, team cards, race calendar rows)
- ✅ Use team color variables on colored elements (bars, dots, borders)
- ✅ Use `card-interactive` class on all clickable cards
- ✅ Apply `btn-press` to all buttons for tactile press feedback
- ✅ Eyebrow labels in uppercase with `tracking-widest`
- ✅ Respect `prefers-reduced-motion`

### Don'ts
- ❌ Hardcode `bg-[#0a0a0a]`, `bg-[#1a1a1a]`, `bg-[#171717]` in components — use CSS variables
- ❌ Use `text-gray-500` for muted text — use `var(--text-muted)` or Tailwind's `text-zinc-600`
- ❌ Use `border-gray-700/800` — use `var(--bg-overlay)`
- ❌ Use emoji in UI (🏆 💨 🏎️) — use lucide-react icons with team color tinting
- ❌ Use `rounded-full` on cards — use `rounded-xl` (12px) max
- ❌ Use `font-bold` — use `font-semibold` (600) or `font-extrabold` (800) explicitly
- ❌ Use `animate-pulse` from Tailwind for the live dot — use custom `live-dot` class
- ❌ Put raw numbers without `JetBrains Mono` font for data values

---

## 9. Responsive Behavior

**Breakpoints:**
| Breakpoint | Width | Sidebar | Grid cols |
|------------|-------|---------|-----------|
| Mobile | < 640px | Hidden overlay | 1–2 cols |
| Tablet | 640–1024px | Collapsed (64px) | 2–3 cols |
| Desktop | > 1024px | Full (256px) | 3–6 cols |

**Mobile sidebar:** Overlay from left, backdrop blur on content when open. Hamburger icon in header.

**Touch targets:** All interactive elements minimum `44×44px`.

**Horizontal overflow:** Mobile (≤ 640px) must have zero horizontal overflow — test every page.

---

## Implementation Priority

1. **globals.css** — Define all CSS variables, font imports, shadow system
2. **Sidebar** — Clean up styling with CSS vars, add hover states
3. **Home page** — Apply typography scale, fadeInUp animations, card-interactive classes
4. **Shared components** (TeamCard, CircuitCard, DriverRow) — CSS vars + animate-enter
5. **All other pages** — Consistent spacing, typography, animations
