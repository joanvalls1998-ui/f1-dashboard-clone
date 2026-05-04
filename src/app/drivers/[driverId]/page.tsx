import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import {
  Trophy,
  Flag,
  Calendar,
  Hash,
  Globe,
  Award,
  TrendingUp,
  Timer,
  Zap,
  ChevronRight,
} from "lucide-react";

interface DriverDetail {
  driverId: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
  permanentNumber?: string;
  code: string;
  url: string;
}

interface DriverStanding {
  position: string;
  wins: string;
  points: string;
  Constructor: {
    constructorId: string;
    name: string;
  };
}

interface RaceResult {
  round: string;
  raceName: string;
  circuitName: string;
  date: string;
  position: string;
  points: string;
  grid: string;
  status: string;
  Time?: { time: string };
  FastestLap?: { rank: string; Time: { time: string } };
}

async function fetchDriverInfo(driverId: string): Promise<DriverDetail> {
  const res = await fetch(
    `https://api.jolpi.ca/ergast/f1/drivers/${driverId}.json`,
    { next: { revalidate: 86400 } }
  );
  if (!res.ok) notFound();
  const data = await res.json();
  const driver = data.MRData?.DriverTable?.Drivers?.[0];
  if (!driver) notFound();
  return driver;
}

async function fetchDriverStandings(driverId: string): Promise<DriverStanding | null> {
  const res = await fetch(
    `https://api.jolpi.ca/ergast/f1/2026/drivers/${driverId}/driverStandings.json`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.[0] || null;
}

async function fetchDriverResults(driverId: string): Promise<RaceResult[]> {
  const res = await fetch(
    `https://api.jolpi.ca/ergast/f1/2026/drivers/${driverId}/results.json`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  const races = data.MRData?.RaceTable?.Races || [];
  return races.map((r: any) => ({
    round: r.round,
    raceName: r.raceName,
    circuitName: r.Circuit.circuitName,
    date: r.date,
    position: r.Results[0]?.position || "NC",
    points: r.Results[0]?.points || "0",
    grid: r.Results[0]?.grid || "0",
    status: r.Results[0]?.status || "Unknown",
    Time: r.Results[0]?.Time,
    FastestLap: r.Results[0]?.FastestLap,
  }));
}

export async function generateMetadata({ params }: { params: { driverId: string } }): Promise<Metadata> {
  const driver = await fetchDriverInfo(params.driverId);
  const fullName = `${driver.givenName} ${driver.familyName}`;
  return {
    title: `${fullName} — Pilot F1 2026`,
    description: `Estadístiques, resultats i palmarès de ${fullName} (${driver.nationality}) a la temporada 2026 de Fórmula 1.`,
    openGraph: {
      title: `${fullName} — Pilot F1 2026`,
      description: `Estadístiques, resultats i palmarès de ${fullName} (${driver.nationality}) a la temporada 2026 de Fórmula 1.`,
    },
  };
}

function jsonLdPerson(driver: DriverDetail, standing: DriverStanding | null): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: `${driver.givenName} ${driver.familyName}`,
    nationality: { "@type": "Country", name: driver.nationality },
    birthDate: driver.dateOfBirth,
    url: driver.url,
    ...(standing && {
      jobTitle: `${standing.Constructor.name} F1 Driver`,
      memberOf: { "@type": "SportsTeam", name: standing.Constructor.name },
    }),
  };
  return JSON.stringify(schema);
}

const teamLogos: Record<string, string> = {
  red_bull: "Red Bull",
  mercedes: "Mercedes",
  ferrari: "Ferrari",
  mclaren: "McLaren",
  alpine: "Alpine",
  aston_martin: "Aston Martin",
  rb: "RB",
  haas: "Haas",
  sauber: "Kick Sauber",
  williams: "Williams",
};

