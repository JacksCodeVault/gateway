import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  // Replace this with your actual auth logic
  const isAuthenticated = localStorage.getItem('token')

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
