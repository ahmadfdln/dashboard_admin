import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Filter, Download, ChevronRight, Eye, Users, CheckCircle, X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

// Import library untuk PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import headerKampus from '../../assets/Header.png';

export default function RiwayatContent({
  riwayatSesi,
  selectedSesi,
  detailKehadiran,
  handleSesiClick,
  isLoading,
  isDetailLoading,
}) {
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleExport = () => {
    if (!selectedSesi) {
      toast.warn("Pilih sesi terlebih dahulu sebelum mengunduh data.");
      return;
    }
    if (!detailKehadiran || detailKehadiran.length === 0) {
      toast.warn("Tidak ada data kehadiran untuk diunduh.");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const addHeader = () => {
      // Menambahkan gambar header lengkap
      // Argumen: gambar, format, x, y, width, height
      // X = 10, Y = 10 (posisi sedikit dari kiri atas)
      // Width = 190 (hampir selebar kertas A4, yang lebarnya sekitar 210mm)
      // Height = 45 (tinggi gambar header, sesuaikan jika gambar Anda lebih tinggi/rendah)
      doc.addImage(headerKampus, 'PNG', 10, 10, 190, 28);
    };

    // Panggil fungsi header
    addHeader();

    // --- Informasi Mata Kuliah dan Judul (Layout disesuaikan untuk gambar header) ---
    // Sesuaikan posisi Y awal konten agar ada ruang yang cukup setelah gambar header
    const contentStartY = 60; // Disesuaikan dari 55 menjadi 60 untuk memberi lebih banyak ruang
    
    const tglSesi = selectedSesi?.waktuMulai?.seconds
      ? new Date(selectedSesi.waktuMulai.seconds * 1000).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : new Date().toLocaleDateString('id-ID');
    const namaMK = selectedSesi?.namaMK || 'Mata Kuliah';

    // Judul Utama
    doc.setFontSize(14);
    doc.setFont('times', 'bold');
    doc.text('DAFTAR HADIR MAHASISWA', pageWidth / 2, contentStartY, { align: 'center' });

    // Garis Bawah Judul
    const titleWidth = doc.getStringUnitWidth('DAFTAR HADIR MAHASISWA') * doc.getFontSize() / doc.internal.scaleFactor;
    const titleX = (pageWidth - titleWidth) / 2;
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(titleX, contentStartY + 1, titleX + titleWidth, contentStartY + 1);

    // Info Mata Kuliah & Tanggal (Rata tengah)
    const infoY = contentStartY + 10;
    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    doc.text(`Mata Kuliah: ${namaMK}`, pageWidth / 2, infoY, { align: 'center' });
    doc.text(`Tanggal Sesi: ${tglSesi}`, pageWidth / 2, infoY + 5, { align: 'center' });


    // --- Tabel Data Kehadiran ---
    const tableHeaders = ['No', 'Nama Mahasiswa', 'NIM', 'Tanggal Absen', 'Waktu Absen', 'Status'];
    const tableData = detailKehadiran.map((mhs, index) => {
      let waktu = '-';
      let tanggalAbsen = '-';
      if (mhs.waktuAbsen) {
        try {
          const waktuDate = mhs.waktuAbsen.seconds ? new Date(mhs.waktuAbsen.seconds * 1000) : new Date(mhs.waktuAbsen);
          waktu = waktuDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          tanggalAbsen = waktuDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        } catch (err) { /* Biarkan default */ }
      }
      return [
        index + 1, mhs.nama || '-', mhs.nim || '-', tanggalAbsen, waktu,
        mhs.status ? mhs.status.charAt(0).toUpperCase() + mhs.status.slice(1) : 'Hadir',
      ];
    });

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: infoY + 12, // Posisi Y tabel disesuaikan
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2, font: 'times' },
      headStyles: { fillColor: [0, 128, 0], textColor: 255, fontStyle: 'bold', font: 'times' },
    });

    const fileName = `Daftar Hadir - ${namaMK} - ${tglSesi}.pdf`;
    doc.save(fileName);
    toast.success('Data kehadiran berhasil diunduh sebagai PDF!');
  };

  // ... Sisa kode komponen tidak perlu diubah ...
  // (kode tidak saya tampilkan lagi untuk meringkas)
  const getTanggalSesi = (sesi) => {
    if (!sesi.waktuMulai) return null;
    return sesi.waktuMulai.seconds
      ? new Date(sesi.waktuMulai.seconds * 1000)
      : new Date(sesi.waktuMulai);
  };

  const filteredSesi = useMemo(() => {
    return riwayatSesi.filter((sesi) => {
      const namaMatch = sesi.namaMK.toLowerCase().includes(searchTerm.toLowerCase());
      const tglSesi = getTanggalSesi(sesi);
      if (!tglSesi) return namaMatch;
      const tglStr = tglSesi.toISOString().split('T')[0];
      const dateMatch =
        (!startDate || tglStr >= startDate) &&
        (!endDate || tglStr <= endDate);
      return namaMatch && dateMatch;
    });
  }, [riwayatSesi, searchTerm, startDate, endDate]);

  const handleResetFilter = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
  };

  if (isLoading) {
    return <LoadingSpinner message="Memuat riwayat sesi..." />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Riwayat Absensi</h2>
          <p className="text-gray-600">Lihat dan unduh data kehadiran mahasiswa dari sesi sebelumnya.</p>
        </div>
        <div className="flex gap-3 self-stretch md:self-auto">
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Filter size={18} /> Filter
            </button>
            {showFilter && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-800">Filter Sesi</h4>
                  <button onClick={() => setShowFilter(false)} className="text-gray-500 hover:text-gray-700">
                    <X size={18} />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cari Mata Kuliah</label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Nama mata kuliah..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleResetFilter}
                      className="flex-1 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setShowFilter(false)}
                      className="flex-1 px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Terapkan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleExport}
            disabled={!selectedSesi || detailKehadiran.length === 0}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Download size={18} /> Unduh PDF
          </button>
        </div>
      </div>
      {riwayatSesi.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-16 text-center">
          <Eye size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Riwayat</h3>
          <p className="text-gray-500">Sesi absensi yang telah selesai akan muncul di sini.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 px-1">
                  Daftar Sesi Selesai
                  {searchTerm || startDate || endDate ? (
                    <span className="ml-2 text-sm text-blue-600">({filteredSesi.length} hasil)</span>
                  ) : null}
                </h3>
                {filteredSesi.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Tidak ada sesi yang sesuai filter.</p>
                ) : (
                  filteredSesi.map((sesi) => (
                    <button
                      key={sesi.id}
                      onClick={() => handleSesiClick(sesi)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedSesi?.id === sesi.id
                          ? 'bg-blue-50 border-blue-400'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-800 truncate">{sesi.namaMK}</h4>
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 mb-1">{sesi.kodeMK}</p>
                      <p className="text-xs text-gray-400">
                        {sesi.waktuMulai?.seconds
                          ? new Date(sesi.waktuMulai.seconds * 1000).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'Tanggal tidak tersedia'}
                      </p>
                    </button>
                  ))
                )}
              </div>
              <div className="lg:col-span-2 bg-gray-50 p-6 rounded-2xl">
                {isDetailLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : selectedSesi ? (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Detail Kehadiran</h3>
                        <p className="text-gray-500">
                          {selectedSesi.namaMK} • {detailKehadiran.length} Peserta
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-2">
                      {detailKehadiran.length > 0 ? (
                        detailKehadiran.map((mhs, index) => (
                          <div
                            key={mhs.uid || index}
                            className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{mhs.nama}</p>
                                <p className="text-sm text-gray-500">{mhs.nim || 'NIM tidak ada'}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-700">
                                {mhs.waktuAbsen
                                  ? new Date(
                                      mhs.waktuAbsen.seconds
                                        ? mhs.waktuAbsen.seconds * 1000
                                        : mhs.waktuAbsen
                                    ).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                                  : '-'}
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <CheckCircle size={14} className="text-green-500" />
                                <span className="text-xs text-green-600 font-medium">
                                  {mhs.status ? mhs.status : 'Hadir'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <Users size={48} className="text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 font-medium">Tidak ada peserta pada sesi ini.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <Eye size={64} className="text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">Pilih Sesi</h3>
                      <p className="text-gray-500">
                        Klik salah satu sesi di sebelah kiri untuk melihat detail kehadiran.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}