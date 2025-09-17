import React from 'react';
import { 
  Grid3X3, Calendar, History, BarChart3, LogOut, User, Users, BookOpen
} from 'lucide-react';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Grid3X3, description: 'Ringkasan aktivitas' },
  { id: 'jadwal', label: 'Jadwal Mengajar', icon: Calendar, description: 'Kelola jadwal kuliah' },
  { id: 'mahasiswa', label: 'Mahasiswa Saya', icon: Users, description: 'Lihat mahasiswa per MK' },
  { id: 'riwayat', label: 'Riwayat Absensi', icon: History, description: 'Data kehadiran mahasiswa' },
  { id: 'statistik', label: 'Statistik', icon: BarChart3, description: 'Analisis kehadiran' },
];

const Sidebar = ({ currentUser, activeTab, setActiveTab, handleLogout }) => (
    <div className="w-80 bg-white shadow-xl flex flex-col border-r border-gray-200">
      <div className="flex items-center justify-center h-20 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <BookOpen size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Dosen Portal</span>
        </div>
      </div>
      
      <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
            <User size={32} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg truncate">
              {currentUser?.displayName || 'Dosen'}
            </h3>
            <p className="text-gray-500 text-sm truncate">{currentUser?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-600 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 py-8">
        <div className="space-y-3">
          {sidebarItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-left transition-all duration-300 group ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <item.icon size={24} className={`${activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'}`}/>
              <div>
                <span className="font-semibold text-base">{item.label}</span>
                <p className={`text-xs mt-1 ${activeTab === item.id ? 'text-blue-100' : 'text-gray-400'}`}>
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </nav>

      <div className="p-6 border-t border-gray-200">
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-red-600 hover:bg-red-50 transition-all duration-300 group"
        >
          <LogOut size={24} className="text-red-500 group-hover:text-red-600"/>
          <div>
            <span className="font-semibold text-base">Logout</span>
            <p className="text-xs text-red-400 mt-1">Keluar dari sistem</p>
          </div>
        </button>
      </div>
    </div>
);

export default Sidebar;

