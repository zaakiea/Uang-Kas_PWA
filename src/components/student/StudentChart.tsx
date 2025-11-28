"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";

interface StudentChartProps {
  data: any[];
  loading: boolean;
}

export default function StudentChart({ data, loading }: StudentChartProps) {
  if (loading) {
    return (
      <div className="h-[350px] flex items-center justify-center bg-white rounded-xl border border-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800">Statistik Bulanan</h3>
        <p className="text-sm text-gray-500">
          Pantau setoranmu vs pengeluaran tahun ini
        </p>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip
              cursor={{ fill: "#f9fafb" }}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number) => [
                `Rp ${value.toLocaleString("id-ID")}`,
                "",
              ]}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />

            {/* Bar Pengeluaran */}
            <Bar
              name="Pengeluaran Total"
              dataKey="pengeluaran_angkatan"
              fill="#ef4444" // Merah
              radius={[4, 4, 0, 0]}
              barSize={20}
            />

            {/* Bar Pemasukan Total */}
            <Bar
              name="Total Pemasukan"
              dataKey="pemasukan_angkatan"
              fill="#e5e7eb" // Abu-abu
              radius={[4, 4, 0, 0]}
              barSize={20}
            />

            {/* Bar Bayaran Saya */}
            <Bar
              name="Setoran Saya"
              dataKey="bayaran_saya"
              fill="#2563eb" // Biru
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
