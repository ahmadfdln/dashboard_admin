import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  Timestamp,
  doc,
} from "firebase/firestore";
import { db, GeoPoint } from "../../../config/firebase";

export default function useInitialData(currentUser) {
  const [mataKuliahList, setMataKuliahList] = useState([]);
  const [ruangKelasList, setRuangKelasList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil data awal: users, mata kuliah, ruang kelas
  const fetchInitialData = useCallback(async () => {
    if (!currentUser || !currentUser.uid) return;

    setIsLoading(true);
    try {
      // Users (mahasiswa)
      const usersQuery = query(
        collection(db, "users"),
        where("role", "==", "mahasiswa")
      );
      const usersSnapshot = await getDocs(usersQuery);
      setUsersList(usersSnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));

      // Mata kuliah yang diampu dosen ini
      const mkQuery = query(
        collection(db, "mataKuliah"),
        where("dosenPengampu", "==", currentUser.uid)
      );
      const mkSnapshot = await getDocs(mkQuery);
      const listMK = mkSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      listMK.sort((a, b) => a.namaMK.localeCompare(b.namaMK));
      setMataKuliahList(listMK);

      // Ruang kelas
      const ruangSnapshot = await getDocs(collection(db, "ruangKelas"));
      setRuangKelasList(
        ruangSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
    } catch (error) {
      console.error("Gagal memuat data awal:", error);
      toast.error("Gagal memuat data awal.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // 🔹 Mulai sesi (dengan cek sesi aktif bentrok)
  const handleMulaiSesi = async (mataKuliah, selectedRuang) => {
    if (!currentUser || !currentUser.uid) {
      toast.error("User tidak valid. Silakan login ulang.");
      return;
    }

    if (!selectedRuang) {
      toast.warn("Harap pilih ruangan.");
      return;
    }

    setIsLoading(true);

    try {
      // Cek apakah masih ada sesi aktif milik dosen ini
      const qCekBentrok = query(
        collection(db, "sesiAbsensi"),
        where("idDosen", "==", currentUser.uid),
        where("status", "==", "aktif")
      );

      const snapshotBentrok = await getDocs(qCekBentrok);

      if (!snapshotBentrok.empty) {
        toast.warn(
          `Menonaktifkan ${snapshotBentrok.size} sesi aktif sebelumnya...`
        );

        const updatePromises = snapshotBentrok.docs.map((sesiDoc) => {
          const docRef = doc(db, "sesiAbsensi", sesiDoc.id);
          return updateDoc(docRef, {
            status: "selesai",
            waktuSelesai: Timestamp.now(),
          });
        });

        await Promise.all(updatePromises);
        toast.info("Sesi sebelumnya berhasil diakhiri.");
      }

      // Cari data ruang
      const ruang = ruangKelasList.find((r) => r.id === selectedRuang);
      if (!ruang || !ruang.lokasi) {
        toast.error("Data ruangan tidak valid.");
        return;
      }

      // Buat sesi baru
      await addDoc(collection(db, "sesiAbsensi"), {
        idDosen: currentUser.uid,
        namaDosen: currentUser.displayName || currentUser.email,
        kodeMK: mataKuliah.kodeMK,
        namaMK: mataKuliah.namaMK,
        waktuMulai: Timestamp.now(),
        status: "aktif",
        lokasi: new GeoPoint(ruang.lokasi.latitude, ruang.lokasi.longitude),
        radius: 50,
      });

      toast.success(`Sesi baru untuk ${mataKuliah.namaMK} dimulai!`);
    } catch (error) {
      console.error("Error saat memulai sesi:", error);
      toast.error("Gagal memulai sesi baru atau mengakhiri sesi lama.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Akhiri sesi (pakai objek sesi sebagai parameter)
  const handleAkhiriSesi = async (sesi) => {
    if (!sesi || !sesi.id) {
      toast.warn("Tidak ada sesi aktif yang bisa diakhiri.");
      return;
    }

    try {
      await updateDoc(doc(db, "sesiAbsensi", sesi.id), {
        status: "selesai",
        waktuSelesai: Timestamp.now(),
      });
      toast.info("Sesi telah berakhir.");
    } catch (error) {
      console.error("Gagal mengakhiri sesi:", error);
      toast.error("Gagal mengakhiri sesi.");
    }
  };

  return {
    mataKuliahList,
    ruangKelasList,
    usersList,
    isLoading,
    handleMulaiSesi,
    handleAkhiriSesi,
  };
}
