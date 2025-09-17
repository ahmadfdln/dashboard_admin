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
    // State baru untuk jadwal
    const [hari, setHari] = useState('Senin');
    const [jamMulai, setJamMulai] = useState('');
    const [jamSelesai, setJamSelesai] = useState('');

    const handleTambahMK = async (e) => {
        e.preventDefault();
        if (!kodeMK || !namaMK || !sks || !semesterMK || !hari || !jamMulai || !jamSelesai) {
            return toast.warn("Harap lengkapi semua field mata kuliah, termasuk jadwal.");
        }
        setIsLoading(true);
        try {
            await addDoc(collection(db, "mataKuliah"), {
                kodeMK,
                namaMK,
                sks: Number(sks),
                semester: Number(semesterMK),
                // Field baru untuk jadwal
                hari,
                jamMulai,
                jamSelesai,
                dosenPengampu: null,
                namaDosenPengampu: null,
            });
            await logActivity(`Menambahkan mata kuliah: ${namaMK} (${kodeMK})`, 'COURSE_CREATE');
            toast.success('Mata Kuliah berhasil ditambahkan!');
            // Reset semua form
            setKodeMK(''); setNamaMK(''); setSks(''); setSemesterMK('');
            setHari('Senin'); setJamMulai(''); setJamSelesai('');
            onActionSuccess();
        } catch (error) {
            console.error("Error menambah mata kuliah: ", error);
            toast.error(`Gagal menambah mata kuliah: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-purple-100 rounded-xl">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Tambah Mata Kuliah</h2>
            </div>

            <form onSubmit={handleTambahMK} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Kode Mata Kuliah</label>
                        <input type="text" value={kodeMK} onChange={e => setKodeMK(e.target.value)} required placeholder="Contoh: IF201" className="w-full p-3 border border-gray-300 rounded-lg"/>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Jumlah SKS</label>
                        <input type="number" value={sks} onChange={e => setSks(e.target.value)} required placeholder="Contoh: 3" className="w-full p-3 border border-gray-300 rounded-lg"/>
                    </div>
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Nama Mata Kuliah</label>
                    <input type="text" value={namaMK} onChange={e => setNamaMK(e.target.value)} required placeholder="Contoh: Dasar Pemrograman" className="w-full p-3 border border-gray-300 rounded-lg"/>
                </div>
                
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Semester</label>
                    <input type="number" value={semesterMK} onChange={e => setSemesterMK(e.target.value)} required placeholder="Mata kuliah untuk semester ke berapa" className="w-full p-3 border border-gray-300 rounded-lg"/>
                </div>

                <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Atur Jadwal</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Hari</label>
                            <select value={hari} onChange={e => setHari(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg">
                                <option>Senin</option>
                                <option>Selasa</option>
                                <option>Rabu</option>
                                <option>Kamis</option>
                                <option>Jumat</option>
                            </select>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Jam Masuk</label>
                            <input type="time" value={jamMulai} onChange={e => setJamMulai(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg"/>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Jam Keluar</label>
                            <input type="time" value={jamSelesai} onChange={e => setJamSelesai(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg"/>
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400">
                    {isLoading ? 'Memproses...' : <><Plus className="w-5 h-5" /><span>Tambah Mata Kuliah</span></>}
                </button>
            </form>
        </div>
    );
}
