"use client";

import { usePathname } from "next/navigation";
import { Sun, Moon, Menu } from "lucide-react";
import { useState, useEffect } from "react";

export function Header() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const getTitle = () => {
    if (pathname === "/") return "Home";
    if (pathname === "/calendar") return "Race Calendar";
    if (pathname === "/standings") return "Driver Standings";
    if (pathname === "/constructors") return "Constructor Standings";
    if (pathname === "/drivers") return "Drivers";
    if (pathname === "/teams") return "Teams";
    if (pathname === "/driver-stats") return "Driver Stats";
    if (pathname === "/head-to-head") return "Head To Head";
    if (pathname === "/consistency") return "Consistency";
    if (pathname === "/race-pace") return "Race Pace";
    if (pathname === "/pit-stops") return "Pit Stops";
    if (pathname === "/tech-updates") return "Tech Updates";
    if (pathname === "/used-elements") return "Used Elements";
    if (pathname === "/destructors") return "Destructors Championship";
    if (pathname === "/track-dna") return "Track DNA";
    return "F1 Dashboard";
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b">
      <div className="flex h-16 items-center gap-2 px-4">
        <button
          className="md:hidden p-2 hover:bg-accent rounded-md"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="h-4 w-px bg-border hidden md:block" />

        <nav aria-label="breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <span className="font-normal text-foreground">{getTitle()}</span>
            </li>
          </ol>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
