"use client";

import { useState, useEffect } from "react";
import { Radio, Gauge, RefreshCw, ExternalLink, Calendar } from "lucide-react";

interface LiveDriver {
  driver_number: number;
  last_name: string;
  team_name: string;
  team_color: string;
  position: number;
  gap_to_leader: string;
  interval: string;
  current_lap: number;
  current_lap_time: string;
  speed: number;
  sector_1_time: string;
  sector_2_time: string;
  sector_3_time: string;
  pit_lap: number;
  tyre: string;
}

interface Session {
  session_key: number;
  session_type: string;
  session_name: string;
  date_start: string;
  date_end: string;
  circuit_short_name: string;
  country_name: string;
  location: string;
  is_cancelled: boolean;
}

interface F1DashboardSession {
  session_key: number;
  session_name: string;
  session_type: string;
  date_start: string;
  date_end: string;
  year: number;
  grand_prix: {
    city: string;
    country: string;
    circuit_track: string;
  };
}

const TYRE_COLORS: Record<string, string> = {
  "SOFT": "#ff3333",
  "MEDIUM": "#ffff33",
  "HARD": "#ffffff",
  "INTER": "#33ff33",
  "WET": "#3399ff",
  "UNKNOWN": "#666666"
};

// Mock data for when API is not available
const mockLiveDrivers: LiveDriver[] = [
  { driver_number: 12, last_name: "ANT", team_name: "Mercedes", team_color: "27f4d2", position: 1, gap_to_leader: "--", interval: "--", current_lap: 42, current_lap_time: "1:32.456", speed: 285, sector_1_time: "28.123", sector_2_time: "32.456", sector_3_time: "31.877", pit_lap: 18, tyre: "MEDIUM" },
  { driver_number: 63, last_name: "RUS", team_name: "Mercedes", team_color: "27f4d2", position: 2, gap_to_leader: "+2.847", interval: "+2.847", current_lap: 42, current_lap_time: "1:32.678", speed: 283, sector_1_time: "28.234", sector_2_time: "32.567", sector_3_time: "31.877", pit_lap: 18, tyre: "MEDIUM" },
  { driver_number: 16, last_name: "LEC", team_name: "Ferrari", team_color: "e8002d", position: 3, gap_to_leader: "+5.123", interval: "+2.276", current_lap: 42, current_lap_time: "1:32.890", speed: 284, sector_1_time: "28.345", sector_2_time: "32.678", sector_3_time: "31.867", pit_lap: 18, tyre: "MEDIUM" },
  { driver_number: 44, last_name: "HAM", team_name: "Ferrari", team_color: "e8002d", position: 4, gap_to_leader: "+8.456", interval: "+3.333", current_lap: 41, current_lap_time: "1:33.012", speed: 282, sector_1_time: "28.456", sector_2_time: "32.789", sector_3_time: "31.767", pit_lap: 17, tyre: "HARD" },
  { driver_number: 4, last_name: "NOR", team_name: "McLaren", team_color: "ff8000", position: 5, gap_to_leader: "+12.234", interval: "+3.778", current_lap: 41, current_lap_time: "1:33.234", speed: 281, sector_1_time: "28.567", sector_2_time: "32.890", sector_3_time: "31.777", pit_lap: 19, tyre: "MEDIUM" },
  { driver_number: 81, last_name: "PIA", team_name: "McLaren", team_color: "ff8000", position: 6, gap_to_leader: "+15.678", interval: "+3.444", current_lap: 41, current_lap_time: "1:33.456", speed: 280, sector_1_time: "28.678", sector_2_time: "32.901", sector_3_time: "31.877", pit_lap: 18, tyre: "HARD" },
  { driver_number: 1, last_name: "VER", team_name: "Red Bull Racing", team_color: "3671c6", position: 7, gap_to_leader: "+18.901", interval: "+3.223", current_lap: 40, current_lap_time: "1:33.567", speed: 279, sector_1_time: "28.789", sector_2_time: "32.912", sector_3_time: "31.866", pit_lap: 18, tyre: "HARD" },
  { driver_number: 87, last_name: "BEA", team_name: "Haas F1 Team", team_color: "b6babd", position: 8, gap_to_leader: "+22.345", interval: "+3.444", current_lap: 40, current_lap_time: "1:33.678", speed: 278, sector_1_time: "28.890", sector_2_time: "32.923", sector_3_time: "31.865", pit_lap: 19, tyre: "MEDIUM" },
  { driver_number: 10, last_name: "GAS", team_name: "Alpine", team_color: "ff87bc", position: 9, gap_to_leader: "+25.678", interval: "+3.333", current_lap: 40, current_lap_time: "1:33.789", speed: 277, sector_1_time: "28.901", sector_2_time: "32.934", sector_3_time: "31.954", pit_lap: 18, tyre: "HARD" },
  { driver_number: 30, last_name: "LAW", team_name: "RB F1 Team", team_color: "6b3fc6", position: 10, gap_to_leader: "+30.123", interval: "+4.445", current_lap: 39, current_lap_time: "1:33.890", speed: 276, sector_1_time: "28.012", sector_2_time: "32.945", sector_3_time: "31.933", pit_lap: 17, tyre: "HARD" },
];

