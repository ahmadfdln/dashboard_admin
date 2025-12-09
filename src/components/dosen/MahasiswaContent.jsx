import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  Grid,
  List,
  Mail,
  Phone,
  Search,
  UserCheck,
  Users,
  Plus,
} from "lucide-react";

export const MahasiswaContent = ({ mataKuliahList, usersList }) => {
  const [selectedMataKuliah, setSelectedMataKuliah] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("card");
  const [sortBy, setSortBy] = useState("name");
  const [showMobileList, setShowMobileList] = useState(false);

  const enrolledStudents = useMemo(() => {
    if (
      !selectedMataKuliah ||
      !Array.isArray(selectedMataKuliah.mahasiswaTerdaftar)
    ) {
      return [];
    }

    const baseStudents = usersList.filter((user) =>
      selectedMataKuliah.mahasiswaTerdaftar.includes(user.uid)
    );

    let filteredStudents = baseStudents;
    if (searchTerm) {
      filteredStudents = baseStudents.filter(
        (student) =>
          student.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.nim_nidn?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const sortedStudents = [...filteredStudents];
    sortedStudents.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.nama || "").localeCompare(b.nama || "");
        case "email":
          return (a.email || "").localeCompare(b.email || "");
        case "nim":
          return (a.nim_nidn || "").localeCompare(b.nim_nidn || "");
        default:
          return 0;
      }
    });

    return sortedStudents;
  }, [selectedMataKuliah, usersList, searchTerm, sortBy]);

  const renderStudentCard = (student, index) => (
    <div
      key={student.uid || index}
      className="group bg-white/10 hover:bg-white/5 border border-white/20 rounded-xl p-5 transition-all backdrop-blur shadow-md"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-white/20">
            <span className="text-white font-semibold text-lg">
              {student.nama?.charAt(0)?.toUpperCase() || "M"}
            </span>
          </div>

          <div>
            <h4 className="font-semibold text-white">
              {student.nama || "Nama tidak tersedia"}
            </h4>
            <p className="text-sm text-gray-400 mt-1">
              {student.nim_nidn || "-"}
            </p>
          </div>
        </div>

        <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition">
          <Eye className="w-4 h-4 text-gray-300" />
        </button>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-3 text-gray-300">
          <Mail className="w-4 h-4 text-gray-400" />
          <span>{student.email}</span>
        </div>

        {student.phone && (
          <div className="flex items-center gap-3 text-gray-300">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{student.phone}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-green-400" />
          <span className="text-sm text-gray-300">Aktif</span>
        </div>

        <button className="text-sm text-cyan-300 hover:text-cyan-200">
          Detail
        </button>
      </div>
    </div>
  );

  const renderStudentListItem = (student, index) => (
    <tr
      key={student.uid || index}
      className="hover:bg-white/5 transition-colors"
    >
      <td className="py-4 px-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-white/20">
            <span className="text-white font-bold">
              {student.nama?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-semibold text-white">{student.nama}</div>
            <div className="text-sm text-gray-400 sm:hidden">
              {student.nim_nidn} • {student.email}
            </div>
          </div>
        </div>
      </td>

      <td className="py-4 px-6 text-gray-300 hidden sm:table-cell">
        {student.nim_nidn}
      </td>

      <td className="py-4 px-6 text-gray-300 hidden md:table-cell">
        {student.email}
      </td>

      <td className="py-4 px-6 text-gray-300">
        <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs border border-green-500/30">
          <UserCheck className="w-3 h-3" /> Aktif
        </span>
      </td>

      <td className="py-4 px-6 text-right">
        <button className="p-2 text-gray-400 hover:bg-white/10 rounded-lg">
          <Eye className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );

  const renderCourseSelection = () => (
    <div className="bg-white/10 border border-white/20 rounded-xl shadow-md backdrop-blur">
      <div className="p-6 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">Mata Kuliah</h3>
        <p className="text-gray-400 mt-1">{mataKuliahList.length} total</p>
      </div>

      <div className="max-h-[60vh] overflow-y-auto">
        {mataKuliahList.map((mk) => {
          const studentCount = mk.mahasiswaTerdaftar?.length || 0;

          return (
            <button
              key={mk.id}
              onClick={() => {
                setSelectedMataKuliah(mk);
                setShowMobileList(false);
              }}
              className={`w-full text-left p-5 border-b border-white/10 transition hover:bg-white/5 ${
                selectedMataKuliah?.id === mk.id
                  ? "bg-cyan-500/10 border-l-4 border-cyan-400"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-white">{mk.namaMK}</h4>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400">{mk.kodeMK}</span>

                <div className="flex items-center gap-2 text-gray-300">
                  <Users className="w-4 h-4" />
                  {studentCount}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStudentList = () => (
    <div className="space-y-6">
      <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur shadow-md">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <button
            onClick={() => setShowMobileList(true)}
            className="lg:hidden flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Pilih Mata Kuliah
          </button>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">
              {selectedMataKuliah.namaMK}
            </h3>
            <p className="text-gray-400">
              {enrolledStudents.length} mahasiswa terdaftar
            </p>
          </div>

          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari mahasiswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/20 text-white rounded-xl pl-10 pr-4 py-2.5 placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/20 text-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-cyan-500"
            >
              <option value="name" className="bg-slate-900">
                Nama
              </option>
              <option value="nim" className="bg-slate-900">
                NIM
              </option>
              <option value="email" className="bg-slate-900">
                Email
              </option>
            </select>

            <div className="flex bg-white/10 rounded-xl p-1 border border-white/20">
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 rounded-lg ${
                  viewMode === "card"
                    ? "bg-white/20 text-cyan-300"
                    : "text-gray-400"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>

              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${
                  viewMode === "list"
                    ? "bg-white/20 text-cyan-300"
                    : "text-gray-400"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-gray-300 px-4 py-2.5 rounded-xl border border-white/20">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {searchTerm && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
            <span className="text-gray-400">Hasil pencarian:</span>

            <span className="text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-lg text-sm">
              "{searchTerm}"
            </span>

            <button onClick={() => setSearchTerm("")} className="text-white">
              ×
            </button>
          </div>
        )}
      </div>

      <div>
        {enrolledStudents.length > 0 ? (
          viewMode === "card" ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {enrolledStudents.map(renderStudentCard)}
            </div>
          ) : (
            <div className="bg-white/10 border border-white/20 rounded-xl shadow-md backdrop-blur overflow-hidden">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="text-left px-6 py-4 text-gray-300">
                      Mahasiswa
                    </th>
                    <th className="text-left px-6 py-4 text-gray-300 hidden sm:table-cell">
                      NIM
                    </th>
                    <th className="text-left px-6 py-4 text-gray-300 hidden md:table-cell">
                      Email
                    </th>
                    <th className="text-left px-6 py-4 text-gray-300">
                      Status
                    </th>
                    <th className="text-right px-6 py-4 text-gray-300">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {enrolledStudents.map(renderStudentListItem)}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="bg-white/10 border border-dashed border-white/20 rounded-xl py-20 text-center">
            <Users className="w-14 h-14 text-gray-400 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold">
              Belum Ada Mahasiswa
            </h3>
            <p className="text-gray-400 mt-1">
              Tidak ada data mahasiswa yang terdaftar.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white">Daftar Mahasiswa</h2>
        <p className="text-gray-400 mt-1">
          Kelola data mahasiswa berdasarkan mata kuliah
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div
          className={`lg:col-span-1 ${
            showMobileList ? "block" : "hidden lg:block"
          }`}
        >
          {renderCourseSelection()}
        </div>

        <div
          className={`lg:col-span-3 ${
            showMobileList ? "hidden lg:block" : "block"
          }`}
        >
          {selectedMataKuliah ? (
            renderStudentList()
          ) : (
            <div className="bg-white/10 border border-dashed border-white/20 rounded-xl py-20 text-center">
              <BookOpen className="w-14 h-14 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white">
                Pilih Mata Kuliah
              </h3>
              <p className="text-gray-400 mt-1">
                Silakan pilih mata kuliah untuk melihat daftar mahasiswa
              </p>

              <button
                onClick={() => setShowMobileList(true)}
                className="mt-6 bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-xl text-gray-200 border border-white/20"
              >
                Lihat Daftar Mata Kuliah
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
