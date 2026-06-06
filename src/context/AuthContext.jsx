import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem('spacewaste_usuario')) || null
  )
  const [empresa, setEmpresa] = useState(
    JSON.parse(localStorage.getItem('spacewaste_empresa')) || null
  )

  function loginUsuario(dados) {
    setUsuario(dados)
    localStorage.setItem('spacewaste_usuario', JSON.stringify(dados))
  }

  function loginEmpresa(dados) {
    setEmpresa(dados)
    localStorage.setItem('spacewaste_empresa', JSON.stringify(dados))
  }

  function logout() {
    setUsuario(null)
    setEmpresa(null)
    localStorage.removeItem('spacewaste_usuario')
    localStorage.removeItem('spacewaste_empresa')
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
  return useContext(AuthContext)
}