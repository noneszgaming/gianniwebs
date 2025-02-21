/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { FaRedoAlt } from 'react-icons/fa';

const columns = [
  { field: 'paymentId', headerName: 'Payment ID', width: 200 },
  { field: 'status', headerName: 'Status', width: 130,
    renderCell: (params) => (
      <div className="flex items-center gap-2">
        {params.value}
        {params.value === 'pending' && (
          <FaRedoAlt 
            className="w-4 h-4 cursor-pointer text-accent hover:text-dark-accent" 
            onClick={() => retryVerification(params.row.paymentId)}
          />
        )}
      </div>
    )
  },
  { field: 'created_date', headerName: 'Order Date', width: 130,
    valueGetter: (params) => {
      return params.value ? new Date(params.value).toLocaleDateString() : '-'
    }
  },
  { field: 'deliveryDate', headerName: 'Delivery Date', width: 130,
    valueGetter: (params) => {
      return params.value ? new Date(params.value).toLocaleDateString() : '-'
    }
  },
  { field: 'total_price', headerName: 'Total Price', width: 130,
    valueFormatter: (params) => `${params.value || 0} Ft`
  },
  { field: 'customer', headerName: 'Customer', width: 200,
    valueGetter: (params) => {
      return params.row?.customer?.name || '-'
    }
  },
  { field: 'customer', headerName: 'Email', width: 200,
    valueGetter: (params) => {
      return params.row?.customer?.email || '-'
    }
  },
  { field: 'address', headerName: 'Address', width: 300,
    valueGetter: (params) => {
      const addr = params.row?.address;
      if (!addr) return '-';
      return `${addr.city || ''}, ${addr.addressLine1 || ''}, ${addr.zipCode || ''}`.trim();
    }
  }
];
const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

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

  return (
    <div className='flex items-center justify-center w-full h-full'>
      <Paper sx={{ height: 600, width: '100%', p: 2 }}>
        <DataGrid
          rows={orders}
          columns={columns}
          getRowId={(row) => row.paymentId}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
};

export default OrderPage;