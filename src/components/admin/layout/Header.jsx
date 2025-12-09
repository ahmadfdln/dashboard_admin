import React from 'react';
import { Bell, Menu } from 'lucide-react';

export function Header({ title, setIsSidebarOpen }) {
  return (
    <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10 flex-shrink-0">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Title & Mobile Menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-gray-300 hover:text-white transition-colors duration-200"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>

        {/* Right: Notifications & Avatar */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-300 hover:text-white transition-colors duration-200">
            <Bell className="w-6 h-6" />
          </button>
          <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
        </div>
      </div>
    </header>
  );
}