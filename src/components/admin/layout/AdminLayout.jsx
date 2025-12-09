import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { X } from 'lucide-react';

export function AdminLayout({ children, sidebarItems, activeTab, setActiveTab, handleLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const activeItem = sidebarItems.find(item => item.id === activeTab);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0B1120]">
      {/* 🔥 NEON DIAGONAL BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-0 w-[70%] h-[70%] bg-emerald-500 opacity-90 rotate-[-35deg] translate-x-40 -translate-y-40"></div>
      </div>

      <div className="flex h-screen relative z-10">

        {/* OVERLAY MOBILE */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <div
          className={`fixed inset-y-0 left-0 z-30 mt-14 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:relative transition-transform duration-300`}
        >
          <div className="h-full bg-black/30 backdrop-blur-2xl border-r border-white/10 shadow-xl">

            {/* CLOSE BTN MOBILE */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* SIDEBAR COMPONENT */}
            <Sidebar
              sidebarItems={sidebarItems}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setIsSidebarOpen={setIsSidebarOpen}
              handleLogout={handleLogout}
            />
          </div>
        </div>

        {/* MAIN AREA */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* HEADER */}
          <div className="sticky top-0 z-10 bg-black/30 backdrop-blur-xl border-b border-white/10 shadow-lg">
            <Header
              title={activeItem?.label || 'Dashboard'}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </div>

          {/* MAIN CONTENT */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>

        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.05); }
          50% { transform: translate(-25px, 20px) scale(0.95); }
          75% { transform: translate(35px, 45px) scale(1.08); }
        }
        .animate-blob { animation: blob 7s infinite; }
      `}</style>
    </div>
  );
}
