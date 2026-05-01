// F1 Driver, Team and Circuit image assets
// Images sourced from Wikipedia Commons (free, attribution required)

// Driver images from Wikipedia - 18/20 complete
export const driverImages: Record<string, string> = {
  // Mercedes
  ANT: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Kimi_Antonelli_at_the_2025_US_Grand_Prix_in_Austin%2C_TX_%28cropped%29.jpg/330px-Kimi_Antonelli_at_the_2025_US_Grand_Prix_in_Austin%2C_TX_%28cropped%29.jpg",
  RUS: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/KingsLeonSilverstne040724_%2828_of_112%29_%2853838006028%29_%28cropped%29.jpg/330px-KingsLeonSilverstne040724_%2828_of_112%29_%2853838006028%29_%28cropped%29.jpg",
  
  // Ferrari
  LEC: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3978_by_Stepro_%28cropped2%29.jpg/330px-2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3978_by_Stepro_%28cropped2%29.jpg",
  HAM: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Prime_Minister_Keir_Starmer_meets_Sir_Lewis_Hamilton_%2854566928382%29_%28cropped%29.jpg/330px-Prime_Minister_Keir_Starmer_meets_Sir_Lewis_Hamilton_%2854566928382%29_%28cropped%29.jpg",
  
  // McLaren
  NOR: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3968_by_Stepro_%28cropped2%29.jpg/330px-2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3968_by_Stepro_%28cropped2%29.jpg",
  PIA: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/2026_Chinese_GP_-_Oscar_Piastri_%28cropped%29_%28cropped%29.jpg/330px-2026_Chinese_GP_-_Oscar_Piastri_%28cropped%29_%28cropped%29.jpg",
  
  // Red Bull Racing
  VER: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3973_by_Stepro_%28medium_crop%29.jpg/330px-2024-08-25_Motorsport%2C_Formel_1%2C_Gro%C3%9Fer_Preis_der_Niederlande_2024_STP_3973_by_Stepro_%28medium_crop%29.jpg",
  HAD: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Isack_Hadjar_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8753%29_%28cropped%29.jpg/330px-Isack_Hadjar_at_the_Melbourne_Walk_during_the_2026_Australian_Grand_Prix_%28028A8753%29_%28cropped%29.jpg",
  
  // Racing Bulls
  LAW: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Liam_Lawson_%282026_Australian_Grand_Prix%29.jpg/330px-Liam_Lawson_%282026_Australian_Grand_Prix%29.jpg",
  LIN: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Arvid_Lindblad_at_the_Red_Bull_Fan_Zone_%E2%80%93_Crown_Riverwalk%2C_Melbourne_%28028A7869%29_%28cropped%29.jpg/330px-Arvid_Lindblad_at_the_Red_Bull_Fan_Zone_%E2%80%93_Crown_Riverwalk%2C_Melbourne_%28028A7869%29_%28cropped%29.jpg",
  
  // Ferrari (additional)
  SAI: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Formula1Gabelhofen2022_%2804%29_%28cropped2%29.jpg/330px-Formula1Gabelhofen2022_%2804%29_%28cropped2%29.jpg",
  
  // Aston Martin
  ALO: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Alonso-68_%2824710447098%29.jpg/330px-Alonso-68_%2824710447098%29.jpg",
  STR: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/2025_Japan_GP_-_Aston_Martin_-_Lance_Stroll_-_Fanzone_Stage_%28cropped%29.jpg/330px-2025_Japan_GP_-_Aston_Martin_-_Lance_Stroll_-_Fanzone_Stage_%28cropped%29.jpg",
  
  // Alpine
  GAS: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/2022_French_Grand_Prix_%2852279065728%29_%28midcrop%29.png/330px-2022_French_Grand_Prix_%2852279065728%29_%28midcrop%29.png",
  OCO: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Esteban_Ocon_2024_Suzuka_%28cropped%29.jpg/330px-Esteban_Ocon_2024_Suzuka_%28cropped%29.jpg",
  COL: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Franco_Colapinto_2024_%28cropped%29.jpg/330px-Franco_Colapinto_2024_%28cropped%29.jpg",
  
  // Haas
  BEA: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/2025_Japan_GP_-_Haas_-_Oliver_Bearman_-_Thursday_%28cropped%29.jpg/330px-2025_Japan_GP_-_Haas_-_Oliver_Bearman_-_Thursday_%28cropped%29.jpg",
  
  // Williams
  ALB: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Alex_Albon_%28cropped%29.jpg/330px-Alex_Albon_%28cropped%29.jpg",
  
  // AlphaTauri / RB
  TSU: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Yuki_Tsunoda_at_the_2026_Australian_Grand_Prix_%28028A8096%29.jpg/330px-Yuki_Tsunoda_at_the_2026_Australian_Grand_Prix_%28028A8096%29.jpg",
  
  // Audi
  BOR: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Gabriel_Bortoleto_%28cropped%29.jpg/330px-Gabriel_Bortoleto_%28cropped%29.jpg",
  
  // Cadillac
  BOT: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Valtteri_Bottas_at_the_2026_Adelaide_Motorsport_Festival_%28028A7567%29.jpg/330px-Valtteri_Bottas_at_the_2026_Adelaide_Motorsport_Festival_%28028A7567%29.jpg",
  HUL: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/2019_Formula_One_tests_Barcelona%2C_Hulkenberg_%2840287128313%29.jpg/330px-2019_Formula_One_tests_Barcelona%2C_Hulkenberg_%2840287128313%29.jpg",
  PER: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/2021_US_GP_driver_parade_%28cropped2%29.jpg/330px-2021_US_GP_driver_parade_%28cropped2%29.jpg",
};

