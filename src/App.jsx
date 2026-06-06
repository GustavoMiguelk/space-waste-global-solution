import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import PaginaInicial from './pages/PaginaInicial'

function RotaProtegida({ children }) {
  const { isAutenticado } = useAuth()
  return isAutenticado() ? children : <Navigate to="/" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PaginaInicial />} />
      <Route
        path="/dashboard"
        element={
          <RotaProtegida>
            <div className="text-white p-8">Dashboard do Usuário — em breve</div>
          </RotaProtegida>
        }
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