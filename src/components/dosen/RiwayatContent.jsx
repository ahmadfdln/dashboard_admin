import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { db } from '../../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Filter, Download, ChevronRight, Eye, Users, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../dosen/LoadingSpinner';

const RiwayatContent = ({ currentUser, usersList }) => {
  const [riwayatSesi, setRiwayatSesi] = useState([]);
  const [selectedSesi, setSelectedSesi] = useState(null);
  const [detailKehadiran, setDetailKehadiran] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // ✅ Tambahkan pengecekan awal
  if (!currentUser) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 font-medium">Anda belum login atau sesi telah kadaluarsa.</p>
      </div>
    );
  }

  if (!currentUser.uid) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 font-medium">UID pengguna tidak ditemukan. Silakan login ulang.</p>
      </div>
    );
  }

  const fetchRiwayat = useCallback(async (uid) => {
    if (!uid) {
      console.error("fetchRiwayat called with invalid UID:", uid);
      setIsLoading(false);
      return;
    }

    console.log("[DEBUG] fetchRiwayat called with UID:", uid);
    setIsLoading(true);

    try {
      console.log("[DEBUG] Creating query...");
      const riwayatQuery = query(
        collection(db, "sesiAbsensi"),
        where("idDosen", "==", uid),
        where("status", "==", "selesai")
      );

      console.log("[DEBUG] Executing getDocs...");
      const snapshot = await getDocs(riwayatQuery);
      console.log("[DEBUG] Snapshot received. Size:", snapshot.size);

      const sesi = snapshot.docs.map(d => {
        const data = d.data();
        console.log("[DEBUG] Raw doc data:", data);
        return {
          id: d.id,
          ...data,
          waktuMulai: data.waktuMulai?.seconds ? data.waktuMulai : null
        };
      });

      sesi.sort((a, b) => (b.waktuMulai?.seconds || 0) - (a.waktuMulai?.seconds || 0));
      setRiwayatSesi(sesi);

      if (sesi.length === 0) {
        toast.info("Belum ada riwayat absensi yang selesai.");
      } else {
        console.log("[DEBUG] Data loaded successfully. Count:", sesi.length);
      }

    } catch (error) {
      console.error("[ERROR] fetchRiwayat failed:", error);
      toast.error("Gagal memuat riwayat: " + (error.message || "Unknown error"));
    } finally {
      console.log("[DEBUG] Finally block — setting isLoading to false");
      setIsLoading(false);
    }
  }, []);

  const fetchDetailKehadiran = async (sesiId) => {
    if (!sesiId) return;
    setIsDetailLoading(true);
    try {
      const detailQuery = query(collection(db, "sesiAbsensi", sesiId, "kehadiran"));
      const snapshot = await getDocs(detailQuery);
      
      const detailData = snapshot.docs.map(d => {
        const data = d.data();
        const user = usersList.find(u => u.uid === data.uid);
        const waktuAbsen = data.waktuAbsen?.seconds 
          ? new Date(data.waktuAbsen.seconds * 1000) 
          : new Date();
        return { ...data, nama: user ? user.nama : 'Nama tidak ditemukan', waktuAbsen };
      });
      setDetailKehadiran(detailData);
    } catch (error) {
      console.error("Error fetching detail kehadiran:", error);
      toast.error("Gagal memuat detail kehadiran: " + (error.message || "Unknown error"));
    } finally {
      setIsDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat(currentUser.uid);

    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn("Riwayat loading timeout — forcing setIsLoading(false)");
        setIsLoading(false);
        toast.error("Gagal memuat riwayat: timeout. Cek koneksi atau izin Firestore.");
      }
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [currentUser, fetchRiwayat]); // ✅ Hanya currentUser dan fetchRiwayat

  const handleSesiClick = (sesi) => {
    setSelectedSesi(sesi);
    fetchDetailKehadiran(sesi.id);
  }

  if (isLoading) {
    return <LoadingSpinner message="Memuat riwayat sesi..." />;
  }

  if (riwayatSesi.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Riwayat Absensi</h2>
            <p className="text-gray-600">Lihat data kehadiran dari sesi sebelumnya</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors"><Filter size={18} /> Filter</button>
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"><Download size={18} /> Export</button>
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-16 text-center">
          <Eye size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Riwayat</h3>
          <p className="text-gray-500">Sesi absensi yang telah selesai akan muncul di sini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Riwayat Absensi</h2>
          <p className="text-gray-600">Lihat data kehadiran dari sesi sebelumnya</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors"><Filter size={18} /> Filter</button>
          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"><Download size={18} /> Export</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Daftar Sesi</h3>
              {riwayatSesi.map(sesi => (
                <button 
                  key={sesi.id} 
                  onClick={() => handleSesiClick(sesi)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${selectedSesi?.id === sesi.id ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-100' : 'bg-white hover:bg-gray-50 border-gray-200'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-800 truncate">{sesi.namaMK}</h4>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{sesi.kodeMK}</p>
                  <p className="text-xs text-gray-400">
                    {sesi.waktuMulai?.seconds 
                      ? new Date(sesi.waktuMulai.seconds * 1000).toLocaleDateString('id-ID', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
                      : 'Tanggal tidak tersedia'
                    }
                  </p>
                </button>
              ))}
            </div>
            
            <div className="lg:col-span-2 bg-gray-50 p-6 rounded-2xl">
              {isDetailLoading ? (
                  <div className="flex justify-center items-center h-full"><div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div></div>
              ) : selectedSesi ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Detail Kehadiran</h3>
                      <p className="text-gray-500">{selectedSesi.namaMK} • {detailKehadiran.length} Peserta</p>
                    </div>
                  </div>
                  <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-2">
                    {detailKehadiran.length > 0 ? detailKehadiran.map((mhs, index) => (
                      <div key={mhs.uid} className="flex items-center justify-between bg-white p-4 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><span className="text-blue-600 font-bold text-sm">{index + 1}</span></div>
                          <div>
                            <p className="font-semibold text-gray-800">{mhs.nama}</p>
                            <p className="text-sm text-gray-500">Mahasiswa</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-700">
                            {mhs.waktuAbsen.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <div className="flex items-center gap-1 mt-1"><CheckCircle size={14} className="text-green-500" /><span className="text-xs text-green-600 font-medium">Hadir</span></div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-12"><Users size={48} className="text-gray-300 mx-auto mb-4" /><p className="text-gray-500 font-medium">Tidak ada peserta pada sesi ini</p></div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-center">
                  <div>
                    <Eye size={64} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Pilih Sesi</h3>
                    <p className="text-gray-500">Klik sesi di kiri untuk melihat detail kehadiran</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiwayatContent;