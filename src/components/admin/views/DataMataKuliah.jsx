import React from 'react';
import { Trash2 } from 'lucide-react';

export function DataMataKuliah({ courses, isLoading, handleDeleteCourse }) {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-[#0f172a]/70 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Data Mata Kuliah</h2>
          <p className="text-sm text-gray-400 mt-1">
            Daftar semua mata kuliah beserta dosen pengampu yang telah ditetapkan.
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-5 py-3 text-left font-semibold text-gray-300">Nama MK</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-300">Kode</th>
                <th className="px-5 py-3 text-center font-semibold text-gray-300">SKS</th>
                <th className="px-5 py-3 text-center font-semibold text-gray-300">Semester</th>
                <th className="px-5 py-3 text-left font-semibold text-gray-300">Dosen Pengampu</th>
                <th className="px-5 py-3 text-center font-semibold text-gray-300">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {/* Loading */}
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-400">
                    <div className="flex justify-center items-center gap-2">
                      <div className="h-5 w-5 border-b-2 border-purple-500 rounded-full animate-spin"></div>
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                // Empty Data
                <tr>
                  <td
                    colSpan="6"
                    className="py-10 text-center text-gray-400"
                  >
                    Tidak ada data mata kuliah.
                  </td>
                </tr>
              ) : (
                // Data
                courses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-5 py-4 text-white font-medium">
                      {course.namaMK}
                    </td>
                    <td className="px-5 py-4 text-gray-300 font-mono">
                      {course.kodeMK}
                    </td>
                    <td className="px-5 py-4 text-gray-300 text-center">
                      {course.sks}
                    </td>
                    <td className="px-5 py-4 text-gray-300 text-center">
                      {course.semester}
                    </td>

                    {/* Dosen Pengampu */}
                    <td className="px-5 py-4">
                      {course.namaDosenPengampu ? (
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-green-500/20 text-green-300 text-xs border border-green-500/30">
                          {course.namaDosenPengampu}
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-yellow-500/20 text-yellow-300 text-xs border border-yellow-500/30">
                          Belum Ditetapkan
                        </span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleDeleteCourse(course.id, course.namaMK)}
                        className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                        title="Hapus Mata Kuliah"
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
