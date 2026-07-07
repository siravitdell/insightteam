"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface WinRateDatum {
  label: string;
  winRate: number;
}

const CHART_COLORS = {
  bar: "var(--chart-1)",
  grid: "var(--border)",
  axis: "var(--muted-foreground)",
};

export function WinRateBarChart({ data }: { data: WinRateDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis dataKey="label" stroke={CHART_COLORS.axis} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke={CHART_COLORS.axis}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          formatter={(value) => [`${value}%`, "Win rate"]}
          contentStyle={{ borderRadius: 8, borderColor: CHART_COLORS.grid }}
        />
        <Bar dataKey="winRate" fill={CHART_COLORS.bar} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
