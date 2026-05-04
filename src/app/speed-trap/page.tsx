import { SpeedTrap } from "@/components/SpeedTrap";

export default function SpeedTrapPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Speed Trap</h1>
        <p className="text-gray-400">
          Maximum speeds through speed traps.
        </p>
      </div>
      <SpeedTrap />
    </div>
  );
}
