import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { db } from '../../../config/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { BookOpen, Plus } from 'lucide-react';

export default function ManajemenMataKuliah({ onActionSuccess, logActivity }) {
  const [isLoading, setIsLoading] = useState(false);
  const [kodeMK, setKodeMK] = useState('');
  const [namaMK, setNamaMK] = useState('');
  const [sks, setSks] = useState('');
  const [semesterMK, setSemesterMK] = useState('');
  const [hari, setHari] = useState('Senin');
  const [jamMulai, setJamMulai] = useState('');
  const [jamSelesai, setJamSelesai] = useState('');
  const [ruangan, setRuangan] = useState('');

  const handleTambahMK = async (e) => {
    e.preventDefault();

    if (!kodeMK || !namaMK || !sks || !semesterMK || !hari || !jamMulai || !jamSelesai || !ruangan) {
      return toast.warn("Harap lengkapi semua field mata kuliah, termasuk jadwal dan ruangan.");
    }

    setIsLoading(true);

    try {
      await addDoc(collection(db, "mataKuliah"), {
        kodeMK,
        namaMK,
        sks: Number(sks),
        semester: Number(semesterMK),
        hari,
        jamMulai,
        jamSelesai,
        ruangan,
        dosenPengampu: null,
        namaDosenPengampu: null,
      });

      await logActivity(`Menambahkan mata kuliah: ${namaMK} (${kodeMK})`, 'COURSE_CREATE');

      toast.success('Mata Kuliah berhasil ditambahkan!');

      setKodeMK('');
      setNamaMK('');
      setSks('');
      setSemesterMK('');
      setHari('Senin');
      setJamMulai('');
      setJamSelesai('');
      setRuangan('');

      onActionSuccess();
    } catch (error) {
      toast.error(`Gagal menambah mata kuliah: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      
      {/* CARD SAMA PERSIS DENGAN MANAJEMEN PENGGUNA */}
      <div className="bg-[#0f172a]/70 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl">

        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <BookOpen className="w-6 h-6 text-purple-300" />
          </div>
          <h2 className="text-2xl font-bold text-white">Tambah Mata Kuliah</h2>
        </div>

        {/* FORM */}
        <form onSubmit={handleTambahMK} className="space-y-6">

          {/* DATA DASAR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Kode Mata Kuliah
              </label>
              <input
                type="text"
                value={kodeMK}
                onChange={(e) => setKodeMK(e.target.value)}
                placeholder="SI101"
                className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Nama Mata Kuliah
              </label>
              <input
                type="text"
                value={namaMK}
                onChange={(e) => setNamaMK(e.target.value)}
                placeholder="Pemrograman Web"
                className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Jumlah SKS
              </label>
              <input
                type="number"
                value={sks}
                onChange={(e) => setSks(e.target.value)}
                placeholder="Contoh: 3"
                className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Semester
              </label>
              <input
                type="number"
                value={semesterMK}
                onChange={(e) => setSemesterMK(e.target.value)}
                placeholder="Untuk semester ke-"
                className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          {/* JADWAL */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Atur Jadwal & Ruangan</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Hari
                </label>
                <select
                  value={hari}
                  onChange={(e) => setHari(e.target.value)}
                  className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  {['Senin','Selasa','Rabu','Kamis','Jumat'].map(h => (
                    <option key={h} value={h} className="bg-slate-900">{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Ruangan
                </label>
                <input
                  type="text"
                  value={ruangan}
                  onChange={(e) => setRuangan(e.target.value)}
                  placeholder="Lab Komputer 1"
                  className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Jam Masuk
                </label>
                <input
                  type="time"
                  value={jamMulai}
                  onChange={(e) => setJamMulai(e.target.value)}
                  className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Jam Keluar
                </label>
                <input
                  type="time"
                  value={jamSelesai}
                  onChange={(e) => setJamSelesai(e.target.value)}
                  className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3 rounded-xl font-semibold  bg-emerald-500 hover:bg-emerald-600 text-black hover:opacity-90 shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Memproses...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Tambah Mata Kuliah
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
