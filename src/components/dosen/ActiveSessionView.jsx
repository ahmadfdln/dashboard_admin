import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, StopCircle, Users, Clock, CheckCircle } from "lucide-react";

const ActiveSessionView = ({
  sesiAktif,
  handleAkhiriSesi,
  activeTab,
  setActiveTab,
  daftarHadir,
  daftarIzin,
  usersList,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="
        bg-[#020617]/80 backdrop-blur-xl border border-white/20 
        rounded-3xl p-6 md:p-7 text-white 
        shadow-[0_0_28px_rgba(15,23,42,0.9)]
      "
    >
      {/* HEADER SESI */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-white/15 border border-white/20 rounded-2xl flex items-center justify-center">
              <PlayCircle size={26} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-400 rounded-full animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-0.5 bg-white/10 border border-white/20 backdrop-blur rounded-full text-[11px] font-bold">
                LIVE
              </span>
              <span className="text-xs opacity-90">
                {new Date().toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-1">{sesiAktif.namaMK}</h2>
            <p className="text-xs opacity-80">{sesiAktif.kodeMK}</p>
          </div>
        </div>

        <button
          onClick={handleAkhiriSesi}
          className="
            flex items-center gap-2 
            bg-white/10 hover:bg-white/20 
            border border-white/20
            text-white text-sm font-semibold 
            px-5 py-2.5 rounded-xl 
            transition-all shadow-lg
          "
        >
          <StopCircle size={18} />
          Akhiri Sesi
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT LIST */}
        <div
          className="
            lg:col-span-2 
            bg-[#020617]/80 backdrop-blur-xl 
            rounded-2xl p-5 
            border border-white/10 
            shadow-[0_0_22px_rgba(56,189,248,0.15)]
          "
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {/* TAB HADIR */}
              <button
                onClick={() => setActiveTab("hadir")}
                className={`
                  px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${
                    activeTab === "hadir"
                      ? "bg-white/15 border border-white/20 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }
                `}
              >
                Hadir ({daftarHadir.length})
              </button>

              {/* TAB IZIN */}
              <button
                onClick={() => setActiveTab("izin")}
                className={`
                  px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${
                    activeTab === "izin"
                      ? "bg-white/15 border border-white/20 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }
                `}
              >
                Izin ({daftarIzin.length})
              </button>
            </div>

            <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full">
              <div
                className={`
                  w-2 h-2 rounded-full animate-pulse
                  ${
                    activeTab === "hadir" ? "bg-green-400" : "bg-amber-400"
                  }
                `}
              />
              <span className="text-xs font-semibold">
                {activeTab === "hadir"
                  ? `${daftarHadir.length} Hadir`
                  : `${daftarIzin.length} Izin`}
              </span>
            </div>
          </div>

          {/* LIST ANIMATED */}
          <AnimatePresence mode="wait">
            {/* HADIR LIST */}
            {activeTab === "hadir" && (
              <motion.div
                key="hadir"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-2.5 max-h-80 overflow-y-auto"
              >
                {daftarHadir.length > 0 ? (
                  daftarHadir.map((mhs, idx) => (
                    <motion.div
                      key={mhs.id || mhs.uid || `hadir-${idx}`}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="
                        flex items-center justify-between 
                        bg-white/5 p-3 rounded-xl 
                        border border-white/10 
                        shadow-inner
                      "
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>

                        <div>
                          <p className="font-semibold text-sm">
                            {mhs.namaMahasiswa}
                          </p>
                          <p className="text-[11px] opacity-70">
                            Check-in berhasil
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          {mhs.waktuAbsen?.seconds
                            ? new Date(
                                mhs.waktuAbsen.seconds * 1000
                              ).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </p>
                        <CheckCircle className="w-3.5 h-3.5 ml-auto text-green-400 mt-1" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <Users className="mx-auto mb-3 opacity-50" size={40} />
                    <p className="text-sm opacity-80">
                      Menunggu mahasiswa check-in…
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* IZIN LIST */}
            {activeTab === "izin" && (
              <motion.div
                key="izin"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-2.5 max-h-80 overflow-y-auto"
              >
                {daftarIzin.length > 0 ? (
                  daftarIzin.map((mhs, idx) => (
                    <motion.div
                      key={mhs.id || mhs.uid || `izin-${idx}`}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="
                        flex items-center justify-between 
                        bg-white/5 p-3 rounded-xl border border-white/10
                      "
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-amber-300">
                          <Clock className="w-4 h-4" />
                        </div>

                        <div>
                          <p className="font-semibold text-sm">
                            {mhs.namaMahasiswa}
                          </p>
                          <p className="text-[11px] opacity-70">
                            {mhs.keterangan || "Menunggu konfirmasi"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right text-[11px] opacity-80">
                        {mhs.waktuIzin?.seconds
                          ? new Date(
                              mhs.waktuIzin.seconds * 1000
                            ).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Baru saja"}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <Clock className="mx-auto mb-3 opacity-50" size={40} />
                    <p className="text-sm opacity-80">
                      Tidak ada mahasiswa izin
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="space-y-3">
          <div className="bg-[#020617]/80 border border-white/10 backdrop-blur-xl rounded-2xl p-5 text-center shadow-[0_0_22px_rgba(56,189,248,0.15)]">
            <div className="text-3xl font-bold mb-1">{daftarHadir.length}</div>
            <p className="text-xs opacity-80">Mahasiswa Hadir</p>
          </div>

          <div className="bg-[#020617]/80 border border-white/10 backdrop-blur-xl rounded-2xl p-5 text-center shadow-[0_0_22px_rgba(56,189,248,0.15)]">
            <div className="text-3xl font-bold mb-1 text-amber-300">
              {daftarIzin.length}
            </div>
            <p className="text-xs opacity-80">Mahasiswa Izin</p>
          </div>

          <div className="bg-[#020617]/80 border border-white/10 backdrop-blur-xl rounded-2xl p-5 text-center shadow-[0_0_22px_rgba(56,189,248,0.15)]">
            <div className="text-3xl font-bold mb-1">
              {Math.round(
                (daftarHadir.length / (usersList.length || 1)) * 100
              )}
              %
            </div>
            <p className="text-xs opacity-80">Tingkat Kehadiran</p>
          </div>

          <div className="bg-[#020617]/80 border border-white/10 backdrop-blur-xl rounded-2xl p-5 shadow-[0_0_22px_rgba(56,189,248,0.15)]">
            <p className="text-xs opacity-80 mb-2">Progress Target (85%)</p>
            <div className="w-full bg-white/10 rounded-full h-2.5">
              <div
                className="h-2.5 bg-cyan-400 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    (daftarHadir.length / (usersList.length || 1)) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ActiveSessionView;
