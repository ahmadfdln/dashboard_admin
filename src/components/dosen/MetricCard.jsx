import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const MetricCard = ({ title, value, change, icon: Icon, color, trend }) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="bg-[#020617]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-white/20 transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-3">
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      {change && (
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold ${
            trend === "up"
              ? "bg-green-500/20 text-green-300 border border-green-500/30"
              : "bg-red-500/20 text-red-300 border border-red-500/30"
          }`}
        >
          {trend === "up" ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {change}
        </div>
      )}
    </div>
    <h3 className="text-2xl font-bold text-white mb-0.5">{value}</h3>
    <p className="text-xs text-gray-300">{title}</p>
  </motion.div>
);

export default MetricCard;