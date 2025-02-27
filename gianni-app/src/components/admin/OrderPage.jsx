/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { IconButton } from '@mui/material';
import { FaRedoAlt } from 'react-icons/fa';
import zIndex from '@mui/material/styles/zIndex';
  const columns = [
    { field: 'paymentId', headerName: 'Payment ID', width: 200 },
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'customerName', headerName: 'Customer Name', width: 150 },
    { field: 'customerEmail', headerName: 'Customer Email', width: 200 },
    { field: 'customerPhone', headerName: 'Phone', width: 130 },
    { field: 'city', headerName: 'City', width: 130 },
    { field: 'addressLine1', headerName: 'Address Line 1', width: 200 },
    { field: 'addressLine2', headerName: 'Address Line 2', width: 200 },
    { field: 'zipCode', headerName: 'Zip Code', width: 100 },
    { field: 'isInstantDelivery', headerName: 'Instant Delivery', width: 130 },
    { field: 'deliveryDate', headerName: 'Delivery Date', width: 130 },
    { field: 'deliveryTime', headerName: 'Delivery Time', width: 130 },
    { field: 'created_date', headerName: 'Created Date', width: 130 },
    { field: 'total_price', headerName: 'Total Price', width: 130 },
    {
      field: 'itemsList',
      headerName: 'Items',
      width: 300,
      renderCell: (params) => (
        <div style={{ 
          whiteSpace: 'pre-line', 
          padding: '8px 0',
          width: '100%'
        }}>
          {params.value}
        </div>
      )
    }
  
  ];


