import { useState } from "react";
import { PlayCircle, BookOpen, MapPin } from "lucide-react";

export  function StartSession({ handleMulaiSesi }) {
  const [selectedMK, setSelectedMK] = useState("");
  const [selectedRuangan, setSelectedRuangan] = useState("");

  const daftarMK = [
    { kode: "SI101", nama: "Sistem Informasi Manajemen" },
    { kode: "SI202", nama: "Pemrograman Web" },
    { kode: "SI303", nama: "Kecerdasan Buatan" },
  ];

  const daftarRuangan = [
    { kode: "R101", nama: "Ruang Kuliah 101" },
    { kode: "R202", nama: "Ruang Kuliah 202" },
    { kode: "LAB1", nama: "Lab Komputer 1" },
  ];

  const mulaiSesi = () => {
    if (!selectedMK || !selectedRuangan) {
      alert("Silakan pilih mata kuliah dan ruangan terlebih dahulu!");
      return;
    }
    const mk = daftarMK.find((mk) => mk.kode === selectedMK);
    const ruangan = daftarRuangan.find((r) => r.kode === selectedRuangan);
    handleMulaiSesi(mk.nama, ruangan.nama);
    setSelectedMK("");
    setSelectedRuangan("");
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mulai Sesi Baru</h2>

      {/* Pilih Mata Kuliah */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <BookOpen size={18} className="text-blue-500" />
          Pilih Mata Kuliah
        </label>
        <select
          value={selectedMK}
          onChange={(e) => setSelectedMK(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">-- Pilih Mata Kuliah --</option>
          {daftarMK.map((mk) => (
            <option key={mk.kode} value={mk.kode}>
              {mk.kode} - {mk.nama}
            </option>
          ))}
        </select>
      </div>

      {/* Pilih Ruangan */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <MapPin size={18} className="text-green-500" />
          Pilih Ruangan
        </label>
        <select
          value={selectedRuangan}
          onChange={(e) => setSelectedRuangan(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none"
        >
          <option value="">-- Pilih Ruangan --</option>
          {daftarRuangan.map((r) => (
            <option key={r.kode} value={r.kode}>
              {r.nama}
            </option>
          ))}
        </select>
      </div>

      {/* Tombol Mulai */}
      <button
        onClick={mulaiSesi}
        className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <PlayCircle size={22} />
        Mulai Sesi
      </button>
    </div>
  );
}
