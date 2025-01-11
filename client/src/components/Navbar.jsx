import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-red-600 p-4 text-white">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="hover:text-indigo-200">Invoice List</Link>
        </li>
        <li>
          <Link to="/api/invoices" className="hover:text-indigo-200">Create Invoice</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
