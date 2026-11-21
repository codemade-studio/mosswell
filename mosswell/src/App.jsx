import { Routes, Route } from 'react-router'
import Layout from './components/Layout.jsx'
import Overview from './pages/Overview.jsx'
import Customers from './pages/Customers.jsx'
import Orders from './pages/Orders.jsx'
import Settings from './pages/Settings.jsx'
import Login from './pages/Login.jsx'
import Placeholder from './pages/Placeholder.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route index element={<Overview />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="products" element={<Placeholder title="Products" />} />
        <Route path="reports" element={<Placeholder title="Reports" />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Placeholder title="Page not found" />} />
      </Route>
    </Routes>
  )
}
