import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generatePDF = (invoice) => {
  const doc = new jsPDF();

  // Add invoice header
  doc.setFontSize(20);
  doc.text('Invoice', 20, 20);
  doc.setFontSize(12);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 20, 30);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);

  // Add customer details
  doc.text('Bill To:', 20, 60);
  doc.text(invoice.customerName, 20, 70);
  doc.text(invoice.email, 20, 80);

  // Add items table
  const tableData = invoice.items.map(item => [
    item.description,
    item.quantity,
    `$${item.price.toFixed(2)}`,
    `$${(item.quantity * item.price).toFixed(2)}`
  ]);

  doc.autoTable({
    startY: 100,
    head: [['Description', 'Quantity', 'Price', 'Total']],
    body: tableData,
  });

  // Add totals
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const finalY = doc.previousAutoTable.finalY + 10;
  doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 140, finalY);
  doc.text(`Tax (10%): $${tax.toFixed(2)}`, 140, finalY + 10);
  doc.text(`Total: $${total.toFixed(2)}`, 140, finalY + 20);

  return doc;
};