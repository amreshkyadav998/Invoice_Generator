const Invoice = require('../models/Invoice');

// Generate invoice number
const generateInvoiceNumber = async () => {
  const count = await Invoice.countDocuments();
  const date = new Date();
  return `INV-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${(count + 1).toString().padStart(4, '0')}`;
};

// Calculate invoice totals
const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;
  return { subtotal, tax, total };
};

// Check for duplicate invoice
const isDuplicateInvoice = async (email, items) => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
    // Fetch potential duplicates within the last hour
    const potentialDuplicates = await Invoice.find({
      email,
      createdAt: { $gte: oneHourAgo },
    });
  
    // Sort and compare items for each potential duplicate
    for (const invoice of potentialDuplicates) {
      if (invoice.items.length !== items.length) continue;
  
      const sortedNewItems = [...items].map(item => ({
        description: item.description.trim(),
        quantity: item.quantity,
        price: item.price,
      })).sort((a, b) => a.description.localeCompare(b.description));
  
      const sortedExistingItems = [...invoice.items].map(item => ({
        description: item.description.trim(),
        quantity: item.quantity,
        price: item.price,
      })).sort((a, b) => a.description.localeCompare(b.description));
  
      if (JSON.stringify(sortedNewItems) === JSON.stringify(sortedExistingItems)) {
        return true;
      }
    }
  
    return false;
  };
  

exports.createInvoice = async (req, res) => {
  try {
    const { customerName, email, items } = req.body;

    // Check for duplicate
    const isDuplicate = await isDuplicateInvoice(email, items);
    if (isDuplicate) {
      return res.status(409).json({ 
        message: 'A similar invoice was recently created. Please check existing invoices or wait a while before creating a new one.'
      });
    }

    const invoiceNumber = await generateInvoiceNumber();
    const { subtotal, tax, total } = calculateTotals(items);

    const invoice = new Invoice({
      invoiceNumber,
      customerName,
      email,
      items,
      subtotal,
      tax,
      total
    });

    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Error creating invoice', error: error.message });
  }
};

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoices', error: error.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoice', error: error.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const { items } = req.body;
    const { subtotal, tax, total } = calculateTotals(items);

    // When updating, we don't check for duplicates since it might be a legitimate update

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { ...req.body, subtotal, tax, total },
      { new: true, runValidators: true }
    );

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Error updating invoice', error: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting invoice', error: error.message });
  }
};