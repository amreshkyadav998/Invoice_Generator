export const fetchInvoices = async () => {
    const response = await fetch('https://invoice-generatorbac.onrender.com/api/invoices');
    if (!response.ok) throw new Error('Failed to fetch invoices');
    return await response.json();
  };
  
  export const fetchInvoiceById = async (id) => {
    const response = await fetch(`https://invoice-generatorbac.onrender.com/api/invoices/${id}`);
    if (!response.ok) throw new Error('Failed to fetch invoice');
    return await response.json();
  };
  