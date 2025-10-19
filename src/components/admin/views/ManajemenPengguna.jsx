import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { auth, db } from '../../../config/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { Users } from 'lucide-react';

// Data untuk dropdown dinamis Fakultas dan Prodi
const prodiData = {
    "Fakultas Teknik": ["Teknik Informatika", "Sistem Informasi", "Teknik Elektro", "Teknik Sipil"],
    "Fakultas Ekonomi dan Bisnis": ["Akuntansi", "Manajemen", "Ekonomi Pembangunan"],
    "Fakultas Ilmu Komunikasi": ["Jurnalistik", "Public Relations", "Broadcasting"],
    "Fakultas Desain Komunikasi Visual": ["Animasi", "Desain Grafis", "Videografi"]
};

export function ManajemenPengguna({ onActionSuccess, logActivity }) {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nama, setNama] = useState('');
    const [nimNidn, setNimNidn] = useState('');
    const [role, setRole] = useState('mahasiswa');
    const [semester, setSemester] = useState('');
    const [fakultas, setFakultas] = useState('');
    const [prodi, setProdi] = useState('');

    const handleFakultasChange = (e) => {
        setFakultas(e.target.value);
        setProdi(''); // Reset pilihan prodi saat fakultas berubah
    };

    const handleBuatAkun = async (e) => {
        e.preventDefault();
        if (!email || !password || !nama || !nimNidn || !fakultas || !prodi || (role === 'mahasiswa' && !semester)) {
            return toast.warn("Harap lengkapi semua field pengguna.");
        }
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userData = {
                uid: user.uid, nama, nim_nidn: nimNidn, email, role, fakultas, prodi, created_at: Timestamp.now(),
            };
            if (role === 'mahasiswa') userData.semester = Number(semester);

            await setDoc(doc(db, "users", user.uid), userData);
            await sendEmailVerification(user);
            await logActivity(`Menambahkan ${role} baru: ${nama}`, 'USER_CREATE');
            toast.success(`Akun ${role} untuk ${nama} berhasil dibuat.`);
            
            setEmail(''); setPassword(''); setNama(''); setNimNidn(''); setSemester(''); setFakultas(''); setProdi('');
            onActionSuccess();
        } catch (error) {
            toast.error(`Gagal membuat akun: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // PERBAIKAN: class max-w-lg mx-auto dihapus agar form melebar
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Tambah Pengguna Baru</h2>
            </div>

            <form onSubmit={handleBuatAkun} className="space-y-6">
                {/* PERBAIKAN: Form diatur dalam grid 2 kolom */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Role</label>
                        <select value={role} onChange={e => setRole(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg">
                            <option value="mahasiswa">Mahasiswa</option>
                            <option value="dosen">Dosen</option>
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Nama Lengkap</label>
                        <input type="text" value={nama} onChange={e => setNama(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg"/>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg"/>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Minimal 6 karakter" className="w-full p-3 border border-gray-300 rounded-lg"/>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Fakultas</label>
                        <select value={fakultas} onChange={handleFakultasChange} required className="w-full p-3 border border-gray-300 rounded-lg">
                            <option value="" disabled>-- Pilih Fakultas --</option>
                            {Object.keys(prodiData).map(fak => (<option key={fak} value={fak}>{fak}</option>))}
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Program Studi (Prodi)</label>
                        <select value={prodi} onChange={e => setProdi(e.target.value)} required disabled={!fakultas} className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100">
                            <option value="" disabled>-- Pilih Prodi --</option>
                            {fakultas && prodiData[fakultas].map(p => (<option key={p} value={p}>{p}</option>))}
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>{role === 'mahasiswa' ? 'NIM' : 'NIDN'}</label>
                        <input type="text" value={nimNidn} onChange={e => setNimNidn(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg"/>
                    </div>
                    {role === 'mahasiswa' && (
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Semester</label>
                            <input type="number" value={semester} onChange={e => setSemester(e.target.value)} required placeholder="Contoh: 3" className="w-full p-3 border border-gray-300 rounded-lg"/>
                        </div>
                    )}
                </div>
                <div className="pt-4">
                    <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                        {isLoading ? 'Memproses...' : 'Buat Akun'}
                    </button>
                </div>
            </form>
        </div>
    );
}

