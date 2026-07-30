import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import App from './App'
import OrderMenu from './pages/order/OrderMenu'
import Receipt from './pages/order/Receipt'
import MasterProduct from './pages/admin/MasterProduct'
import MasterCustomer from './pages/admin/MasterCustomer'
import ListOrders from './pages/admin/ListOrders'
import Dashboard from './pages/admin/Dashboard'
import PwaInstallPrompt from './components/PwaInstallPrompt'
import './index.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App>
          <Routes>
            <Route path="/" element={<Navigate to="/order" replace />} />
            <Route path="/order" element={<OrderMenu />} />
            <Route path="/receipt" element={<Receipt />} />
            <Route path="/admin/products" element={<MasterProduct />} />
            <Route path="/admin/customers" element={<MasterCustomer />} />
            <Route path="/admin/orders" element={<ListOrders />} />
            <Route path="/admin" element={<Dashboard />} />
          </Routes>
          <PwaInstallPrompt />
        </App>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
)
