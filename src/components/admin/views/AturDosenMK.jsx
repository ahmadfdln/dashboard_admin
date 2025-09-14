import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { db } from '../../../config/firebase';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { ChevronRight } from 'lucide-react';

export default function AturDosenMK({ onActionSuccess, logActivity }) {
    const [isLoading, setIsLoading] = useState(false);
    const [dosenList, setDosenList] = useState([]);
    const [mataKuliahList, setMataKuliahList] = useState([]);
    
    const [selectedMK, setSelectedMK] = useState('');
    const [selectedDosen, setSelectedDosen] = useState('');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Ambil daftar semua dosen
            const dosenQuery = query(collection(db, "users"), where("role", "==", "dosen"));
            const dosenSnapshot = await getDocs(dosenQuery);
            setDosenList(dosenSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

            // Ambil daftar semua mata kuliah
            const mkSnapshot = await getDocs(collection(db, "mataKuliah"));
            setMataKuliahList(mkSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (error) {
            console.error("Error fetching data:", error);
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

            // Update dokumen mata kuliah dengan UID dosen
            const mataKuliahDocRef = doc(db, "mataKuliah", selectedMK);
            await updateDoc(mataKuliahDocRef, {
                dosenPengampu: selectedDosen, // Simpan UID dosen
                namaDosenPengampu: dosenTerpilih.nama // Simpan nama untuk kemudahan tampilan
            });

            await logActivity(`Menetapkan dosen ${dosenTerpilih.nama} ke mata kuliah ${mataKuliahTerpilih.namaMK}`, 'ASSIGN_COURSE');
            toast.success("Dosen berhasil ditetapkan ke mata kuliah!");
            
            // Reset form dan muat ulang data untuk melihat perubahan
            setSelectedMK('');
            setSelectedDosen('');
            await fetchData();
            onActionSuccess();
        } catch (error) {
            console.error("Error updating document:", error);
            toast.error("Gagal menyimpan penetapan.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSimpanPenetapan} className="space-y-4 max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tetapkan Dosen ke Mata Kuliah</h2>
            
            <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>Pilih Mata Kuliah</label>
                <select value={selectedMK} onChange={e => setSelectedMK(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md">
                    <option value="" disabled>-- Pilih Mata Kuliah --</option>
                    {mataKuliahList.map(mk => (
                        <option key={mk.id} value={mk.id}>
                            {mk.namaMK} ({mk.kodeMK}) - {mk.namaDosenPengampu ? `(Dosen: ${mk.namaDosenPengampu})` : '(Belum ada dosen)'}
                        </option>
                    ))}
                </select>
            </div>

            <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>Tetapkan ke Dosen</label>
                <select value={selectedDosen} onChange={e => setSelectedDosen(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md">
                    <option value="" disabled>-- Pilih Dosen --</option>
                    {dosenList.map(dosen => (
                        <option key={dosen.id} value={dosen.id}>{dosen.nama} ({dosen.nim_nidn})</option>
                    ))}
                </select>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2">
                {isLoading ? 'Menyimpan...' : 'Simpan Penetapan'}
                {!isLoading && <ChevronRight className="w-5 h-5"/>}
            </button>
        </form>
    );
}