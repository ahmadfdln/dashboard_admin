// src/components/admin/charts/AdminCharts.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../../../config/firebase';

// Color palette untuk charts
const COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
  gradient: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444']
};

// Component untuk User Distribution Chart
export const UserDistributionChart = ({ stats }) => {
  const data = [
    {
      name: 'Mahasiswa',
      value: stats.totalMahasiswa,
      color: COLORS.primary
    },
    {
      name: 'Dosen',
      value: stats.totalDosen,
      color: COLORS.secondary
    }
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
        Distribusi Pengguna
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component untuk Semester Distribution Chart
export const SemesterDistributionChart = () => {
  const [semesterData, setSemesterData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSemesterData = async () => {
      try {
        const mahasiswaQuery = query(
          collection(db, 'users'), 
          where('role', '==', 'mahasiswa')
        );
        const snapshot = await getDocs(mahasiswaQuery);
        
        const semesterCount = {};
        snapshot.docs.forEach(doc => {
          const semester = doc.data().semester || 'Tidak Diketahui';
          semesterCount[semester] = (semesterCount[semester] || 0) + 1;
        });

        const chartData = Object.entries(semesterCount)
          .map(([semester, count]) => ({
            semester: `Semester ${semester}`,
            jumlah: count
          }))
          .sort((a, b) => {
            const semesterA = parseInt(a.semester.replace('Semester ', ''));
            const semesterB = parseInt(b.semester.replace('Semester ', ''));
            return semesterA - semesterB;
          });

        setSemesterData(chartData);
      } catch (error) {
        console.error('Error fetching semester data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSemesterData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
        Distribusi Mahasiswa per Semester
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={semesterData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="semester" 
              fontSize={12}
              stroke="#6b7280"
            />
            <YAxis 
              fontSize={12}
              stroke="#6b7280"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="jumlah" 
              fill="url(#colorGradient)"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.6}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Component untuk Recent Activity Chart
export const ActivityChart = () => {
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const activityQuery = query(
          collection(db, 'activityLogs'), 
          orderBy('timestamp', 'desc'),
          limit(30)
        );
        const snapshot = await getDocs(activityQuery);
        
        const dailyActivity = {};
        snapshot.docs.forEach(doc => {
          const date = doc.data().timestamp.toDate().toLocaleDateString('id-ID');
          const type = doc.data().type;
          
          if (!dailyActivity[date]) {
            dailyActivity[date] = { date, total: 0, USER_CREATE: 0, COURSE_CREATE: 0, USER_DELETE: 0 };
          }
          
          dailyActivity[date].total += 1;
          dailyActivity[date][type] = (dailyActivity[date][type] || 0) + 1;
        });

        const chartData = Object.values(dailyActivity)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(-7); // Last 7 days

        setActivityData(chartData);
      } catch (error) {
        console.error('Error fetching activity data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
        Aktivitas Admin (7 Hari Terakhir)
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              fontSize={10}
              stroke="#6b7280"
            />
            <YAxis 
              fontSize={12}
              stroke="#6b7280"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="total" 
              stroke={COLORS.secondary}
              fillOpacity={0.6}
              fill="url(#colorActivity)"
            />
            <defs>
              <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Component untuk Resource Overview Chart
export const ResourceOverviewChart = ({ stats }) => {
  const data = [
    {
      name: 'Mahasiswa',
      value: stats.totalMahasiswa,
      color: COLORS.primary,
      icon: '👨‍🎓'
    },
    {
      name: 'Dosen',
      value: stats.totalDosen,
      color: COLORS.secondary,
      icon: '👨‍🏫'
    },
    {
      name: 'Mata Kuliah',
      value: stats.totalMataKuliah,
      color: COLORS.accent,
      icon: '📚'
    },
    {
      name: 'Ruangan',
      value: stats.totalRuangan,
      color: COLORS.danger,
      icon: '🏢'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
        Overview Sumber Daya
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              fontSize={12}
              stroke="#6b7280"
            />
            <YAxis 
              fontSize={12}
              stroke="#6b7280"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="value" 
              radius={[8, 8, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-2xl mr-3">{item.icon}</span>
            <div>
              <div className="text-sm text-gray-600">{item.name}</div>
              <div className="text-lg font-bold" style={{ color: item.color }}>
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Charts Container Component
export const AdminChartsContainer = ({ stats }) => {
  return (
    <div className="space-y-6">
      {/* Row 1: Main Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserDistributionChart stats={stats} />
        <ResourceOverviewChart stats={stats} />
      </div>
      
      {/* Row 2: Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SemesterDistributionChart />
        <ActivityChart />
      </div>
    </div>
  );
};