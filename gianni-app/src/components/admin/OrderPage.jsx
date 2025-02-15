/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { FaSort, FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';
  const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortField, setSortField] = useState('orderDate');
    const [sortDirection, setSortDirection] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState({});

      useEffect(() => {
        const fetchOrders = async () => {
          try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:3001/api/orders', {
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
          } finally {
            setLoading(false);
          }
        };
  
        fetchOrders();
      }, []);

    const handleSort = (field) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    };

    const toggleRowExpand = (orderId) => {
      setExpandedRows(prev => ({
        ...prev,
        [orderId]: !prev[orderId]
      }));
    };

    const toggleAllDetails = (orderId) => {
      setExpandedRows(prev => {
        const isAnyExpanded = prev[orderId] || 
                           prev[orderId + '_customer'] || 
                           prev[orderId + '_address'];
      
        return {
          ...prev,
          [orderId]: !isAnyExpanded,
          [orderId + '_customer']: !isAnyExpanded,
          [orderId + '_address']: !isAnyExpanded
        };
      });
    };

    const filteredOrders = orders.filter(order => 
      order.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedOrders = [...filteredOrders].sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      return a[sortField] > b[sortField] ? direction : -direction;
    });

    return (
      <div className="p-4">
        <div className="mb-4 flex items-center">
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
        </div>

        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              {['Payment ID', 'Items', 'Customer', 'Address', 'Status', 'Order Date', 'Delivery Date', 'Delivery Time'].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort(header.toLowerCase().replace(' ', ''))}
                >
                  <div className="flex items-center">
                    {header}
                    <FaSort className="ml-1" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedOrders.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-8 text-center text-gray-500 text-lg">
                  No orders found
                </td>
              </tr>
            ) : (
              sortedOrders.map((order) => (
                <React.Fragment key={order.paymentId}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleAllDetails(order.paymentId)}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        View All
                        {(expandedRows[order.paymentId] ||
                          expandedRows[order.paymentId + '_customer'] ||
                          expandedRows[order.paymentId + '_address']) ?
                          <FaChevronUp className="ml-1" /> :
                          <FaChevronDown className="ml-1" />}
                      </button>
                    </td>
                    <td className="px-6 py-4">{order.paymentId}</td>
                    <td className="px-6 py-4">
                      <div>
                        <button
                          onClick={() => toggleRowExpand(order.paymentId)}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          View Items
                          {expandedRows[order.paymentId] ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <button
                          onClick={() => toggleRowExpand(order.paymentId + '_customer')}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          View Customer
                          {expandedRows[order.paymentId + '_customer'] ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <button
                          onClick={() => toggleRowExpand(order.paymentId + '_address')}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          View Address
                          {expandedRows[order.paymentId + '_address'] ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">{order.status}</td>
                    <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{new Date(order.deliveryDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{order.deliveryTime}</td>
                  </tr>

                  {(expandedRows[order.paymentId] || 
                    expandedRows[order.paymentId + '_customer'] || 
                    expandedRows[order.paymentId + '_address']) && (
                    <tr>
                      <td colSpan="2" className='flex flex-col justify-start items-center'></td>
                      {expandedRows[order.paymentId] ? (
                        <td className="px-6 py-4 bg-gray-50">
                          <div className="pl-4">
                            <h4 className="font-semibold mb-2">Ordered Items:</h4>
                            {order.items.map((item, index) => (
                              <div key={index} className="ml-4">
                                • {item.name} - {item.quantity}x - {item.price} Ft
                              </div>
                            ))}
                          </div>
                        </td>
                      ) : <td></td>}
                      {expandedRows[order.paymentId + '_customer'] ? (
                        <td className="px-6 py-4 bg-gray-50">
                          <div className="pl-4">
                            <h4 className="font-semibold mb-2">Customer Details:</h4>
                            <div className="ml-4">
                              <p>Name: {order.customer?.name || 'N/A'}</p>
                              <p>Email: {order.customer?.email || 'N/A'}</p>
                              <p>Phone: {order.customer?.phone || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                      ) : <td></td>}
                      {expandedRows[order.paymentId + '_address'] ? (
                        <td className="px-6 py-4 bg-gray-50">
                          <div className="pl-4">
                            <h4 className="font-semibold mb-2">Delivery Address:</h4>
                            <div className="ml-4">
                              <p>Street: {order.address?.addressLine1 || 'N/A'}</p>
                              <p>City: {order.address?.city || 'N/A'}</p>
                              <p>Postal Code: {order.address?.zipCode || 'N/A'}</p>
                              <p>Country: {order.address?.country || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                      ) : <td></td>}
                      <td colSpan="4"></td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };
export default OrderPage;
