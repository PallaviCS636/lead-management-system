const express = require('express');
const { body, param } = require('express-validator');
const {
  getLeads, getLead, createLead, updateLead, deleteLead, exportLeadsCsv,
} = require('../controllers/leadController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const STATUS_VALUES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

// Separate chains for create vs update - ValidationChain objects are mutable,
// so create/update rules must never share the same chain instances.
const createLeadRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('serviceInterested').trim().notEmpty().withMessage('Service interested is required'),
  body('status').optional().isIn(STATUS_VALUES).withMessage('Invalid status value'),
  body('followUpDate').optional({ nullable: true }).isISO8601().withMessage('Invalid follow-up date'),
];

const updateLeadRules = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('phone').optional().trim().notEmpty().withMessage('Phone number cannot be empty'),
  body('serviceInterested').optional().trim().notEmpty().withMessage('Service interested cannot be empty'),
  body('status').optional().isIn(STATUS_VALUES).withMessage('Invalid status value'),
  body('followUpDate').optional({ nullable: true }).isISO8601().withMessage('Invalid follow-up date'),
];

router.use(protect); // every lead route requires authentication

router.get('/export/csv', exportLeadsCsv);
router.get('/', getLeads);
router.get('/:id', param('id').isMongoId().withMessage('Invalid lead id'), validate, getLead);
router.post('/', createLeadRules, validate, createLead);
router.put(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid lead id'), ...updateLeadRules],
  validate,
  updateLead
);
router.delete('/:id', param('id').isMongoId().withMessage('Invalid lead id'), validate, deleteLead);

module.exports = router;
