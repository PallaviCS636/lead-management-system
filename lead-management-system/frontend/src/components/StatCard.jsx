import React from 'react';

const StatCard = ({ label, value, icon, gradient }) => (
  <div className="card relative overflow-hidden">
    <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-20 ${gradient}`} />
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
      </div>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg text-white ${gradient}`}>
        {icon}
      </div>
    </div>
  </div>
);

export default StatCard;
