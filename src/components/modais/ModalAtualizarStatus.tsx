// src/components/modais/ModalAtualizarStatus.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../services/api'
import ModalErro from './ModalErro'

type StatusColeta = 'PENDENTE' | 'EM_COLETA' | 'CONCLUIDO'

interface Coleta {
  idColeta: number
  statusColeta: StatusColeta
}

interface Props {
  coleta: Coleta
  onFechar: () => void
  onSucesso: () => void
}

const STATUS_OPCOES: { valor: StatusColeta; label: string; cor: string; bg: string }[] = [
  { valor: 'PENDENTE',   label: 'Pendente',    cor: '#93c5fd', bg: '#1e3a5f' },
  { valor: 'EM_COLETA',  label: 'Em Coleta',   cor: '#fcd34d', bg: '#78350f' },
  { valor: 'CONCLUIDO',  label: 'Concluído',   cor: '#86efac', bg: '#14532d' },
]

export default function ModalAtualizarStatus({ coleta, onFechar, onSucesso }: Props) {
  const [statusSelecionado, setStatusSelecionado] = useState<StatusColeta>(coleta.statusColeta)
  const [carregando, setCarregando] = useState(false)
  const [erroMsg, setErroMsg] = useState('')
  const [modalErro, setModalErro] = useState(false)

  async function handleSalvar() {
    try {
      setCarregando(true)
      if (statusSelecionado === 'CONCLUIDO') {
        // Endpoint específico de conclusão
        await api.put(`/coletas/${coleta.idColeta}/concluir`, {})
      } else {
        // Atualização manual de status
        await api.put(`/coletas/${coleta.idColeta}/status`, { status: statusSelecionado })
      }
      onSucesso()
    } catch (err) {
      setErroMsg('Não foi possível atualizar o status. Tente novamente.')
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
          className="w-full max-w-sm rounded-2xl p-6 border shadow-2xl"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-secondary)' }}>
            Atualizar Status
          </h2>
          <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>
            Coleta #{coleta.idColeta}
          </p>

          {/* Opções de status */}
          <div className="space-y-3 mb-6">
            {STATUS_OPCOES.map((opcao) => {
              const ativo = statusSelecionado === opcao.valor
              return (
                <button
                  key={opcao.valor}
                  onClick={() => setStatusSelecionado(opcao.valor)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all"
                  style={{
                    borderColor: ativo ? opcao.cor : 'var(--color-border)',
                    background: ativo ? opcao.bg : 'var(--color-surface-2)',
                    color: ativo ? opcao.cor : 'var(--color-text-muted)',
                  }}
                >
                  <span
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{ borderColor: ativo ? opcao.cor : 'var(--color-border)' }}
                  >
                    {ativo && (
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: opcao.cor }}
                      />
                    )}
                  </span>
                  {opcao.label}
                </button>
              )
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onFechar}
              className="flex-1 py-2.5 rounded-xl text-sm border transition-colors hover:bg-white/5"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSalvar}
              disabled={carregando || statusSelecionado === coleta.statusColeta}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ background: 'var(--color-secondary)', color: '#fff' }}
            >
              {carregando ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </div>
      </motion.div>

      {modalErro && (
  <ModalErro
    aberto={modalErro}
    mensagem={erroMsg}
    onFechar={() => setModalErro(false)}
  />
)}
    </>
  )
}