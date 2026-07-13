import React from "react";
function StatCard({title,value,icon,subtitle, color = "blue"}){

  const colorMap = {
    blue:   { bg: "bg-blue-50",   icon: "text-blue-500",   border: "border-blue-100" },
    green:  { bg: "bg-green-50",  icon: "text-green-500",  border: "border-green-100" },
    red:    { bg: "bg-red-50",    icon: "text-red-400",    border: "border-red-100" },
    purple: { bg: "bg-purple-50", icon: "text-purple-500", border: "border-purple-100" },
    yellow: { bg: "bg-yellow-50", icon: "text-yellow-500", border: "border-yellow-100" },
  };

  const c = colorMap[color] || colorMap.blue;
  return (
    <div className= {`bg-white rounded-2xl shadow-sm border ${c.border} p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          {title}
        </h3>
        <div className={`w-9 h-9 rounded-xl ${c.bg} ${c.icon} flex items-center justify-center text-lg`}>
          {icon}
        </div>
      </div>
      <h2 className="text-3xl font-bold text-slate-800">
        {value}
      </h2>
      <p className="text-xs text-slate-400 mt-1.5">
        {subtitle}
      </p>
    </div>
  );
}

export default StatCard;