// Circuit images from Wikipedia - 16/22 complete
export const circuitImages: Record<string, string> = {
  Australia: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Albert_Park_Circuit_2023.svg/500px-Albert_Park_Circuit_2023.svg.png",
  China: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Shanghai_International_Circuit_2004.svg/500px-Shanghai_International_Circuit_2004.svg.png",
  Japan: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Suzuka_circuit_map--2005.svg/500px-Suzuka_circuit_map--2005.svg.png",
  Bahrain: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Bahrain_International_Circuit--Grand_Prix_Layout.svg/500px-Bahrain_International_Circuit--Grand_Prix_Layout.svg.png",
  "Saudi Arabia": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Jeddah_Street_Circuit_2021.svg/500px-Jeddah_Street_Circuit_2021.svg.png",
  Miami: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Hard_Rock_Stadium_Circuit_2022.svg/500px-Hard_Rock_Stadium_Circuit_2022.svg.png",
  Monaco: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Monte_Carlo_Formula_1_track_map.svg/500px-Monte_Carlo_Formula_1_track_map.svg.png",
  Spain: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Madring_%282026%29.svg/500px-Madring_%282026%29.svg.png",
  Canada: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/%C3%8Ele_Notre-Dame_%28Circuit_Gilles_Villeneuve%29.svg/500px-%C3%8Ele_Notre-Dame_%28Circuit_Gilles_Villeneuve%29.svg.png",
  Austria: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Spielberg_bare_map_numbers_contextless_2021_corner_names.svg/500px-Spielberg_bare_map_numbers_contextless_2021_corner_names.svg.png",
  Britain: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Silverstone_Circuit_2021.svg/500px-Silverstone_Circuit_2021.svg.png",
  Belgium: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Circuit_de_Spa-Francorchamps.svg/500px-Circuit_de_Spa-Francorchamps.svg.png",
  Netherlands: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Zandvoort_Circuit.png/500px-Zandvoort_Circuit.png",
  Italy: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Monza_Circuit_2022.svg/500px-Monza_Circuit_2022.svg.png",
  Azerbaijan: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Baku_City_Circuit_2023.svg/500px-Baku_City_Circuit_2023.svg.png",
  Singapore: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Marina_Bay_circuit_2023.svg/500px-Marina_Bay_circuit_2023.svg.png",
  "United States": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Circuit_of_the_Americas_2022.svg/500px-Circuit_of_the_Americas_2022.svg.png",
  Mexico: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez_2023.svg/500px-Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez_2023.svg.png",
  Brazil: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Interlagos_2022.svg/500px-Interlagos_2022.svg.png",
  "Las Vegas": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/2023_Las_Vegas_street_circuit.svg/500px-2023_Las_Vegas_street_circuit.svg.png",
  Qatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Lusail_International_Circuit_%28F1%29.svg/500px-Lusail_International_Circuit_%28F1%29.svg.png",
  "Abu Dhabi": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Yas_Marina_Circuit.png/500px-Yas_Marina_Circuit.png",
};

// Team colors matching F1 official
export const teamColors: Record<string, string> = {
  Mercedes: "#27F4D2",
  Ferrari: "#E8002D",
  McLaren: "#FF8000",
  "Red Bull Racing": "#3671C6",
  "Red Bull": "#3671C6",
  "Racing Bulls": "#6B3FC6",
  "RB F1 Team": "#6B3FC6",
  "Haas F1 Team": "#F0F0F0",
  Alpine: "#FF87BC",
  Audi: "#CC0000",
  Williams: "#64C4FF",
  "Aston Martin": "#229971",
  Cadillac: "#C20000",
};

// Get team color by team name
export function getTeamColor(teamName: string): string {
  return teamColors[teamName] || "#666666";
}

