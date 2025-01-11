import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceList from "./components/InvoiceList";
import InvoicePreview from "./components/InvoicePreview";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<InvoiceList />} />
          <Route path="/api/invoices" element={<InvoiceForm />} />
          <Route path="/invoice-preview/:id" element={<InvoicePreview />} />
        </Routes>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
};

export default App;
