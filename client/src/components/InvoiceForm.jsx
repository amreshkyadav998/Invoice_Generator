import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const InvoiceForm = ({ onInvoiceSaved }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    products: [{ name: "", quantity: "", price: "", disabled: false }],
    tax: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleProductChange = (index, key, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index][key] = value;
    setFormData({ ...formData, products: updatedProducts });
  };

  const addProductRow = () => {
    const updatedProducts = formData.products.map((product) => ({
      ...product,
      disabled: true,
    }));
    setFormData({
      ...formData,
      products: [
        ...updatedProducts,
        { name: "", quantity: 1, price: 0, disabled: false },
      ],
    });
  };

  const deleteProductRow = (index) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: updatedProducts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const total = formData.products.reduce(
        (sum, product) => sum + product.quantity * product.price,
        0
      );
      const taxAmount = (total * formData.tax) / 100;
      const invoice = { ...formData, total: total + taxAmount };

      const response = await fetch("http://localhost:5000/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoice),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Unknown error");
      }

      const data = await response.json();

      if (onInvoiceSaved && typeof onInvoiceSaved === "function") {
        onInvoiceSaved(data);
      }

      toast.success("Invoice saved successfully!");

      setFormData({
        customerName: "",
        customerEmail: "",
        products: [{ name: "", quantity: 1, price: 0, disabled: false }],
        tax: 0,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save invoice: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-12 p-8 bg-gray-900 text-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-semibold text-center mb-8">
        Create Invoice
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Customer Name</label>
          <input
            type="text"
            placeholder="Enter customer name"
            value={formData.customerName}
            onChange={(e) =>
              setFormData({ ...formData, customerName: e.target.value })
            }
            className="w-full border border-gray-700 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Customer Email</label>
          <input
            type="email"
            placeholder="Enter customer email"
            value={formData.customerEmail}
            onChange={(e) =>
              setFormData({ ...formData, customerEmail: e.target.value })
            }
            className="w-full border border-gray-700 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <h3 className="text-xl mb-4">Products</h3>
          {formData.products.map((product, index) => (
            <div key={index} className="flex flex-wrap items-center gap-4 mb-4">
              <input
                type="text"
                placeholder="Product Name"
                value={product.name}
                onChange={(e) => handleProductChange(index, "name", e.target.value)}
                className="border border-gray-700 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={product.disabled}
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                value={product.quantity}
                onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                className="border border-gray-700 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={product.disabled}
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={product.price}
                onChange={(e) => handleProductChange(index, "price", e.target.value)}
                className="border border-gray-700 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={product.disabled}
                required
              />
              <button
                type="button"
                onClick={() => deleteProductRow(index)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addProductRow}
            className="text-red-500 hover:text-red-700 font-medium"
          >
            + Add Another Product
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tax Percentage (%)</label>
          <input
            type="number"
            placeholder="Enter tax percentage"
            value={formData.tax}
            onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
            className="w-full border border-gray-700 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {isLoading ? "Saving..." : "Save Invoice"}
        </button>
      </form>
    </div>
  );
};

export default InvoiceForm;
