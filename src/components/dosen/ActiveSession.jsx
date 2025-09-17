import { StopCircle, RefreshCw, Users, CheckCircle } from "lucide-react";

export function ActiveSession({ sesiAktif, daftarHadir, handleAkhiriSesi }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-3xl border border-blue-200">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex items-center mb-4 lg:mb-0">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
          <div>
            <p className="text-blue-700 font-semibold text-sm uppercase tracking-wide">Sesi Sedang Berlangsung</p>
            <h2 className="text-4xl font-bold text-gray-900 mt-1">{sesiAktif.namaMK}</h2>
            <p className="text-gray-600 mt-1">{sesiAktif.kodeMK}</p>
          </div>
        </div>
        <button 
          onClick={handleAkhiriSesi} 
          className="flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <StopCircle size={22}/> 
          Akhiri Sesi
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Daftar Kehadiran</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-600">{daftarHadir.length} Hadir</span>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {daftarHadir.length > 0 ? daftarHadir.map((mhs, index) => (
            <div key={mhs.id} className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-4 rounded-xl transition-colors duration-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{mhs.namaMahasiswa}</p>
                  <p className="text-sm text-gray-500">Check-in berhasil</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">
                  {new Date(mhs.waktuAbsen.seconds * 1000).toLocaleTimeString('id-ID', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-xs text-green-600 font-medium">Hadir</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-12">
              <Users size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Belum ada mahasiswa yang check-in</p>
              <p className="text-sm text-gray-400 mt-1">Mahasiswa akan muncul di sini setelah melakukan absensi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
