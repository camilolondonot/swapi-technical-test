import { Routes, Route, Navigate } from 'react-router-dom'
import { Get, Album, Home } from '@/pages'

export default function AppRouter() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/get/:id" element={<Get />} />
      <Route path="/get" element={<Get />} />
      <Route path="/album" element={<Album />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
