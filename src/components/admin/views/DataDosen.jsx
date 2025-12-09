import React, { useState } from 'react';
import { Trash2, Search } from 'lucide-react';

export function DataDosen({ users, isLoading, handleDeleteUser }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = users
    .filter(user => user.role === 'dosen')
    .filter(user => 
      (user.nama && user.nama.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.nim_nidn && user.nim_nidn.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const getInitials = (name) => {
    if (!name) return 'D';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-[#0f172a]/70 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Data Dosen</h2>
            <p className="text-sm text-gray-400 mt-1">Kelola dan lihat semua data dosen yang terdaftar.</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau NIDN..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-3 text-left font-semibold text-gray-300">Nama</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-300">NIDN</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-300">Fakultas</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-300">Prodi</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-300">Email</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-300">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10">
                    <div className="flex justify-center items-center gap-3 text-gray-400">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
                      <span>Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-400">
                    {searchQuery 
                      ? `Tidak ada dosen dengan nama/NIDN "${searchQuery}"` 
                      : "Tidak ada data dosen."}
                  </td>
                </tr>
              ) : (
                filteredData.map(user => (
                  <tr
                    key={user.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10  bg-emerald-500 hover:bg-emerald-600 text-black rounded-full flex items-center justify-center font-bold text-sm">
                          {getInitials(user.nama)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.nama}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-300 font-mono">{user.nim_nidn}</td>
                    <td className="px-6 py-4 text-gray-300">{user.fakultas || '-'}</td>
                    <td className="px-6 py-4 text-gray-300">{user.prodi || '-'}</td>
                    <td className="px-6 py-4 text-gray-300 break-all">{user.email}</td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDeleteUser(user.id, user.nama)}
                        className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                        title={`Hapus ${user.nama}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
