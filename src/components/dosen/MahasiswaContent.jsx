import React, { useState } from 'react';
import { 
  ChevronRight, Users, Eye, Search, Filter, Download, 
  Mail, User, GraduationCap, BookOpen, ArrowLeft,
  Grid, List, MoreVertical, Phone, MapPin, Calendar,
  ChevronDown, SortAsc, UserCheck, AlertCircle, Plus
} from 'lucide-react';

const MahasiswaContent = ({ mataKuliahList, usersList }) => {
  const [selectedMataKuliah, setSelectedMataKuliah] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('card'); // 'card' | 'list'
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'email' | 'nim'
  const [showMobileList, setShowMobileList] = useState(false);
  // Fungsi untuk mendapatkan mahasiswa yang terdaftar di mata kuliah yang dipilih
  const getEnrolledStudents = () => {
    if (!selectedMataKuliah || !Array.isArray(selectedMataKuliah.mahasiswaTerdaftar)) {
      return [];
    }
    return usersList.filter(user => 
      selectedMataKuliah.mahasiswaTerdaftar.includes(user.uid)
    );
  };

  // Filter dan sort mahasiswa
  const getFilteredAndSortedStudents = () => {
    let students = getEnrolledStudents();
    
    // Filter berdasarkan pencarian
    if (searchTerm) {
      students = students.filter(student => 
        student.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nim?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort berdasarkan pilihan
    students.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.nama || '').localeCompare(b.nama || '');
        case 'email':
          return (a.email || '').localeCompare(b.email || '');
        case 'nim':
          return (a.nim || '').localeCompare(b.nim || '');
        default:
          return 0;
      }
    });

    return students;
  };

  const enrolledStudents = getFilteredAndSortedStudents();

  // Render student card
  const renderStudentCard = (student, index) => (
    <div key={student.uid || index} className="group bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">
              {student.nama?.charAt(0)?.toUpperCase() || 'M'}
            </span>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">
              {student.nama || 'Nama tidak tersedia'}
            </h4>
            <p className="text-sm text-gray-500 font-medium mt-1">
              {student.nim || 'NIM tidak tersedia'}
            </p>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-lg transition-all duration-200">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-3 text-sm">
          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-600 truncate">{student.email}</span>
        </div>
        
        {student.phone && (
          <div className="flex items-center space-x-3 text-sm">
            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-600">{student.phone}</span>
          </div>
        )}

        {student.angkatan && (
          <div className="flex items-center space-x-3 text-sm">
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-600">Angkatan {student.angkatan}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <UserCheck className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-600 font-medium">Aktif</span>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
          Lihat Detail
        </button>
      </div>
    </div>
  );

  // Render student list item
  const renderStudentListItem = (student, index) => (
    <tr key={student.uid || index} className="hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {student.nama?.charAt(0)?.toUpperCase() || 'M'}
            </span>
          </div>
          <div>
            <div className="font-semibold text-gray-900">{student.nama || 'Nama tidak tersedia'}</div>
            <div className="text-sm text-gray-500 sm:hidden">{student.nim} • {student.email}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-6 text-gray-600 font-mono text-sm hidden sm:table-cell">
        {student.nim || '-'}
      </td>
      <td className="py-4 px-6 text-gray-600 hidden md:table-cell">
        {student.email}
      </td>
      <td className="py-4 px-6 text-gray-600 hidden lg:table-cell">
        {student.angkatan || '-'}
      </td>
      <td className="py-4 px-6">
        <span className="inline-flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
          <UserCheck className="w-3 h-3" />
          <span>Aktif</span>
        </span>
      </td>
      <td className="py-4 px-6">
        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <Eye className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );

  // Render course selection
  const renderCourseSelection = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Mata Kuliah</h3>
          <span className="text-sm text-gray-500">{mataKuliahList.length} mata kuliah</span>
        </div>
      </div>
      <div className="max-h-[60vh] overflow-y-auto">
        {mataKuliahList.map(mk => {
          const studentCount = mk.mahasiswaTerdaftar?.length || 0;
          return (
            <button
              key={mk.id}
              onClick={() => {
                setSelectedMataKuliah(mk);
                setShowMobileList(false);
                setSearchTerm('');
              }}
              className={`w-full text-left p-6 border-b border-gray-100 last:border-b-0 transition-all duration-200 hover:bg-gray-50 ${
                selectedMataKuliah?.id === mk.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-semibold truncate pr-4 ${
                  selectedMataKuliah?.id === mk.id ? 'text-blue-700' : 'text-gray-900'
                }`}>
                  {mk.namaMK}
                </h4>
                <ChevronRight className={`w-4 h-4 flex-shrink-0 ${
                  selectedMataKuliah?.id === mk.id ? 'text-blue-500' : 'text-gray-400'
                }`} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 font-medium">{mk.kodeMK}</span>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 font-medium">{studentCount}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  // Render student list
  const renderStudentList = () => (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Back button (mobile) */}
          <button
            onClick={() => setShowMobileList(true)}
            className="lg:hidden flex items-center space-x-2 text-gray-600 hover:text-gray-900 self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Pilih Mata Kuliah</span>
          </button>

          {/* Selected course info */}
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {selectedMataKuliah.namaMK}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {selectedMataKuliah.kodeMK} • {enrolledStudents.length} mahasiswa
            </p>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari mahasiswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer"
              >
                <option value="name">Nama</option>
                <option value="nim">NIM</option>
                <option value="email">Email</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* View toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'card' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Export button */}
            <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl transition-colors text-sm font-medium">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Active search indicator */}
        {searchTerm && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-500">Hasil pencarian untuk:</span>
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
              "{searchTerm}"
              <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-blue-900">×</button>
            </span>
          </div>
        )}
      </div>

      {/* Student list content */}
      <div className="min-h-[400px]">
        {enrolledStudents.length > 0 ? (
          viewMode === 'card' ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {enrolledStudents.map(renderStudentCard)}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Mahasiswa</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 hidden sm:table-cell">NIM</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 hidden md:table-cell">Email</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 hidden lg:table-cell">Angkatan</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-900">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {enrolledStudents.map(renderStudentListItem)}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 py-16">
            <div className="text-center max-w-md mx-auto px-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                {searchTerm ? (
                  <Search className="w-10 h-10 text-gray-400" />
                ) : (
                  <Users className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'Tidak Ada Hasil' : 'Belum Ada Mahasiswa'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? 'Coba ubah kata kunci pencarian Anda'
                  : 'Belum ada mahasiswa yang terdaftar di mata kuliah ini'
                }
              </p>
              {!searchTerm && (
                <button className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                  <Plus className="w-5 h-5" />
                  <span>Tambah Mahasiswa</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Daftar Mahasiswa</h2>
          <p className="text-gray-600 mt-1">
            Kelola data mahasiswa yang terdaftar dalam mata kuliah Anda
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-colors font-medium shadow-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah Mahasiswa</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Course List - Desktop */}
        <div className={`lg:col-span-1 ${showMobileList ? 'block' : 'hidden lg:block'}`}>
          {renderCourseSelection()}
        </div>

        {/* Student List */}
        <div className={`lg:col-span-3 ${showMobileList ? 'hidden lg:block' : 'block'}`}>
          {selectedMataKuliah ? (
            renderStudentList()
          ) : (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 py-20">
              <div className="text-center max-w-md mx-auto px-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Pilih Mata Kuliah
                </h3>
                <p className="text-gray-500 mb-6">
                  Pilih mata kuliah dari daftar di sebelah kiri untuk melihat mahasiswa yang terdaftar
                </p>
                <button
                  onClick={() => setShowMobileList(true)}
                  className="lg:hidden inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Pilih Mata Kuliah</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MahasiswaContent;