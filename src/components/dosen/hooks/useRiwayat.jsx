import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';

export default function useRiwayat(currentUser, usersList, activeTab) {
  const [riwayatSesi, setRiwayatSesi] = useState([]);
  const [selectedRiwayatSesi, setSelectedRiwayatSesi] = useState(null);
  const [detailKehadiran, setDetailKehadiran] = useState([]);
  const [isRiwayatLoading, setIsRiwayatLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  useEffect(() => {
    if (!currentUser || activeTab !== 'riwayat') return;

    const fetch = async () => {
      setIsRiwayatLoading(true);
      try {
        const q = query(collection(db, 'sesiAbsensi'), where('idDosen', '==', currentUser.uid), where('status', '==', 'selesai'));
        const snap = await getDocs(q);

        const sesi = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setRiwayatSesi(sesi);
      } catch {
        toast.error('Gagal memuat riwayat.');
      } finally {
        setIsRiwayatLoading(false);
      }
    };

    fetch();
  }, [currentUser, activeTab]);

  const handleSesiClick = async sesi => {
    setSelectedRiwayatSesi(sesi);
    setIsDetailLoading(true);

    try {
      const q = collection(db, 'sesiAbsensi', sesi.id, 'kehadiran');
      const snap = await getDocs(q);
      const details = snap.docs.map(d => {
        const data = d.data();
        const u = usersList.find(u => u.uid === data.uid);
        return { ...data, nama: u?.nama || 'Tidak ditemukan' };
      });

      setDetailKehadiran(details);
    } catch {
      toast.error('Detail kehadiran gagal dimuat.');
    } finally {
      setIsDetailLoading(false);
    }
  };

  return {
    riwayatSesi,
    selectedRiwayatSesi,
    detailKehadiran,
    isRiwayatLoading,
    isDetailLoading,
    handleSesiClick
  };
}
