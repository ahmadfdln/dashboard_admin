import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  PlayCircle, 
  StopCircle, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Search,
  TrendingUp,
  Calendar,
  Target,
  Activity,
  Award,
  UserCheck,
  Timer,
  Settings
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import StatCard from './StatCard';
import LoadingSpinner from './LoadingSpinner';

const DashboardContent = ({ 
  isLoading, 
  sesiAktif, 
  daftarHadir, 
  mataKuliahList, 
  ruangKelasList, 
  riwayatSesi = [],
  usersList = [],
  handleMulaiSesi, 
  handleAkhiriSesi 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRuang, setSelectedRuang] = useState('');

  // Helper functions untuk analisis data real
  const getTimeFromTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.getHours();
  };

  const getDayFromTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.getDay();
  };

  // Data real untuk statistik dashboard
  const dashboardStats = useMemo(() => {
    const totalSesi = riwayatSesi.length;
    const totalMahasiswa = usersList.length;
    const rataKehadiran = totalSesi > 0 ? Math.round((daftarHadir.length / totalMahasiswa) * 100) || 0 : 0;
    const sesiHariIni = riwayatSesi.filter(sesi => {
      const today = new Date();
      const sesiDate = new Date(sesi.waktuMulai.seconds * 1000);
      return sesiDate.toDateString() === today.toDateString();
    }).length;

    return {
      totalMataKuliah: mataKuliahList.length,
      sesiAktifCount: sesiAktif ? 1 : 0,
      mahasiswaHadir: sesiAktif ? daftarHadir.length : 0,
      totalRuangan: ruangKelasList.length,
      rataKehadiran,
      totalSesi,
      sesiHariIni,
      totalMahasiswa
    };
  }, [riwayatSesi, usersList, daftarHadir, mataKuliahList, ruangKelasList, sesiAktif]);

  // Data aktivitas per hari (7 hari terakhir)
  const aktivitasHarian = useMemo(() => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dayName = date.toLocaleDateString('id-ID', { weekday: 'short' });
      const dayString = date.toDateString();
      
      const sesiHari = riwayatSesi.filter(sesi => {
        const sesiDate = new Date(sesi.waktuMulai.seconds * 1000);
        return sesiDate.toDateString() === dayString;
      }).length;

      last7Days.push({
        hari: dayName,
        sesi: sesiHari,
        tanggal: date.getDate()
      });
    }
    
    return last7Days;
  }, [riwayatSesi]);

  // Data distribusi waktu sesi
  const distribusiWaktu = useMemo(() => {
    const waktuData = { pagi: 0, siang: 0, sore: 0, malam: 0 };
    
    riwayatSesi.forEach(sesi => {
      const hour = getTimeFromTimestamp(sesi.waktuMulai);
      if (hour >= 6 && hour < 12) waktuData.pagi++;
      else if (hour >= 12 && hour < 17) waktuData.siang++;
      else if (hour >= 17 && hour < 20) waktuData.sore++;
      else waktuData.malam++;
    });

    return [
      { name: 'Pagi', value: waktuData.pagi, color: '#10B981' },
      { name: 'Siang', value: waktuData.siang, color: '#F59E0B' },
      { name: 'Sore', value: waktuData.sore, color: '#3B82F6' },
      { name: 'Malam', value: waktuData.malam, color: '#8B5CF6' }
    ];
  }, [riwayatSesi]);

  // Data mata kuliah dengan statistik
  const mataKuliahStats = useMemo(() => {
    return mataKuliahList.map(mk => {
      const sesiMK = riwayatSesi.filter(sesi => sesi.namaMK === mk.namaMK).length;
      const lastSesi = riwayatSesi
        .filter(sesi => sesi.namaMK === mk.namaMK)
        .sort((a, b) => b.waktuMulai.seconds - a.waktuMulai.seconds)[0];
      
      return {
        ...mk,
        totalSesi: sesiMK,
        lastSesi: lastSesi ? new Date(lastSesi.waktuMulai.seconds * 1000) : null,
        engagement: Math.min(100, 60 + (sesiMK * 5)) // Base engagement + bonus per sesi
      };
    });
  }, [mataKuliahList, riwayatSesi]);

  const filteredMataKuliah = mataKuliahStats.filter(mk =>
    mk.namaMK.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mk.kodeMK.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && !sesiAktif) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg mb-4">
            <Activity className="text-blue-600" size={24} />
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Dashboard Control</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Sistem Absensi Digital
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dashboard utama untuk mengelola sesi kehadiran dan monitoring aktivitas mahasiswa
          </p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 rounded-2xl text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Mata Kuliah</p>
                <p className="text-3xl font-bold">{dashboardStats.totalMataKuliah}</p>
                <p className="text-blue-100 text-xs mt-1">Aktif semester ini</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <BookOpen size={28} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-2xl text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Sesi Aktif</p>
                <p className="text-3xl font-bold">{dashboardStats.sesiAktifCount}</p>
                <p className="text-green-100 text-xs mt-1">
                  {sesiAktif ? 'Sedang berlangsung' : 'Tidak ada sesi aktif'}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <PlayCircle size={28} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-2xl text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Mahasiswa Hadir</p>
                <p className="text-3xl font-bold">{dashboardStats.mahasiswaHadir}</p>
                <p className="text-purple-100 text-xs mt-1">
                  {sesiAktif ? 'Sesi aktif saat ini' : 'Dari total ' + dashboardStats.totalMahasiswa}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <Users size={28} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-2xl text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Total Ruangan</p>
                <p className="text-3xl font-bold">{dashboardStats.totalRuangan}</p>
                <p className="text-orange-100 text-xs mt-1">Ruang kelas tersedia</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <MapPin size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section - Only show when no active session */}
        {!sesiAktif && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Aktivitas 7 Hari Terakhir */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Aktivitas 7 Hari Terakhir</h3>
                  <p className="text-sm text-gray-600">Jumlah sesi per hari</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={aktivitasHarian}>
                  <defs>
                    <linearGradient id="colorSesi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="hari" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                    }}
                    formatter={(value) => [value, 'Jumlah Sesi']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sesi" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorSesi)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Distribusi Waktu Sesi */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Timer className="text-green-600" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Distribusi Waktu Sesi</h3>
                  <p className="text-sm text-gray-600">Pola waktu pelaksanaan</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={distribusiWaktu}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {distribusiWaktu.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} sesi`, 'Total']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Active Session or Course Selection */}
        {sesiAktif ? (
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-3xl border border-green-200 shadow-xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <div className="flex items-center mb-4 lg:mb-0">
                <div className="relative mr-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <PlayCircle size={32} className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold uppercase tracking-wide">
                      Live Session
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-1">{sesiAktif.namaMK}</h2>
                  <div className="flex items-center gap-4 text-gray-600">
                    <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">{sesiAktif.kodeMK}</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={16} />
                      {ruangKelasList.find(r => r.id === sesiAktif.ruangKelasId)?.kodeRuangan || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleAkhiriSesi} 
                className="flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <StopCircle size={22}/>
                Akhiri Sesi
              </button>
            </div>

            {/* Real-time Attendance Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Daftar Kehadiran Real-time</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-600">{daftarHadir.length} Hadir</span>
                    </div>
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {Math.round((daftarHadir.length / dashboardStats.totalMahasiswa) * 100) || 0}% Kehadiran
                    </div>
                  </div>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {daftarHadir.length > 0 ? daftarHadir.map((mhs, index) => (
                    <div key={mhs.id} className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-green-50 hover:from-gray-100 hover:to-green-100 p-4 rounded-xl transition-all duration-200 border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle size={12} className="text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{mhs.namaMahasiswa}</p>
                          <p className="text-sm text-gray-500">Check-in berhasil</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">
                          {new Date(mhs.waktuAbsen.seconds * 1000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <div className="flex items-center gap-1 mt-1 justify-end">
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-xs text-green-600 font-medium">Hadir</span>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users size={40} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium text-lg">Menunggu mahasiswa check-in</p>
                      <p className="text-gray-400 text-sm mt-2">Sesi telah dimulai, mahasiswa dapat melakukan absensi</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Session Statistics */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Statistik Sesi</h3>
                <div className="space-y-6">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{daftarHadir.length}</div>
                    <div className="text-sm text-blue-700 font-medium">Mahasiswa Hadir</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      {Math.round((daftarHadir.length / dashboardStats.totalMahasiswa) * 100) || 0}%
                    </div>
                    <div className="text-sm text-purple-700 font-medium">Tingkat Kehadiran</div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <div className="text-3xl font-bold text-orange-600 mb-1">
                      {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-sm text-orange-700 font-medium">Waktu Saat Ini</div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Target size={16} />
                      <span>Target Kehadiran: 85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500" 
                        style={{ 
                          width: `${Math.min(100, (daftarHadir.length / dashboardStats.totalMahasiswa) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Mulai Sesi Absensi</h2>
                <p className="text-gray-600">Pilih mata kuliah dan ruangan untuk memulai sesi kehadiran</p>
              </div>
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Cari mata kuliah..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm" 
                />
              </div>
            </div>
            
            <div className="grid gap-6">
              {filteredMataKuliah.map(mk => (
                <div key={mk.id} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <BookOpen size={32} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{mk.namaMK}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">{mk.kodeMK}</span>
                            <span className="flex items-center gap-1">
                              <Clock size={16} />
                              {mk.sks} SKS
                            </span>
                          </div>
                          
                          {/* Real Statistics */}
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-3 rounded-xl">
                              <div className="text-lg font-bold text-blue-600">{mk.totalSesi}</div>
                              <div className="text-xs text-blue-700">Total Sesi</div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-xl">
                              <div className="text-lg font-bold text-green-600">{mk.engagement}%</div>
                              <div className="text-xs text-green-700">Engagement</div>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-xl">
                              <div className="text-xs font-medium text-purple-600">
                                {mk.lastSesi ? mk.lastSesi.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : 'Belum ada'}
                              </div>
                              <div className="text-xs text-purple-700">Terakhir</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full lg:w-auto">
                      <select 
                        onChange={e => setSelectedRuang(e.target.value)} 
                        value={selectedRuang}
                        className="flex-grow lg:w-48 px-4 py-4 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium shadow-sm"
                      >
                        <option value="">Pilih Ruangan</option>
                        {ruangKelasList.map(r => (
                          <option key={r.id} value={r.id}>
                            {r.kodeRuangan} - Kapasitas {r.kapasitas || 'N/A'}
                          </option>
                        ))}
                      </select>
                      <button 
                        onClick={() => handleMulaiSesi(mk, selectedRuang)} 
                        disabled={!selectedRuang} 
                        className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                      >
                        <PlayCircle size={22}/> 
                        Mulai Sesi
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredMataKuliah.length === 0 && (
                <div className="text-center py-12 bg-white rounded-3xl shadow-lg">
                  <Search size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium text-lg">Tidak ada mata kuliah yang cocok</p>
                  <p className="text-gray-400 text-sm mt-2">Silakan coba dengan kata kunci lain</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;