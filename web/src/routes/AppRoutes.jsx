  import { BrowserRouter, Routes, Route } from 'react-router-dom'
  import Landing from '@/pages/Landing'
  import Login from '@/pages/Login'
  import Register from '@/pages/Register'
  import NotFound from '@/pages/NotFound'

  export default function AppRoutes() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    )
  }