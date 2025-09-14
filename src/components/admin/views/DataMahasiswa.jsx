import React from 'react';

export function DataMahasiswa({ users, isLoading }) {
  const mahasiswaData = users.filter(user => user.role === 'mahasiswa');
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900">Data Mahasiswa</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">NIM</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Semester</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="4" className="text-center py-8">Memuat data...</td>
              </tr>
            ) : mahasiswaData.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">Tidak ada data mahasiswa.</td>
              </tr>
            ) : (
              mahasiswaData.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{user.nama}</td>
                  <td className="px-6 py-4 text-gray-700">{user.nim_nidn}</td>
                  <td className="px-6 py-4 text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 text-gray-700 text-center">{user.semester || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}