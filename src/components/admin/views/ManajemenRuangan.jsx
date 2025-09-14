import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { db, GeoPoint } from '../../../config/firebase'; // Sesuaikan path jika perlu
import { addDoc, collection } from 'firebase/firestore';

export  default function ManajemenRuangan({ onActionSuccess, logActivity }) {
    const [isLoading, setIsLoading] = useState(false);
    const [kodeRuangan, setKodeRuangan] = useState('');
    const [namaGedung, setNamaGedung] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const handleTambahRuangan = async (e) => {
        e.preventDefault();
        if (!kodeRuangan || !namaGedung || !latitude || !longitude) {
            return toast.warn("Harap lengkapi semua field ruangan.");
        }
        setIsLoading(true);
        try {
            await addDoc(collection(db, "ruangKelas"), {
                kodeRuangan,
                namaGedung,
                lokasi: new GeoPoint(Number(latitude), Number(longitude))
            });
            await logActivity(`Menambahkan ruangan: ${kodeRuangan} di Gedung ${namaGedung}`, 'ROOM_CREATE');
            toast.success('Ruangan berhasil ditambahkan!');
            setKodeRuangan(''); setNamaGedung(''); setLatitude(''); setLongitude('');
            onActionSuccess();
        } catch (error) {
            console.error("Error menambah ruangan: ", error);
            toast.error(`Gagal menambah ruangan: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleTambahRuangan} className="space-y-4 max-w-lg mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tambah Ruangan</h2>
            <div>
                <label className='block text-sm font-medium text-gray-700'>Kode Ruangan</label>
                <input type="text" value={kodeRuangan} onChange={e => setKodeRuangan(e.target.value)} required className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700'>Nama Gedung</label>
                <input type="text" value={namaGedung} onChange={e => setNamaGedung(e.target.value)} required className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Latitude</label>
                    <input type="number" step="any" value={latitude} onChange={e => setLatitude(e.target.value)} required className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Longitude</label>
                    <input type="number" step="any" value={longitude} onChange={e => setLongitude(e.target.value)} required className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
                </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400">
                {isLoading ? 'Memproses...' : 'Tambah Ruangan'}
            </button>
        </form>
    );
}