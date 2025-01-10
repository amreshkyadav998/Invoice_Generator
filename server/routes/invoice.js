const express = require("express");
const { validateInvoice, validate } = require("../middleware/validation");
const { addInvoice, getAllInvoices, deleteInvoice } = require("../controllers/invoice");

const router = express.Router();

// Add invoice route with validation
router.route("/").post(validateInvoice, validate, addInvoice);

// Get all invoices route
router.route("/all").get(getAllInvoices);

// Delete invoice route by ID
router.route("/:id").delete(deleteInvoice);

module.exports = router;
