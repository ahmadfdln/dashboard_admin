import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { auth, db } from '../../../config/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { Users } from 'lucide-react';

// Dropdown dinamis Fakultas dan Prodi
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
    setProdi('');
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
        uid: user.uid,
        nama,
        nim_nidn: nimNidn,
        email,
        role,
        fakultas,
        prodi,
        created_at: Timestamp.now(),
      };

      if (role === 'mahasiswa') {
        userData.semester = Number(semester);
      }

      await setDoc(doc(db, "users", user.uid), userData);
      await sendEmailVerification(user);

      await logActivity(`Menambahkan ${role} baru: ${nama}`, 'USER_CREATE');
      toast.success(`Akun ${role} untuk ${nama} berhasil dibuat.`);

      setEmail('');
      setPassword('');
      setNama('');
      setNimNidn('');
      setSemester('');
      setFakultas('');
      setProdi('');

      onActionSuccess();
    } catch (error) {
      toast.error(`Gagal membuat akun: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">

      {/* CARD GLASS */}
      <div className="
        bg-[#0C1022]/70
        backdrop-blur-2xl
        border border-white/10
        rounded-2xl
        p-8
        shadow-[0_4px_20px_rgba(0,0,0,0.45)]
        transition-all
      ">
        
        {/* HEADER */}
        <div className="flex items-center space-x-3 mb-10">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 shadow-inner">
            <Users className="w-6 h-6 text-purple-300" />
          </div>

          <h2 className="text-2xl font-bold text-white tracking-wide">
            Tambah Pengguna Baru
          </h2>
        </div>

        {/* FORM */}
        <form onSubmit={handleBuatAkun} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Role */}
            <FormSelect
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="dosen">Dosen</option>
            </FormSelect>

            {/* Nama */}
            <FormInput
              label="Nama Lengkap"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />

            {/* Email */}
            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password */}
            <FormInput
              label="Password"
              type="password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Fakultas */}
            <FormSelect
              label="Fakultas"
              value={fakultas}
              onChange={handleFakultasChange}
            >
              <option value="" disabled>-- Pilih Fakultas --</option>
              {Object.keys(prodiData).map((fak) => (
                <option key={fak} value={fak} className="bg-slate-900">
                  {fak}
                </option>
              ))}
            </FormSelect>

            {/* Prodi */}
            <FormSelect
              label="Program Studi (Prodi)"
              value={prodi}
              disabled={!fakultas}
              onChange={(e) => setProdi(e.target.value)}
            >
              <option value="" disabled>-- Pilih Prodi --</option>
              {fakultas &&
                prodiData[fakultas].map((p) => (
                  <option key={p} value={p} className="bg-slate-900">
                    {p}
                  </option>
                ))}
            </FormSelect>

            {/* NIM / NIDN */}
            <FormInput
              label={role === 'mahasiswa' ? 'NIM' : 'NIDN'}
              value={nimNidn}
              onChange={(e) => setNimNidn(e.target.value)}
            />

            {/* Semester */}
            {role === 'mahasiswa' && (
              <FormInput
                label="Semester"
                type="number"
                placeholder="Contoh: 3"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              />
            )}

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="
              w-full py-3 px-4 rounded-xl font-semibold 
              bg-emerald-500 hover:bg-emerald-600 text-black
              transition-all duration-300
              shadow-lg shadow-purple-900/30
              disabled:opacity-60
            "
          >
            {isLoading ? "Memproses..." : "Buat Akun"}
          </button>

        </form>
      </div>
    </div>
  );
}



/* --------------------------
   COMPONENT : FORM INPUT
--------------------------- */
function FormInput({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <input
        {...props}
        className="
          w-full p-3 rounded-xl
          bg-white/5
          border border-white/10
          text-white
          placeholder-gray-400
          focus:outline-none
          focus:ring-2 focus:ring-purple-500
        "
      />
    </div>
  );
}

/* --------------------------
   COMPONENT : FORM SELECT
--------------------------- */
function FormSelect({ label, children, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <select
        {...props}
        className="
          w-full p-3 rounded-xl
          bg-white/5
          border border-white/10
          text-white
          disabled:text-gray-500
          focus:outline-none
          focus:ring-2 focus:ring-purple-500
        "
      >
        {children}
      </select>
    </div>
  );
}
