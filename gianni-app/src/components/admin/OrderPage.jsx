import React, { useState, useEffect } from 'react';
import { FaSearch, FaRedoAlt } from 'react-icons/fa';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [sortField, setSortField] = useState('orderDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    items: false,
    customer: false,
    address: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Base columns that are always visible
  const baseColumns = [
    { label: 'Payment ID', field: 'paymentId' },
    { label: 'Status', field: 'status' },
    { label: 'Order Date', field: 'orderDate' },
    { label: 'Delivery Date', field: 'deliveryDate' },
    { label: 'Total Price', field: 'total_price' }
  ];

  // Additional columns for expanded sections
  const itemColumns = [
    { label: 'Items List', field: 'items' }
  ];

  const customerColumns = [
    { label: 'Customer Name', field: 'name' },
    { label: 'Email', field: 'email' },
    { label: 'Phone', field: 'phone' }
  ];

  const addressColumns = [
    { label: 'Country', field: 'country' },
    { label: 'City', field: 'city' },
    { label: 'Street', field: 'addressLine1' },
    { label: 'ZIP', field: 'zipCode' }
  ];

  // Combine all visible columns based on expanded sections
  const visibleColumns = [
    ...baseColumns,
    ...(expandedSections.items ? itemColumns : []),
    ...(expandedSections.customer ? customerColumns : []),
    ...(expandedSections.address ? addressColumns : [])
  ];

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders);
      } else {
        console.error('Failed to fetch orders:', data.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const retryVerification = async (paymentId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/verify/${paymentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Refresh orders after verification
        fetchOrders();
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    return a[sortField] > b[sortField] ? direction : -direction;
  });

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            className="pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={() => toggleSection('items')}
          className={`px-4 py-2 rounded-lg ${expandedSections.items
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
            }`}
        >
          Items
        </button>

        <button
          onClick={() => toggleSection('customer')}
          className={`px-4 py-2 rounded-lg ${expandedSections.customer
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
            }`}
        >
          Customer
        </button>

        <button
          onClick={() => toggleSection('address')}
          className={`px-4 py-2 rounded-lg ${expandedSections.address
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
            }`}
        >
          Address
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              {visibleColumns.map(({ label }) => (
                <th key={label} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedOrders.map((order) => (
              <tr key={order.paymentId} className="hover:bg-gray-50">
                <td className="px-6 py-4">{order.paymentId}</td>
                <td className="px-6 py-4 flex items-center gap-2">
                  {order.status}
                  {order.status === 'pending' && (
                    <button 
                      onClick={() => retryVerification(order.paymentId)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="Retry verification"
                    >
                      <FaRedoAlt className="w-4 h-4" />
                    </button>
                  )}
                </td>
                <td className="px-6 py-4">{new Date(order.created_date).toLocaleDateString()}</td>
                <td className="px-6 py-4">{new Date(order.deliveryDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">{order.total_price} Ft</td>
                
                {expandedSections.items && (
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={item.id || index} className="flex items-center">
                          <span className="text-gray-600">•</span>
                          <span className="ml-2">
                            {item.name} - {item.quantity}x - {item.price} Ft
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                )}

                {expandedSections.customer && (
                  <>
                    <td className="px-6 py-4">{order.customer.name}</td>
                    <td className="px-6 py-4">{order.customer.email}</td>
                    <td className="px-6 py-4">{order.customer.phone}</td>
                  </>
                )}

                {expandedSections.address && (
                  <>
                    <td className="px-6 py-4">{order.address.country}</td>
                    <td className="px-6 py-4">{order.address.city}</td>
                    <td className="px-6 py-4">{order.address.addressLine1}</td>
                    <td className="px-6 py-4">{order.address.zipCode}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>        </table>
      </div>
    </div>
  );
};

export default OrderPage;