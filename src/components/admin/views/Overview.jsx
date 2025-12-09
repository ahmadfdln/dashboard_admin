import React from 'react';
import {
  BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

import {
  Users, BookOpen, MapPin,
  GraduationCap, TrendingUp,
  Activity, Calendar, Award
} from 'lucide-react';

export function Overview({ stats, activityLogs }) {

  // ==================== DATA ====================
  const studentGrowthData = [
    { month: 'Jan', mahasiswa: 120, dosen: 15 },
    { month: 'Feb', mahasiswa: 145, dosen: 18 },
    { month: 'Mar', mahasiswa: 168, dosen: 20 },
    { month: 'Apr', mahasiswa: 192, dosen: 22 },
    { month: 'Mei', mahasiswa: 215, dosen: 24 },
    { month: 'Jun', mahasiswa: stats.totalMahasiswa, dosen: stats.totalDosen },
  ];

  const courseDistributionData = [
    { name: 'Semester 1', value: 8 },
    { name: 'Semester 2', value: 8 },
    { name: 'Semester 3', value: 7 },
    { name: 'Semester 4', value: 7 },
    { name: 'Semester 5', value: 6 },
    { name: 'Semester 6', value: 6 },
    { name: 'Semester 7', value: 4 },
    { name: 'Semester 8', value: 4 },
  ];

  const weeklyActivityData = [
    { day: 'Sen', aktivitas: 45 },
    { day: 'Sel', aktivitas: 52 },
    { day: 'Rab', aktivitas: 61 },
    { day: 'Kam', aktivitas: 48 },
    { day: 'Jum', aktivitas: 70 },
    { day: 'Sab', aktivitas: 28 },
    { day: 'Min', aktivitas: 15 },
  ];

  const comparisonData = [
    { category: 'Mahasiswa', current: stats.totalMahasiswa, target: 300 },
    { category: 'Dosen', current: stats.totalDosen, target: 30 },
    { category: 'Mata Kuliah', current: stats.totalMataKuliah, target: 60 },
    { category: 'Ruangan', current: stats.totalRuangan, target: 20 },
  ];

  const performanceData = [
    { subject: 'Kehadiran', A: 85, fullMark: 100 },
    { subject: 'Tugas', A: 78, fullMark: 100 },
    { subject: 'UTS', A: 82, fullMark: 100 },
    { subject: 'UAS', A: 88, fullMark: 100 },
    { subject: 'Partisipasi', A: 90, fullMark: 100 },
    { subject: 'Proyek', A: 75, fullMark: 100 },
  ];

  const COLORS = [
    '#3b82f6', '#10b981', '#f59e0b',
    '#ef4444', '#8b5cf6', '#ec4899',
    '#14b8a6', '#f97316'
  ];

  const statsCards = [
    { title: 'Total Mahasiswa', value: stats.totalMahasiswa, icon: GraduationCap, color: 'text-blue-400', change: '+12%' },
    { title: 'Total Dosen', value: stats.totalDosen, icon: Users, color: 'text-green-400', change: '+8%' },
    { title: 'Total Mata Kuliah', value: stats.totalMataKuliah, icon: BookOpen, color: 'text-yellow-300', change: '+5%' },
    { title: 'Total Ruangan', value: stats.totalRuangan, icon: MapPin, color: 'text-red-400', change: '+15%' },
  ];

  // ==================== UI ====================
  return (
    <div className="space-y-4">

      {/* HEADER SECTION */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-300 mt-1">Selamat datang di dashboard admin</p>
        </div>

        {/* Date badge */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10">
          <Calendar className="w-5 h-5 text-green-300" />
          <span className="text-sm text-gray-200">
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* === STATS CARDS === */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, i) => (
          <div key={i} className="
            bg-[#0C1022]/70
            backdrop-blur-xl
            border border-white/10
            rounded-2xl p-6
            shadow-[0_4px_20px_rgba(0,0,0,0.4)]
            hover:border-white/20
            transition-all duration-300
          ">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <span className="text-xs px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/40 rounded-lg">
                {stat.change}
              </span>
            </div>

            <p className="text-gray-300 text-sm">{stat.title}</p>
            <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* === MAIN GRAPH ROW 1 === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Growth Chart */}
        <GlassPanel title="Pertumbuhan Mahasiswa & Dosen" icon={<TrendingUp className="w-5 h-5 text-blue-400" />}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={studentGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={darkTooltip} />
              <Legend />
              <Area type="monotone" dataKey="mahasiswa" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
              <Area type="monotone" dataKey="dosen" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassPanel>

        {/* Pie Chart */}
        <GlassPanel title="Distribusi Mata Kuliah per Semester" icon={<BookOpen className="w-5 h-5 text-purple-400" />}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={courseDistributionData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}`}
                dataKey="value"
              >
                {courseDistributionData.map((d, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={darkTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </GlassPanel>

      </div>

      {/* === MAIN GRAPH ROW 2 === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Weekly Activity */}
        <GlassPanel title="Aktivitas Mingguan" icon={<Activity className="w-5 h-5 text-violet-400" />}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={darkTooltip} />
              <Legend />
              <Line type="monotone" dataKey="aktivitas" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </GlassPanel>

        {/* Bar Chart */}
        <GlassPanel title="Pencapaian vs Target" icon={<Award className="w-5 h-5 text-cyan-400" />}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="category" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={darkTooltip} />
              <Legend />
              <Bar dataKey="current" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="target" fill="rgba(255,255,255,0.2)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassPanel>

      </div>

      {/* === RADAR + LOG === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Radar */}
        <GlassPanel title="Rata-rata Kinerja Akademik" icon={<Award className="w-5 h-5 text-emerald-400" />}>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={performanceData}>
              <PolarGrid stroke="rgba(255,255,255,0.2)" />
              <PolarAngleAxis dataKey="subject" stroke="#ddd" />
              <PolarRadiusAxis stroke="rgba(255,255,255,0.2)" />
              <Radar dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Tooltip contentStyle={darkTooltip} />
            </RadarChart>
          </ResponsiveContainer>
        </GlassPanel>

        {/* Activity Logs */}
        <GlassPanel title="Aktivitas Terbaru" icon={<Activity className="w-5 h-5 text-orange-400" />}>
          <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">

            {activityLogs?.length ? (
              activityLogs.map((log, i) => (
                <div key={i} className="
                  bg-white/5 p-3 rounded-xl
                  border border-white/10
                  hover:bg-white/10
                  transition shadow-sm
                  flex items-start gap-3
                ">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-200">{log.action}</p>
                    <p className="text-xs text-gray-400 mt-1">{log.adminEmail} • {log.timestamp}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-6 text-sm">Belum ada aktivitas</p>
            )}

          </div>
        </GlassPanel>

      </div>

      {/* Scrollbar Style */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>

    </div>
  );
}



// Small reusable glass-panel wrapper
function GlassPanel({ children, title, icon }) {
  return (
    <div className="
      bg-[#0C1022]/70
      backdrop-blur-xl
      border border-white/10
      rounded-2xl p-6
      shadow-[0_4px_20px_rgba(0,0,0,0.4)]
      hover:border-white/20
      transition-all duration-300
    ">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>

      {children}
    </div>
  );
}


// Tooltip style 
const darkTooltip = {
  backgroundColor: "rgba(0,0,0,0.85)",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "#fff",
  padding: "8px"
};

