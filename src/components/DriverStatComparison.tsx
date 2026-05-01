"use client";

import { useState, useEffect } from "react";
import { fetchDriverStandings, Driver } from "@/lib/api";
import { getTeamColor } from "@/lib/f1-assets";
import { driverImages } from "@/lib/f1-assets";
import { ChevronDown } from "lucide-react";

export function DriverStatComparison() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver1, setSelectedDriver1] = useState<string>("");
  const [selectedDriver2, setSelectedDriver2] = useState<string>("");
  const [isDropdown1Open, setIsDropdown1Open] = useState(false);
  const [isDropdown2Open, setIsDropdown2Open] = useState(false);

  useEffect(() => {
    async function loadDrivers() {
      try {
        const standings = await fetchDriverStandings();
        setDrivers(standings);
        if (standings.length >= 2) {
          setSelectedDriver1(standings[0].abbreviation);
          setSelectedDriver2(standings[1].abbreviation);
        }
      } catch (error) {
        console.error("Error loading drivers:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDrivers();
  }, []);

  const driver1 = drivers.find((d) => d.abbreviation === selectedDriver1);
  const driver2 = drivers.find((d) => d.abbreviation === selectedDriver2);

  const DriverCard = ({ driver, position }: { driver: Driver | undefined; position: number }) => {
    if (!driver) {
      return (
        <div className="flex-1 bg-card rounded-xl border p-6 flex items-center justify-center min-h-[320px]">
          <p className="text-muted-foreground">Select a driver</p>
        </div>
      );
    }

    const teamColor = getTeamColor(driver.team);
    const driverImage = driverImages[driver.abbreviation];

    return (
      <div
        className="flex-1 bg-card rounded-xl border overflow-hidden"
        style={{ borderColor: teamColor }}
      >
        {/* Header with team color */}
        <div
          className="h-2"
          style={{ backgroundColor: teamColor }}
        />

        <div className="p-6 space-y-4">
          {/* Position badge */}
          <div className="flex items-center justify-between">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white"
              style={{ backgroundColor: teamColor }}
            >
              {driver.position}
            </div>
            <span className="text-sm text-muted-foreground">P{position}</span>
          </div>

          {/* Driver photo */}
          <div className="flex justify-center">
            {driverImage ? (
              <img
                src={driverImage}
                alt={driver.fullName}
                className="w-32 h-32 rounded-lg object-cover object-top"
              />
            ) : (
              <div
                className="w-32 h-32 rounded-lg flex items-center justify-center text-2xl font-bold text-white"
                style={{ backgroundColor: teamColor }}
              >
                {driver.abbreviation}
              </div>
            )}
          </div>

          {/* Driver info */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold">{driver.fullName}</h3>
            <p className="text-muted-foreground">{driver.team}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: teamColor }}>
                {driver.points}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Points</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: teamColor }}>
                {driver.position}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Position</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Dropdown = ({
    value,
    onChange,
    isOpen,
    onToggle,
    otherValue,
    label,
  }: {
    value: string;
    onChange: (v: string) => void;
    isOpen: boolean;
    onToggle: () => void;
    otherValue: string;
    label: string;
  }) => (
    <div className="relative">
      <label className="text-sm text-muted-foreground mb-1 block">{label}</label>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-2 bg-card border rounded-lg hover:bg-muted transition-colors"
      >
        <span className="font-medium">{value || "Select driver"}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={onToggle} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
            {drivers.map((driver) => {
              const isSelected = driver.abbreviation === value;
              const isOtherSelected = driver.abbreviation === otherValue;
              const teamColor = getTeamColor(driver.team);

              return (
                <button
                  key={driver.abbreviation}
                  onClick={() => {
                    onChange(driver.abbreviation);
                    onToggle();
                  }}
                  disabled={isOtherSelected}
                  className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors ${
                    isSelected ? "bg-muted" : ""
                  } ${isOtherSelected ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: teamColor }}
                  />
                  <span className="font-medium">{driver.abbreviation}</span>
                  <span className="text-sm text-muted-foreground">- {driver.fullName}</span>
                  <span className="ml-auto text-xs text-muted-foreground">P{driver.position}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-6 max-w-xl">
        <Dropdown
          label="Driver 1"
          value={selectedDriver1}
          onChange={setSelectedDriver1}
          isOpen={isDropdown1Open}
          onToggle={() => {
            setIsDropdown1Open(!isDropdown1Open);
            setIsDropdown2Open(false);
          }}
          otherValue={selectedDriver2}
        />
        <Dropdown
          label="Driver 2"
          value={selectedDriver2}
          onChange={setSelectedDriver2}
          isOpen={isDropdown2Open}
          onToggle={() => {
            setIsDropdown2Open(!isDropdown2Open);
            setIsDropdown1Open(false);
          }}
          otherValue={selectedDriver1}
        />
      </div>

      {/* VS indicator */}
      <div className="flex items-center gap-4 max-w-xl">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm font-bold text-muted-foreground">VS</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Driver cards */}
      <div className="flex gap-6 max-w-3xl">
        <DriverCard driver={driver1} position={1} />
        <DriverCard driver={driver2} position={2} />
      </div>

      {/* Comparison stats */}
      {driver1 && driver2 && (
        <div className="bg-card rounded-xl border p-6 max-w-3xl">
          <h3 className="text-lg font-semibold mb-4">Comparison Summary</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{Math.abs(driver1.points - driver2.points)}</p>
              <p className="text-xs text-muted-foreground">Points Difference</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{Math.abs(driver1.position - driver2.position)}</p>
              <p className="text-xs text-muted-foreground">Position Difference</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">
                {driver1.points > driver2.points ? driver1.abbreviation : driver2.abbreviation}
              </p>
              <p className="text-xs text-muted-foreground">Leading</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">
                {driver1.team === driver2.team ? "Same" : "Different"}
              </p>
              <p className="text-xs text-muted-foreground">Team</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
