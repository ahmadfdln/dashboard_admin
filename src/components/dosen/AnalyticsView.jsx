import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  PlayCircle,
  TrendingUp,
  Calendar,
  Target,
  Award,
  PieChart as PieChartIcon,
  Search,
  Clock,
  Users,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, ComposedChart, Line
} from "recharts";

import ChartCard from "./ChartCard";
import CustomTooltip from "./CustomTooltip";

const AnalyticsView = ({
  analyticsData,
  mataKuliahList,
  searchTerm,
  setSearchTerm,
  selectedRuang,
  setSelectedRuang,
  handleMulaiSesi,
  ruangKelasList,
}) => {
  return (
    <>
      {/* ROW 1 CHART: TREND + RADAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartCard
          title="Trend Kehadiran Mingguan"
          subtitle="8 minggu terakhir"
          icon={TrendingUp}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={analyticsData.weeklyTrend}>
              <defs>
                <linearGradient id="colorKehadiran" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#111827" vertical={false} />
              <XAxis dataKey="minggu" stroke="#9ca3af" style={{ fontSize: 11 }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: 11 }} domain={[70, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="kehadiran"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorKehadiran)"
                name="Kehadiran"
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#10b981"
                strokeWidth={1.8}
                strokeDasharray="5 5"
                fill="url(#colorTarget)"
                name="Target"
              />
              <Legend verticalAlign="top" height={30} iconType="circle" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Analisis Performa"
          subtitle="Metrik pembelajaran"
          icon={Target}
        >
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={analyticsData.performanceMetrics}>
              <PolarGrid stroke="#111827" />
              <PolarAngleAxis dataKey="metric" style={{ fontSize: 10, fill: "#9ca3af" }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} style={{ fontSize: 9, fill: "#9ca3af" }} />
              <Radar
                name="Performa"
                dataKey="value"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.4}
                strokeWidth={2}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ROW 2 CHART: PER MATA KULIAH + PIE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard
          title="Kehadiran per Mata Kuliah"
          subtitle="Perbandingan status kehadiran"
          icon={BookOpen}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={analyticsData.kehadiranPerMK}>
              <CartesianGrid strokeDasharray="3 3" stroke="#111827" vertical={false} />
              <XAxis
                dataKey="namaMK"
                stroke="#9ca3af"
                style={{ fontSize: 10 }}
                angle={-18}
                textAnchor="end"
                height={70}
              />
              <YAxis stroke="#9ca3af" style={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" />
              <Bar dataKey="hadir" stackId="a" fill="#3b82f6" name="Hadir" />
              <Bar dataKey="izin" stackId="a" fill="#f59e0b" name="Izin" />
              <Bar
                dataKey="alpha"
                stackId="a"
                fill="#ef4444"
                radius={[6, 6, 0, 0]}
                name="Alpha"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Distribusi Status Kehadiran"
          subtitle="Total 890 pertemuan"
          icon={PieChartIcon}
        >
          <ResponsiveContainer width="100%" height={260}>
            <RechartsPieChart>
              <Pie
                data={analyticsData.distribusiKehadiran}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percentage }) => `${name} ${percentage}%`}
                labelLine={false}
              >
                {analyticsData.distribusiKehadiran.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ROW 3: KEHADIRAN HARIAN + TOP MAHASISWA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartCard
          title="Kehadiran per Hari"
          subtitle="Minggu ini"
          icon={Calendar}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={analyticsData.kehadiranHarian}>
              <CartesianGrid strokeDasharray="3 3" stroke="#111827" vertical={false} />
              <XAxis dataKey="hari" stroke="#9ca3af" style={{ fontSize: 11 }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: 11 }} domain={[0, 300]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" />
              <Bar dataKey="hadir" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Hadir" />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#ef4444", r: 3 }}
                name="Total Mahasiswa"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Mahasiswa Terbaik"
          subtitle="Top 5 kehadiran"
          icon={Award}
        >
          <div className="space-y-2.5">
            {analyticsData.topMahasiswa.map((mhs, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/20 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                      idx === 0
                        ? "bg-gradient-to-r from-amber-400 to-yellow-500"
                        : idx === 1
                        ? "bg-gradient-to-r from-gray-400 to-gray-500"
                        : idx === 2
                        ? "bg-gradient-to-r from-orange-400 to-amber-600"
                        : "bg-gradient-to-r from-blue-400 to-purple-600"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{mhs.nama}</p>
                    <p className="text-[11px] text-gray-400">
                      {mhs.hadir} pertemuan
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-green-400">
                    {mhs.persentase}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* JAM KEHADIRAN */}
      <ChartCard
        title="Distribusi Jam Kehadiran"
        subtitle="Pola waktu check-in mahasiswa"
        icon={Clock}
      >
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={analyticsData.jamKehadiran}>
            <defs>
              <linearGradient id="colorJam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#111827" vertical={false} />
            <XAxis dataKey="jam" stroke="#9ca3af" style={{ fontSize: 11 }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="jumlah"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#colorJam)"
              name="Jumlah Check-in"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* MULAI SESI ABSENSI (LIST MATA KULIAH) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1.5">
              Mulai Sesi Absensi
            </h2>
            <p className="text-sm text-gray-300">
              Pilih mata kuliah dan ruangan untuk memulai sesi kehadiran.
            </p>
          </div>
          <div className="relative w-full md:w-auto">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari mata kuliah..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-[#020617]/80 border border-white/15 rounded-xl w-full md:w-72 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {mataKuliahList
            .filter(
              (mk) =>
                mk.namaMK.toLowerCase().includes(searchTerm.toLowerCase()) ||
                mk.kodeMK.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((mk, index) => (
              <motion.div
                key={mk.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-[#020617]/80 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/20 hover:shadow-[0_4px_22px_rgba(0,0,0,0.45)] transition-all"
              >
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1.5">
                          {mk.namaMK}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2.5 text-xs">
                          <span className="px-2.5 py-1 bg-white/5 text-cyan-300 font-semibold rounded-lg border border-white/15">
                            {mk.kodeMK}
                          </span>
                          <span className="flex items-center gap-1.5 text-gray-300">
                            <Clock className="w-3.5 h-3.5" />
                            {mk.sks || 3} SKS
                          </span>
                          <span className="flex items-center gap-1.5 text-gray-300">
                            <Users className="w-3.5 h-3.5" />
                            {Math.floor(Math.random() * 50) + 30} Mahasiswa
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-5 px-5 border-l border-white/10">
                      <div className="text-center">
                        <div className="text-xl font-bold text-white">
                          {Math.floor(Math.random() * 10) + 15}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          Sesi
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-400">
                          {Math.floor(Math.random() * 15) + 80}%
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          Kehadiran
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 lg:w-auto">
                      <select
                        onChange={(e) => setSelectedRuang(e.target.value)}
                        value={selectedRuang}
                        className="px-3.5 py-2.5 text-xs bg-[#020617]/80 border border-white/15 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                      >
                        <option value="">Pilih Ruangan</option>
                        {ruangKelasList?.map((r) => (
                          <option
                            key={r.id}
                            value={r.id}
                            className="bg-slate-900 text-xs"
                          >
                            {r.kodeRuangan || r.namaRuang}
                          </option>
                        ))}
                      </select>

                      <motion.button
                        whileHover={selectedRuang ? { scale: 1.02 } : {}}
                        whileTap={selectedRuang ? { scale: 0.98 } : {}}
                        onClick={() => handleMulaiSesi(mk, selectedRuang)}
                        disabled={!selectedRuang}
                        className={`flex items-center justify-center gap-2 font-semibold py-2.5 px-5 rounded-xl text-xs transition-all duration-200 whitespace-nowrap ${
                          selectedRuang
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg"
                            : "bg-white/5 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <PlayCircle className="w-4 h-4" />
                        Mulai Absensi
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

          {mataKuliahList.filter(
            (mk) =>
              mk.namaMK.toLowerCase().includes(searchTerm.toLowerCase()) ||
              mk.kodeMK.toLowerCase().includes(searchTerm.toLowerCase())
          ).length === 0 && (
            <div className="text-center py-12 bg-[#020617]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
              <Search size={40} className="text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 font-semibold text-sm mb-1.5">
                Tidak ada mata kuliah ditemukan
              </p>
              <p className="text-gray-500 text-xs">
                Coba gunakan kata kunci yang berbeda.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default AnalyticsView;