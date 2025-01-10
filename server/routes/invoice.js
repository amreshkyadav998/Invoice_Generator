const express = require('express');
const router = express.Router();
const { validateInvoice, validateId, validate } = require('../middleware/validation');
const invoiceController = require('../controllers/invoice');

// Create invoice - validate full invoice data
router.post('/', validateInvoice, validate, invoiceController.createInvoice);

// Get all invoices - no validation needed
router.get('/', invoiceController.getAllInvoices);

// Get single invoice - validate ID
router.get('/:id', validateId, validate, invoiceController.getInvoiceById);

// Update invoice - validate both ID and invoice data
router.put('/:id', validateId, validateInvoice, validate, invoiceController.updateInvoice);

// Delete invoice - validate ID
router.delete('/:id', validateId, validate, invoiceController.deleteInvoice);

module.exports = router;