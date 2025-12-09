import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Hooks
import useAuth from "../../components/dosen/hooks/useAuth";
import useInitialData from "../../components/dosen/hooks/useInitialData";
import useRiwayat from "../../components/dosen/hooks/useRiwayat";
import useStatistik from "../../components/dosen/hooks/useStatistik";
import useSesiRealtime from "../../components/dosen/hooks/useSesiRealtime";

// Layout components
import DosenSidebar from "../../components/dosen/Sidebar";
import DosenHeader from "../../components/dosen/Header";

// Content components
import DashboardContent from "../../components/dosen/DashboardContent";
import { JadwalContent } from "../../components/dosen/JadwalContent";
import { RiwayatContent } from "../../components/dosen/RiwayatContent";
import { StatistikContent } from "../../components/dosen/StatistikContent";
import { MahasiswaView } from "../../components/dosen/MahasiswaView";
import LoadingSpinner from "../../components/dosen/LoadingSpinner";

export default function DashboardDosen() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth
  const { currentUser, authChecked } = useAuth(navigate);

  // Data awal (MK, ruang, users) + handler sesi
  const {
    mataKuliahList,
    ruangKelasList,
    usersList,
    isLoading,
    handleMulaiSesi,
    handleAkhiriSesi,
  } = useInitialData(currentUser);

  // Riwayat & detail kehadiran
  const {
    riwayatSesi,
    selectedRiwayatSesi,
    detailKehadiran,
    isRiwayatLoading,
    isDetailLoading,
    handleSesiClick,
  } = useRiwayat(currentUser, usersList, activeTab);

  // Sesi realtime (aktif, daftar hadir/izin)
  const { sesiAktif, daftarHadir, daftarIzin } = useSesiRealtime(
    currentUser,
    usersList
  );

  // Statistik
  const { statistikGrafik, kehadiranHistoris } = useStatistik(
    currentUser,
    usersList,
    mataKuliahList,
    riwayatSesi,
    sesiAktif
  );

  const renderContent = () => {
    if (!authChecked) {
      return <LoadingSpinner message="Memeriksa sesi login..." />;
    }

    if (!currentUser) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-red-500/20 shadow-xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-red-400">!</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Akses Ditolak
            </h3>
            <p className="text-gray-300">
              Silakan login untuk melanjutkan ke dashboard.
            </p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardContent
            isLoading={isLoading}
            sesiAktif={sesiAktif}
            daftarHadir={daftarHadir}
            daftarIzin={daftarIzin}
            mataKuliahList={mataKuliahList}
            ruangKelasList={ruangKelasList}
            riwayatSesi={riwayatSesi}
            usersList={usersList}
            statistikGrafik={statistikGrafik}
            kehadiranHistoris={kehadiranHistoris}
            handleMulaiSesi={handleMulaiSesi}
            // 🔹 Penting: bungkus sesiAktif, agar tidak undefined
            handleAkhiriSesi={() => handleAkhiriSesi(sesiAktif)}
          />
        );

      case "jadwal":
        return <JadwalContent mataKuliahList={mataKuliahList} />;

      case "mahasiswa":
        return (
          <MahasiswaView mataKuliahList={mataKuliahList} isLoading={isLoading} />
        );

      case "riwayat":
        return (
          <RiwayatContent
            currentUser={currentUser}
            usersList={usersList}
            riwayatSesi={riwayatSesi}
            selectedSesi={selectedRiwayatSesi}
            detailKehadiran={detailKehadiran}
            handleSesiClick={handleSesiClick}
            isLoading={isRiwayatLoading}
            isDetailLoading={isDetailLoading}
          />
        );

      case "statistik":
        return (
          <StatistikContent
            mataKuliahList={mataKuliahList}
            usersList={usersList}
            riwayatSesi={riwayatSesi}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0B1120]">
      {/* Neon background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-0 w-[70%] h-[70%] bg-emerald-500 opacity-90 rotate-[-35deg] translate-x-40 -translate-y-40" />
      </div>

      <div className="flex h-screen relative z-10">
        {/* Sidebar */}
        <DosenSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
        />

        {/* Main area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <DosenHeader
            activeTab={activeTab}
            currentUser={currentUser}
            setSidebarOpen={setSidebarOpen}
          />

          <main className="flex-1 overflow-y-auto">
            <div className="p-6 max-w-7xl mx-auto">{renderContent()}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
