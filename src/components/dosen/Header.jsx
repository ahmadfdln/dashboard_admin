// src/components/dashboard/Header.jsx
import React from 'react';
import { Bell, User } from 'lucide-react';

const Header = ({ activeTab, currentUser }) => {
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'jadwal', label: 'Jadwal Mengajar' },
    { id: 'riwayat', label: 'Riwayat Absensi' },
    { id: 'statistik', label: 'Statistik' },
  ];

  return (
    <header className="bg-white shadow-sm h-20 flex items-center justify-between px-8 border-b border-gray-200 flex-shrink-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}</h1>
        <p className="text-gray-500 text-sm mt-1">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors relative">
          <Bell size={22} className="text-gray-600" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </button>
        <div className="w-px h-8 bg-gray-200"></div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <span className="font-medium text-gray-700">{currentUser?.displayName?.split(' ')[0] || 'Dosen'}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;