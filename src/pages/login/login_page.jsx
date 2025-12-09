import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import logo from "../../assets/Picture2.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

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
          await signOut(auth);
          toast.error("Akses ditolak. Mahasiswa hanya bisa login melalui aplikasi mobile.");
        }
      } else {
        await signOut(auth);
        toast.error("Data pengguna tidak ditemukan. Hubungi administrator.");
      }
    } catch (error) {
      toast.error("Email atau password salah.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] relative flex items-center justify-center overflow-hidden p-4">

      {/* NEON DIAGONAL BACKGROUND */}
      <div className="absolute w-full h-full pointer-events-none">
        <div className="absolute right-0 top-0 w-[70%] h-[70%] bg-emerald-500 opacity-90 rotate-[-35deg] translate-x-40 -translate-y-40"></div>
      </div>

      {/* CARD */}
      <div className="relative z-[2] w-full max-w-sm">
        <div className="bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6">

          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-3 shadow-xl">
              <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-white">Selamat Datang</h1>
            <p className="text-gray-300 text-sm">Masuk untuk melanjutkan</p>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-xs font-medium text-gray-300">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 text-white border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-medium text-gray-300">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 bg-white/10 text-white border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                {/* Toggle password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="text-right text-xs mt-1">
                <Link to="/forgot-password" className="text-emerald-400 hover:text-emerald-300">
                  Lupa password?
                </Link>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-3 rounded-xl shadow-lg flex justify-center items-center gap-2 transition"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Masuk
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-center text-xs text-gray-400">
              Sistem Informasi Akademik
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
