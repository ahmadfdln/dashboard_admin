// JadwalContent.jsx
import React, { useState } from 'react';
import { 
  Calendar, Clock, Plus, Search, Filter, MapPin, Users, 
  BookOpen, Edit3, MoreVertical, Eye, Settings, ChevronDown,
  Grid, List, CalendarDays, Timer, GraduationCap
} from 'lucide-react';

export const JadwalContent = ({ mataKuliahList }) => {
  const [viewMode, setViewMode] = useState('card'); // 'card' | 'list' | 'calendar'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const days = ['all', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
  const dayLabels = {
    all: 'Semua Hari',
    senin: 'Senin',
    selasa: 'Selasa', 
    rabu: 'Rabu',
    kamis: 'Kamis',
    jumat: 'Jumat',
    sabtu: 'Sabtu'
  };

  // Filter mata kuliah berdasarkan pencarian dan hari
  const filteredMK = mataKuliahList.filter(mk => {
    const matchesSearch = mk.namaMK.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mk.kodeMK.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDay = selectedDay === 'all' || 
                      (mk.hari && mk.hari.toLowerCase() === selectedDay);
    return matchesSearch && matchesDay;
  });

  // Render Card View
  const renderCardView = () => (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {filteredMK.map((mk, index) => (
        <div key={mk.id} className="group bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          {/* Card Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-700 transition-colors">
                  {mk.namaMK}
                </h3>
                <p className="text-sm text-gray-500 font-medium mt-1">{mk.kodeMK}</p>
              </div>
            </div>
            <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-lg transition-all duration-200">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Card Content */}
          <div className="space-y-3">
            {/* SKS Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{mk.sks} SKS</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                mk.hari 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
              }`}>
                {mk.hari ? 'Terjadwal' : 'Belum Terjadwal'}
              </span>
            </div>

            {/* Schedule Info */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">
                  {mk.hari || 'Hari belum ditentukan'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">
                  {mk.jamMulai ? `${mk.jamMulai} - ${mk.jamSelesai || 'Selesai'}` : 'Waktu belum ditentukan'}
                </span>
              </div>
              {mk.ruangan && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600">{mk.ruangan}</span>
                </div>
              )}
            </div>
          </div>

          {/* Card Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <button className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
              <Eye className="w-4 h-4" />
              <span>Detail</span>
            </button>
            <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-700 font-medium transition-colors">
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Render List View
  const renderListView = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Mata Kuliah</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 hidden sm:table-cell">Kode</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 hidden md:table-cell">SKS</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Jadwal</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 hidden lg:table-cell">Ruangan</th>
              <th className="text-right py-4 px-6 font-semibold text-gray-900">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredMK.map((mk, index) => (
              <tr key={mk.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{mk.namaMK}</div>
                      <div className="text-sm text-gray-500 sm:hidden">{mk.kodeMK} • {mk.sks} SKS</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-600 font-medium hidden sm:table-cell">{mk.kodeMK}</td>
                <td className="py-4 px-6 text-gray-600 hidden md:table-cell">{mk.sks}</td>
                <td className="py-4 px-6">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {mk.hari || 'Belum diatur'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">
                        {mk.jamMulai || 'Belum diatur'}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-600 hidden lg:table-cell">
                  {mk.ruangan || '-'}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
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
  );

  // Render Empty State
  const renderEmptyState = () => (
    <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 py-16">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CalendarDays className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {searchTerm || selectedDay !== 'all' ? 'Tidak Ada Hasil' : 'Belum Ada Jadwal'}
        </h3>
        <p className="text-gray-500 mb-6">
          {searchTerm || selectedDay !== 'all' 
            ? 'Coba ubah filter atau kata kunci pencarian Anda'
            : 'Mulai atur jadwal perkuliahan untuk mata kuliah yang Anda ampu'
          }
        </p>
        {!searchTerm && selectedDay === 'all' && (
          <button className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium">
            <Plus className="w-5 h-5" />
            <span>Atur Jadwal</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Jadwal Mengajar</h2>
          <p className="text-gray-600 mt-1">Kelola dan pantau jadwal perkuliahan Anda</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-colors font-medium shadow-sm">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Atur Jadwal</span>
            <span className="sm:hidden">Jadwal</span>
          </button>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari mata kuliah atau kode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Filter and View Controls */}
          <div className="flex items-center gap-3">
            {/* Day Filter */}
            <div className="relative">
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer"
              >
                {days.map(day => (
                  <option key={day} value={day}>{dayLabels[day]}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
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
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || selectedDay !== 'all') && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-500">Filter aktif:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-blue-900">×</button>
              </span>
            )}
            {selectedDay !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium">
                {dayLabels[selectedDay]}
                <button onClick={() => setSelectedDay('all')} className="ml-1 hover:text-green-900">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      {mataKuliahList.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Menampilkan {filteredMK.length} dari {mataKuliahList.length} mata kuliah
          </span>
          <span>
            {filteredMK.filter(mk => mk.hari).length} sudah terjadwal
          </span>
        </div>
      )}

      {/* Content Area */}
      <div className="min-h-[400px]">
        {filteredMK.length > 0 ? (
          viewMode === 'card' ? renderCardView() : renderListView()
        ) : (
          renderEmptyState()
        )}
      </div>
    </div>
  );
};