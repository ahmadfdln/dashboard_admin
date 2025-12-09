import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { db } from '../../../config/firebase';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { ChevronRight, UserCheck } from 'lucide-react';

export default function AturDosenMK({ onActionSuccess, logActivity }) {
  const [isLoading, setIsLoading] = useState(false);
  const [dosenList, setDosenList] = useState([]);
  const [mataKuliahList, setMataKuliahList] = useState([]);
  const [selectedMK, setSelectedMK] = useState('');
  const [selectedDosen, setSelectedDosen] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const dosenQuery = query(collection(db, "users"), where("role", "==", "dosen"));
      const dosenSnapshot = await getDocs(dosenQuery);
      setDosenList(dosenSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

      const mkSnapshot = await getDocs(collection(db, "mataKuliah"));
      setMataKuliahList(mkSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      toast.error("Gagal memuat data dosen atau mata kuliah.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSimpanPenetapan = async (e) => {
    e.preventDefault();

    if (!selectedMK || !selectedDosen) {
      return toast.warn("Harap pilih mata kuliah dan dosen.");
    }

    setIsLoading(true);
    try {
      const dosenTerpilih = dosenList.find(d => d.id === selectedDosen);
      const mataKuliahTerpilih = mataKuliahList.find(mk => mk.id === selectedMK);

      await updateDoc(doc(db, "mataKuliah", selectedMK), {
        dosenPengampu: selectedDosen,
        namaDosenPengampu: dosenTerpilih.nama
      });

      await logActivity(
        `Menetapkan dosen ${dosenTerpilih.nama} ke mata kuliah ${mataKuliahTerpilih.namaMK}`,
        'ASSIGN_COURSE'
      );

      toast.success("Dosen berhasil ditetapkan!");

      setSelectedMK('');
      setSelectedDosen('');
      await fetchData();
      onActionSuccess();

    } catch (error) {
      toast.error("Gagal menyimpan penetapan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">

      {/* CARD FORM SAMA PERSIS DENGAN FORM LAIN */}
      <form
        onSubmit={handleSimpanPenetapan}
        className="bg-[#0f172a]/70 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl space-y-8"
      >

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
            <UserCheck className="w-6 h-6 text-purple-300" />
          </div>
          <h2 className="text-2xl font-bold text-white">Tetapkan Dosen ke Mata Kuliah</h2>
        </div>

        {/* SELECT MATA KULIAH */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Pilih Mata Kuliah</label>
          <select
            value={selectedMK}
            onChange={(e) => setSelectedMK(e.target.value)}
            disabled={isLoading}
            className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white focus:ring-2 placeholder-gray-500 focus:ring-purple-500 outline-none"
          >
            <option value="" disabled>-- Pilih Mata Kuliah --</option>

            {mataKuliahList.map((mk) => (
              <option key={mk.id} value={mk.id} className="bg-slate-900">
                {mk.namaMK} ({mk.kodeMK})
                {mk.namaDosenPengampu ? ` • Dosen: ${mk.namaDosenPengampu}` : " • Belum ada dosen"}
              </option>
            ))}
          </select>
        </div>

        {/* SELECT DOSEN */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Pilih Dosen Pengampu</label>
          <select
            value={selectedDosen}
            onChange={(e) => setSelectedDosen(e.target.value)}
            disabled={isLoading}
            className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white focus:ring-2 placeholder-gray-500 focus:ring-purple-500 outline-none"
          >
            <option value="" disabled>-- Pilih Dosen --</option>

            {dosenList.map((dosen) => (
              <option key={dosen.id} value={dosen.id} className="bg-slate-900">
                {dosen.nama} ({dosen.nim_nidn})
              </option>
            ))}
          </select>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-semibold  bg-emerald-500 hover:bg-emerald-600 text-black hover:opacity-90 flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          {isLoading ? "Menyimpan..." : "Simpan Penetapan"}
          {!isLoading && <ChevronRight className="w-5 h-5" />}
        </button>

      </form>
    </div>
  );
}
