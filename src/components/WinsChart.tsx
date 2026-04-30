"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Verstappen", value: 19, color: "3671c6" },
  { name: "Norris", value: 4, color: "ff8000" },
  { name: "Leclerc", value: 3, color: "e8002d" },
  { name: "Sainz", value: 2, color: "e8002d" },
  { name: "Piastri", value: 2, color: "ff8000" },
  { name: "Russell", value: 2, color: "27f4d2" },
  { name: "Hamilton", value: 2, color: "27f4d2" },
  { name: "Perez", value: 1, color: "3671c6" },
];

export function WinsChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={`#${entry.color}`} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
