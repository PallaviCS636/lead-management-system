import React, { useState, useEffect } from 'react';

const STATUS_OPTIONS = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  serviceInterested: '',
  status: 'New',
  followUpDate: '',
  notes: '',
};

const LeadFormModal = ({ isOpen, onClose, onSubmit, initialData, submitting }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        company: initialData.company || '',
        serviceInterested: initialData.serviceInterested || '',
        status: initialData.status || 'New',
        followUpDate: initialData.followUpDate ? initialData.followUpDate.split('T')[0] : '',
        notes: initialData.notes || '',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'A valid email is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    if (!form.serviceInterested.trim()) errs.serviceInterested = 'Service interested is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, followUpDate: form.followUpDate || null });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">
            {initialData ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Name *</label>
              <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="Jane Doe" />
              {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Email *</label>
              <input name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="jane@company.com" />
              {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Phone *</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="9876543210" />
              {errors.phone && <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Company</label>
              <input name="company" value={form.company} onChange={handleChange} className="input-field" placeholder="Acme Corp" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Service Interested *</label>
              <input
                name="serviceInterested"
                value={form.serviceInterested}
                onChange={handleChange}
                className="input-field"
                placeholder="Web Development"
              />
              {errors.serviceInterested && <p className="mt-1 text-xs text-rose-500">{errors.serviceInterested}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-500">Follow-up Date</label>
              <input type="date" name="followUpDate" value={form.followUpDate} onChange={handleChange} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-500">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none"
                placeholder="Any relevant context about this lead..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadFormModal;
