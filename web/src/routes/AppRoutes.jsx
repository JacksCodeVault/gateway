  import { BrowserRouter, Routes, Route } from 'react-router-dom'
  import Landing from '@/pages/Landing'
  import Login from '@/pages/Login'
  import Register from '@/pages/Register'
  import Dashboard from '@/pages/Dashboard'
  import ContactList from '@/components/contacts/ContactList'
  import UserSettings from '@/components/settings/UserSettings'
  import ConnectedDevices from '@/components/devices/ConnectedDevices'
  import NotFound from '@/pages/NotFound'
  import ProtectedRoute from '@/components/ProtectedRoute'
  import DashboardLayout from '@/components/layouts/DashboardLayout'

  export default function AppRoutes() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/contacts" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ContactList />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/devices" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ConnectedDevices />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/settings" element={
            <ProtectedRoute>
              <DashboardLayout>
                <UserSettings />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    )
  }