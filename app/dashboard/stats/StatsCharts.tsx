// app/dashboard/stats/StatsCharts.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

type PaymentPoint = {
  date: string;
  gross: number;
  net: number;
};

export default function StatsCharts({ data }: { data: PaymentPoint[] }) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
          />
          <YAxis
            tick={{ fontSize: 10 }}
          />
          <Tooltip
            formatter={(value: any) =>
              `${Number(value).toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} €`
            }
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="gross"
            name="Brut"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="net"
            name="Net"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