function isSessionActive(session: F1DashboardSession): boolean {
  const now = new Date();
  const start = new Date(session.date_start);
  const end = new Date(session.date_end);
  return now >= start && now <= end;
}

function f1DashboardToSession(fd: F1DashboardSession): Session {
  return {
    session_key: fd.session_key,
    session_type: fd.session_type,
    session_name: fd.session_name,
    date_start: fd.date_start,
    date_end: fd.date_end,
    circuit_short_name: fd.grand_prix.city,
    country_name: fd.grand_prix.country,
    location: fd.grand_prix.city,
    is_cancelled: false,
  };
}

export function LiveTiming() {
  const [drivers, setDrivers] = useState<LiveDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showOnlyActive, setShowOnlyActive] = useState(true);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [showEmbed, setShowEmbed] = useState(false);

  useEffect(() => {
    async function fetchLiveData() {
      // Step 1: Check formula1dashboard for active sessions (primary source)
      let activeFromF1D: F1DashboardSession | null = null;
      try {
        const f1Res = await fetch(
          `https://api.formula1dashboard.com/api/v1/sessions?state=upcoming`,
          { signal: AbortSignal.timeout(6000) }
        );
        if (f1Res.ok) {
          const f1Data = await f1Res.json() as F1DashboardSession[];
          const active = f1Data.find(s => isSessionActive(s));
          if (active) {
            activeFromF1D = active;
            setCurrentSession(f1DashboardToSession(active));
          }
        }
      } catch (e) {
        // F1 Dashboard check failed, continue anyway
        console.warn("F1 Dashboard check failed:", e);
      }

      // Step 2: Try OpenF1 for live timing data (graceful degradation)
      // We don't let OpenF1 failures break the whole component
      try {
        const now = new Date().toISOString();
        const sessionsRes = await fetch(
          `https://api.openf1.org/v1/sessions?date_start<=${now}&date_end>=${now}&is_cancelled=false`,
          { signal: AbortSignal.timeout(6000) }
        );
        
        if (sessionsRes.ok) {
          const sessionsData = await sessionsRes.json();
          if (sessionsData && sessionsData.length > 0) {
            const sessionKey = sessionsData[0].session_key;
            const positionRes = await fetch(
              `https://api.openf1.org/v1/position?session_key=${sessionKey}`,
              { signal: AbortSignal.timeout(6000) }
            );
            
            if (positionRes.ok) {
              const positionData = await positionRes.json();
              if (positionData && positionData.length > 0) {
                const transformedDrivers: LiveDriver[] = positionData.map((d: any) => ({
                  driver_number: d.driver_number,
                  last_name: d.last_name || `DRV${d.driver_number}`,
                  team_name: d.team_name || "Unknown",
                  team_color: d.team_colour || "666666",
                  position: d.position || 0,
                  gap_to_leader: d.gap_to_leader || "--",
                  interval: d.interval || "--",
                  current_lap: d.current_lap || 0,
                  current_lap_time: d.current_lap_time || "--:--.---",
                  speed: d.speed || 0,
                  sector_1_time: d.sector_1_time || "--",
                  sector_2_time: d.sector_2_time || "--",
                  sector_3_time: d.sector_3_time || "--",
                  pit_lap: d.pit_lap || 0,
                  tyre: d.tyre_compound || "UNKNOWN"
                }));
                
                setDrivers(transformedDrivers.sort((a, b) => a.position - b.position));
                setIsLive(true);
                setLoading(false);
                setLastUpdate(new Date());
                return;
              }
            }
          }
        }
      } catch (e) {
        // OpenF1 failed — not critical, we have F1 Dashboard fallback
        console.warn("OpenF1 check failed:", e);
      }

      // Step 3: If F1 Dashboard found an active session, show iframe (even without OpenF1 data)
      if (activeFromF1D) {
        setIsLive(true);
        setDrivers(mockLiveDrivers); // keep mock for the table display
        setLoading(false);
        setLastUpdate(new Date());
        return;
      }

      // Step 4: No live session — fetch upcoming from F1 Dashboard
      try {
        const f1Upcoming = await fetch(
          `https://api.formula1dashboard.com/api/v1/sessions?state=upcoming`,
          { signal: AbortSignal.timeout(6000) }
        );
        if (f1Upcoming.ok) {
          const f1Data = await f1Upcoming.json() as F1DashboardSession[];
          const now = new Date();
          const upcoming = f1Data
            .filter(s => new Date(s.date_start) > now)
            .sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime())
            .slice(0, 5)
            .map(f1DashboardToSession);
          setUpcomingSessions(upcoming);
        }
      } catch (_) {}

      // Fallback: mock data
      setDrivers(mockLiveDrivers);
      setIsLive(false);
      setLastUpdate(new Date());
      setLoading(false);
    }

    fetchLiveData();

    if (autoRefresh) {
      const interval = setInterval(fetchLiveData, 15000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const filteredDrivers = showOnlyActive 
    ? drivers.filter(d => d.position > 0)
    : drivers;

  // Show iframe for live session (from F1 Dashboard or OpenF1)
  if (isLive && currentSession) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
            <h2 className="text-lg font-semibold">Live Timing — {currentSession.session_name}</h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full animate-pulse">
              LIVE NOW
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open("https://formula1dashboard.com/live-timing/", "_blank")}
              className="p-2 rounded-md border bg-background hover:bg-secondary flex items-center gap-1"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-xs hidden md:inline">Open Live</span>
            </button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <iframe
            src="https://formula1dashboard.com/live-timing/"
            className="w-full h-[600px] md:h-[700px]"
            title="F1 Live Timing"
            style={{ border: 'none' }}
          />
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          Live timing via formula1dashboard.com — {currentSession.session_name} at {currentSession.circuit_short_name}
        </p>
      </div>
    );
  }

  // No live session
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Live Timing</h2>
          <span className="px-2 py-0.5 text-xs font-medium bg-gray-500 text-white rounded-full">
            NO LIVE SESSION
          </span>
        </div>

        <div className="flex items-center gap-2">
          {lastUpdate && (
            <span className="text-xs text-muted-foreground">
              Updated: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          
          <button
            onClick={() => window.open("https://formula1dashboard.com/live-timing/", "_blank")}
            className="p-2 rounded-md border bg-background hover:bg-secondary flex items-center gap-1"
            title="Open Live Timing Dashboard"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-xs hidden md:inline">Live Dashboard</span>
          </button>
          
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-2 rounded-md border ${autoRefresh ? "bg-primary/10 border-primary" : "bg-background"}`}
            title={autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <div className="bg-card border rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Next Race
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingSessions.slice(0, 1).map((session) => (
              <div key={session.session_key} className="space-y-1">
                <p className="font-bold">{session.circuit_short_name}</p>
                <p className="text-sm text-muted-foreground">
                  {session.location}, {session.country_name}
                </p>
                <p className="text-sm">
                  {new Date(session.date_start).toLocaleDateString('en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                  })}
                  {' @ '}
                  {new Date(session.date_start).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short'
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyActive}
            onChange={(e) => setShowOnlyActive(e.target.checked)}
            className="rounded"
          />
          Show only active drivers
        </label>
        
        <span className="text-xs text-muted-foreground">
          Showing mock data — No active session
        </span>
      </div>

      {/* Mock data table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium text-muted-foreground">
            <div className="col-span-1">POS</div>
            <div className="col-span-2">DRIVER</div>
            <div className="col-span-1">LAP</div>
            <div className="col-span-2">TIME / GAP</div>
            <div className="col-span-1">TYRE</div>
            <div className="col-span-2 hidden md:block">SECTORS</div>
            <div className="col-span-1 hidden md:block">PIT</div>
            <div className="col-span-2">SPEED</div>
          </div>

          {filteredDrivers.map((driver) => (
            <div
              key={driver.driver_number}
              className="grid grid-cols-12 gap-2 px-3 py-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="col-span-1 flex items-center">
                <span className={`font-bold text-lg ${
                  driver.position === 1 ? "text-yellow-500" :
                  driver.position === 2 ? "text-gray-400" :
                  driver.position === 3 ? "text-amber-600" :
                  "text-foreground"
                }`}>
                  {driver.position}
                </span>
              </div>

              <div className="col-span-2 flex items-center gap-2">
                <div
                  className="w-2 h-8 rounded-full"
                  style={{ backgroundColor: `#${driver.team_color}` }}
                />
                <div>
                  <div className="font-bold">#{driver.driver_number}</div>
                  <div className="text-xs text-muted-foreground">{driver.last_name}</div>
                </div>
              </div>

              <div className="col-span-1 flex items-center">
                <div className="text-center">
                  <div className="font-medium">{driver.current_lap}</div>
                  <div className="text-xs text-muted-foreground">LAP</div>
                </div>
              </div>

              <div className="col-span-2 flex items-center">
                <div>
                  <div className="font-mono text-sm">{driver.current_lap_time}</div>
                  <div className="text-xs text-muted-foreground">
                    {driver.gap_to_leader === "--" ? "LEADER" : driver.gap_to_leader}
                  </div>
                </div>
              </div>

              <div className="col-span-1 flex items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2"
                  style={{ 
                    backgroundColor: TYRE_COLORS[driver.tyre] || TYRE_COLORS["UNKNOWN"],
                    borderColor: driver.tyre === "INTER" || driver.tyre === "WET" ? "#333" : "transparent"
                  }}
                  title={driver.tyre}
                >
                  {driver.tyre[0]}
                </div>
              </div>

              <div className="col-span-2 hidden md:flex items-center gap-1 text-xs">
                <span className="px-1.5 py-0.5 bg-green-500/20 text-green-500 rounded font-mono">
                  {driver.sector_1_time}
                </span>
                <span className="px-1.5 py-0.5 bg-green-500/20 text-green-500 rounded font-mono">
                  {driver.sector_2_time}
                </span>
                <span className="px-1.5 py-0.5 bg-green-500/20 text-green-500 rounded font-mono">
                  {driver.sector_3_time}
                </span>
              </div>

              <div className="col-span-1 hidden md:flex items-center">
                {driver.pit_lap > 0 ? (
                  <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-500 rounded">
                    Lap {driver.pit_lap}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">-</span>
                )}
              </div>

              <div className="col-span-2 flex items-center">
                <div className="flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-muted-foreground" />
                  <span className="font-mono text-sm">{driver.speed}</span>
                  <span className="text-xs text-muted-foreground">km/h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
