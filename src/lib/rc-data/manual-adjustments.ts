export const MANUAL_ADJUSTMENTS_AS_OF = "2026-04-01";

export const manualAdjustmentsState = {
  meta: {
    updatedAt: "2026-04-01T00:00:00.000Z",
    source: "initial_empty_state",
    version: 1,
    notes: [
      "Aquí se guardan SOLO ajustes semanales o puntuales",
      "No sustituye la base de performance.js",
      "La idea es aplicar estos deltas encima de la base"
    ]
  },

  limits: {
    teams: {
      perUpdate: {
        qualyPace: 2,
        racePace: 2,
        reliability: 2,
        upgradeMomentum: 1,
        recentTrend: 1,
        aero: 1,
        topSpeed: 1,
        traction: 1,
        tyreManagement: 1,
        streetTrack: 1,
        wetPerformance: 1
      },
      accumulated: {
        qualyPace: 8,
        racePace: 8,
        reliability: 8,
        upgradeMomentum: 4,
        recentTrend: 4,
        aero: 5,
        topSpeed: 5,
        traction: 5,
        tyreManagement: 5,
        streetTrack: 4,
        wetPerformance: 4
      }
    },

    drivers: {
      perUpdate: {
        form: 2,
        confidence: 2,
        qualySkill: 1,
        raceSkill: 1,
        consistency: 1,
        risk: 1,
        starts: 1,
        streetCraft: 1,
        wetWeather: 1,
        tyreSaving: 1
      },
      accumulated: {
        form: 6,
        confidence: 6,
        qualySkill: 4,
        raceSkill: 4,
        consistency: 4,
        risk: 4,
        starts: 3,
        streetCraft: 3,
        wetWeather: 3,
        tyreSaving: 3
      }
    }
  },

  teams: {} as Record<string, Record<string, number>>,

  drivers: {} as Record<string, Record<string, number>>,

  newsSignals: [] as any[],

  weeklySnapshots: [] as any[]
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function isNumber(value: any): boolean {
  return typeof value === "number" && !Number.isNaN(value);
}

export function getTeamAdjustments(teamName: string): Record<string, number> {
  return manualAdjustmentsState.teams[teamName] || {};
}

export function getDriverAdjustments(driverName: string): Record<string, number> {
  return manualAdjustmentsState.drivers[driverName] || {};
}

export function getAllTeamAdjustments(): Record<string, Record<string, number>> {
  return manualAdjustmentsState.teams;
}

export function getAllDriverAdjustments(): Record<string, Record<string, number>> {
  return manualAdjustmentsState.drivers;
}

export function getNewsSignals(): any[] {
  return manualAdjustmentsState.newsSignals || [];
}

export function applyBoundedAdjustments(
  baseObject: Record<string, any> = {},
  deltaObject: Record<string, any> = {},
  limitObject: Record<string, number> | undefined = undefined
): Record<string, any> {
  const result: Record<string, any> = { ...baseObject };

  for (const [key, delta] of Object.entries(deltaObject || {})) {
    if (!isNumber(delta)) continue;

    const limit = typeof limitObject?.[key] === "number" ? limitObject![key] : null;
    result[key] = limit == null ? delta : clamp(delta, -limit, limit);
  }

  return result;
}

export function sanitizeTeamDelta(deltaObject: Record<string, any> = {}): Record<string, any> {
  return applyBoundedAdjustments(
    {},
    deltaObject,
    manualAdjustmentsState.limits.teams.perUpdate
  );
}

export function sanitizeDriverDelta(deltaObject: Record<string, any> = {}): Record<string, any> {
  return applyBoundedAdjustments(
    {},
    deltaObject,
    manualAdjustmentsState.limits.drivers.perUpdate
  );
}

export function mergeAdjustmentObjects(
  current: Record<string, any> = {},
  incoming: Record<string, any> = {},
  accumulatedLimits: Record<string, number> | undefined = undefined
): Record<string, any> {
  const merged: Record<string, any> = { ...current };

  for (const [key, value] of Object.entries(incoming || {})) {
    if (!isNumber(value)) continue;

    const previous = isNumber(merged[key]) ? merged[key] : 0;
    const raw = previous + value;
    const limit = typeof accumulatedLimits?.[key] === "number" ? accumulatedLimits![key] : null;

    merged[key] = limit == null ? raw : clamp(raw, -limit, limit);
  }

  return merged;
}

export function previewMergedTeamAdjustments(
  teamName: string,
  newDelta: Record<string, any> = {}
): Record<string, number> {
  const current = getTeamAdjustments(teamName);
  const sanitized = sanitizeTeamDelta(newDelta);

  return mergeAdjustmentObjects(
    current,
    sanitized,
    manualAdjustmentsState.limits.teams.accumulated
  ) as Record<string, number>;
}

export function previewMergedDriverAdjustments(
  driverName: string,
  newDelta: Record<string, any> = {}
): Record<string, number> {
  const current = getDriverAdjustments(driverName);
  const sanitized = sanitizeDriverDelta(newDelta);

  return mergeAdjustmentObjects(
    current,
    sanitized,
    manualAdjustmentsState.limits.drivers.accumulated
  ) as Record<string, number>;
}
