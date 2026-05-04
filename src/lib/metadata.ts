// Open Graph / metadata templates for dynamic pages
export const defaultMeta = {
  title: "F1 Dashboard - Classificacions, Calendari i Estadístiques",
  description: "Explora les classificacions de la Fórmula 1, calendari de curses, estadístiques de pilots i equips, cronometratge en directe i molt més.",
  images: ["/og-image.png"],
};

export function driverMeta(driver: { fullName: string; team: string; points: number; abbreviation: string }) {
  const name = driver.fullName;
  return {
    title: `${name} - Estadístiques F1 2026`,
    description: `Estadístiques de ${name} (${driver.abbreviation}) — ${driver.points} punts amb ${driver.team} a la temporada 2026 de la Fórmula 1.`,
    openGraph: {
      title: `${name} - Estadístiques F1 2026`,
      description: `Estadístiques de ${name} (${driver.abbreviation}) — ${driver.points} punts amb ${driver.team} a la temporada 2026 de la Fórmula 1.`,
      images: [`https://f1-dashboard-clone.vercel.app/og-driver/${driver.abbreviation}.png`],
    },
  };
}

export function teamMeta(team: { name: string; position: number; points: number; wins: number }) {
  return {
    title: `${team.name} - Classificació Constructors F1 2026`,
    description: `${team.name}: posició ${team.position}, ${team.points} punts i ${team.wins} victòries al Mundial de Constructors 2026.`,
    openGraph: {
      title: `${team.name} - Classificació Constructors F1 2026`,
      description: `${team.name}: posició ${team.position}, ${team.points} punts i ${team.wins} victòries.`,
      images: [`https://f1-dashboard-clone.vercel.app/og-team/${team.name.replace(/\s+/g, "-")}.png`],
    },
  };
}

export function raceMeta(race: { name: string; date: string; circuit: string; country: string }) {
  return {
    title: `${race.name} 2026 - Calendari i Resultats`,
    description: `${race.name} 2026 al circuit ${race.circuit}, ${race.country}. Horaris, resultats i estadístiques en temps real.`,
    openGraph: {
      title: `${race.name} 2026`,
      description: `${race.name} al circuit ${race.circuit}, ${race.country}.`,
    },
  };
}
