import React from 'react';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-1.5 py-4">
      <button
        className="btn-secondary !px-3 !py-1.5"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${
            p === page ? 'bg-brand-600 text-white shadow-pop' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        className="btn-secondary !px-3 !py-1.5"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
