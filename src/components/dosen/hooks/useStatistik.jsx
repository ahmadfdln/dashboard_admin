import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase";

export default function useStatistik(
  currentUser,
  usersList,
  mataKuliahList,
  riwayatSesi,
  sesiAktif
) {
  const [kehadiranHistoris, setKehadiranHistoris] = useState([]);
  const [statistikGrafik, setStatistikGrafik] = useState({
    kehadiranPerMK: [],
    perkembanganMingguan: [],
    topMahasiswa: [],
    statusSesi: [],
  });

  const fetchStatistikGrafik = useCallback(async () => {
    try {
      if (
        !currentUser ||
        !currentUser.uid ||
        usersList.length === 0 ||
        mataKuliahList.length === 0
      ) {
        return;
      }

      // Ambil semua sesi selesai milik dosen ini
      const sesiQuery = query(
        collection(db, "sesiAbsensi"),
        where("idDosen", "==", currentUser.uid),
        where("status", "==", "selesai")
      );
      const sesiSnapshot = await getDocs(sesiQuery);

      const semuaKehadiran = [];

      // Loop setiap sesi dan tarik subkoleksi "kehadiran"
      for (const sesiDoc of sesiSnapshot.docs) {
        const kehadiranRef = collection(
          db,
          "sesiAbsensi",
          sesiDoc.id,
          "kehadiran"
        );
        const kehadiranSnap = await getDocs(kehadiranRef);

        kehadiranSnap.docs.forEach((docKeh) => {
          semuaKehadiran.push({
            id: docKeh.id,
            ...docKeh.data(),
            idSesi: sesiDoc.id,
            ...sesiDoc.data(),
          });
        });
      }

      setKehadiranHistoris(semuaKehadiran);

      // ================== 1. KEHADIRAN PER MATA KULIAH ==================
      const kehadiranPerMK = mataKuliahList
        .map((mk) => {
          const sesiMK = sesiSnapshot.docs
            .filter((doc) => doc.data().namaMK === mk.namaMK)
            .map((doc) => doc.id);

          const totalHadir = semuaKehadiran.filter(
            (k) => sesiMK.includes(k.idSesi) && k.status === "hadir"
          ).length;

          const totalMahasiswa = usersList.length;
          const totalSesi = sesiMK.length;
          const maksimalKehadiran = totalSesi * totalMahasiswa;

          const persentase =
            maksimalKehadiran > 0
              ? Math.round((totalHadir / maksimalKehadiran) * 100)
              : 0;

          return {
            namaMK: mk.namaMK,
            kehadiran: persentase,
            totalHadir,
            totalSesi,
          };
        })
        .filter((item) => item.totalSesi > 0);

      // ================== 2. PERKEMBANGAN 4 MINGGU ==================
      const now = new Date();
      const perkembanganMingguan = [];

      for (let i = 3; i >= 0; i--) {
        const start = new Date(now);
        start.setDate(now.getDate() - i * 7 - 7);

        const end = new Date(now);
        end.setDate(now.getDate() - i * 7);

        const sesiMingguIni = sesiSnapshot.docs.filter((doc) => {
          const waktu = doc.data().waktuMulai.toDate();
          return waktu >= start && waktu < end;
        });

        const totalKehadiran = semuaKehadiran.filter(
          (k) =>
            sesiMingguIni.some((s) => s.id === k.idSesi) &&
            k.status === "hadir"
        ).length;

        const totalPotensi = sesiMingguIni.length * usersList.length;

        const rataRata =
          totalPotensi > 0
            ? Math.round((totalKehadiran / totalPotensi) * 100)
            : 0;

        perkembanganMingguan.push({
          minggu: `Minggu ${4 - i}`,
          kehadiran: rataRata,
          sesi: sesiMingguIni.length,
        });
      }

      // ================== 3. TOP MAHASISWA ==================
      const kehadiranMahasiswa = {};

      semuaKehadiran.forEach((k) => {
        if (k.status === "hadir") {
          kehadiranMahasiswa[k.uid] =
            (kehadiranMahasiswa[k.uid] || 0) + 1;
        }
      });

      const topMahasiswa = Object.entries(kehadiranMahasiswa)
        .map(([uid, count]) => {
          const user = usersList.find((u) => u.uid === uid);
          return {
            nama: user?.nama || "Tidak dikenal",
            hadir: count,
          };
        })
        .sort((a, b) => b.hadir - a.hadir)
        .slice(0, 5);

      // ================== 4. STATUS SESI ==================
      const sesiAktifCount = sesiAktif ? 1 : 0;
      const sesiSelesaiCount = sesiSnapshot.size;

      const statusSesi = [
        { name: "Aktif", value: sesiAktifCount, color: "#8B5CF6" },
        { name: "Selesai", value: sesiSelesaiCount, color: "#3B82F6" },
      ];

      setStatistikGrafik({
        kehadiranPerMK,
        perkembanganMingguan,
        topMahasiswa,
        statusSesi,
      });
    } catch (error) {
      console.error("Gagal memuat statistik grafik:", error);
      toast.error("Gagal memuat data statistik.");
    }
  }, [currentUser, usersList, mataKuliahList, sesiAktif]);

  // Panggil tiap kali: user siap, data siap, riwayat berubah, atau sesiAktif berubah
  useEffect(() => {
    fetchStatistikGrafik();
  }, [fetchStatistikGrafik, riwayatSesi]);

  return {
    statistikGrafik,
    kehadiranHistoris,
  };
}
