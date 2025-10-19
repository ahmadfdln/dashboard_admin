// src/hooks/useFirestoreData.js
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { useEffect, useState } from "react";

function useFirestoreData() {
  const [mataKuliahList, setMataKuliahList] = useState([]);
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "mataKuliah"), async (snapshot) => {
      const mkData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMataKuliahList(mkData);

      const allMahasiswa = [];
      for (const mk of mkData) {
        const mhsRef = collection(db, `mataKuliah/${mk.id}/mahasiswaTerdaftar`);
        const mhsSnap = await getDocs(mhsRef);
        const mhsData = mhsSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          kodeMK: mk.kodeMK,
          namaMK: mk.namaMK,
        }));
        allMahasiswa.push(...mhsData);
      }

      setMahasiswaList(allMahasiswa);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { mataKuliahList, mahasiswaList, loading };
}

export default useFirestoreData;
