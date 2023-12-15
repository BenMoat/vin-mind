"use client";

import { addThousandsSeparators, formatMileage } from "@/lib/utils";
import { ServiceHistory } from "@prisma/client";
import { useTheme } from "next-themes";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface OverviewProps {
  data: ServiceHistory[];
}

export const Mileage: React.FC<OverviewProps> = ({ data }) => {
  const mileageData = data
    .map((item) => ({
      name: new Date(item.serviceDate).toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
      total: item.mileage,
    }))
    .reverse();

  const { resolvedTheme } = useTheme();
  const fontColor = resolvedTheme === "dark" ? "#ffffff" : "#000000";
  console.log(mileageData);
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={mileageData}>
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
          label={{ value: "Mileage", angle: -90 }}
          dataKey="total"
          domain={["auto", "auto"]}
          stroke={fontColor}
          fontSize={12}
          tickLine={false}
          tickFormatter={(value) => value.toLocaleString()}
          axisLine={false}
          startOffset={"auto"}
        />
        <Line dataKey="total" fill={fontColor} stroke="#22c55e" />
      </LineChart>
    </ResponsiveContainer>
  );
};
