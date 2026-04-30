import { NextResponse } from 'next/server';

const JOLPICA_BASE = 'https://api.jolpi.ca/ergast/f1';

export async function GET() {
  try {
    // Fetch driver and constructor standings in parallel
    const [driverRes, constructorRes, lastRaceRes] = await Promise.all([
      fetch(`${JOLPICA_BASE}/current/driverStandings.json`, { next: { revalidate: 60 } }),
      fetch(`${JOLPICA_BASE}/current/constructorStandings.json`, { next: { revalidate: 60 } }),
      fetch(`${JOLPICA_BASE}/current/last/results.json`, { next: { revalidate: 60 } }),
    ]);

    if (!driverRes.ok || !constructorRes.ok || !lastRaceRes.ok) {
      throw new Error('Failed to fetch from Jolpica API');
    }

    const [driverData, constructorData, lastRaceData] = await Promise.all([
      driverRes.json(),
      constructorRes.json(),
      lastRaceRes.json(),
    ]);

    // Extract driver standings
    const driverStandings = driverData.MRData.StandingsTable.StandingsLists[0].DriverStandings.map((d: any) => ({
      position: parseInt(d.position),
      code: d.Driver.code,
      fullName: `${d.Driver.givenName} ${d.Driver.familyName}`,
      team: d.Constructors[0].name,
      points: parseInt(d.points),
      wins: parseInt(d.wins),
    }));

    // Extract constructor standings
    const constructorStandings = constructorData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings.map((c: any) => ({
      position: parseInt(c.position),
      name: c.Constructor.name,
      points: parseInt(c.points),
    }));

    // Extract last race results
    const race = lastRaceData.MRData.RaceTable.Races[0];
    const lastRace = {
      name: race.raceName,
      date: race.date,
      results: race.Results.slice(0, 20).map((r: any) => ({
        position: parseInt(r.position),
        code: r.Driver.code,
        fullName: `${r.Driver.givenName} ${r.Driver.familyName}`,
        team: r.Constructor.name,
        points: parseInt(r.points),
        status: r.status,
        laps: parseInt(r.laps),
      })),
    };

    return NextResponse.json({
      drivers: driverStandings,
      constructors: constructorStandings,
      lastRace,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching F1 data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch F1 data' },
      { status: 500 }
    );
  }
}
