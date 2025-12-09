import React from "react";
import { motion } from "framer-motion";

const ChartCard = ({ title, subtitle, icon: Icon, children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-[#020617]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-white/20 transition-all duration-300 ${className}`}
  >
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-base font-semibold text-white mb-0.5">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
      {Icon && (
        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/15">
          <Icon className="w-4 h-4 text-cyan-300" />
        </div>
      )}
    </div>
    {children}
  </motion.div>
);

export default ChartCard;