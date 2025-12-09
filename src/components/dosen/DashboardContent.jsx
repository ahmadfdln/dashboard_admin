import React, { useState, useMemo } from "react";
import { Users, CheckCircle, Calendar, AlertCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";

// IMPORT COMPONENTS
import MetricCard from "./MetricCard";
import ActiveSessionView from "./ActiveSessionView";
import AnalyticsView from "./AnalyticsView";

const DashboardContent = ({
  isLoading,
  sesiAktif,
  daftarHadir,
  daftarIzin = [],
  mataKuliahList = [],
  ruangKelasList = [],
  riwayatSesi = [],
  usersList = [],
  handleMulaiSesi,
  handleAkhiriSesi,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRuang, setSelectedRuang] = useState("");
  const [activeTab, setActiveTab] = useState("hadir");

  const analyticsData = useMemo(() => {
    // ... Data dummy untuk grafik tetap di sini ...
    const weeklyTrend = [
      { minggu: "Minggu 1", kehadiran: 78, target: 85 },
      { minggu: "Minggu 2", kehadiran: 82, target: 85 },
      { minggu: "Minggu 3", kehadiran: 85, target: 85 },
      { minggu: "Minggu 4", kehadiran: 88, target: 85 },
      { minggu: "Minggu 5", kehadiran: 86, target: 85 },
      { minggu: "Minggu 6", kehadiran: 91, target: 85 },
      { minggu: "Minggu 7", kehadiran: 89, target: 85 },
      { minggu: "Minggu 8", kehadiran: 93, target: 85 },
    ];

    const kehadiranPerMK = mataKuliahList.slice(0, 5).map((mk) => ({
      namaMK:
        mk.namaMK.length > 18 ? mk.namaMK.substring(0, 18) + "..." : mk.namaMK,
      hadir: Math.round(85 + Math.random() * 15),
      izin: Math.round(5 + Math.random() * 5),
      alpha: Math.round(3 + Math.random() * 3),
    }));

    const distribusiKehadiran = [
      { name: "Hadir", value: 765, color: "#3b82f6", percentage: 86 },
      { name: "Izin", value: 85, color: "#f59e0b", percentage: 10 },
      { name: "Alpha", value: 40, color: "#ef4444", percentage: 4 },
    ];

    const performanceMetrics = [
      { metric: "Kehadiran", value: 88, fullMark: 100 },
      { metric: "Ketepatan", value: 92, fullMark: 100 },
      { metric: "Partisipasi", value: 85, fullMark: 100 },
      { metric: "Konsistensi", value: 90, fullMark: 100 },
      { metric: "Engagement", value: 87, fullMark: 100 },
    ];

    const kehadiranHarian = [
      { hari: "Sen", hadir: 245, total: 285 },
      { hari: "Sel", hadir: 268, total: 285 },
      { hari: "Rab", hadir: 252, total: 285 },
      { hari: "Kam", hadir: 271, total: 285 },
      { hari: "Jum", hadir: 238, total: 285 },
    ];

    const topMahasiswa = [
      { nama: "Ahmad Rizki Pratama", hadir: 24, persentase: 100 },
      { nama: "Siti Nurhaliza", hadir: 23, persentase: 96 },
      { nama: "Budi Santoso", hadir: 23, persentase: 96 },
      { nama: "Dewi Lestari", hadir: 22, persentase: 92 },
      { nama: "Eko Prasetyo", hadir: 22, persentase: 92 },
    ];

    const jamKehadiran = [
      { jam: "07:00", jumlah: 45 },
      { jam: "08:00", jumlah: 78 },
      { jam: "09:00", jumlah: 125 },
      { jam: "10:00", jumlah: 98 },
      { jam: "11:00", jumlah: 65 },
      { jam: "13:00", jumlah: 88 },
      { jam: "14:00", jumlah: 112 },
      { jam: "15:00", jumlah: 75 },
    ];

    return {
      weeklyTrend,
      kehadiranPerMK,
      distribusiKehadiran,
      performanceMetrics,
      kehadiranHarian,
      topMahasiswa,
      jamKehadiran,
    };
  }, [mataKuliahList]);

  if (isLoading && !sesiAktif) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-300 text-sm font-medium">
            Memuat dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ===================== HEADER ===================== */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/20 mb-2">
            <Zap className="w-4 h-4 text-cyan-300" />
            <span className="text-xs font-semibold text-gray-200">
              Real-time Analytics
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Dashboard Absensi
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            Monitoring kehadiran dan analisis performa mahasiswa secara real-time.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#020617]/90 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <Calendar className="w-4 h-4 text-cyan-300" />
          <span className="text-xs text-gray-200">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </motion.div>

      {/* ===================== METRIC CARDS ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Mahasiswa"
          value={usersList.length || 285}
          change="+12%"
          trend="up"
          icon={Users}
          color="from-blue-500 to-cyan-500"
        />
        <MetricCard
          title="Rata-rata Kehadiran"
          value="88%"
          change="+5.2%"
          trend="up"
          icon={CheckCircle}
          color="from-emerald-500 to-cyan-500"
        />
        <MetricCard
          title="Total Sesi"
          value={riwayatSesi.length + (sesiAktif ? 1 : 0)}
          change="+3"
          trend="up"
          icon={Calendar}
          color="from-purple-500 to-indigo-500"
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
        /* ===================== VIEW SAAT ADA SESI AKTIF ===================== */
        <ActiveSessionView
          sesiAktif={sesiAktif}
          handleAkhiriSesi={handleAkhiriSesi}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          daftarHadir={daftarHadir}
          daftarIzin={daftarIzin}
          usersList={usersList}
        />
      ) : (
        /* ===================== VIEW ANALYTICS & MULAI SESI ===================== */
        <AnalyticsView
          analyticsData={analyticsData}
          mataKuliahList={mataKuliahList}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRuang={selectedRuang}
          setSelectedRuang={setSelectedRuang}
          handleMulaiSesi={handleMulaiSesi}
          ruangKelasList={ruangKelasList}
        />
      )}
    </div>
  );
};

export default DashboardContent;