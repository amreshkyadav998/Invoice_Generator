import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To get the invoice ID from URL

const InvoicePreview = () => {
  const { id } = useParams(); // Get the invoice ID from URL
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    // Fetch the invoice based on the ID
    const fetchInvoice = async () => {
        try {
          const response = await fetch(`https://invoice-generatorbac.onrender.com/api/invoices/all`);
          if (!response.ok) {
            throw new Error(`Failed to fetch invoices: ${response.statusText}`);
          }
          const data = await response.json();
          console.log(data); // Log the response data for debugging
      
          const selectedInvoice = data.find((invoice) => invoice._id === id);
          setInvoice(selectedInvoice || null);
        } catch (err) {
          console.error("Error fetching invoices:", err);
        }
      };
      
    fetchInvoice();
  }, [id]);

  if (!invoice) {
    return <div>Loading...</div>;
  }

  // Helper function to safely format numbers
  const formatAmount = (amount) => {
    return amount && !isNaN(amount) ? amount.toFixed(2) : 'N/A';
  };

  // Helper function to safely format the date
  const formatDate = (date) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? 'Invalid Date' : parsedDate.toLocaleDateString();
  };

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg max-w-4xl w-full p-6">
        <h1 className="text-3xl font-bold text-gray-800">Invoice Preview</h1>
        <div className="mt-6">
          <p><strong>Invoice ID:</strong> {invoice._id}</p>
          <p><strong>Customer Name:</strong> {invoice.customerName}</p>
          <p><strong>Customer Email:</strong> {invoice.customerEmail}</p>
          <p><strong>Invoice Date:</strong> {formatDate(invoice.createdAt)}</p>
          <p><strong>Total Amount:</strong> ${formatAmount(invoice.total)}</p>
          <h3 className="text-xl font-semibold mt-4">Products:</h3>
          <ul>
            {Array.isArray(invoice.products) && invoice.products.length > 0 ? (
              invoice.products.map((product) => (
                <li key={product.name}>
                  {product.name} (x{product.quantity}) - ${formatAmount(product.price)} each
                </li>
              ))
            ) : (
              <li>No products available</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
