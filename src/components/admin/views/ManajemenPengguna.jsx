// src/components/admin/views/ManajemenPengguna.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { auth, db } from '../../../config/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

export function ManajemenPengguna({ onActionSuccess, logActivity }) {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nama, setNama] = useState('');
    const [nimNidn, setNimNidn] = useState('');
    const [role, setRole] = useState('mahasiswa');
    const [semester, setSemester] = useState('');

    const handleBuatAkun = async (e) => {
        e.preventDefault();
        if (!email || !password || !nama || !nimNidn || (role === 'mahasiswa' && !semester)) {
            return toast.warn("Harap lengkapi semua field pengguna.");
        }
        setIsLoading(true);
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          const userData = {
            uid: user.uid, nama, nim_nidn: nimNidn, email, role, created_at: Timestamp.now(),
          };
          if (role === 'mahasiswa') userData.semester = Number(semester);
          await setDoc(doc(db, "users", user.uid), userData);
          await sendEmailVerification(user);
          await logActivity(`Menambahkan ${role} baru: ${nama}`, 'USER_CREATE');
          toast.success(`Akun ${role} untuk ${nama} berhasil dibuat.`);
          setEmail(''); setPassword(''); setNama(''); setNimNidn(''); setSemester('');
          onActionSuccess();
        } catch (error) {
          toast.error(`Gagal membuat akun: ${error.message}`);
        } finally {
          setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleBuatAkun} className="space-y-4 max-w-lg mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tambah Pengguna Baru</h2>
            <div><label className='block text-sm font-medium text-gray-700'>Role</label><select value={role} onChange={e => setRole(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md"><option value="mahasiswa">Mahasiswa</option><option value="dosen">Dosen</option></select></div>
            <div><label className='block text-sm font-medium text-gray-700'>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full p-2 border border-gray-300 rounded-md"/></div>
            <div><label className='block text-sm font-medium text-gray-700'>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Minimal 6 karakter" className="mt-1 w-full p-2 border border-gray-300 rounded-md"/></div>
            <div><label className='block text-sm font-medium text-gray-700'>Nama Lengkap</label><input type="text" value={nama} onChange={e => setNama(e.target.value)} required className="mt-1 w-full p-2 border border-gray-300 rounded-md"/></div>
            <div><label className='block text-sm font-medium text-gray-700'>{role === 'mahasiswa' ? 'NIM' : 'NIDN'}</label><input type="text" value={nimNidn} onChange={e => setNimNidn(e.target.value)} required className="mt-1 w-full p-2 border border-gray-300 rounded-md"/></div>
            {role === 'mahasiswa' && (<div><label className='block text-sm font-medium text-gray-700'>Semester</label><input type="number" value={semester} onChange={e => setSemester(e.target.value)} required placeholder="Contoh: 3" className="mt-1 w-full p-2 border border-gray-300 rounded-md"/></div>)}
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">{isLoading ? 'Memproses...' : 'Buat Akun'}</button>
        </form>
    );
}