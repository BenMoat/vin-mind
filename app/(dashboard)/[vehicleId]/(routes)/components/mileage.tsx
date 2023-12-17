"use client";

import { useTheme } from "next-themes";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface OverviewProps {
  data: any[];
}

export const Mileage: React.FC<OverviewProps> = ({ data }) => {
  const { resolvedTheme } = useTheme();
  const fontColor = resolvedTheme === "dark" ? "#ffffff" : "#000000";
  console.log(data);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#282b31" />
        <XAxis
          dataKey="name"
          stroke={fontColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip />
        <YAxis
          domain={["auto", "auto"]}
          dataKey="uv"
          stroke={fontColor}
          fontSize={12}
          tickLine={false}
          tickFormatter={(value) => value.toLocaleString()}
          axisLine={false}
          startOffset={"auto"}
        />
        <Line dataKey="uv" fill={fontColor} stroke="#22c55e" />
      </LineChart>
    </ResponsiveContainer>
  );
};
