import React from 'react';
import { Menu, Bell } from 'lucide-react';

export default function DosenHeader({ activeTab, currentUser, setSidebarOpen }) {
  return (
    <header className="sticky top-0 z-10 bg-black/30 backdrop-blur-xl border-b border-white/10">
      <div className="px-6 py-4 flex items-center justify-between">

        {/* Mobile menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-white/10"
          >
            <Menu className="w-5 h-5 text-gray-300" />
          </button>

          <div>
            <h2 className="text-2xl text-white font-bold capitalize">
              {activeTab === 'dashboard' ? 'Dashboard Utama' : activeTab}
            </h2>
            <p className="text-sm text-gray-300 mt-1">
              {activeTab === 'dashboard' && 'Kelola sesi absensi'}
              {activeTab === 'jadwal' && 'Jadwal mengajar Anda'}
              {activeTab === 'mahasiswa' && 'Data mahasiswa'}
              {activeTab === 'riwayat' && 'Riwayat sesi absensi'}
              {activeTab === 'statistik' && 'Statistik performa mahasiswa'}
            </p>
          </div>
        </div>

        {/* Right profile */}
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-white/10 rounded-xl relative">
            <Bell className="w-5 h-5 text-gray-300" />
            <span className="absolute top-1.5 right-1.5 bg-red-500 w-2 h-2 rounded-full" />
          </button>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 text-white flex items-center justify-center">
            {currentUser?.displayName?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
