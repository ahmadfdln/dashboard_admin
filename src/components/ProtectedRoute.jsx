// src/components/ProtectedRoute.jsx

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listener ini akan memantau status login secara real-time
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    // Cleanup listener saat komponen tidak lagi digunakan
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    // Tampilkan loading spinner atau halaman kosong selagi memeriksa status login
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  if (!user) {
    // Jika tidak ada user yang login, redirect ke halaman login
    return <Navigate to="/login" replace />;
  }

  // Jika ada user yang login, tampilkan halaman yang diproteksi (misal: Dasbor Admin)
  return children;
}

export default ProtectedRoute;