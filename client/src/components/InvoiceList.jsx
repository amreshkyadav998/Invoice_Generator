// InvoiceList.js
import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf"; // Import jsPDF
import "jspdf-autotable";
import { FaRegFilePdf } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { FaEye } from "react-icons/fa"; // Eye icon for preview
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [showModal, setShowModal] = useState(false); // For modal visibility
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null); // To store the invoice ID
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch("https://invoice-generatorbac.onrender.com/api/invoices/all");
      if (!response.ok) {
        throw new Error("Failed to fetch invoices");
      }
      const data = await response.json();
      setInvoices(data);
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDeleteInvoice = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setShowModal(true); // Show the modal
  };

  const deleteInvoice = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://invoice-generatorbac.onrender.com/api/invoices/${selectedInvoiceId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete invoice");
      }
      setInvoices((prevInvoices) =>
        prevInvoices.filter((invoice) => invoice._id !== selectedInvoiceId)
      );
      setShowModal(false); // Hide the modal
      toast.success("Invoice deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete invoice");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = (invoice) => {
    const doc = new jsPDF();

    doc.text(`Invoice ID : ${invoice._id}`, 20, 20);
    doc.text(`Customer Name : ${invoice.customerName}`, 20, 30);
    doc.text(`Customer Email : ${invoice.customerEmail}`, 20, 40);
    doc.text(
      `Invoice Date : ${new Date(invoice.createdAt).toLocaleDateString()}`,
      20,
      50
    );
    doc.text(`Total Amount : $${invoice.total.toFixed(2)}`, 20, 60);

    const tableColumnHeaders = [
      "Product Name",
      "Quantity",
      "Price ($)",
      "Tax (%)",
      "Total ($)",
    ];

    const tableRows = Array.isArray(invoice.products)
      ? invoice.products.map((product) => [
          product.name,
          product.quantity,
          product.price.toFixed(2),
          invoice.tax.toFixed(2),
          invoice.total.toFixed(2),
        ])
      : [];

    doc.autoTable({
      startY: 70,
      head: [tableColumnHeaders],
      body: tableRows,
    });

    doc.save(`invoice_${invoice._id}.pdf`);
  };

  const viewInvoicePreview = (invoiceId) => {
    navigate(`/invoice-preview/${invoiceId}`); // Redirect to InvoicePreview page
  };

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center py-6 text-gray-800">
          Invoice List
        </h1>
        <div className="overflow-auto max-h-96">
          <table className="min-w-full table-auto text-left text-gray-600">
            <thead className="bg-indigo-600 text-white text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index) => (
                <tr
                  key={invoice._id}
                  className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                >
                  <td className="px-6 py-4 text-gray-800">{invoice.customerName}</td>
                  <td className="px-6 py-4">{invoice.customerEmail}</td>
                  <td className="px-6 py-4 font-bold text-green-600">
                    ${invoice.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex gap-3 items-center">
                    <button
                      onClick={() => downloadPDF(invoice)}
                      className="bg-indigo-700 text-white py-2 px-4 rounded-md hover:bg-indigo-800 transition duration-200"
                    >
                      <FaRegFilePdf className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => confirmDeleteInvoice(invoice._id)}
                      className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
                    >
                      <FaTrashCan className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => viewInvoicePreview(invoice._id)}
                      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                      <FaEye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h2 className="text-xl font-semibold text-gray-800">Confirm Delete</h2>
            <p className="mt-4 text-gray-600">
              Are you sure you want to delete this invoice?
            </p>
            <div className="mt-6 flex gap-4">
              <button
                onClick={deleteInvoice}
                className="bg-red-600 text-white py-2 px-4 rounded-md"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
