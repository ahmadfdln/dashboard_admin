import React, { useState, useMemo } from 'react';
import { 
  BookOpen, PlayCircle, StopCircle, Users, MapPin, Clock, 
  CheckCircle, Search, TrendingUp, Calendar, Target, Activity,
  Award, UserCheck, AlertCircle, BarChart3, PieChart as PieChartIcon,
  ArrowUpRight, ArrowDownRight, Zap
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart,
  Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-xl shadow-xl border border-gray-100">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}</span>
            {entry.unit || ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Metric Card Component
const MetricCard = ({ title, value, change, icon: Icon, color, trend }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {change && (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
          trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      )}
    </div>
    <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-sm text-gray-600">{title}</p>
  </motion.div>
);

// Chart Card Wrapper
const ChartCard = ({ title, subtitle, icon: Icon, children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${className}`}
  >
    <div className="flex items-start justify-between mb-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {Icon && (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
      )}
    </div>
    {children}
  </motion.div>
);

const DashboardContent = ({ 
  isLoading, 
  sesiAktif, 
  daftarHadir, 
  mataKuliahList = [], 
  ruangKelasList = [], 
  riwayatSesi = [],
  usersList = [],
  handleMulaiSesi, 
  handleAkhiriSesi 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRuang, setSelectedRuang] = useState('');

  // Generate advanced analytics data
  const analyticsData = useMemo(() => {
    // Trend kehadiran mingguan dengan smooth curve
    const weeklyTrend = [
      { minggu: 'Minggu 1', kehadiran: 78, target: 85 },
      { minggu: 'Minggu 2', kehadiran: 82, target: 85 },
      { minggu: 'Minggu 3', kehadiran: 85, target: 85 },
      { minggu: 'Minggu 4', kehadiran: 88, target: 85 },
      { minggu: 'Minggu 5', kehadiran: 86, target: 85 },
      { minggu: 'Minggu 6', kehadiran: 91, target: 85 },
      { minggu: 'Minggu 7', kehadiran: 89, target: 85 },
      { minggu: 'Minggu 8', kehadiran: 93, target: 85 }
    ];

    // Kehadiran per mata kuliah
    const kehadiranPerMK = mataKuliahList.slice(0, 5).map((mk, idx) => ({
      namaMK: mk.namaMK.length > 15 ? mk.namaMK.substring(0, 15) + '...' : mk.namaMK,
      hadir: Math.round(85 + Math.random() * 15),
      izin: Math.round(5 + Math.random() * 5),
      alpha: Math.round(3 + Math.random() * 3)
    }));

    // Distribusi kehadiran (Pie Chart)
    const distribusiKehadiran = [
      { name: 'Hadir', value: 765, color: '#10b981', percentage: 86 },
      { name: 'Izin', value: 85, color: '#f59e0b', percentage: 10 },
      { name: 'Alpha', value: 40, color: '#ef4444', percentage: 4 }
    ];

    // Performance radar
    const performanceMetrics = [
      { metric: 'Kehadiran', value: 88, fullMark: 100 },
      { metric: 'Ketepatan', value: 92, fullMark: 100 },
      { metric: 'Partisipasi', value: 85, fullMark: 100 },
      { metric: 'Konsistensi', value: 90, fullMark: 100 },
      { metric: 'Engagement', value: 87, fullMark: 100 }
    ];

    // Kehadiran per hari dalam seminggu
    const kehadiranHarian = [
      { hari: 'Sen', hadir: 245, total: 285 },
      { hari: 'Sel', hadir: 268, total: 285 },
      { hari: 'Rab', hadir: 252, total: 285 },
      { hari: 'Kam', hadir: 271, total: 285 },
      { hari: 'Jum', hadir: 238, total: 285 }
    ];

    // Top 5 mahasiswa
    const topMahasiswa = [
      { nama: 'Ahmad Rizki Pratama', hadir: 24, persentase: 100 },
      { nama: 'Siti Nurhaliza', hadir: 23, persentase: 96 },
      { nama: 'Budi Santoso', hadir: 23, persentase: 96 },
      { nama: 'Dewi Lestari', hadir: 22, persentase: 92 },
      { nama: 'Eko Prasetyo', hadir: 22, persentase: 92 }
    ];

    // Jam kehadiran (Heatmap data)
    const jamKehadiran = [
      { jam: '07:00', jumlah: 45 },
      { jam: '08:00', jumlah: 78 },
      { jam: '09:00', jumlah: 125 },
      { jam: '10:00', jumlah: 98 },
      { jam: '11:00', jumlah: 65 },
      { jam: '13:00', jumlah: 88 },
      { jam: '14:00', jumlah: 112 },
      { jam: '15:00', jumlah: 75 }
    ];

    return {
      weeklyTrend,
      kehadiranPerMK,
      distribusiKehadiran,
      performanceMetrics,
      kehadiranHarian,
      topMahasiswa,
      jamKehadiran
    };
  }, [mataKuliahList]);

  if (isLoading && !sesiAktif) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100 mb-4">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">Real-time Analytics</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Dashboard Absensi
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Monitoring kehadiran dan analisis performa mahasiswa secara real-time
          </p>
        </motion.div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Mahasiswa"
            value={usersList.length || 285}
            change="+12%"
            trend="up"
            icon={Users}
            color="from-blue-500 to-blue-600"
          />
          <MetricCard
            title="Rata-rata Kehadiran"
            value="88%"
            change="+5.2%"
            trend="up"
            icon={CheckCircle}
            color="from-green-500 to-emerald-600"
          />
          <MetricCard
            title="Total Sesi"
            value={riwayatSesi.length + (sesiAktif ? 1 : 0)}
            change="+3"
            trend="up"
            icon={Calendar}
            color="from-purple-500 to-indigo-600"
          />
          <MetricCard
            title="Tingkat Alpha"
            value="4.5%"
            change="-1.2%"
            trend="up"
            icon={AlertCircle}
            color="from-orange-500 to-red-500"
          />
        </div>

        {sesiAktif ? (
          // Active Session View
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-xl"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <div className="flex items-center gap-4 mb-4 lg:mb-0">
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                    <PlayCircle size={32} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold">
                      LIVE
                    </span>
                    <span className="text-sm opacity-90">
                      {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold mb-1">{sesiAktif.namaMK}</h2>
                  <p className="opacity-90">{sesiAktif.kodeMK}</p>
                </div>
              </div>
              <button
                onClick={handleAkhiriSesi}
                className="flex items-center gap-2 bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition-all shadow-lg"
              >
                <StopCircle size={20} />
                Akhiri Sesi
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Daftar Kehadiran</h3>
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold">{daftarHadir.length} Hadir</span>
                  </div>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {daftarHadir.length > 0 ? (
                    daftarHadir.map((mhs, idx) => (
                      <motion.div
                        key={mhs.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center justify-between bg-white/10 backdrop-blur p-4 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-semibold">{mhs.namaMahasiswa}</p>
                            <p className="text-sm opacity-75">Check-in berhasil</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {new Date(mhs.waktuAbsen?.seconds * 1000).toLocaleTimeString('id-ID', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                          <CheckCircle className="w-4 h-4 ml-auto mt-1" />
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Users size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium opacity-90">Menunggu mahasiswa check-in</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold mb-2">{daftarHadir.length}</div>
                  <p className="text-sm opacity-90">Mahasiswa Hadir</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
                  <div className="text-4xl font-bold mb-2">
                    {Math.round((daftarHadir.length / (usersList.length || 1)) * 100) || 0}%
                  </div>
                  <p className="text-sm opacity-90">Tingkat Kehadiran</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                  <p className="text-sm mb-2 opacity-90">Progress Target (85%)</p>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div 
                      className="h-3 bg-white rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (daftarHadir.length / (usersList.length || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Advanced Analytics Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* 1. Trend Kehadiran - Area Chart */}
              <ChartCard 
                title="Trend Kehadiran Mingguan" 
                subtitle="8 minggu terakhir"
                icon={TrendingUp}
                className="lg:col-span-2"
              >
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={analyticsData.weeklyTrend}>
                    <defs>
                      <linearGradient id="colorKehadiran" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis 
                      dataKey="minggu" 
                      stroke="#9ca3af" 
                      style={{ fontSize: 12, fontWeight: 500 }} 
                    />
                    <YAxis 
                      stroke="#9ca3af" 
                      style={{ fontSize: 12 }}
                      domain={[70, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="kehadiran" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fill="url(#colorKehadiran)" 
                      name="Kehadiran"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fill="url(#colorTarget)" 
                      name="Target"
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={36}
                      iconType="circle"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* 2. Performance Radar */}
              <ChartCard 
                title="Analisis Performa" 
                subtitle="Metrik pembelajaran"
                icon={Target}
              >
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={analyticsData.performanceMetrics}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis 
                      dataKey="metric" 
                      style={{ fontSize: 11, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]}
                      style={{ fontSize: 10 }}
                    />
                    <Radar 
                      name="Performa" 
                      dataKey="value" 
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.6}
                      strokeWidth={2}
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Second Row of Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* 3. Kehadiran Per Mata Kuliah - Stacked Bar */}
              <ChartCard 
                title="Kehadiran per Mata Kuliah" 
                subtitle="Perbandingan status kehadiran"
                icon={BookOpen}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.kehadiranPerMK}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis 
                      dataKey="namaMK" 
                      stroke="#9ca3af"
                      style={{ fontSize: 11 }}
                      angle={-20}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="#9ca3af" style={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" />
                    <Bar dataKey="hadir" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} name="Hadir" />
                    <Bar dataKey="izin" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} name="Izin" />
                    <Bar dataKey="alpha" stackId="a" fill="#ef4444" radius={[8, 8, 0, 0]} name="Alpha" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* 4. Distribusi Kehadiran - Donut Chart */}
              <ChartCard 
                title="Distribusi Status Kehadiran" 
                subtitle="Total 890 pertemuan"
                icon={PieChartIcon}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={analyticsData.distribusiKehadiran}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
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

            {/* Third Row of Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* 5. Kehadiran Harian */}
              <ChartCard 
                title="Kehadiran per Hari" 
                subtitle="Minggu ini"
                icon={Calendar}
                className="lg:col-span-2"
              >
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart data={analyticsData.kehadiranHarian}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="hari" stroke="#9ca3af" style={{ fontSize: 12, fontWeight: 500 }} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: 12 }} domain={[0, 300]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" />
                    <Bar dataKey="hadir" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Hadir" />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#ef4444', r: 4 }}
                      name="Total Mahasiswa"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* 6. Top Mahasiswa */}
              <ChartCard 
                title="Mahasiswa Terbaik" 
                subtitle="Top 5 kehadiran"
                icon={Award}
              >
                <div className="space-y-3">
                  {analyticsData.topMahasiswa.map((mhs, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-gray-100 hover:to-blue-100 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          idx === 0 ? 'bg-gradient-to-r from-amber-400 to-yellow-500' :
                          idx === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                          idx === 2 ? 'bg-gradient-to-r from-orange-400 to-amber-600' :
                          'bg-gradient-to-r from-blue-400 to-blue-600'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{mhs.nama}</p>
                          <p className="text-xs text-gray-500">{mhs.hadir} pertemuan</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{mhs.persentase}%</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ChartCard>
            </div>

            {/* Jam Kehadiran Chart */}
            <ChartCard 
              title="Distribusi Jam Kehadiran" 
              subtitle="Pola waktu check-in mahasiswa"
              icon={Clock}
            >
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={analyticsData.jamKehadiran}>
                  <defs>
                    <linearGradient id="colorJam" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="jam" stroke="#9ca3af" style={{ fontSize: 12 }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="jumlah" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    fill="url(#colorJam)"
                    name="Jumlah Check-in"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Course Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Mulai Sesi Absensi</h2>
                  <p className="text-gray-600">Pilih mata kuliah dan ruangan untuk memulai sesi kehadiran</p>
                </div>
                <div className="relative w-full md:w-auto">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Cari mata kuliah..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl w-full md:w-80 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm" 
                  />
                </div>
              </div>
              
              <div className="grid gap-4">
                {mataKuliahList
                  .filter(mk =>
                    mk.namaMK.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    mk.kodeMK.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((mk, index) => (
                  <motion.div
                    key={mk.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Course Info */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                            <BookOpen className="w-7 h-7 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{mk.namaMK}</h3>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-lg">
                                {mk.kodeMK}
                              </span>
                              <span className="flex items-center gap-1.5 text-gray-600 text-sm">
                                <Clock className="w-4 h-4" />
                                {mk.sks || 3} SKS
                              </span>
                              <span className="flex items-center gap-1.5 text-gray-600 text-sm">
                                <Users className="w-4 h-4" />
                                {Math.floor(Math.random() * 50) + 30} Mahasiswa
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="hidden lg:flex items-center gap-6 px-6 border-l border-gray-100">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              {Math.floor(Math.random() * 10) + 15}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Sesi</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {Math.floor(Math.random() * 15) + 80}%
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Kehadiran</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 lg:w-auto">
                          <select 
                            onChange={e => setSelectedRuang(e.target.value)} 
                            value={selectedRuang}
                            className="px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm hover:border-gray-300 transition-colors"
                          >
                            <option value="">Pilih Ruangan</option>
                            {ruangKelasList?.map(r => (
                              <option key={r.id} value={r.id}>
                                {r.kodeRuangan || r.namaRuang}
                              </option>
                            ))}
                          </select>
                          
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleMulaiSesi(mk, selectedRuang)} 
                            disabled={!selectedRuang}
                            className={`
                              flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-xl text-sm
                              transition-all duration-200 whitespace-nowrap shadow-sm
                              ${selectedRuang
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:from-green-600 hover:to-emerald-700'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }
                            `}
                          >
                            <PlayCircle className="w-5 h-5" />
                            Mulai Absensi
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {mataKuliahList.filter(mk =>
                  mk.namaMK.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  mk.kodeMK.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                    <Search size={56} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-semibold text-lg mb-2">Tidak ada mata kuliah ditemukan</p>
                    <p className="text-gray-400 text-sm">Coba gunakan kata kunci yang berbeda</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;