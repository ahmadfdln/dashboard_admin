import React from "react";
import {
  BookOpen,
  Grid3X3,
  Users,
  History,
  Calendar,
  BarChart3,
  LogOut,
  X,
} from "lucide-react";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function DosenSidebar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  currentUser,
}) {
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Grid3X3 },
    { id: "jadwal", label: "Jadwal", icon: Calendar },
    { id: "mahasiswa", label: "Mahasiswa", icon: Users },
    { id: "riwayat", label: "Riwayat", icon: History },
    { id: "statistik", label: "Statistik", icon: BarChart3 },
  ];

  const handleLogout = async () => {
    if (window.confirm("Yakin ingin keluar?")) {
      await signOut(auth);
      navigate("/login");
    }
  };

  return (
    <aside
      className={`
        bg-black/30 backdrop-blur-xl border-r border-white/10
        flex flex-col items-center
        transition-transform duration-300
        fixed inset-y-0 left-0 z-40 w-64
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0 lg:w-20
      `}
    >
      {/* Tombol close (mobile) */}
      <button
        onClick={() => setSidebarOpen(false)}
        className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10"
      >
        <X className="w-5 h-5 text-gray-300" />
      </button>

      {/* Logo (ikon saja di desktop) */}
      <div className="w-full flex items-center justify-center lg:justify-center px-4 py-5 border-b border-white/10">
        <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-purple-300" />
        </div>

        {/* Teks logo hanya di mobile */}
        <div className="ml-3 lg:hidden">
          <h1 className="text-lg font-bold text-white">EduAttend</h1>
          <p className="text-xs text-gray-400">Dashboard Dosen</p>
        </div>
      </div>

      {/* Profil user: ikon + tooltip saat hover */}
      <div className="mt-4 mb-3">
        <div className="relative group">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-semibold">
            {currentUser?.displayName?.charAt(0) ||
              currentUser?.email?.charAt(0) ||
              "U"}
          </div>

          {/* Tooltip nama & email di desktop */}
          <div
            className="
              hidden lg:block
              absolute left-full ml-3 top-1/2 -translate-y-1/2
              bg-slate-900/95 border border-white/10 rounded-xl
              px-3 py-2 text-xs text-white shadow-xl
              opacity-0 group-hover:opacity-100
              pointer-events-none transition-opacity duration-200
              whitespace-nowrap
            "
          >
            <div className="font-semibold">
              {currentUser?.displayName || "Dosen"}
            </div>
            <div className="text-[10px] text-gray-300">
              {currentUser?.email}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation: hanya ICON, teks muncul sebagai tooltip */}
      <nav className="mt-4 flex-1 flex flex-col items-center gap-2 w-full">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`
                relative group
                w-12 h-12 mx-auto
                flex items-center justify-center
                rounded-2xl 
                transition-all
                ${
                  active
                    ? "bg-white/20 border border-white/30 text-white"
                    : "text-gray-300 hover:bg-white/10"
                }
              `}
            >
              <Icon className="w-5 h-5" />

              {/* Tooltip label di desktop */}
              <span
                className="
                  hidden lg:inline-block
                  absolute left-full ml-3
                  bg-slate-900/95 border border-white/10
                  rounded-xl px-3 py-1.5 text-xs text-white
                  shadow-xl whitespace-nowrap
                  opacity-0 group-hover:opacity-100
                  pointer-events-none transition-opacity duration-200
                "
              >
                {item.label}
              </span>

              {/* Label biasa di mobile (sidebar full) */}
              <span className="lg:hidden ml-3 text-sm font-medium">
                {item.label}
              </span>

              {/* Bulatan indikator aktif di bawah icon */}
              {active && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-purple-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Tombol logout – ikon + tooltip */}
      <div className="mb-5">
        <button
          onClick={handleLogout}
          className="
            relative group
            w-12 h-12 mx-auto
            flex items-center justify-center
            rounded-2xl 
            text-red-400 hover:bg-red-500/10
            transition-all
          "
        >
          <LogOut className="w-5 h-5" />

          {/* Tooltip logout di desktop */}
          <span
            className="
              hidden lg:inline-block
              absolute left-full ml-3
              bg-slate-900/95 border border-red-500/40
              rounded-xl px-3 py-1.5 text-xs text-red-200
              shadow-xl whitespace-nowrap
              opacity-0 group-hover:opacity-100
              pointer-events-none transition-opacity duration-200
            "
          >
            Keluar
          </span>

          {/* Label logout di mobile */}
          <span className="lg:hidden ml-3 text-sm font-medium text-red-300">
            Keluar
          </span>
        </button>
      </div>
    </aside>
  );
}