const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const columns = [
    { field: 'paymentId', headerName: 'Fizetési azonosító', width: 200 },
    {
      field: 'status',
      headerName: 'Állapot',
      width: 130,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          {params.value === 'pending' ? 'Függőben' : 
           params.value === 'Paid' ? 'Fizetve' : 
           params.value === 'failed' ? 'Sikertelen' : params.value}
          {params.value === 'pending' && (
            <IconButton
              size="small"
              onClick={() => handleRestartVerification(params.row.paymentId)}
              sx={{ padding: '4px' }}
            >
              <FaRedoAlt size={16} />
            </IconButton>
          )}
        </div>
      )
    },
    { field: 'customerName', headerName: 'Vásárló neve', width: 150 },
    { field: 'customerEmail', headerName: 'Email cím', width: 200 },
    { field: 'customerPhone', headerName: 'Telefonszám', width: 130 },
    { field: 'city', headerName: 'Város', width: 130 },
    { field: 'addressLine1', headerName: 'Cím 1', width: 200 },
    { field: 'addressLine2', headerName: 'Cím 2', width: 200 },
    { field: 'zipCode', headerName: 'Irányítószám', width: 100 },
    { field: 'isInstantDelivery', headerName: 'Azonnali kiszállítás', width: 130 },
    { field: 'deliveryDate', headerName: 'Kiszállítás dátuma', width: 130 },
    { field: 'deliveryTime', headerName: 'Kiszállítás időpontja', width: 130 },
    { field: 'created_date', headerName: 'Létrehozva', width: 130 },
    { field: 'total_price', headerName: 'Végösszeg', width: 130 },
    {
      field: 'items',
      headerName: 'Termékek',
      width: 300,
      renderCell: (params) => {
        const items = params.value;
        
        return (
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            padding: '4px'
          }}>
            {items.map((item, index) => {
              try {
                const nameObj = JSON.parse(item.name.replace(/([a-zA-Z0-9_]+):/g, '"$1":').replace(/'/g, '"'));
                const displayName = nameObj.hu || nameObj.en || item.name;
                
                return (
                  <div key={`${params.id}-${index}`} style={{ 
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    fontSize: '0.875rem',
                    lineHeight: '1.2'
                  }}>
                    {displayName} ({item.price} Ft × {item.quantity})
                  </div>
                );
              } catch (error) {
                console.log('Error parsing item:', item);
                return null;
              }
            })}
          </div>
        );
      }
    }
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
        const transformedOrders = data.orders.map(order => {
          // Create a formatted string of all items
          const itemsList = order.items.reduce((acc, item) => {
            const nameObj = JSON.parse(item.name.replace(/(\w+):/g, '"$1":').replace(/'/g, '"'));
            return acc + `${nameObj.hu} (${item.price} Ft × ${item.quantity})\n`;
          }, '');

          return {
            ...order,
            customerName: order.customer?.name,
            customerEmail: order.customer?.email,
            customerPhone: order.customer?.phone,
            city: order.address?.city,
            addressLine1: order.address?.addressLine1,
            addressLine2: order.address?.addressLine2,
            zipCode: order.address?.zipCode,
            deliveryDate: order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : '-',
            created_date: order.created_date ? new Date(order.created_date).toLocaleDateString() : '-',
            total_price: `${order.total_price?.toLocaleString() || 0} Ft`,
            itemsList: itemsList.trim()
          };
        });
        console.log('Transformed orders:', transformedOrders);
        setOrders(transformedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  const handleRestartVerification = async (paymentId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/verify/${paymentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const data = await response.json();
      if (data.success) {
        fetchOrders(); // Refresh the orders list
      }
    } catch (error) {
      console.error('Error restarting verification:', error);
    }
  };


  useEffect(() => {
    fetchOrders(); // Initial fetch
    
    const intervalId = setInterval(() => {
      fetchOrders(); // Add the fetch call here to refresh every 30 seconds
    }, 30000); // 30 seconds in milliseconds

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div 
      className='flex items-center justify-center w-full h-full'
      style={{ zIndex: 4000 }}
    >
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
          localeText={{
            noRowsLabel: 'Nincsenek rendelések',
            noResultsOverlayLabel: 'Nincs találat.',
            toolbarDensity: 'Sűrűség',
            toolbarDensityLabel: 'Sűrűség',
            toolbarDensityCompact: 'Kompakt',
            toolbarDensityStandard: 'Normál',
            toolbarDensityComfortable: 'Kényelmes',
            toolbarExport: 'Exportálás',
            toolbarExportLabel: 'Exportálás',
            toolbarExportCSV: 'CSV letöltése',
            columnsPanelTextFieldLabel: 'Oszlop keresése',
            columnsPanelTextFieldPlaceholder: 'Oszlop neve',
            columnsPanelDragIconLabel: 'Oszlop átrendezése',
            columnsPanelShowAllButton: 'Összes megjelenítése',
            columnsPanelHideAllButton: 'Összes elrejtése',
            filterPanelAddFilter: 'Szűrő hozzáadása',
            filterPanelDeleteIconLabel: 'Törlés',
            filterPanelOperators: 'Operátorok',
            filterPanelOperatorAnd: 'És',
            filterPanelOperatorOr: 'Vagy',
            filterPanelColumns: 'Oszlopok',
            filterPanelInputLabel: 'Érték',
            filterPanelInputPlaceholder: 'Érték szűrése',
            columnMenuLabel: 'Menü',
            columnMenuShowColumns: 'Oszlopok megjelenítése',
            columnMenuManageColumns: 'Oszlopok kezelése',
            columnMenuFilter: 'Szűrő',
            columnMenuHideColumn: 'Oszlop elrejtése',
            columnMenuUnsort: 'Rendezés törlése',
            columnMenuSortAsc: 'Rendezés növekvő',
            columnMenuSortDesc: 'Rendezés csökkenő',
            columnHeaderFiltersLabel: 'Szűrők megjelenítése',
            columnHeaderSortIconLabel: 'Rendezés',
            footerRowSelected: (count) =>
              count !== 1
                ? `${count.toLocaleString()} sor kiválasztva`
                : `1 sor kiválasztva`,
            MuiTablePagination: {
              labelRowsPerPage: 'Sorok száma:',
              labelDisplayedRows: ({ from, to, count }) =>
                `${from}-${to} / ${count !== -1 ? count : `${to}-nél több`}`,
            },
            filterOperatorContains: 'tartalmazza',
            filterOperatorEquals: 'egyenlő',
            filterOperatorStartsWith: 'kezdődik',
            filterOperatorEndsWith: 'végződik',
            filterOperatorIs: 'megegyezik',
            filterOperatorNot: 'nem',
            filterOperatorAfter: 'után',
            filterOperatorOnOrAfter: 'ekkor vagy után',
            filterOperatorBefore: 'előtt',
            filterOperatorOnOrBefore: 'ekkor vagy előtt',
            filterOperatorIsEmpty: 'üres',
            filterOperatorIsNotEmpty: 'nem üres',
            filterOperatorIsAnyOf: 'bármelyik',
            filterValueAny: 'bármely',
            filterValueTrue: 'igaz',
            filterValueFalse: 'hamis',
          }}
        />
      </Paper>
    </div>  )};

export default OrderPage;
