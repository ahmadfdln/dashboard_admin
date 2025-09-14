import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login/login_page';

// 1. Impor ToastContainer dan CSS-nya
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardAdmin from './components/DashboardAdmin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path='/dashboard-admin' element={
             <ProtectedRoute>
             <DashboardAdmin />
           </ProtectedRoute>
          } /> 
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

