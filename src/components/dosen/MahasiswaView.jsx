import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, 
  Search, 
  Users,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import { toast } from 'react-toastify';

import { db } from '../../config/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';

export const MahasiswaView = ({ mataKuliahList, isLoading: isCourseLoading }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [isStudentLoading, setIsStudentLoading] = useState(false);
  const [filterSemester, setFilterSemester] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Ambil mahasiswa dari Firestore
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
      toast.error("Gagal memuat data mahasiswa.");
      console.error("Error fetching students:", error);
    } finally {
      setIsStudentLoading(false);
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    fetchEnrolledStudents(course.id);
    setFilterSemester("all");
    setSearchQuery("");
  };

  const getInitials = (name) => name?.charAt(0)?.toUpperCase() || "M";

  const semesterOptions = useMemo(() => 
    [...new Set(enrolledStudents.map(s => s.semester))].sort((a, b) => a - b),
    [enrolledStudents]
  );

  const filteredStudents = useMemo(() => {
    return enrolledStudents.filter(student => {
      const matchSemester = filterSemester === "all" || String(student.semester) === String(filterSemester);
      const q = searchQuery.toLowerCase();
      const matchSearch =
        student.nama?.toLowerCase().includes(q) ||
        student.nim?.toLowerCase().includes(q) ||
        student.prodi?.toLowerCase().includes(q);

      return matchSemester && matchSearch;
    });
  }, [enrolledStudents, filterSemester, searchQuery]);

  const renderEmpty = (Icon, title, message) => (
    <div className="flex flex-col justify-center items-center py-16 text-center">
      <div className="w-20 h-20 bg-white/5 border border-white/15 rounded-full flex items-center justify-center mb-6">
        <Icon size={42} className="text-gray-500" />
      </div>
      <p className="text-xl text-white font-semibold">{title}</p>
      <p className="text-gray-400 text-sm mt-1">{message}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">

      {/* SIDEBAR KIRI */}
      <div className="lg:col-span-1 bg-[#020617]/80 border border-white/15 rounded-2xl p-6 shadow-xl backdrop-blur-xl h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Mata Kuliah</h3>
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-sm font-medium">
            {mataKuliahList.length} kelas
          </span>
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
          {isCourseLoading ? (
            <p className="text-center text-gray-400 py-6">Memuat...</p>
          ) : (
            <div className="space-y-2">
              {mataKuliahList.map(course => (
                <button
                  key={course.id}
                  onClick={() => handleCourseClick(course)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                    selectedCourse?.id === course.id
                      ? 'border-cyan-400 bg-white/5 text-cyan-300'
                      : 'border-white/10 hover:bg-white/5 text-white'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{course.namaMK}</p>
                      <p className="text-sm text-gray-400">{course.kodeMK}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KONTEN KANAN */}
      <div className="lg:col-span-3 bg-[#020617]/80 border border-white/15 rounded-2xl p-6 shadow-xl backdrop-blur-xl flex flex-col">

        {/* HEADER */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white">Daftar Mahasiswa</h3>
          <p className="text-sm text-gray-400">
            {selectedCourse
              ? `Peserta ${selectedCourse.namaMK}`
              : `Pilih mata kuliah untuk melihat daftar mahasiswa`}
          </p>
        </div>

        {/* FILTER BAR */}
        {selectedCourse && (
          <div className="flex flex-wrap gap-3 mb-4">

            {/* SEARCH */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, NIM, atau prodi..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* SEMESTER */}
            <div className="relative">
              <select
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
                className="appearance-none bg-white/5 border border-white/15 rounded-xl px-4 py-3 pr-10 text-gray-200 font-medium focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all" className="bg-slate-900 text-white">Semua Semester</option>
                {semesterOptions.map(sem => (
                  <option key={sem} value={sem} className="bg-slate-900 text-white">
                    Semester {sem}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        )}

        {/* LIST MAHASISWA */}
        <div className="flex-1 overflow-y-auto pr-1">
          {isStudentLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !selectedCourse ? (
            renderEmpty(BookOpen, "Belum Ada Mata Kuliah", "Silakan pilih mata kuliah dulu.")
          ) : filteredStudents.length === 0 ? (
            renderEmpty(Users, "Tidak Ada Data", "Mahasiswa tidak ditemukan.")
          ) : (
            <table className="min-w-full">
              <thead className="bg-white/5 sticky top-0 backdrop-blur-xl border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Mahasiswa</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">NIM</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Prodi</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Semester</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-white/5 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {getInitials(student.nama)}
                        </div>
                        <span className="text-white font-medium">{student.nama}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{student.nim}</td>
                    <td className="px-4 py-3 text-gray-300">{student.prodi || '-'}</td>
                    <td className="px-4 py-3 text-gray-300">{student.semester || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};
