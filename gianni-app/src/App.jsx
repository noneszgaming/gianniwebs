import { Routes, Route } from 'react-router-dom'
import { useSignals } from '@preact/signals-react/runtime'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import OrderDataPage from './pages/OrderDataPage'
import ChoosePaymentPage from './pages/ChoosePaymentPage'
import AdminLogin from './components/admin/AdminLogin'
import EditMenuPage from './components/admin/EditMenuPage'
import OrderPage from './components/admin/OrderPage'
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useSignals();

  return (
    <div className='w-full h-full flex justify-center px-[2%] overflow-y-auto'>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order" element={<OrderDataPage />} />
        <Route path="/payment" element={<ChoosePaymentPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/orders" element={
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/edit" element={
          <ProtectedRoute>
            <EditMenuPage />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}
export default App
