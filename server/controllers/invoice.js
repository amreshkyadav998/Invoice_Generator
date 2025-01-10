const Invoice = require("../models/Invoice");
const { validationResult } = require("express-validator");

// Add invoice
const addInvoice = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Create a new invoice from the request body
    const invoice = new Invoice(req.body);

    // Save the invoice to the database
    const savedInvoice = await invoice.save();
    res.status(201).json(savedInvoice); // Send the saved invoice back as a response
  } catch (error) {
    // Handle unexpected errors
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Error saving invoice", details: error.message });
  }
};

// Get all invoices
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Error fetching invoices", details: error.message });
  }
};

// Delete invoice by ID
const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Error deleting invoice", details: error.message });
  }
};

module.exports = { addInvoice, getAllInvoices, deleteInvoice };
