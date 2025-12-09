// JadwalContent.jsx
import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Search,
  ChevronDown,
  BookOpen,
  Eye,
  Edit3,
  CalendarDays,
} from "lucide-react";

export const JadwalContent = ({ mataKuliahList }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDay, setSelectedDay] = useState("all");

  const days = ["all", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];

  const dayLabels = {
    all: "Semua Hari",
    senin: "Senin",
    selasa: "Selasa",
    rabu: "Rabu",
    kamis: "Kamis",
    jumat: "Jumat",
    sabtu: "Sabtu",
  };

  // Filter data
  const filtered = mataKuliahList.filter((mk) => {
    const matchSearch =
      mk.namaMK.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mk.kodeMK.toLowerCase().includes(searchTerm.toLowerCase());

    const matchDay =
      selectedDay === "all" ||
      (mk.hari && mk.hari.toLowerCase() === selectedDay);

    return matchSearch && matchDay;
  });

  const renderEmptyState = () => (
    <div className="bg-[#020617]/80 border-2 border-dashed border-white/15 rounded-2xl py-16 backdrop-blur-xl">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
          <CalendarDays className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl text-white font-semibold mb-2">
          Tidak Ada Data
        </h3>
        <p className="text-gray-400">Coba ubah pencarian atau filter.</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ---------- FILTER BAR ---------- */}
      <div className="bg-[#020617]/80 border border-white/15 backdrop-blur-xl rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari mata kuliah atau kode..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Day filter */}
          <div className="relative">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="appearance-none bg-white/5 border border-white/15 text-gray-200 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-cyan-500"
            >
              {days.map((d) => (
                <option key={d} value={d} className="bg-slate-900 text-white">
                  {dayLabels[d]}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* Active filters */}
        {(searchTerm || selectedDay !== "all") && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
            <span className="text-sm text-gray-400">Filter aktif:</span>

            {searchTerm && (
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-200 rounded-lg border border-cyan-500/30 text-sm font-medium">
                "{searchTerm}"
              </span>
            )}

            {selectedDay !== "all" && (
              <span className="px-3 py-1 bg-green-500/20 text-green-200 rounded-lg border border-green-500/30 text-sm font-medium">
                {dayLabels[selectedDay]}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ---------- TABLE ---------- */}
      {filtered.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="bg-[#020617]/80 border border-white/15 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-300 uppercase">
                    Mata Kuliah
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-300 uppercase">
                    Jadwal
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-300 uppercase hidden sm:table-cell">
                    Kode
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-300 uppercase hidden md:table-cell">
                    SKS
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-gray-300 uppercase hidden lg:table-cell">
                    Ruangan
                  </th>
                  <th className="py-4 px-6 text-right text-xs font-semibold text-gray-300 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {filtered.map((mk) => (
                  <tr key={mk.id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{mk.namaMK}</p>
                          <p className="text-gray-400 text-sm sm:hidden">
                            {mk.kodeMK} • {mk.sks} SKS
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-cyan-300" />
                          <span className="text-gray-200 text-sm">
                            {mk.hari || "Belum diatur"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-300" />
                          <span className="text-gray-300 text-sm">
                            {mk.jamMulai
                              ? `${mk.jamMulai} - ${mk.jamSelesai || "Selesai"}`
                              : "Belum diatur"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-300 hidden sm:table-cell">
                      {mk.kodeMK}
                    </td>
                    <td className="px-6 py-4 text-gray-300 hidden md:table-cell">
                      {mk.sks}
                    </td>

                    <td className="px-6 py-4 text-gray-300 hidden lg:table-cell">
                      {mk.ruangan || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 rounded-lg text-gray-400 hover:bg-white/10 hover:text-cyan-300 transition">
                          <Eye className="w-4 h-4" />
                        </button>

                        <button className="p-2 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
