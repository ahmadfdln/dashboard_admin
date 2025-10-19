import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Users, BookOpen, MapPin, GraduationCap, TrendingUp, Activity, Calendar, Award } from 'lucide-react';

export function Overview({ stats, activityLogs }) {
  // Data untuk grafik pertumbuhan mahasiswa
  const studentGrowthData = [
    { month: 'Jan', mahasiswa: 120, dosen: 15 },
    { month: 'Feb', mahasiswa: 145, dosen: 18 },
    { month: 'Mar', mahasiswa: 168, dosen: 20 },
    { month: 'Apr', mahasiswa: 192, dosen: 22 },
    { month: 'Mei', mahasiswa: 215, dosen: 24 },
    { month: 'Jun', mahasiswa: stats.totalMahasiswa, dosen: stats.totalDosen },
  ];

  // Data untuk distribusi mata kuliah per semester
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

  // Data untuk grafik aktivitas mingguan
  const weeklyActivityData = [
    { day: 'Sen', aktivitas: 45 },
    { day: 'Sel', aktivitas: 52 },
    { day: 'Rab', aktivitas: 61 },
    { day: 'Kam', aktivitas: 48 },
    { day: 'Jum', aktivitas: 70 },
    { day: 'Sab', aktivitas: 28 },
    { day: 'Min', aktivitas: 15 },
  ];

  // Data untuk perbandingan statistik
  const comparisonData = [
    { category: 'Mahasiswa', current: stats.totalMahasiswa, target: 300 },
    { category: 'Dosen', current: stats.totalDosen, target: 30 },
    { category: 'Mata Kuliah', current: stats.totalMataKuliah, target: 60 },
    { category: 'Ruangan', current: stats.totalRuangan, target: 20 },
  ];

  // Data untuk radar chart - kinerja akademik
  const performanceData = [
    { subject: 'Kehadiran', A: 85, fullMark: 100 },
    { subject: 'Tugas', A: 78, fullMark: 100 },
    { subject: 'UTS', A: 82, fullMark: 100 },
    { subject: 'UAS', A: 88, fullMark: 100 },
    { subject: 'Partisipasi', A: 90, fullMark: 100 },
    { subject: 'Proyek', A: 75, fullMark: 100 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  const statsCards = [
    { title: 'Total Mahasiswa', value: stats.totalMahasiswa, icon: GraduationCap, color: 'bg-blue-500', change: '+12%' },
    { title: 'Total Dosen', value: stats.totalDosen, icon: Users, color: 'bg-green-500', change: '+8%' },
    { title: 'Total Mata Kuliah', value: stats.totalMataKuliah, icon: BookOpen, color: 'bg-yellow-500', change: '+5%' },
    { title: 'Total Ruangan', value: stats.totalRuangan, icon: MapPin, color: 'bg-red-500', change: '+15%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Selamat datang di dashboard admin</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafik Pertumbuhan */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Pertumbuhan Mahasiswa & Dosen</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={studentGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="mahasiswa" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Mahasiswa" />
              <Area type="monotone" dataKey="dosen" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Dosen" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Grafik Distribusi Mata Kuliah */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Distribusi Mata Kuliah per Semester</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={courseDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {courseDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafik Aktivitas Mingguan */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Aktivitas Mingguan</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="aktivitas" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 6 }} name="Jumlah Aktivitas" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Grafik Perbandingan Target */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Pencapaian vs Target</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Bar dataKey="current" fill="#3b82f6" name="Saat Ini" radius={[8, 8, 0, 0]} />
              <Bar dataKey="target" fill="#e5e7eb" name="Target" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar Chart dan Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafik Kinerja Akademik */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Rata-rata Kinerja Akademik</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" stroke="#6b7280" />
              <PolarRadiusAxis stroke="#6b7280" />
              <Radar name="Persentase" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Aktivitas Terbaru</h2>
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {activityLogs && activityLogs.length > 0 ? (
              activityLogs.map((log, idx) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{log.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{log.adminEmail}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{log.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">Belum ada aktivitas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}