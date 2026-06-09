import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { ReactNode } from 'react'
import PaginaInicial from './pages/PaginaInicial'
import Sobre from './pages/Sobre'
import Integrantes from './pages/Integrantes'
import IntegranteDinamico from './pages/IntegranteDinamico'
import FAQ from './pages/FAQ'
import Contato from './pages/Contato'
import DashboardUsuario from './pages/DashboardUsuario'
import DashboardEmpresa from './pages/DashboardEmpresa'
import PaginaRelatorios from './pages/PaginaRelatorio'
import ConteudoPrincipal from './components/layout/ConteudoPrincipal'

interface RotaProtegidaProps {
  children: ReactNode
}

function RotaProtegida({ children }: RotaProtegidaProps) {
  const { isAutenticado } = useAuth()
  if (!isAutenticado()) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>

      <Route element={<ConteudoPrincipal />}>
        <Route path="/"                element={<PaginaInicial />} />
        <Route path="/sobre"           element={<Sobre />} />
        <Route path="/integrantes"     element={<Integrantes />} />
        <Route path="/integrantes/:id" element={<IntegranteDinamico />} />
        <Route path="/faq"             element={<FAQ />} />
        <Route path="/contato"         element={<Contato />} />
      </Route>

      <Route path="/dashboard"  element={<RotaProtegida><DashboardUsuario /></RotaProtegida>} />
      <Route path="/empresa"    element={<RotaProtegida><DashboardEmpresa /></RotaProtegida>} />
      <Route path="/relatorios" element={<RotaProtegida><PaginaRelatorios /></RotaProtegida>} />

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}