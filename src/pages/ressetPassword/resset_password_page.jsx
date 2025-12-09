import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { Mail, ArrowLeft, Lock, CheckCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.warn('Silakan masukkan alamat email Anda.');
    }
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsSent(true);
      toast.success('Link reset password telah dikirim ke email Anda!');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        toast.error('Email tidak terdaftar dalam sistem.');
      } else {
        toast.error(`Terjadi kesalahan: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] relative flex items-center justify-center p-4 overflow-hidden">

      {/* NEON DIAGONAL BACKGROUND */}
      <div className="absolute w-full h-full pointer-events-none">
        <div className="absolute right-0 top-0 w-[70%] h-[70%] bg-emerald-500 opacity-90 rotate-[-35deg] translate-x-40 -translate-y-40"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-[2]"
      >

        {!isSent ? (
          /* FORM CARD - DARK GLASS */
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6">

            {/* ICON */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl rotate-3">
                  <Lock className="w-10 h-10 text-black" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </motion.div>
              </div>
            </motion.div>

            {/* TITLE */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-extrabold text-white mb-2">
                Lupa Password?
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Masukkan email Anda dan kami akan mengirimkan link reset password.
              </p>
            </div>

            {/* FORM */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleResetPassword}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Alamat Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-white transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3 bg-white/10 text-white border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              {/* BUTTON */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 font-semibold rounded-xl text-black bg-emerald-500 hover:bg-emerald-600 shadow-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 text-black" />
                    <span>Kirim Link Reset</span>
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* BACK */}
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Login
              </Link>
            </div>

            {/* FOOTER */}
            <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-gray-400 flex justify-center items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Link reset aman, berlaku 1 jam
            </div>
          </div>

        ) : (

          /* SUCCESS CARD */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                <CheckCircle className="w-10 h-10 text-black" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Email Terkirim!</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Kami telah mengirimkan link reset password ke <br />
              <span className="font-semibold text-white">{email}</span>
            </p>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-xl shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Login
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
