// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { ReactNode } from 'react'
import PaginaInicial      from './pages/PaginaInicial'
import DashboardUsuario   from './pages/DashboardUsuario'
import DashboardEmpresa   from './pages/DashboardEmpresa'
import PaginaRelatorios   from './pages/PaginaRelatorio'

interface RotaProtegidaProps {
  children: ReactNode
}

function RotaProtegida({ children }: RotaProtegidaProps) {
  const { isAutenticado } = useAuth()
  return isAutenticado() ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<PaginaInicial />} />
        <Route
          path="/dashboard"
          element={<RotaProtegida><DashboardUsuario /></RotaProtegida>}
        />
        <Route
          path="/empresa"
          element={<RotaProtegida><DashboardEmpresa /></RotaProtegida>}
        />
        <Route
          path="/relatorios"
          element={<RotaProtegida><PaginaRelatorios /></RotaProtegida>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

  )
}