"use client";

import { useTheme } from "next-themes";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface OverviewProps {
  data: any[];
}

export const Mileage: React.FC<OverviewProps> = ({ data }) => {
  const dummyData = [
    { name: "January", total: 10023 },
    { name: "February", total: 10500 },
    { name: "March", total: 11000 },
    { name: "April", total: 11651 },
    { name: "May", total: 12102 },
    { name: "June", total: 12333 },
    { name: "July", total: 12400 },
    { name: "August", total: 12599 },
    { name: "September", total: 12893 },
    { name: "October", total: 12915 },
    { name: "November", total: 13105 },
    { name: "December", total: 13116 },
  ];

  const { resolvedTheme } = useTheme();
  const fontColor = resolvedTheme === "dark" ? "#ffffff" : "#000000";

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={dummyData}>
        <XAxis
          dataKey="name"
          stroke={fontColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          className=""
          domain={[10000, "auto"]}
          stroke={fontColor}
          fontSize={12}
          tickLine={false}
          tickFormatter={(value) => `${value}`}
          axisLine={false}
          startOffset={10000}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
