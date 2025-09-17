// src/components/dashboard/DashboardDosen.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  BookOpen, MapPin, PlayCircle, StopCircle, LogOut, Users, Clock, History, Calendar,
  ChevronRight, User, BarChart3, TrendingUp, CheckCircle, Eye, Filter,
  Search, Download, RefreshCw, Bell, Grid3X3, Menu, X
} from 'lucide-react';

import { auth, db, GeoPoint } from '../../config/firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, getDocs, query, where, doc, 
  addDoc, updateDoc, Timestamp, onSnapshot
} from 'firebase/firestore';

// Import komponen-komponen terpisah
import Sidebar from '../../components/dosen/Sidebar';
import Header from '../../components/dosen/Header';
import DashboardContent from '../../components/dosen/DashboardContent';
import {JadwalContent} from '../../components/dosen/JadwalContent';
import RiwayatContent from '../../components/dosen/RiwayatContent';
import StatistikContent from '../../components/dosen/StatistikContent';
import MahasiswaContent from '../../components/dosen/MahasiswaContent';
import LoadingSpinner from '../../components/dosen/LoadingSpinner';

export function DashboardDosen() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [mataKuliahList, setMataKuliahList] = useState([]);
  const [ruangKelasList, setRuangKelasList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [sesiAktif, setSesiAktif] = useState(null);
  const [daftarHadir, setDaftarHadir] = useState([]);
  const [riwayatSesi, setRiwayatSesi] = useState([]);
  const [selectedRiwayatSesi, setSelectedRiwayatSesi] = useState(null);
  const [detailKehadiran, setDetailKehadiran] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRiwayatLoading, setIsRiwayatLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        navigate('/login');
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchInitialData = useCallback(async (uid) => {
    setIsLoading(true);
    try {
      const usersQuery = query(collection(db, "users"), where("role", "==", "mahasiswa"));
      const usersSnapshot = await getDocs(usersQuery);
      setUsersList(usersSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

      const mkQuery = query(collection(db, "mataKuliah"), where("dosenPengampu", "==", uid));
      const mkSnapshot = await getDocs(mkQuery);
      const listMK = mkSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      listMK.sort((a, b) => a.namaMK.localeCompare(b.namaMK));
      setMataKuliahList(listMK);

      const ruangSnapshot = await getDocs(collection(db, "ruangKelas"));
      setRuangKelasList(ruangSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
        toast.error("Gagal memuat data awal.");
    } finally {
        setIsLoading(false);
    }
  }, []);
  
  const fetchRiwayat = useCallback(async (uid) => {
    setIsRiwayatLoading(true);
    try {
      const q = query(collection(db, "sesiAbsensi"), where("idDosen", "==", uid), where("status", "==", "selesai"));
      const snapshot = await getDocs(q);
      const sesi = snapshot.docs.map(d => ({id: d.id, ...d.data()}));
      sesi.sort((a, b) => b.waktuMulai.seconds - a.waktuMulai.seconds);
      setRiwayatSesi(sesi);
    } catch (error) {
      toast.error("Gagal memuat riwayat absensi.");
    } finally {
      setIsRiwayatLoading(false);
    }
  }, []);

  const fetchDetailKehadiran = async (sesiId) => {
    setIsDetailLoading(true);
    try {
      const q = query(collection(db, "sesiAbsensi", sesiId, "kehadiran"));
      const snapshot = await getDocs(q);
      const detailData = snapshot.docs.map(d => {
        const data = d.data();
        const user = usersList.find(u => u.uid === data.uid);
        return { ...data, nama: user ? user.nama : 'Nama tidak ditemukan' };
      });
      setDetailKehadiran(detailData);
    } catch (error) {
      toast.error("Gagal memuat detail kehadiran.");
    } finally {
      setIsDetailLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchInitialData(currentUser.uid);
  }, [currentUser, fetchInitialData]);
  
  useEffect(() => {
    if (!currentUser) return;
    if (activeTab === 'riwayat' || activeTab === 'statistik') {
        fetchRiwayat(currentUser.uid);
    }
  }, [currentUser, activeTab, fetchRiwayat]);

  useEffect(() => {
    if (!currentUser || usersList.length === 0) return;
    const qSesi = query(collection(db, 'sesiAbsensi'), where('idDosen', '==', currentUser.uid), where('status', '==', 'aktif'));
    const unsubSesi = onSnapshot(qSesi, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const sesiDoc = querySnapshot.docs[0];
        setSesiAktif({ id: sesiDoc.id, ...sesiDoc.data() });
        const qHadir = collection(db, 'sesiAbsensi', sesiDoc.id, 'kehadiran');
        const unsubHadir = onSnapshot(qHadir, (hadirSnapshot) => {
          const daftar = hadirSnapshot.docs.map(doc => {
              const data = doc.data();
              const user = usersList.find(u => u.uid === data.uid);
              return { id: doc.id, ...data, namaMahasiswa: user ? user.nama : data.uid };
          });
          setDaftarHadir(daftar);
        });
        return () => unsubHadir();
      } else {
        setSesiAktif(null);
        setDaftarHadir([]);
      }
    }, (error) => {
        console.error("Firebase Snapshot Error:", error);
        toast.error("Gagal memantau sesi secara real-time.");
    });
    return () => unsubSesi();
  }, [currentUser, usersList]);

  const handleMulaiSesi = async (mataKuliah, selectedRuang) => {
    if (!selectedRuang) return toast.warn("Harap pilih ruangan.");
    if (sesiAktif) return toast.error("Sesi lain sedang aktif.");
    setIsLoading(true);
    try {
      const ruang = ruangKelasList.find(r => r.id === selectedRuang);
      await addDoc(collection(db, 'sesiAbsensi'), {
        idDosen: currentUser.uid, namaDosen: currentUser.displayName || currentUser.email,
        kodeMK: mataKuliah.kodeMK, namaMK: mataKuliah.namaMK, waktuMulai: Timestamp.now(),
        status: 'aktif', lokasi: new GeoPoint(ruang.lokasi.latitude, ruang.lokasi.longitude), radius: 50,
      });
      toast.success(`Sesi untuk ${mataKuliah.namaMK} dimulai!`);
    } catch (error) {
      toast.error("Gagal memulai sesi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAkhiriSesi = async () => {
    if (!sesiAktif || !window.confirm("Yakin ingin mengakhiri sesi ini?")) return;
    try {
      await updateDoc(doc(db, 'sesiAbsensi', sesiAktif.id), { status: 'selesai', waktuSelesai: Timestamp.now() });
      toast.info("Sesi telah berakhir.");
    } catch (error) {
      toast.error("Gagal mengakhiri sesi.");
    }
  };
  
  const handleLogout = async () => {
    if (window.confirm("Yakin ingin keluar?")) {
      await signOut(auth);
      navigate('/login');
    }
  };
  
  const handleSesiClick = (sesi) => {
    setSelectedRiwayatSesi(sesi);
    fetchDetailKehadiran(sesi.id);
  }

  const renderContent = () => {
    if (!authChecked) {
      return <LoadingSpinner message="Memeriksa sesi login..." />;
    }

    if (!currentUser) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-red-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Akses Ditolak</h3>
            <p className="text-gray-600">Silakan login untuk melanjutkan ke dashboard.</p>
          </div>
        </div>
      );
    }

    if (isLoading && activeTab === 'dashboard') {
      return <LoadingSpinner />;
    }

    switch(activeTab) {
      case 'dashboard': 
        return <DashboardContent 
          isLoading={isLoading} 
          sesiAktif={sesiAktif} 
          daftarHadir={daftarHadir} 
          mataKuliahList={mataKuliahList} 
          ruangKelasList={ruangKelasList} 
          handleMulaiSesi={handleMulaiSesi} 
          handleAkhiriSesi={handleAkhiriSesi} 
        />;
      case 'jadwal': 
        return <JadwalContent mataKuliahList={mataKuliahList} />;
      case 'mahasiswa':
        return <MahasiswaContent 
          mataKuliahList={mataKuliahList} 
          usersList={usersList} 
        />;
      case 'riwayat': 
        return <RiwayatContent 
          currentUser={currentUser}
          usersList={usersList}
          riwayatSesi={riwayatSesi} 
          selectedSesi={selectedRiwayatSesi} 
          detailKehadiran={detailKehadiran} 
          handleSesiClick={handleSesiClick} 
          isLoading={isRiwayatLoading} 
          isDetailLoading={isDetailLoading} 
        />;
      case 'statistik': 
        return <StatistikContent 
          mataKuliahList={mataKuliahList} 
          usersList={usersList} 
          riwayatSesi={riwayatSesi} 
        />;
      default: 
        return null;
    }
  };
  
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Modern Design */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        fixed lg:static inset-y-0 left-0 z-50 w-72 
        bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50
        flex flex-col
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                EduAttend
              </h1>
              <p className="text-xs text-gray-500">Dashboard Dosen</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="px-6 py-4 border-b border-gray-200/50">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
              {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {currentUser?.displayName || 'Dosen'}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {currentUser?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation - Enhanced */}
        <nav className="flex-1 px-6 py-4 overflow-y-auto">
          <div className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Grid3X3, color: 'blue' },
              { id: 'jadwal', label: 'Jadwal', icon: Calendar, color: 'green' },
              { id: 'mahasiswa', label: 'Mahasiswa', icon: Users, color: 'purple' },
              { id: 'riwayat', label: 'Riwayat', icon: History, color: 'orange' },
              { id: 'statistik', label: 'Statistik', icon: BarChart3, color: 'red' },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left
                    transition-all duration-200 group
                    ${isActive 
                      ? `bg-${item.color}-50 text-${item.color}-700 border border-${item.color}-200 shadow-md` 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 transition-colors ${
                    isActive ? `text-${item.color}-600` : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto">
                      <div className={`w-2 h-2 bg-${item.color}-500 rounded-full`} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout Button - Enhanced */}
        <div className="p-6 border-t border-gray-200/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-700 hover:bg-red-50 hover:text-red-800 rounded-xl transition-all duration-200 group border border-transparent hover:border-red-200"
          >
            <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors" />
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Modern Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button & Title */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 capitalize">
                    {activeTab === 'dashboard' ? 'Dashboard Utama' : activeTab}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {activeTab === 'dashboard' && 'Kelola sesi absensi dan pantau kehadiran mahasiswa'}
                    {activeTab === 'jadwal' && 'Lihat jadwal mata kuliah yang diampu'}
                    {activeTab === 'mahasiswa' && 'Kelola data mahasiswa dan enrollment'}
                    {activeTab === 'riwayat' && 'Riwayat sesi absensi yang telah selesai'}
                    {activeTab === 'statistik' && 'Analisis kehadiran dan performa kelas'}
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center space-x-4">
                {sesiAktif && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-green-700">Sesi Aktif</span>
                  </div>
                )}
                
                {/* Notification Bell */}
                <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                  {daftarHadir.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area with Enhanced Styling */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardDosen;