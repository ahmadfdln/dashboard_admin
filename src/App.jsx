import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login/login_page';

// 1. Impor ToastContainer dan CSS-nya
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 2. Impor semua komponen dasbor
import DashboardAdmin from './components/DashboardAdmin';
import { DashboardDosen } from './pages/dosen/DashboardDosen';
import ProtectedRoute from './components/ProtectedRoute';
import { ForgotPassword } from './pages/ressetPassword/resset_password_page';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <div className="App">
        <Routes>
          {/* Rute Publik */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
          
          {/* Rute Terproteksi untuk Admin */}
          <Route path='/dashboard-admin' element={
             <ProtectedRoute>
               <DashboardAdmin />
             </ProtectedRoute>
          } /> 

          {/* Rute Terproteksi baru untuk Dosen */}
          <Route path='/dashboard-dosen' element={
             <ProtectedRoute>
               <DashboardDosen />
             </ProtectedRoute>
          } />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
