import type { MetadataRoute } from "next";
import { fetchDriverStandings } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://f1-dashboard-clone.vercel.app";

  const routes = [
    "",
    "calendar",
    "constructors",
    "consistency",
    "destructors",
    "dnf",
    "driver-comparison",
    "driver-stats",
    "drivers",
    "engineer",
    "favorito",
    "head-to-head",
    "home-intel",
    "intervals",
    "live",
    "news",
    "pit-stops",
    "predictions",
    "qualifying",
    "race-history",
    "race-mode",
    "race-pace",
    "season-stats",
    "sector-times",
    "speed-histogram",
    "speed-trap",
    "standings",
    "starting-grid",
    "teams",
    "tech-updates",
    "track-dna",
    "track-map",
    "tyre-strategy",
    "used-elements",
    "weather",
  ];

  const staticPages: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}/${route}`,
    lastModified: new Date(),
    changeFrequency: (route === "" ? "daily" : "weekly") as "daily" | "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  let driverPages: MetadataRoute.Sitemap = [];
  try {
    const drivers = await fetchDriverStandings(2026);
    driverPages = drivers.map((d) => ({
      url: `${baseUrl}/drivers/${d.driverId}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));
  } catch {
    // fallback: no driver detail pages
  }

  return [...staticPages, ...driverPages];
}
