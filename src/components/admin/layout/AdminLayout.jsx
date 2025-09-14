import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { X } from 'lucide-react';

export function AdminLayout({ children, sidebarItems, activeTab, setActiveTab, handleLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const activeItem = sidebarItems.find(item => item.id === activeTab);

  return (
    <div className="bg-gray-100">
      <div className="flex h-screen">
        {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
        
        <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform`}>
          <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 lg:hidden p-1 rounded-full bg-gray-100"><X className="w-5 h-5"/></button>
          <Sidebar 
            sidebarItems={sidebarItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setIsSidebarOpen={setIsSidebarOpen}
            handleLogout={handleLogout}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            title={activeItem?.label || 'Dashboard'}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}