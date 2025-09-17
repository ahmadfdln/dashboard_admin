// src/components/dashboard/StatCard.jsx
import React from 'react';
import { TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp size={16} className="text-green-500 mr-1" />
            <span className="text-green-500 text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div className={`p-4 rounded-2xl ${color.replace('text', 'bg').replace('600', '100')}`}>
        <Icon size={32} className={color} />
      </div>
    </div>
  </div>
);

export default StatCard;