const Lead = require('../models/Lead');

const STATUS_VALUES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

// @desc    Get all leads (search, filter, pagination)
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res, next) => {
  try {
    const {
      search = '',
      status = '',
      dateFrom = '',
      dateTo = '',
      page = 1,
      limit = 10,
      sortBy = 'createdDate',
      sortOrder = 'desc',
    } = req.query;

    const query = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    if (status && STATUS_VALUES.includes(status)) {
      query.status = status;
    }

    if (dateFrom || dateTo) {
      query.createdDate = {};
      if (dateFrom) query.createdDate.$gte = new Date(dateFrom);
      if (dateTo) query.createdDate.$lte = new Date(dateTo);
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(limitNum)
        .populate('owner', 'name email'),
      Lead.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
const getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('owner', 'name email');
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ success: true, message: 'Lead created successfully', data: lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const trackedFields = ['status', 'followUpDate', 'name', 'email', 'phone', 'company', 'serviceInterested'];
    const historyEntries = [];

    trackedFields.forEach((field) => {
      if (req.body[field] !== undefined && String(req.body[field]) !== String(lead[field] ?? '')) {
        historyEntries.push({
          field,
          oldValue: String(lead[field] ?? ''),
          newValue: String(req.body[field]),
        });
      }
    });

    Object.assign(lead, req.body);
    if (historyEntries.length) {
      lead.history.push(...historyEntries);
    }

    await lead.save();

    res.status(200).json({ success: true, message: 'Lead updated successfully', data: lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    await lead.deleteOne();
    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Export leads as CSV
// @route   GET /api/leads/export/csv
// @access  Private
const exportLeadsCsv = async (req, res, next) => {
  try {
    const leads = await Lead.find().sort({ createdDate: -1 });
    const header = [
      'Name', 'Email', 'Phone', 'Company', 'Service Interested', 'Status', 'Follow-up Date', 'Notes', 'Created Date',
    ];
    const escape = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const rows = leads.map((l) =>
      [
        l.name, l.email, l.phone, l.company, l.serviceInterested, l.status,
        l.followUpDate ? l.followUpDate.toISOString().split('T')[0] : '',
        l.notes, l.createdDate.toISOString().split('T')[0],
      ].map(escape).join(',')
    );
    const csv = [header.map(escape).join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads-export.csv');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = { getLeads, getLead, createLead, updateLead, deleteLead, exportLeadsCsv };
