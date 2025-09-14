import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { db } from '../../../config/firebase'; // Sesuaikan path jika perlu
import { addDoc, collection } from 'firebase/firestore';

export  default function ManajemenMataKuliah({ onActionSuccess, logActivity }) {
    const [isLoading, setIsLoading] = useState(false);
    const [kodeMK, setKodeMK] = useState('');
    const [namaMK, setNamaMK] = useState('');
    const [sks, setSks] = useState('');
    const [semesterMK, setSemesterMK] = useState('');

    const handleTambahMK = async (e) => {
        e.preventDefault();
        if (!kodeMK || !namaMK || !sks || !semesterMK) {
            return toast.warn("Harap lengkapi semua field mata kuliah.");
        }
        setIsLoading(true);
        try {
            await addDoc(collection(db, "mataKuliah"), {
                kodeMK,
                namaMK,
                sks: Number(sks),
                semester: Number(semesterMK),
            });
            await logActivity(`Menambahkan mata kuliah: ${namaMK} (${kodeMK})`, 'COURSE_CREATE');
            toast.success('Mata Kuliah berhasil ditambahkan!');
            setKodeMK(''); setNamaMK(''); setSks(''); setSemesterMK('');
            onActionSuccess();
        } catch (error) {
            console.error("Error menambah mata kuliah: ", error);
            toast.error(`Gagal menambah mata kuliah: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleTambahMK} className="space-y-4 max-w-lg mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tambah Mata Kuliah</h2>
            <div>
                <label className='block text-sm font-medium text-gray-700'>Kode Mata Kuliah</label>
                <input type="text" value={kodeMK} onChange={e => setKodeMK(e.target.value)} required className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700'>Nama Mata Kuliah</label>
                <input type="text" value={namaMK} onChange={e => setNamaMK(e.target.value)} required className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700'>Jumlah SKS</label>
                <input type="number" value={sks} onChange={e => setSks(e.target.value)} required className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700'>Semester</label>
                <input type="number" value={semesterMK} onChange={e => setSemesterMK(e.target.value)} required placeholder="Untuk semester ke berapa" className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400">
                {isLoading ? 'Memproses...' : 'Tambah Mata Kuliah'}
            </button>
        </form>
    );
}