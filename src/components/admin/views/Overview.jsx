import React, { useState, useEffect } from "react";
import { StatCard } from "../ui/StatCard";
import { ActivityLogItem } from "../ui/ActivityLogItem";
import {
  GraduationCap,
  UserCheck,
  BookOpen,
  MapPin,
  History,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function Overview({ stats, activityLogs }) {
  const [chartData, setChartData] = useState([]);

  // bikin data grafik dari stats
  useEffect(() => {
    setChartData([
      { name: "Mahasiswa", total: stats.totalMahasiswa },
      { name: "Dosen", total: stats.totalDosen },
      { name: "Mata Kuliah", total: stats.totalMataKuliah },
      { name: "Ruangan", total: stats.totalRuangan },
    ]);
  }, [stats]);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Ringkasan Sistem</h2>

      {/* Statistik Ringkas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={GraduationCap}
          title="Total Mahasiswa"
          value={stats.totalMahasiswa}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCard
          icon={UserCheck}
          title="Total Dosen"
          value={stats.totalDosen}
          color="bg-gradient-to-r from-emerald-500 to-emerald-600"
        />
        <StatCard
          icon={BookOpen}
          title="Mata Kuliah"
          value={stats.totalMataKuliah}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        <StatCard
          icon={MapPin}
          title="Ruangan"
          value={stats.totalRuangan}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
        />
      </div>

      {/* Aktivitas Terbaru */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <History className="w-6 h-6 text-gray-700" />
          <h3 className="text-xl font-bold text-gray-900">Aktivitas Terbaru</h3>
        </div>
        <div className="space-y-4">
          {activityLogs.length > 0 ? (
            activityLogs.map((log) => (
              <ActivityLogItem key={log.id} log={log} />
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">
              Belum ada aktivitas.
            </p>
          )}
        </div>
      </div>

      {/* Grafik Statistik */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 className="w-6 h-6 text-gray-700" />
          <h3 className="text-xl font-bold text-gray-900">
            Grafik Data Sistem
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
