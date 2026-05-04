import { z } from 'zod';

// ── Jolpica / Ergast API Schemas ────────────────────────────────

const DriverSchema = z.object({
  driverId: z.string(),
  permanentNumber: z.string().optional(),
  code: z.string(),
  givenName: z.string(),
  familyName: z.string(),
  nationality: z.string(),
});

const ConstructorSchema = z.object({
  constructorId: z.string(),
  name: z.string(),
  nationality: z.string(),
});

const DriverStandingSchema = z.object({
  position: z.string(),
  points: z.string(),
  wins: z.string(),
  Driver: DriverSchema,
  Constructors: z.array(ConstructorSchema).min(1),
});

const ConstructorStandingSchema = z.object({
  position: z.string(),
  points: z.string(),
  wins: z.string(),
  Constructor: ConstructorSchema,
});

const CircuitLocationSchema = z.object({
  locality: z.string(),
  country: z.string(),
  lat: z.string(),
  long: z.string(),
});

const CircuitSchema = z.object({
  circuitId: z.string(),
  circuitName: z.string(),
  Location: CircuitLocationSchema,
});

const RaceSchema = z.object({
  season: z.string(),
  round: z.string(),
  raceName: z.string(),
  date: z.string(),
  Circuit: CircuitSchema,
});

const ResultSchema = z.object({
  position: z.string(),
  points: z.string(),
  status: z.string(),
  laps: z.string().optional(),
  Time: z.object({ time: z.string() }).optional(),
  FastestLap: z.object({ rank: z.string() }).optional(),
  Driver: DriverSchema,
  Constructor: ConstructorSchema,
});

const RaceResultSchema = RaceSchema.extend({
  Results: z.array(ResultSchema),
});

const StandingsResponseSchema = z.object({
  MRData: z.object({
    xmlns: z.string(),
    series: z.string(),
    url: z.string(),
    limit: z.string(),
    offset: z.string(),
    total: z.string(),
    StandingsTable: z.object({
      season: z.string(),
      StandingsLists: z.array(
        z.object({
          season: z.string(),
          round: z.string(),
          DriverStandings: z.array(DriverStandingSchema),
        })
      ),
    }),
  }),
});

const ConstructorStandingsResponseSchema = z.object({
  MRData: z.object({
    StandingsTable: z.object({
      StandingsLists: z.array(
        z.object({
          ConstructorStandings: z.array(ConstructorStandingSchema),
        })
      ),
    }),
  }),
});

const CalendarResponseSchema = z.object({
  MRData: z.object({
    total: z.string(),
    RaceTable: z.object({
      season: z.string(),
      Races: z.array(RaceSchema),
    }),
  }),
});

const LastRaceResponseSchema = z.object({
  MRData: z.object({
    total: z.string(),
    RaceTable: z.object({
      Races: z.array(RaceResultSchema),
    }),
  }),
});

// ── OpenF1 Schemas ──────────────────────────────────────────────

const SessionSchema = z.object({
  session_key: z.number(),
  session_type: z.string(),
  session_name: z.string(),
  date_start: z.string(),
  date_end: z.string(),
  circuit_short_name: z.string().optional(),
  country_name: z.string().optional(),
  location: z.string().optional(),
  is_cancelled: z.boolean().optional(),
});

const OpenF1CarDataSchema = z.object({
  driver_number: z.number(),
  speed: z.number().optional(),
  rpm: z.number().optional(),
  gear: z.number().optional(),
  throttle: z.number().optional(),
  brake: z.number().optional(),
  drs: z.number().optional(),
  date: z.string(),
});

const OpenF1PositionSchema = z.object({
  driver_number: z.number(),
  position: z.number(),
  date: z.string(),
});

const OpenF1IntervalSchema = z.object({
  driver_number: z.number(),
  gap_to_leader: z.string().nullable(),
  interval: z.string().nullable(),
  date: z.string(),
});

const OpenF1StintSchema = z.object({
  driver_number: z.number(),
  compound: z.string(),
  lap_start: z.number(),
  lap_end: z.number().nullable(),
  tyre_age_at_start: z.number(),
});

const OpenF1PitStopSchema = z.object({
  driver_number: z.number(),
  lap: z.number(),
  pit_duration: z.number().nullable(),
});

// ── Export tipus inferits ────────────────────────────────────

export type ValidatedDriver = z.infer<typeof DriverSchema>;
export type ValidatedConstructor = z.infer<typeof ConstructorSchema>;
export type ValidatedDriverStanding = z.infer<typeof DriverStandingSchema>;
export type ValidatedConstructorStanding = z.infer<typeof ConstructorStandingSchema>;
export type ValidatedRace = z.infer<typeof RaceSchema>;
export type ValidatedCircuit = z.infer<typeof CircuitSchema>;
export type ValidatedResult = z.infer<typeof ResultSchema>;
export type ValidatedSession = z.infer<typeof SessionSchema>;
export type ValidatedCarData = z.infer<typeof OpenF1CarDataSchema>;
export type ValidatedPosition = z.infer<typeof OpenF1PositionSchema>;
export type ValidatedInterval = z.infer<typeof OpenF1IntervalSchema>;
export type ValidatedStint = z.infer<typeof OpenF1StintSchema>;
export type ValidatedPitStop = z.infer<typeof OpenF1PitStopSchema>;

export {
  DriverSchema,
  ConstructorSchema,
  DriverStandingSchema,
  ConstructorStandingSchema,
  CircuitSchema,
  RaceSchema,
  ResultSchema,
  RaceResultSchema,
  StandingsResponseSchema,
  ConstructorStandingsResponseSchema,
  CalendarResponseSchema,
  LastRaceResponseSchema,
  SessionSchema,
  OpenF1CarDataSchema,
  OpenF1PositionSchema,
  OpenF1IntervalSchema,
  OpenF1StintSchema,
  OpenF1PitStopSchema,
};
