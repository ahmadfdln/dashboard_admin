import React from "react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.85)",
          borderRadius: "10px",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#fff",
          padding: "8px 12px",
        }}
      >
        <p className="font-semibold mb-2 text-sm">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}</span>
            {entry.unit || ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;