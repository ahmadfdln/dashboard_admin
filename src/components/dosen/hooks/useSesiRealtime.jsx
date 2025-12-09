import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export default function useSesiRealtime(currentUser, usersList) {
  const [sesiAktif, setSesiAktif] = useState(null);
  const [daftarHadir, setDaftarHadir] = useState([]);
  const [daftarIzin, setDaftarIzin] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'sesiAbsensi'),
      where('idDosen', '==', currentUser.uid),
      where('status', '==', 'aktif')
    );

    const unsub = onSnapshot(q, snap => {
      if (snap.empty) {
        setSesiAktif(null);
        setDaftarHadir([]);
        setDaftarIzin([]);
        return;
      }

      const sesi = snap.docs[0];
      setSesiAktif({ id: sesi.id, ...sesi.data() });

      const qHadir = collection(db, 'sesiAbsensi', sesi.id, 'kehadiran');
      const unsubHadir = onSnapshot(qHadir, hadirSnap => {
        const hadir = [];
        const izin = [];

        hadirSnap.forEach(d => {
          const data = d.data();
          const user = usersList.find(u => u.uid === data.uid);

          const row = { ...data, namaMahasiswa: user?.nama || 'Tidak ditemukan' };
          data.status === 'izin' ? izin.push(row) : hadir.push(row);
        });

        setDaftarHadir(hadir);
        setDaftarIzin(izin);
      });

      return () => unsubHadir();
    });

    return () => unsub();
  }, [currentUser, usersList]);

  return { sesiAktif, daftarHadir, daftarIzin };
}
