"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { name: "VER", points: 437, color: "3671c6" },
  { name: "NOR", points: 374, color: "ff8000" },
  { name: "LEC", points: 356, color: "e8002d" },
  { name: "SAI", points: 290, color: "e8002d" },
  { name: "PIA", points: 272, color: "ff8000" },
  { name: "PER", points: 234, color: "3671c6" },
  { name: "ALO", points: 181, color: "229971" },
  { name: "HAM", points: 117, color: "27f4d2" },
  { name: "RUS", points: 115, color: "27f4d2" },
  { name: "OCO", points: 62, color: "ff87bc" },
];

export function PointsChart() {
  return (
    <div className="relative h-[300px] w-full">
      <div className="absolute top-2 right-2 z-10 px-2 py-1 text-xs font-bold bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded">
        Demo Data
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Bar dataKey="points" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={`#${entry.color}`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
