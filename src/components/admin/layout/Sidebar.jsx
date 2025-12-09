import React from 'react';
import { LogOut } from 'lucide-react';

export function Sidebar({ sidebarItems, activeTab, setActiveTab, setIsSidebarOpen, handleLogout, className }) {
  return (
    <div
      className={`
        group flex flex-col h-full 
        bg-[#0f172a]/80 backdrop-blur-xl border-r border-white/10 
        transition-all duration-300 ease-in-out
        w-20 hover:w-60
      `}
    >
      {/* Navigation */}
      <nav className={`mt-6 px-3 flex-grow ${className}`}>
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center px-3 py-3 rounded-xl transition-all duration-300
                  ${isActive ? 'bg-white/20 text-white border border-white/30' : 'text-gray-300 hover:bg-white/10 hover:text-white'}
                `}
              >
                {/* Icon */}
                <Icon className="w-5 h-5 flex-shrink-0" />

                {/* Label muncul hanya ketika hover */}
                <span
                  className="
                    ml-3 font-medium whitespace-nowrap
                    opacity-0 group-hover:opacity-100 
                    translate-x-[-10px] group-hover:translate-x-0
                    transition-all duration-300
                  "
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-3 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-100 transition-all duration-300"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />

          <span
            className="
              ml-3 font-medium whitespace-nowrap
              opacity-0 group-hover:opacity-100 
              translate-x-[-10px] group-hover:translate-x-0
              transition-all duration-300
            "
          >
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}
