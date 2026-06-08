// src/components/modais/ModalPerfil.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import ModalErro from './ModalErro'

interface Props {
  onFechar: () => void
}

export default function ModalPerfil({ onFechar }: Props) {
  const { empresa, loginEmpresa } = useAuth()

  const [form, setForm] = useState({
    nomeFantasia: empresa?.nomeFantasia ?? '',
    cnpj:         empresa?.cnpj ?? '',
    email:        empresa?.email ?? '',
    telefone:     empresa?.telefone ?? '',
    endereco:     empresa?.endereco ?? '',
    senha:        '',
    statusAtivo:  empresa?.statusAtivo ?? 'A',
  })

  const [carregando, setCarregando] = useState(false)
  const [erroMsg, setErroMsg]       = useState('')
  const [modalErro, setModalErro]   = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSalvar() {
    if (!empresa) return
    try {
      setCarregando(true)
      const payload: Record<string, string> = {
        nomeFantasia: form.nomeFantasia,
        cnpj:         form.cnpj,
        email:        form.email,
        telefone:     form.telefone,
        endereco:     form.endereco,
        statusAtivo:  form.statusAtivo,
      }
      // Inclui senha apenas se preenchida
      if (form.senha.trim()) payload.senha = form.senha

      const atualizado = await api.put(`/empresas/${empresa.idEmpresa}`, payload)
      // Atualiza o contexto com os dados novos
      loginEmpresa({ ...empresa, ...atualizado })
      onFechar()
    } catch (err) {
      setErroMsg('Não foi possível atualizar os dados. Tente novamente.')
      setModalErro(true)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onFechar}
      />

      {/* Modal */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div
          className="w-full max-w-lg rounded-2xl p-6 border shadow-2xl overflow-y-auto max-h-[90vh]"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>
            Perfil da Empresa
          </h2>
          <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>
            Edite os dados da sua empresa.
          </p>

          <div className="space-y-4">
            <Campo label="Nome Fantasia" name="nomeFantasia" value={form.nomeFantasia} onChange={handleChange} />
            <Campo label="CNPJ"          name="cnpj"         value={form.cnpj}         onChange={handleChange} />
            <Campo label="Email"         name="email"        value={form.email}        onChange={handleChange} type="email" />
            <Campo label="Telefone"      name="telefone"     value={form.telefone}     onChange={handleChange} />
            <Campo label="Endereço"      name="endereco"     value={form.endereco}     onChange={handleChange} />
            <Campo label="Nova Senha"    name="senha"        value={form.senha}        onChange={handleChange} type="password" placeholder="Deixe em branco para não alterar" />

            {/* Status Ativo */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
                Status
              </label>
              <select
                name="statusAtivo"
                value={form.statusAtivo}
                onChange={handleChange}
                className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none focus:ring-1"
                style={{
                  background: 'var(--color-surface-2)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <option value="A">Ativa</option>
                <option value="I">Inativa</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onFechar}
              className="flex-1 py-2.5 rounded-xl text-sm border transition-colors hover:bg-white/5"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSalvar}
              disabled={carregando}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--color-primary)', color: '#000' }}
            >
              {carregando ? 'Salvando…' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </motion.div>

      {modalErro && (
        <ModalErro mensagem={erroMsg} onFechar={() => setModalErro(false)} />
      )}
    </>
  )
}

// Componente de campo reutilizável
function Campo({
  label, name, value, onChange, type = 'text', placeholder,
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none focus:ring-1"
        style={{
          background: 'var(--color-surface-2)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text)',
        }}
      />
    </div>
  )
}