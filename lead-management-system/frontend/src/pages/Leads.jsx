import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import LeadFormModal from '../components/LeadFormModal';
import api from '../api/axios';

const STATUS_OPTIONS = ['All', 'New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (status !== 'All') params.status = status;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const res = await api.get('/leads', { params });
      setLeads(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setTotal(res.data.pagination.total);
    } catch (err) {
      setError('Could not load leads. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, search, status, dateFrom, dateTo]);

  useEffect(() => {
    const timeout = setTimeout(fetchLeads, 300); // debounce search typing
    return () => clearTimeout(timeout);
  }, [fetchLeads]);

  useEffect(() => {
    setPage(1);
  }, [search, status, dateFrom, dateTo]);

  const openCreateModal = () => {
    setEditingLead(null);
    setModalOpen(true);
  };

  const openEditModal = (lead) => {
    setEditingLead(lead);
    setModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingLead) {
        await api.put(`/leads/${editingLead._id}`, formData);
      } else {
        await api.post('/leads', formData);
      }
      setModalOpen(false);
      fetchLeads();
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong while saving the lead.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/leads/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchLeads();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete lead.');
    }
  };

  const handleExport = () => {
    const token = localStorage.getItem('lms_token');
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    fetch(`${baseURL}/leads/export/csv`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'leads-export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => alert('Could not export leads.'));
  };

  return (
    <Layout
      title="Leads"
      subtitle={`${total} total lead${total === 1 ? '' : 's'}`}
      actions={
        <>
          <button onClick={handleExport} className="btn-secondary">
            Export CSV
          </button>
          <button onClick={openCreateModal} className="btn-primary">
            + Add Lead
          </button>
        </>
      }
    >
      <div className="card mb-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            className="input-field"
            placeholder="Search name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
            ))}
          </select>
          <input type="date" className="input-field" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <input type="date" className="input-field" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
      </div>

      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Contact</th>
                <th className="px-5 py-3 font-semibold">Company</th>
                <th className="px-5 py-3 font-semibold">Service</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Follow-up</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                    Loading leads...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-rose-500">
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && leads.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                    No leads match your filters yet.
                  </td>
                </tr>
              )}

              {!loading && !error && leads.map((lead) => (
                <tr key={lead._id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-3.5 font-semibold text-slate-700">{lead.name}</td>
                  <td className="px-5 py-3.5 text-slate-500">
                    <div>{lead.email}</div>
                    <div className="text-xs text-slate-400">{lead.phone}</div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{lead.company || '—'}</td>
                  <td className="px-5 py-3.5 text-slate-500">{lead.serviceInterested}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={lead.status} /></td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(lead)}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(lead)}
                        className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <LeadFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingLead}
        submitting={submitting}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800">Delete lead?</h3>
            <p className="mt-2 text-sm text-slate-500">
              This will permanently remove <span className="font-semibold">{deleteTarget.name}</span> from your pipeline.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setDeleteTarget(null)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleDelete} className="btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Leads;
