import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import ModalErro from './ModalErro'

interface ModalLoginProps {
  aberto: boolean
  onFechar: () => void
  onAbrirCadastro: () => void
}

export default function ModalLogin({ aberto, onFechar, onAbrirCadastro }: ModalLoginProps) {
  const { loginUsuario, loginEmpresa } = useAuth()

  const [tipo, setTipo] = useState('usuario')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState({ aberto: false, mensagem: '' })

    function abrirErro(mensagem: string) {
    setErro({ aberto: true, mensagem })
  }

  async function handleLogin(e: React.SyntheticEvent) {
    e.preventDefault()

    if (!email || !senha) {
      abrirErro('Preencha todos os campos.')
      return
    }

    setCarregando(true)
    try {
      const endpoint = tipo === 'usuario' ? '/usuarios' : '/empresas'
      const dados = await api.get(endpoint)

      const encontrado = dados.find(
        (item: any) => item.email === email && item.senha === senha
      )

      if (!encontrado) {
        abrirErro('E-mail ou senha incorretos.')
        return
      }

      tipo === 'usuario' ? loginUsuario(encontrado) : loginEmpresa(encontrado)
      onFechar()
    } catch {
      abrirErro('Erro ao conectar com o servidor.')
    } finally {
      setCarregando(false)
    }
  }

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
              className="relative z-10 w-full max-w-md mx-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="mb-6 flex flex-col items-center gap-2">
                <img src="/logo.png" alt="SpaceWaste" className="h-30" />
                <p className="text-sm text-[var(--color-text-muted)]">
                  Acesse sua conta
                </p>
              </div>

              <div className="mb-6 flex rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-1">
                {['usuario', 'empresa'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTipo(t)}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                      tipo === t
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    {t === 'usuario' ? 'Cidadão' : 'Empresa'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-[var(--color-text-muted)]">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-primary)] transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm text-[var(--color-text-muted)]">Senha</label>
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••••••"
                    className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-primary)] transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={carregando}
                  className="mt-2 rounded-xl bg-[var(--color-primary)] py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
                >
                  {carregando ? 'Entrando...' : 'Entrar'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
                Não tem conta?{' '}
                <button
                  onClick={() => { onFechar(); onAbrirCadastro() }}
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Cadastre-se
                </button>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ModalErro
        aberto={erro.aberto}
        onFechar={() => setErro({ aberto: false, mensagem: '' })}
        mensagem={erro.mensagem}
      />
    </>
  )
}