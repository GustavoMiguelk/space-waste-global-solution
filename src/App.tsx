import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { ReactNode } from 'react'
import PaginaInicial from './pages/PaginaInicial'
import DashboardUsuario from './pages/DashboardUsuario'

interface RotaProtegidaProps {
  children: ReactNode
}

function RotaProtegida({ children }: RotaProtegidaProps) {
  const { isAutenticado } = useAuth()
  return isAutenticado() ? children : <Navigate to="/" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PaginaInicial />} />
      <Route
        path="dashboard" element={<RotaProtegida><DashboardUsuario /></RotaProtegida>}
      />
      <Route
        path="/empresa"
        element={
          <RotaProtegida>
            <div className="text-white p-8">Dashboard da Empresa — em breve</div>
          </RotaProtegida>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App