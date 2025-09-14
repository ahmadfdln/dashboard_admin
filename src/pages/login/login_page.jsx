// src/components/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Impor 'db' dan fungsi firestore
import { auth, db } from '../../config/firebase'; 
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from 'firebase/auth';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Shield } from 'lucide-react';
import { toast } from 'react-toastify';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return toast.warn('Mohon isi email dan password.');
    setIsLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 1. Ambil data user dari Firestore untuk cek role
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().role === 'admin') {
        // 2. Jika user adalah admin, lanjutkan
        toast.success(`Login berhasil! Selamat datang, Admin ${user.email}`);
        // Arahkan ke dasbor admin
        setTimeout(() => navigate('/dashboard-admin'), 1500); 
      } else {
        // 3. Jika bukan admin atau data tidak ditemukan, tolak login
        await signOut(auth);
        toast.error('Akses ditolak. Anda bukan admin.');
      }
    } catch (error) {
      console.error('Error saat login:', error);
      let friendlyMessage = 'Email atau password yang Anda masukkan salah.';
      if (error.code === 'auth/invalid-credential') {
        friendlyMessage = 'Email atau password salah.';
      }
      toast.error(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) return toast.warn('Mohon isi email dan password.');
    setIsLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Simpan data admin ke Firestore dengan role 'admin'
      // ID dokumen di Firestore akan sama dengan UID user di Authentication
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: 'admin',
        nama: 'Admin Utama', // Anda bisa menambahkan form untuk nama nanti
        dibuatPada: new Date()
      });
      
      // (Opsional) Kirim verifikasi email, lalu logout agar admin login kembali
      await sendEmailVerification(user);
      await signOut(auth);
      
      toast.info('Registrasi Admin berhasil! Link verifikasi telah dikirim. Silakan login setelah verifikasi.');
      setIsLoginView(true); // Langsung arahkan ke tampilan login
    } catch (error) {
      console.error('Error saat registrasi:', error);
      let friendlyMessage = 'Terjadi kesalahan saat registrasi.';
      if (error.code === 'auth/email-already-in-use') {
        friendlyMessage = 'Email ini sudah terdaftar. Silakan login.';
      } else if (error.code === 'auth/weak-password') {
        friendlyMessage = 'Password terlalu lemah (minimal 6 karakter).';
      }
      toast.error(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="relative z-10 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            {isLoginView ? <User className="w-8 h-8 text-white" /> : <Shield className="w-8 h-8 text-white" />}
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {isLoginView ? 'Admin Login' : 'Register Admin'}
          </h1>
          <p className="text-gray-500 mt-2">
            {isLoginView ? 'Masuk ke akun Anda untuk melanjutkan' : 'Buat akun admin baru'}
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 backdrop-blur-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            onClick={isLoginView ? handleLogin : handleRegister}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                {isLoginView ? 'Masuk' : 'Daftar'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsLoginView(!isLoginView);
              setEmail('');
              setPassword('');
            }}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors hover:underline"
          >
            {isLoginView ? 'Belum punya akun admin? Daftar' : 'Sudah punya akun? Masuk'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;