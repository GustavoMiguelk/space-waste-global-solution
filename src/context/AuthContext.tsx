import { createContext, useContext, useState, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface Usuario {
  id: number
  nome: string
  email: string
  telefone?: string
}

interface Empresa {
  idEmpresa: number
  nomeFantasia: string
  cnpj: string
  email: string
  telefone?: string
  endereco?: string
  statusAtivo?: string
}

interface AuthContextType {
  usuario: Usuario | null
  empresa: Empresa | null
  loginUsuario: (dados: Usuario) => void
  loginEmpresa: (dados: Empresa) => void
  logout: () => void
  isAutenticado: () => boolean
  isEmpresa: () => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(
    JSON.parse(localStorage.getItem('spacewaste_usuario') || 'null')
  )
  const [empresa, setEmpresa] = useState<Empresa | null>(
    JSON.parse(localStorage.getItem('spacewaste_empresa') || 'null')
  )

  const navigate = useNavigate()

  function loginUsuario(dados: Usuario) {
    setUsuario(dados)
    localStorage.setItem('spacewaste_usuario', JSON.stringify(dados))
    navigate('/dashboard')
  }

  function loginEmpresa(dados: Empresa) {
    setEmpresa(dados)
    localStorage.setItem('spacewaste_empresa', JSON.stringify(dados))
    navigate('/empresa')
  }

  function logout() {
    setUsuario(null)
    setEmpresa(null)
    localStorage.removeItem('spacewaste_usuario')
    localStorage.removeItem('spacewaste_empresa')
    navigate('/')
  }

  function isAutenticado() {
    return usuario !== null || empresa !== null
  }

  function isEmpresa() {
    return empresa !== null
  }

  return (
    <AuthContext.Provider value={{
      usuario,
      empresa,
      loginUsuario,
      loginEmpresa,
      logout,
      isAutenticado,
      isEmpresa,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return context
}