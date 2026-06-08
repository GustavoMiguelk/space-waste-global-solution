// src/components/modais/ModalAceitarColeta.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import ModalConfirmacao from './ModalConfirmacao'
import ModalErro from './ModalErro'

interface Descarte {
  idDescarte: number
  descricao: string
  pesoEstimado: number
  latitude: number
  longitude: number
  status: string
  dataDescarte: string
}

interface Props {
  descarte: Descarte
  onFechar: () => void
  onSucesso: () => void
}

export default function ModalAceitarColeta({ descarte, onFechar, onSucesso }: Props) {
  const { empresa } = useAuth()
  const [confirmando, setConfirmando] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erroMsg, setErroMsg] = useState('')
  const [modalErro, setModalErro] = useState(false)

  async function handleConfirmar() {
    if (!empresa) return
    try {
      setCarregando(true)
      // 1. Cria a coleta
      const novaColeta = await api.post('/coletas', {
        idEmpresa: empresa.idEmpresa,
        idDescarte: descarte.idDescarte,
      })
      // 2. Aceita a coleta
      await api.put(`/coletas/${novaColeta.idColeta}/aceitar`, {})
      onSucesso()
    } catch (err) {
      setErroMsg('Erro ao aceitar coleta. Tente novamente.')
      setModalErro(true)
      setConfirmando(false)
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
          className="w-full max-w-md rounded-2xl p-6 border shadow-2xl"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>
            Aceitar Coleta
          </h2>
          <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>
            Confirme os detalhes antes de aceitar este descarte.
          </p>

          {/* Detalhes do descarte */}
          <div
            className="rounded-xl p-4 border mb-6 space-y-2 text-sm"
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
          >
            <InfoRow label="Descrição" valor={descarte.descricao} />
            <InfoRow label="Peso estimado" valor={`${descarte.pesoEstimado} kg`} />
            <InfoRow
              label="Localização"
              valor={`${descarte.latitude.toFixed(5)}, ${descarte.longitude.toFixed(5)}`}
            />
            <InfoRow
              label="Data do descarte"
              valor={new Date(descarte.dataDescarte).toLocaleDateString('pt-BR')}
            />
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
              onClick={() => setConfirmando(true)}
              disabled={carregando}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--color-primary)', color: '#000' }}
            >
              {carregando ? 'Processando…' : 'Aceitar Coleta'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Confirmação */}
      {confirmando && (
        <ModalConfirmacao
          mensagem={`Deseja confirmar a coleta do descarte "${descarte.descricao}"?`}
          onConfirmar={handleConfirmar}
          onCancelar={() => setConfirmando(false)}
        />
      )}

      {/* Erro */}
      {modalErro && (
        <ModalErro mensagem={erroMsg} onFechar={() => setModalErro(false)} />
      )}
    </>
  )
}

// Componente auxiliar de linha de informação
function InfoRow({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span style={{ color: 'var(--color-text-muted)' }}>{label}:</span>
      <span className="font-medium text-right" style={{ color: 'var(--color-text)' }}>
        {valor}
      </span>
    </div>
  )
}