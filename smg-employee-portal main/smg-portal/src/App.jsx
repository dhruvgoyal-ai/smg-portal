import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'

import LoginPage             from './pages/LoginPage'
import AdminDashboard        from './pages/AdminDashboard'
import CustomerDashboard     from './pages/CustomerDashboard'
import PartnerDashboard      from './pages/PartnerDashboard'
import ShipmentTrackingPage  from './pages/ShipmentTrackingPage'
import ShipmentsPage         from './pages/ShipmentsPage'
import CustomersPage         from './pages/CustomersPage'
import PartnersPage          from './pages/PartnersPage'
import NotFound              from './pages/NotFound'
import AnalyticsPage         from './pages/AnalyticsPage'

// Guard: redirect to login if unauthenticated
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user?.role)) return <Navigate to="/unauthorized" replace />
  return children
}

// Root redirect based on role
const RoleRedirect = () => {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  const roleMap = { admin: '/admin', customer: '/customer', partner: '/partner' }
  return <Navigate to={roleMap[user?.role] || '/login'} replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"        element={<RoleRedirect />} />
          <Route path="/login"   element={<LoginPage />} />

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/shipments" element={
            <ProtectedRoute roles={['admin']}>
              <ShipmentsPage role="admin" />
            </ProtectedRoute>
          } />
          <Route path="/admin/customers" element={
            <ProtectedRoute roles={['admin']}>
              <CustomersPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/partners" element={
            <ProtectedRoute roles={['admin']}>
              <PartnersPage />
            </ProtectedRoute>
          } />
         <Route path="/admin/analytics" element={
          <ProtectedRoute roles={['admin']}>
            <AnalyticsPage />
           </ProtectedRoute>
         } />

          {/* Customer */}
          <Route path="/customer" element={
            <ProtectedRoute roles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/customer/shipments" element={
            <ProtectedRoute roles={['customer']}>
              <ShipmentsPage role="customer" />
            </ProtectedRoute>
          } />

          {/* Partner */}
          <Route path="/partner" element={
            <ProtectedRoute roles={['partner']}>
              <PartnerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/partner/shipments" element={
            <ProtectedRoute roles={['partner']}>
              <ShipmentsPage role="partner" />
            </ProtectedRoute>
          } />

          {/* Tracking — public */}
          <Route path="/track"    element={<ShipmentTrackingPage />} />
          <Route path="/track/:trackingNo" element={<ShipmentTrackingPage />} />

          <Route path="/unauthorized" element={
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-brand mb-2">Access Denied</h1>
                <p className="text-slate-500">You don't have permission to view this page.</p>
              </div>
            </div>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
