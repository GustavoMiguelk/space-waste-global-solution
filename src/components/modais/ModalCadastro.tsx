import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../services/api'
import ModalErro from './ModalErro'

interface ModalCadastroProps {
  aberto: boolean
  onFechar: () => void
  onAbrirLogin: () => void
}

export default function ModalCadastro({ aberto, onFechar, onAbrirLogin }: ModalCadastroProps) {  const [tipo, setTipo] = useState('usuario')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState({ aberto: false, mensagem: '' })

  const [formUsuario, setFormUsuario] = useState({
    nome: '', email: '', senha: '', telefone: '',
  })

  const [formEmpresa, setFormEmpresa] = useState({
    nomeFantasia: '', cnpj: '', email: '',
    senha: '', telefone: '', endereco: '',
  })

   function abrirErro(mensagem: string) {
    setErro({ aberto: true, mensagem })
  }

  async function handleCadastro(e: React.SyntheticEvent) {
    e.preventDefault()
    setCarregando(true)

    try {
      if (tipo === 'usuario') {
        const { nome, email, senha, telefone } = formUsuario
        if (!nome || !email || !senha || !telefone) {
          abrirErro('Preencha todos os campos.')
          return
        }
        await api.post('/usuarios', formUsuario)
      } else {
        const { nomeFantasia, cnpj, email, senha, telefone, endereco } = formEmpresa
        if (!nomeFantasia || !cnpj || !email || !senha || !telefone || !endereco) {
          abrirErro('Preencha todos os campos.')
          return
        }
        await api.post('/empresas', { ...formEmpresa, statusAtivo: 'A' })
      }

      onFechar()
      onAbrirLogin()
    } catch {
      abrirErro('Erro ao realizar cadastro. Verifique os dados e tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  const inputClass = "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-primary)] transition"
  const labelClass = "text-sm text-[var(--color-text-muted)]"

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
              className="relative z-10 w-full max-w-md mx-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="mb-6 flex flex-col items-center gap-1">
                <img src="../public/logo.png" alt="SpaceWaste" className="h-30" />
                <p className="text-sm text-[var(--color-text-muted)]">
                  Crie sua conta
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

              <form onSubmit={handleCadastro} className="flex flex-col gap-4">
                {tipo === 'usuario' ? (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Nome completo</label>
                      <input type="text" value={formUsuario.nome} onChange={(e) => setFormUsuario({ ...formUsuario, nome: e.target.value })} placeholder="Seu nome" className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>E-mail</label>
                      <input type="email" value={formUsuario.email} onChange={(e) => setFormUsuario({ ...formUsuario, email: e.target.value })} placeholder="seu@email.com" className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Telefone</label>
                      <input type="text" value={formUsuario.telefone} onChange={(e) => setFormUsuario({ ...formUsuario, telefone: e.target.value })} placeholder="(11) 99999-9999" className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Senha</label>
                      <input type="password" value={formUsuario.senha} onChange={(e) => setFormUsuario({ ...formUsuario, senha: e.target.value })} placeholder="••••••••" className={inputClass} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Nome fantasia</label>
                      <input type="text" value={formEmpresa.nomeFantasia} onChange={(e) => setFormEmpresa({ ...formEmpresa, nomeFantasia: e.target.value })} placeholder="Nome da empresa" className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>CNPJ</label>
                      <input type="text" value={formEmpresa.cnpj} onChange={(e) => setFormEmpresa({ ...formEmpresa, cnpj: e.target.value })} placeholder="00.000.000/0000-00" className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>E-mail</label>
                      <input type="email" value={formEmpresa.email} onChange={(e) => setFormEmpresa({ ...formEmpresa, email: e.target.value })} placeholder="contato@empresa.com" className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Telefone</label>
                      <input type="text" value={formEmpresa.telefone} onChange={(e) => setFormEmpresa({ ...formEmpresa, telefone: e.target.value })} placeholder="(11) 99999-9999" className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Endereço</label>
                      <input type="text" value={formEmpresa.endereco} onChange={(e) => setFormEmpresa({ ...formEmpresa, endereco: e.target.value })} placeholder="Rua, número, cidade" className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Senha</label>
                      <input type="password" value={formEmpresa.senha} onChange={(e) => setFormEmpresa({ ...formEmpresa, senha: e.target.value })} placeholder="••••••••" className={inputClass} />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={carregando}
                  className="mt-2 rounded-xl bg-[var(--color-primary)] py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
                >
                  {carregando ? 'Cadastrando...' : 'Criar conta'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
                Já tem conta?{' '}
                <button
                  onClick={() => { onFechar(); onAbrirLogin() }}
                  className="text-[var(--color-primary)] hover:underline"
                >
                  Entrar
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