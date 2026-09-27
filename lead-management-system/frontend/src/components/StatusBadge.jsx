import React from 'react';

const STYLES = {
  New: 'bg-sky-100 text-sky-700',
  Contacted: 'bg-amber-100 text-amber-700',
  Qualified: 'bg-violet-100 text-violet-700',
  Converted: 'bg-emerald-100 text-emerald-700',
  Lost: 'bg-rose-100 text-rose-700',
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${STYLES[status] || 'bg-slate-100 text-slate-700'}`}>
    {status}
  </span>
);

export default StatusBadge;
