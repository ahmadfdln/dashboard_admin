import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Users,
  BookOpen,
  MapPin,
  UserCheck,
  GraduationCap,
  Settings,
  Trash2,
} from "lucide-react";

// Firebase (Path diperbaiki dan semua fungsi yang dibutuhkan diimpor)
import { auth, db } from "../config/firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  getCountFromServer,
  addDoc,
  Timestamp,
  limit,
  doc,
  deleteDoc,
} from "firebase/firestore";

// Impor komponen yang sudah dipecah dengan path dan sintaks yang benar
import { AdminLayout } from "./admin/layout/AdminLayout";
import { Overview } from "./admin/views/Overview";
import { DataMahasiswa } from "./admin/views/DataMahasiswa";
import { DataDosen } from "./admin/views/DataDosen";
import { ManajemenPengguna } from "./admin/views/ManajemenPengguna";
import ManajemenMataKuliah from "./admin/views/ManajemenMataKuliah";
import ManajemenRuangan from "./admin/views/ManajemenRuangan";
import AturDosenMK from "./admin/views/AturDosenMK";
import { DataMataKuliah } from "./admin/views/DataMataKuliah";

// Definisi item sidebar dengan ID yang konsisten
const sidebarItems = [
  { id: "overview", label: "Dashboard", icon: Settings },
  { id: "pengguna", label: "Tambah Pengguna", icon: Users },
  { id: "matakuliah", label: "Tambah Mata Kuliah", icon: BookOpen },
  { id: "aturdosenmk", label: "Atur Dosen & MK", icon: UserCheck },
  { id: "ruangan", label: "Tambah Ruangan", icon: MapPin },
  { id: "dataMahasiswa", label: "Data Mahasiswa", icon: GraduationCap },
  { id: "dataDosen", label: "Data Dosen", icon: UserCheck },
  { id: "dataMataKuliah", label: "Data Mata Kuliah", icon: Trash2 },
];

function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState("overview");
  const [usersList, setUsersList] = useState([]);
  const [mataKuliahList, setMataKuliahList] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [stats, setStats] = useState({
    totalMahasiswa: 0,
    totalDosen: 0,
    totalMataKuliah: 0,
    totalRuangan: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const logActivity = useCallback(async (action, type) => {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, "activityLogs"), {
        timestamp: Timestamp.now(),
        adminEmail: auth.currentUser.email,
        action: action,
        type: type,
      });
    } catch (error) {
      console.error("Error logging activity: ", error);
    }
  }, []);

  const fetchActivityLogs = useCallback(async () => {
    try {
      const logsQuery = query(
        collection(db, "activityLogs"),
        orderBy("timestamp", "desc"),
        limit(5)
      );
      const querySnapshot = await getDocs(logsQuery);
      setActivityLogs(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc
            .data()
            .timestamp.toDate()
            .toLocaleString("id-ID", {
              dateStyle: "medium",
              timeStyle: "short",
            }),
        }))
      );
    } catch (error) {
      toast.error("Gagal memuat log aktivitas.");
    }
  }, []);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const [
        mahasiswaSnapshot,
        dosenSnapshot,
        mataKuliahSnapshot,
        ruangKelasSnapshot,
      ] = await Promise.all([
        getCountFromServer(
          query(collection(db, "users"), where("role", "==", "mahasiswa"))
        ),
        getCountFromServer(
          query(collection(db, "users"), where("role", "==", "dosen"))
        ),
        getCountFromServer(collection(db, "mataKuliah")),
        getCountFromServer(collection(db, "ruangKelas")),
      ]);
      setStats({
        totalMahasiswa: mahasiswaSnapshot.data().count,
        totalDosen: dosenSnapshot.data().count,
        totalMataKuliah: mataKuliahSnapshot.data().count,
        totalRuangan: ruangKelasSnapshot.data().count,
      });
    } catch (error) {
      toast.error("Gagal memuat statistik.");
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const usersQuery = query(collection(db, "users"), orderBy("nama", "asc"));
      const querySnapshot = await getDocs(usersQuery);
      setUsersList(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (error) {
      toast.error("Gagal memuat data pengguna.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMataKuliah = useCallback(async () => {
    setIsLoading(true);
    try {
      const mkQuery = query(
        collection(db, "mataKuliah"),
        orderBy("namaMK", "asc")
      );
      const querySnapshot = await getDocs(mkQuery);
      setMataKuliahList(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (error) {
      toast.error("Gagal memuat data mata kuliah.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchDashboardStats(),
      fetchActivityLogs(),
      fetchUsers(),
      fetchMataKuliah(),
    ]);
  }, [fetchDashboardStats, fetchActivityLogs, fetchUsers, fetchMataKuliah]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    if (activeTab === "dataMahasiswa" || activeTab === "dataDosen") {
      fetchUsers();
    }
    if (activeTab === "dataMataKuliah") {
      fetchMataKuliah();
    }
  }, [activeTab, fetchUsers, fetchMataKuliah]);

  const handleDeleteUser = async (userId, userName) => {
    if (
      window.confirm(
        `Yakin ingin menghapus pengguna: ${userName}? \n(Tindakan ini hanya menghapus data dari database)`
      )
    ) {
      try {
        await deleteDoc(doc(db, "users", userId));
        toast.success(`Pengguna ${userName} berhasil dihapus.`);
        await logActivity(`Menghapus pengguna: ${userName}`, "USER_DELETE");
        await refreshData();
      } catch (error) {
        toast.error(`Gagal menghapus pengguna: ${error.message}`);
      }
    }
  };

  const handleDeleteCourse = async (courseId, courseName) => {
    if (window.confirm(`Yakin ingin menghapus mata kuliah: ${courseName}?`)) {
      try {
        await deleteDoc(doc(db, "mataKuliah", courseId));
        toast.success(`Mata kuliah ${courseName} berhasil dihapus.`);
        await logActivity(
          `Menghapus mata kuliah: ${courseName}`,
          "COURSE_DELETE"
        );
        await refreshData();
      } catch (error) {
        toast.error(`Gagal menghapus mata kuliah: ${error.message}`);
      }
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      try {
        await signOut(auth);
        toast.success("Logout berhasil.");
        navigate("/login");
      } catch (error) {
        toast.error("Gagal untuk logout.");
      }
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case "overview":
        return <Overview stats={stats} activityLogs={activityLogs} />;
      case "pengguna":
        return (
          <ManajemenPengguna
            onActionSuccess={refreshData}
            logActivity={logActivity}
          />
        );
      case "matakuliah":
        return (
          <ManajemenMataKuliah
            onActionSuccess={refreshData}
            logActivity={logActivity}
          />
        );
      case "ruangan":
        return (
          <ManajemenRuangan
            onActionSuccess={refreshData}
            logActivity={logActivity}
          />
        );
      case "aturdosenmk":
        return (
          <AturDosenMK
            onActionSuccess={refreshData}
            logActivity={logActivity}
          />
        );
      case "dataMahasiswa":
        return (
          <DataMahasiswa
            users={usersList}
            isLoading={isLoading}
            handleDeleteUser={handleDeleteUser}
          />
        );
      case "dataDosen":
        return (
          <DataDosen
            users={usersList}
            isLoading={isLoading}
            handleDeleteUser={handleDeleteUser}
          />
        );
      case "dataMataKuliah":
        return (
          <DataMataKuliah
            courses={mataKuliahList}
            isLoading={isLoading}
            handleDeleteCourse={handleDeleteCourse}
          />
        );
      default:
        return <Overview stats={stats} activityLogs={activityLogs} />;
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
