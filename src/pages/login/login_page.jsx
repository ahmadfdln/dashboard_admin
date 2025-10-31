import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import Logo from "../../assets/logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 🔐 Fungsi Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warn("Mohon isi email dan password.");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔍 Ambil data user dari Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        // Simpan session manual agar tidak bentrok antar role
        if (userRole === "admin") {
          localStorage.setItem(
            "adminSession",
            JSON.stringify({
              uid: user.uid,
              email: user.email,
              nama: userData.nama || "",
              role: userRole,
            })
          );
          toast.success(`Login berhasil! Selamat datang, Admin ${userData.nama || user.email}`);
          navigate("/dashboard-admin");
        } else if (userRole === "dosen") {
          localStorage.setItem(
            "dosenSession",
            JSON.stringify({
              uid: user.uid,
              email: user.email,
              nama: userData.nama || "",
              role: userRole,
            })
          );
          toast.success(`Login berhasil! Selamat datang, ${userData.nama || user.email}`);
          navigate("/dashboard-dosen");
        } else {
          // Mahasiswa login via mobile app
          await signOut(auth);
          toast.error("Akses ditolak. Mahasiswa hanya bisa login melalui aplikasi mobile.");
        }
      } else {
        await signOut(auth);
        toast.error("Data pengguna tidak ditemukan. Hubungi administrator.");
      }
    } catch (error) {
      console.error("Error saat login:", error);
      let msg = "Email atau password salah.";
      if (error.code === "auth/invalid-credential") msg = "Email atau password salah.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // 🧱 UI Komponen Login
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 font-sans">
      {/* Efek latar belakang blur */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      {/* Kartu Login */}
      <div className="relative z-10 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-900 to-green-500 rounded-2xl mb-4 shadow-lg">
            <img src={Logo} alt="Logo" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Selamat Datang
          </h1>
          <p className="text-gray-500 mt-2">Masuk ke akun Anda untuk melanjutkan</p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Password */}
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
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Link Lupa Password */}
            <div className="text-sm text-right mt-1">
              <Link
                to="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Lupa password Anda?
              </Link>
            </div>
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-900 to-green-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Masuk
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