// Team logos (placeholder URLs - would need real team logo URLs)
export const teamLogos: Record<string, string> = {
  Mercedes: "https://www.formula1.com/themes/fom-2018/assets/images/teams/mercedes.svg",
  Ferrari: "https://www.formula1.com/themes/fom-2018/assets/images/teams/ferrari.svg",
  McLaren: "https://www.formula1.com/themes/fom-2018/assets/images/teams/mclaren.svg",
  "Red Bull Racing": "https://www.formula1.com/themes/fom-2018/assets/images/teams/red-bull.svg",
  "Racing Bulls": "https://www.formula1.com/themes/fom-2018/assets/images/teams/alpha-tauri.svg",
  "Haas F1 Team": "https://www.formula1.com/themes/fom-2018/assets/images/teams/haas.svg",
  Alpine: "https://www.formula1.com/themes/fom-2018/assets/images/teams/alpine.svg",
  Audi: "https://www.formula1.com/themes/fom-2018/assets/images/teams/audi.svg",
  Williams: "https://www.formula1.com/themes/fom-2018/assets/images/teams/williams.svg",
  "Aston Martin": "https://www.formula1.com/themes/fom-2018/assets/images/teams/aston-martin.svg",
  Cadillac: "https://www.formula1.com/themes/fom-2018/assets/images/teams/cadillac.svg",
  RB: "https://www.formula1.com/themes/fom-2018/assets/images/teams/alpha-tauri.svg",
};

// Country flags (for nationalities)
export const countryFlags: Record<string, string> = {
  British: "🇬🇧",
  Finnish: "🇫🇮",
  Monegasque: "🇲🇨",
  Australian: "🇦🇺",
  Spanish: "🇪🇸",
  Mexican: "🇲🇽",
  Dutch: "🇳🇱",
  French: "🇫🇷",
  German: "🇩🇪",
  Japanese: "🇯🇵",
  Thai: "🇹🇭",
  Chinese: "🇨🇳",
  Italian: "🇮🇹",
  Brazilian: "🇧🇷",
  Canadian: "🇨🇦",
  American: "🇺🇸",
  Austrian: "🇦🇹",
  Belgian: "🇧🇪",
  Argentine: "🇦🇷",
  Russian: "🇷🇺",
  Polish: "🇵🇱",
  Hungarian: "🇭🇺",
  Danish: "🇩🇰",
  Swedish: "🇸🇪",
  Irish: "🇮🇪",
  Swiss: "🇨🇭",
  UAE: "🇦🇪",
  Portuguese: "🇵🇹",
  NewZealand: "🇳🇿",
  Colombian: "🇨🇴",
  Venezuelan: "🇻🇪",
};
export const teamCarImages: Record<string, string> = {
  Mercedes: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Mercedes_AMG_F1_W15_Edinburgo.jpg/960px-Mercedes_AMG_F1_W15_Edinburgo.jpg",
  Ferrari: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Carlos_Sainz_Chinese_GP_2024.jpg/960px-Carlos_Sainz_Chinese_GP_2024.jpg",
  McLaren: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/FIA_F1_Austria_2023_Nr._4_%282%29.jpg/960px-FIA_F1_Austria_2023_Nr._4_%282%29.jpg",
  "Red Bull Racing": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Max_Verstappen_2024_%28cropped%29.jpg/960px-Max_Verstappen_2024_%28cropped%29.jpg",
  "Racing Bulls": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/FIA_F1_Austria_2023_Nr._21_%282%29.jpg/960px-FIA_F1_Austria_2023_Nr._21_%282%29.jpg",
  "Haas F1 Team": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/2022_British_Grand_Prix_%2852381409242%29.jpg/960px-2022_British_Grand_Prix_%2852381409242%29.jpg",
  Alpine: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/2024_Spanish_Grand_Prix_%2853811182883%29.jpg/960px-2024_Spanish_Grand_Prix_%2853811182883%29.jpg",
  Audi: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Audi_F1_Logo_2024.png/600px-Audi_F1_Logo_2024.png",
  Williams: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/FIA_F1_Austria_2023_Nr._23_%282%29.jpg/960px-FIA_F1_Austria_2023_Nr._23_%282%29.jpg",
  "Aston Martin": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/2025_Japan_GP_-_Aston_Martin_-_Lance_Stroll_-_Fanzone_Stage_%28cropped%29.jpg/960px-2025_Japan_GP_-_Aston_Martin_-_Lance_Stroll_-_Fanzone_Stage_%28cropped%29.jpg",
  Cadillac: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Cadillac_2026_F1.jpg/960px-Cadillac_2026_F1.jpg",
};

// Get driver initials for placeholder
export function getDriverInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

// Get team short name
export function getTeamShortName(team: string): string {
  const shortNames: Record<string, string> = {
    Mercedes: "MER",
    Ferrari: "FER",
    McLaren: "MCL",
    "Red Bull Racing": "RBR",
    "Racing Bulls": "RB",
    "Haas F1 Team": "HAA",
    Alpine: "ALP",
    Audi: "AUD",
    Williams: "WIL",
    "Aston Martin": "AMR",
    Cadillac: "CAD",
  };
  return shortNames[team] || team.substring(0, 3).toUpperCase();
}
