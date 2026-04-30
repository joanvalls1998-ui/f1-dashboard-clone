# F1 Dashboard Clone

A Formula 1 statistics dashboard built with Next.js, inspired by the official F1 Dashboard.

## Features

- 🏎️ **Live Race Data** - Real-time data from OpenF1 API
- 📊 **Driver Standings** - Current championship standings
- 🏆 **Constructor Standings** - Team championship standings
- 📅 **Race Calendar** - Complete F1 season calendar
- 👨‍💼 **Driver Profiles** - All drivers with team information
- 🌐 **Dark/Light Mode** - Full theme support

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Data**: OpenF1 API

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home page
│   ├── calendar/          # Race calendar
│   ├── standings/         # Driver standings
│   ├── constructors/      # Constructor standings
│   ├── drivers/          # Driver profiles
│   └── teams/            # Team profiles
├── components/            # React components
│   ├── Sidebar.tsx       # Navigation sidebar
│   ├── Header.tsx        # Page header
│   └── ...
├── lib/
│   ├── api.ts            # OpenF1 API integration
│   └── utils.ts          # Utility functions
```

## Data Source

This project uses the [OpenF1 API](https://api.openf1.org/) for real F1 data.

## Disclaimer

This is an educational project built for learning purposes. It is not affiliated with Formula 1 or the official F1 Dashboard.
