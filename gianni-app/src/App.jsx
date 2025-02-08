import { Routes, Route } from 'react-router-dom'
import { useSignals } from '@preact/signals-react/runtime'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import OrderDataPage from './pages/OrderDataPage'
import ChoosePaymentPage from './pages/ChoosePaymentPage'

function App() {
  useSignals();

  return (
    <div className='w-full h-full flex justify-center px-[2%] overflow-y-auto'>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order" element={<OrderDataPage />} />
        <Route path="/payment" element={<ChoosePaymentPage />} />
      </Routes>
    </div>
  )
}

export default App
