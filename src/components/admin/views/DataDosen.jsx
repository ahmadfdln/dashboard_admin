import React, { useState } from 'react';
import { Trash2, Search } from 'lucide-react';

export function DataDosen({ users, isLoading, handleDeleteUser }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter data dosen berdasarkan input pencarian (nama atau NIDN)
  const filteredData = users
    .filter(user => user.role === 'dosen')
    .filter(user => 
        (user.nama && user.nama.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.nim_nidn && user.nim_nidn.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  // Fungsi untuk membuat inisial dari nama
  const getInitials = (name) => {
    if (!name) return 'D';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Data Dosen</h2>
            <p className="text-sm text-gray-500 mt-1">Kelola dan lihat semua data dosen yang terdaftar.</p>
        </div>
        <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type="text"
                placeholder="Cari nama atau NIDN..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">NIDN</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Fakultas</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Prodi</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center py-8">
                  <div className="flex justify-center items-center gap-2 text-gray-500">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
                    <span>Memuat data...</span>
                  </div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  {searchQuery ? `Tidak ada dosen dengan nama/NIDN "${searchQuery}"` : "Tidak ada data dosen."}
                </td>
              </tr>
            ) : (
              filteredData.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {getInitials(user.nama)}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{user.nama}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-mono">{user.nim_nidn}</td>
                  <td className="px-6 py-4 text-gray-700">{user.fakultas || '-'}</td>
                  <td className="px-6 py-4 text-gray-700">{user.prodi || '-'}</td>
                  <td className="px-6 py-4 text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleDeleteUser(user.id, user.nama)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
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
  );
}
