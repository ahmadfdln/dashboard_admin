import React from 'react';
import { Trash2 } from 'lucide-react';

export function DataMataKuliah({ courses, isLoading, handleDeleteCourse }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900">Data Mata Kuliah</h2>
        <p className="text-sm text-gray-500 mt-1">Daftar semua mata kuliah beserta dosen pengampu yang ditugaskan.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Nama Mata Kuliah</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Kode MK</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">SKS</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Semester</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Dosen Pengampu</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center py-8">
                    <div className="flex justify-center items-center gap-2 text-gray-500">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                        <span>Memuat data...</span>
                    </div>
                </td>
              </tr>
            ) : courses.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">Tidak ada data mata kuliah.</td>
              </tr>
            ) : (
              courses.map(course => (
                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{course.namaMK}</td>
                  <td className="px-6 py-4 text-gray-700 font-mono">{course.kodeMK}</td>
                  <td className="px-6 py-4 text-gray-700 text-center">{course.sks}</td>
                  <td className="px-6 py-4 text-gray-700 text-center">{course.semester}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {course.namaDosenPengampu ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {course.namaDosenPengampu}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Belum Ditetapkan
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleDeleteCourse(course.id, course.namaMK)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                      title={`Hapus ${course.namaMK}`}
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