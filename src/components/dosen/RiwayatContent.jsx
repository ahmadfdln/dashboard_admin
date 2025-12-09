import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { 
  Filter, 
  Download, 
  ChevronRight, 
  Eye, 
  Users, 
  CheckCircle, 
  X, 
  Search 
} from 'lucide-react';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import headerKampus from '../../assets/Header.png';

export const RiwayatContent = ({
  riwayatSesi,
  selectedSesi,
  detailKehadiran,
  handleSesiClick,
  isLoading,
  isDetailLoading,
}) => {
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
      doc.addImage(headerKampus, 'PNG', 10, 10, 190, 28);
    };

    addHeader();

    const contentStartY = 60;

    const tglSesi = selectedSesi?.waktuMulai?.seconds
      ? new Date(selectedSesi.waktuMulai.seconds * 1000).toLocaleDateString('id-ID')
      : new Date().toLocaleDateString('id-ID');

    const namaMK = selectedSesi?.namaMK || 'Mata Kuliah';

    doc.setFontSize(14);
    doc.setFont('times', 'bold');
    doc.text('DAFTAR HADIR MAHASISWA', pageWidth / 2, contentStartY, { align: 'center' });

    const infoY = contentStartY + 10;

    doc.setFontSize(11);
    doc.setFont('times', 'normal');
    doc.text(`Mata Kuliah: ${namaMK}`, pageWidth / 2, infoY, { align: 'center' });
    doc.text(`Tanggal Sesi: ${tglSesi}`, pageWidth / 2, infoY + 5, { align: 'center' });

    const tableHeaders = ['No', 'Nama Mahasiswa', 'NIM', 'Tanggal Absen', 'Waktu Absen', 'Status'];

    const tableData = detailKehadiran.map((mhs, index) => {
      let waktu = '-';
      let tanggalAbsen = '-';

      if (mhs.waktuAbsen) {
        const tgl = mhs.waktuAbsen.seconds
          ? new Date(mhs.waktuAbsen.seconds * 1000)
          : new Date(mhs.waktuAbsen);

        waktu = tgl.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        tanggalAbsen = tgl.toLocaleDateString('id-ID', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
      }

      return [
        index + 1,
        mhs.nama || '-',
        mhs.nim || '-',
        tanggalAbsen,
        waktu,
        mhs.status ? mhs.status.charAt(0).toUpperCase() + mhs.status.slice(1) : 'Hadir',
      ];
    });

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: infoY + 12,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2, font: 'times' },
      headStyles: {
        fillColor: [0, 128, 0],
        textColor: 255,
        fontStyle: 'bold'
      },
    });

    const fileName = `Daftar Hadir - ${namaMK} - ${tglSesi}.pdf`;
    doc.save(fileName);
    toast.success('Data kehadiran berhasil diunduh sebagai PDF!');
  };

  const getTanggalSesi = (sesi) => {
    if (!sesi?.waktuMulai) return null;
    return sesi.waktuMulai.seconds
      ? new Date(sesi.waktuMulai.seconds * 1000)
      : new Date(sesi.waktuMulai);
  };

  const filteredSesi = useMemo(() => {
    return riwayatSesi.filter((sesi) => {
      const namaMatch = sesi.namaMK.toLowerCase().includes(searchTerm.toLowerCase());
      const tanggalSesi = getTanggalSesi(sesi);

      if (!tanggalSesi) return namaMatch;

      const tglStr = tanggalSesi.toISOString().split('T')[0];
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
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-[#020617]/80 backdrop-blur-xl rounded-2xl border border-white/15 p-8">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-cyan-400/40 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-300">Memuat riwayat sesi...</p>
        </div>
      </div>
    );
  }

  const renderEmptyState = (Icon, title, message) => (
    <div className="bg-[#020617]/80 backdrop-blur-xl rounded-2xl border-2 border-dashed border-white/15 py-16">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/15">
          <Icon className="w-10 h-10 text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Riwayat Absensi</h2>
          <p className="text-gray-400">Lihat dan unduh data kehadiran mahasiswa.</p>
        </div>

        <div className="flex gap-3 self-stretch md:self-auto">

          {/* FILTER */}
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 bg-white/5 text-gray-200 px-4 py-2.5 rounded-xl border border-white/15 hover:bg-white/10 transition-colors"
            >
              <Filter size={18} /> 
              <span className="hidden sm:inline">Filter</span>
            </button>

            {showFilter && (
              <div className="absolute right-0 mt-2 w-80 bg-[#020617]/95 border border-white/15 rounded-xl p-4 z-10 shadow-2xl">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-white">Filter Sesi</h4>
                  <button onClick={() => setShowFilter(false)} className="text-gray-400 hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-3">
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Nama Mata Kuliah</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari mata kuliah..."
                        className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/80"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Tanggal Mulai</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/80"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Tanggal Akhir</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/80"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleResetFilter}
                      className="flex-1 px-3 py-2 bg-white/5 text-gray-200 rounded-lg hover:bg-white/10"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setShowFilter(false)}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-[#0BA360] to-[#3BD17F] text-slate-900 font-semibold rounded-lg hover:opacity-90"
                    >
                      Terapkan
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>

          {/* UNDUH */}
          <button
            onClick={handleExport}
            disabled={!selectedSesi || detailKehadiran.length === 0}
            className="flex items-center gap-2 bg-gradient-to-r from-[#0BA360] to-[#3BD17F] px-4 py-2.5 rounded-xl text-slate-900 font-semibold shadow-lg shadow-emerald-500/30 hover:opacity-90 disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-300 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Unduh PDF</span>
          </button>

        </div>
      </div>

      {/* >>> KONTEN UTAMA <<< */}
      {riwayatSesi.length === 0 ? (
        renderEmptyState(Eye, "Belum Ada Riwayat", "Sesi absensi yang telah selesai akan tampil di sini.")
      ) : (
        <div className="bg-[#020617]/80 backdrop-blur-xl rounded-2xl border border-white/15 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* KIRI — LIST SESI */}
              <div className="lg:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                <h3 className="text-lg font-semibold text-white mb-4 px-1">
                  Daftar Sesi Selesai
                  {(searchTerm || startDate || endDate) && (
                    <span className="ml-2 text-sm text-cyan-300">({filteredSesi.length} hasil)</span>
                  )}
                </h3>

                {filteredSesi.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">Tidak ada sesi yang sesuai.</p>
                ) : (
                  filteredSesi.map((sesi) => (
                    <button
                      key={sesi.id}
                      onClick={() => handleSesiClick(sesi)}
                      className={`w-full text-left p-4 rounded-xl border-l-4 transition-all ${
                        selectedSesi?.id === sesi.id
                          ? 'bg-white/5 border-l-cyan-400 text-cyan-200'
                          : 'bg-white/5 border-l-transparent hover:bg-white/10 text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold truncate">{sesi.namaMK}</h4>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-400">{sesi.kodeMK}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {sesi.waktuMulai?.seconds
                          ? new Date(sesi.waktuMulai.seconds * 1000).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : 'Tanggal tidak tersedia'}
                      </p>
                    </button>
                  ))
                )}
              </div>

              {/* KANAN — DETAIL SESI */}
              <div className="lg:col-span-2 bg-white/5/0 bg-[#020617]/80 p-6 rounded-2xl border border-white/10 min-h-[60vh]">

                {isDetailLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="w-10 h-10 border-4 border-cyan-400/40 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : !selectedSesi ? (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <Eye size={64} className="text-gray-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Pilih Sesi</h3>
                      <p className="text-gray-400">Pilih sesi di sebelah kiri untuk melihat detail.</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white">Detail Kehadiran</h3>
                      <p className="text-gray-300">{selectedSesi.namaMK} • {detailKehadiran.length} Mahasiswa</p>
                    </div>

                    <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-2">
                      
                      {detailKehadiran.length > 0 ? (
                        detailKehadiran.map((mhs, index) => (
                          <div
                            key={mhs.uid || index}
                            className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {index + 1}
                              </div>

                              <div>
                                <p className="font-semibold text-white">{mhs.nama}</p>
                                <p className="text-sm text-gray-400">{mhs.nim || 'NIM tidak ditemukan'}</p>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-gray-200">
                                {mhs.waktuAbsen
                                  ? new Date(
                                      mhs.waktuAbsen.seconds
                                        ? mhs.waktuAbsen.seconds * 1000
                                        : mhs.waktuAbsen
                                    ).toLocaleTimeString('id-ID', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : '-'}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-xs text-emerald-300">
                                  {mhs.status ? mhs.status : 'Hadir'}
                                </span>
                              </div>
                            </div>

                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <Users size={48} className="text-gray-500 mx-auto mb-4" />
                          <p className="text-gray-400 font-medium">Tidak ada peserta pada sesi ini.</p>
                        </div>
                      )}

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
};
