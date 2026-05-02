import { DestructorsLeaderboard } from "@/components/DestructorsStandings";
import { Bomb, AlertTriangle } from "lucide-react";

export default function DestructorsPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center">
            <Bomb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Destructors Championship</h1>
            <p className="text-muted-foreground text-sm">
              Drivers with the most incidents, retirements, and penalties
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#171717] rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <p className="text-3xl font-black text-red-500">DNF</p>
          </div>
          <p className="text-xs text-gray-500 uppercase mt-1">Did Not Finish</p>
        </div>
        <div className="bg-[#171717] rounded-lg p-4 text-center">
          <p className="text-3xl font-black text-orange-500">Collision</p>
          <p className="text-xs text-gray-500 uppercase mt-1">Accidents</p>
        </div>
        <div className="bg-[#171717] rounded-lg p-4 text-center">
          <p className="text-3xl font-black text-yellow-500">Error</p>
          <p className="text-xs text-gray-500 uppercase mt-1">Driver Mistakes</p>
        </div>
        <div className="bg-[#171717] rounded-lg p-4 text-center">
          <p className="text-3xl font-black text-purple-500">Penalty</p>
          <p className="text-xs text-gray-500 uppercase mt-1">Sanctions</p>
        </div>
      </div>

      {/* Main Content */}
      <DestructorsLeaderboard />
    </div>
  );
}
