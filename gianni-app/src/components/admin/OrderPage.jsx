import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { 
  IconButton, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  List,
  ListItem,
  Divider
} from '@mui/material';
import { FaRedoAlt, FaListAlt } from 'react-icons/fa';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleOpenModal = (items, orderId) => {
    setSelectedItems(items);
    setSelectedOrderId(orderId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

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
    { 
      field: 'order_type', 
      headerName: 'Rendelés típusa', 
      width: 150,
      renderCell: (params) => (
        <div>
          {params.value === 'public' ? 'Nyilvános' : 
           params.value === 'airbnb' ? 'Airbnb' : params.value}
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
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          startIcon={<FaListAlt />}
          onClick={() => handleOpenModal(params.value, params.row.paymentId)}
        >
          Részletek
        </Button>
      )
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
          return {
            ...order,
            order_type: order.order_type,
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
            // ... további lokalizációs beállítások
          }}
        />
      </Paper>

      {/* Termék részletek modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        sx={{ zIndex: 5000 }} // Magasabb z-index érték, mint a táblázaté
      >
        <DialogTitle>
          Rendelés részletei - {selectedOrderId}
        </DialogTitle>
        <DialogContent dividers>
          <List>
            {selectedItems && selectedItems.map((item, index) => {
              try {
                const nameObj = JSON.parse(item.name.replace(/(\w+):/g, '"$1":').replace(/'/g, '"'));
                const descriptionObj = item.description ? JSON.parse(item.description.replace(/(\w+):/g, '"$1":').replace(/'/g, '"')) : {};
                const displayName = nameObj.hu || nameObj.en || item.name;
                const displayDescription = descriptionObj.hu || descriptionObj.en || item.description || '';
                
                return (
                  <React.Fragment key={index}>
                    {index > 0 && <Divider sx={{ my: 2 }} />}
                    <ListItem sx={{ display: 'block', py: 1 }}>
                      <Typography variant="h6">
                        {displayName} ({item.price} Ft × {item.quantity})
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Típus: {item.type === 'food' ? 'Étel' : item.type === 'merch' ? 'Termék' : item.type === 'box' ? 'Box' : item.type}
                      </Typography>
                      {displayDescription && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {displayDescription}
                        </Typography>
                      )}
                      
                      {item.specialTypes && item.specialTypes.length > 0 && (
                        <div>
                          <Typography variant="subtitle2" sx={{ mt: 1 }}>
                            Speciális típusok:
                          </Typography>
                          <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                            {item.specialTypes.map((type, idx) => (
                              <li key={idx}>
                                <Typography variant="body2">
                                  {type.name.hu || type.name.en || ''}
                                </Typography>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </ListItem>
                  </React.Fragment>
                );
              } catch (error) {
                console.log('Error parsing item:', item, error);
                return null;
              }
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Bezárás</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderPage;