import { NextResponse } from 'next/server';

const JOLPICA_BASE = 'https://api.jolpi.ca/ergast/f1';

export async function GET() {
  try {
    // Fetch current season schedule
    const scheduleRes = await fetch(`${JOLPICA_BASE}/current.json`);

    if (!scheduleRes.ok) {
      throw new Error('Failed to fetch schedule from Jolpica API');
    }

    const scheduleData = await scheduleRes.json();
    
    const races = scheduleData.MRData.RaceTable.Races.map((race: any) => ({
      round: parseInt(race.round),
      name: race.raceName,
      circuit: race.Circuit?.circuitName || race.Circuit?.circuitId || 'Unknown',
      locality: race.Location?.locality || race.Location?.locality || race.Circuit?.location || 'Unknown',
      country: race.Location?.country || 'Unknown',
      date: race.date,
      time: race.time || '00:00:00Z',
    }));

    return NextResponse.json({
      season: scheduleData.MRData.RaceTable.season,
      races,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching F1 schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch F1 schedule' },
      { status: 500 }
    );
  }
}
