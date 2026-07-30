import { useLocation } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import CustomerLayout from './components/CustomerLayout'

export default function App({ children }) {
  const loc = useLocation()
  const isAdmin = loc.pathname.startsWith('/admin')

  if (isAdmin) {
    return <AdminLayout>{children}</AdminLayout>
  }
  return <CustomerLayout>{children}</CustomerLayout>
}
