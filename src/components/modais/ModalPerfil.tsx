import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import ModalErro from './ModalErro'

interface ModalPerfilProps {
  aberto: boolean
  onFechar: () => void
}

interface FormPerfil {
  nome: string
  email: string
  telefone: string
  senha: string
}

export default function ModalPerfil({ aberto, onFechar }: ModalPerfilProps) {
  const { usuario, loginUsuario } = useAuth()

  const [form, setForm] = useState<FormPerfil>({ nome: '', email: '', telefone: '', senha: '' })
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erroModal, setErroModal] = useState({ aberto: false, mensagem: '' })

  useEffect(() => {
    if (aberto && usuario) {
      setForm({
        nome: usuario.nome || '',
        email: usuario.email || '',
        telefone: usuario.telefone || '',
        senha: '',
      })
      setSucesso(false)
    }
  }, [aberto])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSalvar(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!form.nome || !form.email) {
      setErroModal({ aberto: true, mensagem: 'Nome e e-mail são obrigatórios.' })
      return
    }
    setSalvando(true)
    try {
      const payload: any = {
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
      }
      if (form.senha) payload.senha = form.senha

      const atualizado = await api.put(`/usuarios/${(usuario as any)?.idUsuario}`, payload)
      loginUsuario(atualizado || { ...usuario, ...payload })
      setSucesso(true)
      setTimeout(() => {
        setSucesso(false)
        onFechar()
      }, 1500)
    } catch {
      setErroModal({ aberto: true, mensagem: 'Não foi possível atualizar o perfil.' })
    } finally {
      setSalvando(false)
    }
  }

  const inputClass = `
    w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)]
    px-4 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)]
    focus:border-[var(--color-primary)] focus:outline-none transition
  `
  const labelClass = 'block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide'

  return (
    <>
      <AnimatePresence>
        {aberto && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onFechar} />

            <motion.div
              className="relative z-10 w-full max-w-md mx-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {/* Cabeçalho */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-xl">
                    👤
                  </div>
                  <div>
                    <h2 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
                      Meu Perfil
                    </h2>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      Editar dados da conta
                    </p>
                  </div>
                </div>
                <button
                  onClick={onFechar}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border transition hover:opacity-80"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
                >
                  ✕
                </button>
              </div>

              {/* Sucesso */}
              <AnimatePresence>
                {sucesso && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 flex items-center gap-2 rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm text-green-400"
                  >
                    ✓ Perfil atualizado com sucesso!
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSalvar} className="flex flex-col gap-4">
                <div>
                  <label className={labelClass}>Nome *</label>
                  <input type="text" name="nome" value={form.nome} onChange={handleChange} placeholder="Seu nome" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>E-mail *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Telefone</label>
                  <input type="text" name="telefone" value={form.telefone} onChange={handleChange} placeholder="(11) 99999-9999" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Nova senha</label>
                  <input type="password" name="senha" value={form.senha} onChange={handleChange} placeholder="Deixe em branco para manter" className={inputClass} />
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={onFechar}
                    className="flex-1 rounded-xl border py-2.5 text-sm transition hover:opacity-80"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={salvando}
                    className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {salvando ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ModalErro
        aberto={erroModal.aberto}
        mensagem={erroModal.mensagem}
        onFechar={() => setErroModal({ aberto: false, mensagem: '' })}
      />
    </>
  )
}