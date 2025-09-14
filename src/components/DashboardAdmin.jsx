// src/components/admin/DashboardAdmin.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Users, BookOpen, MapPin, UserCheck, GraduationCap, Settings } from 'lucide-react';

// Firebase
import { auth, db } from '../config/firebase'; 
import { signOut } from 'firebase/auth';
import { collection, getDocs, query, orderBy, where, getCountFromServer, addDoc, Timestamp, limit } from 'firebase/firestore';

// Impor komponen yang sudah dipecah
import { AdminLayout } from './admin/layout/AdminLayout';
import { Overview } from './admin/views/Overview';
import { DataMahasiswa } from './admin/views/DataMahasiswa';
import { DataDosen } from './admin/views/DataDosen';
import { ManajemenPengguna } from './admin/views/ManajemenPengguna';
import ManajemenMataKuliah from "./admin/views/ManajemenMataKuliah";
import  ManajemenRuangan from './admin/views/ManajemenRuangan';
import AturDosenMK from './admin/views/AturDosenMK';

const sidebarItems = [
  { id: 'overview', label: 'Dashboard', icon: Settings },
  { id: 'pengguna', label: 'Kelola Pengguna', icon: Users },
  { id: 'matakuliah', label: 'Mata Kuliah', icon: BookOpen },
  { id: 'ruangan', label: 'Ruangan', icon: MapPin },
  { id: 'aturdosenmk', label: 'Atur Dosen & MK', icon: UserCheck },
  { id: 'lihatMahasiswa', label: 'Data Mahasiswa', icon: GraduationCap },
  { id: 'lihatDosen', label: 'Data Dosen', icon: UserCheck },
];

function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [usersList, setUsersList] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [stats, setStats] = useState({ totalMahasiswa: 0, totalDosen: 0, totalMataKuliah: 0, totalRuangan: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const logActivity = useCallback(async (action, type) => {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, "activityLogs"), {
        timestamp: Timestamp.now(),
        adminEmail: auth.currentUser.email,
        action: action,
        type: type
      });
    } catch (error) { console.error("Error logging activity: ", error); }
  }, []);

  const fetchActivityLogs = useCallback(async () => {
    try {
      const logsQuery = query(collection(db, "activityLogs"), orderBy("timestamp", "desc"), limit(5));
      const querySnapshot = await getDocs(logsQuery);
      setActivityLogs(querySnapshot.docs.map(doc => ({ 
        id: doc.id, ...doc.data(),
        timestamp: doc.data().timestamp.toDate().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
      })));
    } catch (error) { toast.error("Gagal memuat log aktivitas."); }
  }, []);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const [mahasiswaSnapshot, dosenSnapshot, mataKuliahSnapshot, ruangKelasSnapshot] = await Promise.all([
        getCountFromServer(query(collection(db, "users"), where("role", "==", "mahasiswa"))),
        getCountFromServer(query(collection(db, "users"), where("role", "==", "dosen"))),
        getCountFromServer(collection(db, "mataKuliah")),
        getCountFromServer(collection(db, "ruangKelas"))
      ]);
      setStats({
        totalMahasiswa: mahasiswaSnapshot.data().count,
        totalDosen: dosenSnapshot.data().count,
        totalMataKuliah: mataKuliahSnapshot.data().count,
        totalRuangan: ruangKelasSnapshot.data().count,
      });
    } catch (error) { toast.error("Gagal memuat statistik."); }
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const usersQuery = query(collection(db, "users"), orderBy("nama", "asc"));
      const querySnapshot = await getDocs(usersQuery);
      setUsersList(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      toast.error("Gagal memuat data pengguna.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const refreshData = useCallback(async () => {
    await Promise.all([fetchDashboardStats(), fetchActivityLogs(), fetchUsers()]);
  }, [fetchDashboardStats, fetchActivityLogs, fetchUsers]);


  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (activeTab === 'lihatMahasiswa' || activeTab === 'lihatDosen') {
      fetchUsers();
    }
  }, [activeTab, fetchUsers]);

  const handleLogout = async () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      try {
        await signOut(auth);
        toast.success("Logout berhasil.");
        navigate('/login');
      } catch (error) { toast.error("Gagal untuk logout."); }
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview': return <Overview stats={stats} activityLogs={activityLogs} />;
      case 'pengguna': return <ManajemenPengguna onActionSuccess={refreshData} logActivity={logActivity} />;
      case 'matakuliah': return <ManajemenMataKuliah onActionSuccess={refreshData} logActivity={logActivity} />;
      case 'ruangan': return <ManajemenRuangan onActionSuccess={refreshData} logActivity={logActivity} />;
      case 'aturdosenmk': return <AturDosenMK onActionSuccess={refreshData} logActivity={logActivity} />
      case 'lihatMahasiswa': return <DataMahasiswa users={usersList} isLoading={isLoading} />;
      case 'lihatDosen': return <DataDosen users={usersList} isLoading={isLoading} />;
      default: return <Overview stats={stats} activityLogs={activityLogs} />;
    }
  };

  return (
    <AdminLayout
      sidebarItems={sidebarItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      handleLogout={handleLogout}
    >
      {renderActiveView()}
    </AdminLayout>
  );
}

export default DashboardAdmin;