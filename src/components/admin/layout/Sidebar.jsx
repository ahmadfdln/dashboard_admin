import React from 'react';
import { LogOut } from 'lucide-react';

export function Sidebar({ sidebarItems, activeTab, setActiveTab, setIsSidebarOpen, handleLogout }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between h-16 px-6 border-b flex-shrink-0">
        <span className="text-xl font-bold text-gray-900">AdminPanel</span>
      </div>
      
      <nav className="mt-8 px-4 flex-grow overflow-y-auto">
        <div className="space-y-2">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${activeTab === item.id ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t flex-shrink-0">
         <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-red-600 hover:bg-red-50">
            <LogOut className="w-5 h-5"/>
            <span className="font-medium">Logout</span>
         </button>
      </div>
    </div>
  );
}