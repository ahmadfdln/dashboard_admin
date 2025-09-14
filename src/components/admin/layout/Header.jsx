import React from 'react';
import { Bell, Menu } from 'lucide-react';

export function Header({ title, setIsSidebarOpen }) {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-10 flex-shrink-0">
      <div className="flex items-center justify-between h-16 px-6">
        <div className='flex items-center gap-4'>
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden"><Menu className="w-6 h-6"/></button>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Bell className="text-gray-600"/>
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">A</div>
        </div>
      </div>
    </header>
  );
}