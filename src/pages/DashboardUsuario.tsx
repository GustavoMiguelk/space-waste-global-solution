import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

interface ModalState {
  logout: boolean
}

export default function DashboardUsuario() {
  const { usuario, logout } = useAuth()
  const [modais, setModais] = useState<ModalState>({ logout: false })

  function abrirModal(modal: keyof ModalState) {
    setModais(prev => ({ ...prev, [modal]: true }))
  }

  function fecharModal(modal: keyof ModalState) {
    setModais(prev => ({ ...prev, [modal]: false }))
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>

      <nav
        className="sticky top-0 z-40 border-b"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3">

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-lg">
              
            </div>
            <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
              SpaceWaste
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              <span>👤</span>
              <span className="hidden sm:inline">{usuario?.nome?.split(' ')[0]}</span>
            </div>

            <button
              onClick={() => abrirModal('logout')}
              className="flex h-9 w-9 items-center justify-center rounded-lg border transition hover:opacity-80"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
              title="Sair"
            >
              ⏻
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
            Olá, {usuario?.nome?.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Gerencie seus descartes e acompanhe as coletas
          </p>
        </motion.div>
      </div>

      {modais.logout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div
            className="rounded-2xl border p-6 w-80"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <p className="text-sm mb-4" style={{ color: 'var(--color-text)' }}>
              Tem certeza que deseja sair?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => fecharModal('logout')}
                className="flex-1 rounded-xl border py-2 text-sm"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
              >
                Cancelar
              </button>
              <button
                onClick={logout}
                className="flex-1 rounded-xl py-2 text-sm font-semibold text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}