export default async function DriverPage({ params }: { params: { driverId: string } }) {
  const driver = await fetchDriverInfo(params.driverId);
  const standing = await fetchDriverStandings(params.driverId);
  const results = await fetchDriverResults(params.driverId);

  const fullName = `${driver.givenName} ${driver.familyName}`;
  const driverImage = `https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/${driver.familyName.replace(/\s/g, '_')}_%28${driver.givenName.replace(/\s/g, '_')}%29.jpg/440px-${driver.familyName.replace(/\s/g, '_')}_%28${driver.givenName.replace(/\s/g, '_')}%29.jpg`;
  const flagUrl = `https://flagsapi.com/${getCountryCode(driver.nationality)}/flat/64.png`;

  return (
    <div className="space-y-8">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdPerson(driver, standing) }}
      />

      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <span>Pilots</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[var(--text-primary)] font-medium">{fullName}</span>
      </div>

      {/* Profile card */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: 'linear-gradient(145deg, var(--bg-elevated), var(--bg-surface))' }}>
        <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
          {/* Photo */}
          <div className="shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-2 border-[var(--sidebar-border)] bg-[var(--bg-base)] relative">
              <Image
                src={driverImage}
                alt={fullName}
                fill
                className="object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect fill="%231a1a1a" width="160" height="160"/><text fill="%23555" font-family="system-ui" font-size="48" text-anchor="middle" x="80" y="95">' + driver.code + '</text></svg>'; }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                  {fullName}
                </h1>
                <Image src={flagUrl} alt={driver.nationality} width={32} height={24} className="rounded-sm" />
              </div>
              <p className="text-[var(--text-muted)]">{driver.nationality} · {standing?.Constructor.name || "F1 Pilot"}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon={<Hash className="w-4 h-4" />} label="Número" value={`#${driver.permanentNumber || driver.code}`} />
              <StatCard icon={<Calendar className="w-4 h-4" />} label="Data naixement" value={driver.dateOfBirth} />
              <StatCard icon={<Globe className="w-4 h-4" />} label="Nacionalitat" value={driver.nationality} />
              <StatCard icon={<Award className="w-4 h-4" />} label="Codi" value={driver.code} />
            </div>
          </div>
        </div>
      </div>

      {/* Season stats */}
      {standing && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <BigStat icon={<Trophy className="w-5 h-5 text-yellow-500" />} label="Posició" value={`${standing.position}º`} />
          <BigStat icon={<TrendingUp className="w-5 h-5 text-emerald-500" />} label="Punts" value={standing.points} />
          <BigStat icon={<Flag className="w-5 h-5 text-blue-500" />} label="Victòries" value={standing.wins} />
          <BigStat icon={<Zap className="w-5 h-5 text-amber-500" />} label="Curses" value={`${results.length}`} />
        </div>
      )}

      {/* Results table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Timer className="w-5 h-5 text-[var(--accent-red)]" />
          Resultats 2026
        </h2>

        {results.length === 0 ? (
          <EmptyState message="Encara no hi ha resultats per aquesta temporada" />
        ) : (
          <div className="rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--sidebar-border)] bg-[var(--bg-elevated)]">
                    <th className="px-4 py-3 text-left font-medium text-[var(--text-muted)]">RND</th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--text-muted)]">Cursa</th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--text-muted)]">Data</th>
                    <th className="px-4 py-3 text-center font-medium text-[var(--text-muted)]">Grill</th>
                    <th className="px-4 py-3 text-center font-medium text-[var(--text-muted)]">Pos</th>
                    <th className="px-4 py-3 text-center font-medium text-[var(--text-muted)]">Punts</th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--text-muted)]">Estat</th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--text-muted)]">Temps</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr
                      key={r.round}
                      className="border-b border-[var(--sidebar-border)] hover:bg-[var(--sidebar-accent)] transition-colors"
                    >
                      <td className="px-4 py-3 text-[var(--text-muted)]">{r.round}</td>
                      <td className="px-4 py-3 font-medium">{r.raceName}</td>
                      <td className="px-4 py-3 text-[var(--text-muted)]">{r.date}</td>
                      <td className="px-4 py-3 text-center">{r.grid}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs ${
                          r.position === "1" ? "bg-yellow-500/20 text-yellow-500" :
                          r.position === "2" ? "bg-gray-400/20 text-gray-300" :
                          r.position === "3" ? "bg-amber-600/20 text-amber-500" :
                          "bg-[var(--bg-overlay)] text-[var(--text-primary)]"
                        }`}>
                          {r.position}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-medium">{r.points}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-3 text-[var(--text-muted)] font-mono text-xs">{r.Time?.time || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl border bg-[var(--bg-surface)] space-y-1">
      <div className="flex items-center gap-2 text-[var(--text-muted)]">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-sm font-semibold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

function BigStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-5 rounded-2xl border bg-[var(--bg-elevated)] text-center space-y-2">
      <div className="flex justify-center">{icon}</div>
      <div className="text-2xl md:text-3xl font-bold">{value}</div>
      <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const finished = status.includes("Finished") || /^\+/.test(status);
  const dnf = status.includes("Accident") || status.includes("Collision") || status.includes("Retired") || status.includes("Damage");
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
      finished ? "bg-emerald-500/10 text-emerald-500" :
      dnf ? "bg-red-500/10 text-red-500" :
      "bg-amber-500/10 text-amber-500"
    }`}>
      {status}
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)]">
      <Flag className="w-12 h-12 mb-4 opacity-30" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

function getCountryCode(nationality: string): string {
  const map: Record<string, string> = {
    British: "GB", German: "DE", Italian: "IT", Spanish: "ES", French: "FR",
    Dutch: "NL", Australian: "AU", Finnish: "FI", Danish: "DK", Monegasque: "MC",
    Canadian: "CA", Mexican: "MX", Japanese: "JP", Chinese: "CN", Thai: "TH",
    American: "US", Brazilian: "BR", Argentinian: "AR", Belgian: "BE", Swedish: "SE",
    Swiss: "CH", Austrian: "AT", Polish: "PL", Portuguese: "PT", Russian: "RU",
    Hungarian: "HU", Czech: "CZ", "New Zealander": "NZ",
  };
  return map[nationality] || "UN";
}
