import React, { useState } from 'react';
import { ChevronRight, Search, BookOpen, Users } from 'lucide-react';
import { toast } from 'react-toastify';

// Firestore
import { db } from '../../config/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';

export function MahasiswaView({ mataKuliahList, isLoading: isCourseLoading }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [isStudentLoading, setIsStudentLoading] = useState(false);
  const [filterSemester, setFilterSemester] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Ambil mahasiswa dari Firestore
  const fetchEnrolledStudents = async (courseId) => {
    setIsStudentLoading(true);
    setEnrolledStudents([]);
    try {
      const studentsQuery = query(
        collection(db, "mataKuliah", courseId, "mahasiswaTerdaftar"),
        orderBy("nama", "asc")
      );
      const snapshot = await getDocs(studentsQuery);
      const students = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setEnrolledStudents(students);
    } catch (error) {
      toast.error("Gagal memuat data mahasiswa dari mata kuliah ini.");
      console.error("Error fetching students:", error);
    } finally {
      setIsStudentLoading(false);
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    fetchEnrolledStudents(course.id);
    setFilterSemester("all"); // reset filter
    setSearchQuery(""); // reset search
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  // 🔹 Filter mahasiswa berdasarkan semester + pencarian
  const filteredStudents = enrolledStudents.filter(student => {
    const matchSemester = filterSemester === "all" || String(student.semester) === String(filterSemester);
    const queryLower = searchQuery.toLowerCase();
    
    // --- PENYESUAIAN PENCARIAN ---
    const matchSearch = 
      student.nama?.toLowerCase().includes(queryLower) ||
      student.nim?.toLowerCase().includes(queryLower) ||
      student.prodi?.toLowerCase().includes(queryLower); // Ditambahkan pencarian prodi
    // --- AKHIR PENYESUAIAN ---

    return matchSemester && matchSearch;
  });

  // 🔹 Ambil daftar semester unik
  const semesterOptions = [...new Set(enrolledStudents.map(s => s.semester))].sort((a, b) => a - b);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* 🔹 Kiri: Daftar Mata Kuliah */}
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Mata Kuliah Anda</h3>
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {mataKuliahList.length} kelas
          </span>
        </div>
        <div className="flex-1 overflow-y-auto -mr-4 pr-4">
          {isCourseLoading ? (
            <p className="text-center text-gray-500">Memuat mata kuliah...</p>
          ) : (
            <div className="space-y-3">
              {mataKuliahList.map(course => (
                <button
                  key={course.id}
                  onClick={() => handleCourseClick(course)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedCourse?.id === course.id 
                      ? 'bg-blue-50 border-blue-500' 
                      : 'bg-gray-50 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-900">{course.namaMK}</p>
                      <p className="text-sm text-gray-500">{course.kodeMK}</p>
                    </div>
                    <ChevronRight className={`transition-transform ${selectedCourse?.id === course.id ? 'translate-x-1' : ''}`} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🔹 Kanan: Data Mahasiswa */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Informasi Mahasiswa</h3>
            <p className="text-sm text-gray-500">
              {selectedCourse 
                ? `Peserta mata kuliah ${selectedCourse.namaMK}` 
                : 'Pilih mata kuliah untuk melihat peserta'}
            </p>
          </div>
        </div>

        {/* 🔹 Filter & Search */}
        {selectedCourse && (
          <div className="flex flex-wrap gap-3 mb-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama, NIM, atau prodi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Semua Semester</option>
              {semesterOptions.map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex-1 overflow-y-auto -mr-4 pr-4">
          {isStudentLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !selectedCourse ? (
            <div className="flex flex-col justify-center items-center h-full text-center text-gray-500">
              <BookOpen size={48} className="mb-4 text-gray-300" />
              <p className="font-semibold">Pilih Mata Kuliah</p>
              <p className="text-sm">Silakan pilih salah satu mata kuliah di sebelah kiri.</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full text-center text-gray-500">
              <Users size={48} className="mb-4 text-gray-300" />
              <p className="font-semibold">Tidak Ada Mahasiswa</p>
              <p className="text-sm">Data mahasiswa tidak ditemukan untuk filter ini.</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama Mahasiswa</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">NIM</th>
                  
                  {/* --- TAMBAHAN BARU --- */}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Prodi</th>
                  {/* --- AKHIR TAMBAHAN --- */}
                  
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Semester</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {getInitials(student.nama)}
                        </div>
                        <span className="font-medium text-gray-800">{student.nama}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-mono">{student.nim}</td>
                    
                    {/* --- TAMBAJAN BARU --- */}
                    <td className="px-4 py-3 text-gray-600">{student.prodi || '-'}</td>
                    {/* --- AKHIR TAMBAHAN --- */}
                    
                    <td className="px-4 py-3 text-gray-600">{student.semester || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}