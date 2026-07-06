import React from "react";
function StatCard({
  title,
  value,
  icon,
  subtitle
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 transition-all
duration-300
hover:-translate-y-1
hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500">
          {title}
        </h3>
        <div className="text-blue-500 text-xl">
          {icon}
        </div>
      </div>
      <h2 className="text-4xl font-bold text-slate-800">
        {value}
      </h2>
      <p className="text-xs text-slate-400 mt-2">
        {subtitle}
      </p>
    </div>
  );
}

export default StatCard;