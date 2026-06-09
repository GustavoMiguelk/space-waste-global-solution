import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../services/api'

interface ResultadoIA {
  classificacaoIa?: string
  classificacao?: string
  confianca?: number
  modeloUtilizado?: string
}

interface ModalResultadoIAProps {
  aberto: boolean
  onFechar: () => void
  imagemUrl: string
  descricao: string
}

export default function ModalResultadoIA({ aberto, onFechar, imagemUrl, descricao }: ModalResultadoIAProps) {
  const [resultado, setResultado] = useState<ResultadoIA | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (aberto && descricao) {
      setCarregando(true)
      setResultado(null)
      setErro(null)

      api.post('/ia/classificar', { imagemUrl, descricao })
        .then((dados: ResultadoIA) => setResultado(dados))
        .catch(() => setErro('Não foi possível obter a classificação da IA.'))
        .finally(() => setCarregando(false))
    }
  }, [aberto])

  function confiancaCor(confianca: number): string {
    if (confianca >= 0.8) return 'text-green-400'
    if (confianca >= 0.5) return 'text-yellow-400'
    return 'text-red-400'
  }

  function confiancaBarra(confianca: number): string {
    if (confianca >= 0.8) return 'bg-green-400'
    if (confianca >= 0.5) return 'bg-yellow-400'
    return 'bg-red-400'
  }

  return (
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-xl">
                  🤖
                </div>
                <div>
                  <h2 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
                    Classificação por IA
                  </h2>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    Análise automática do resíduo
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

            {carregando && (
              <div className="flex flex-col items-center gap-4 py-8">
                <motion.div
                  className="w-12 h-12 rounded-full border-2 border-purple-400/30 border-t-purple-400"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Analisando resíduo...
                </p>
              </div>
            )}

            {erro && !carregando && (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <span className="text-3xl">⚠️</span>
                <p className="text-sm text-red-400">{erro}</p>
              </div>
            )}

            {resultado && !carregando && (
              <motion.div
                className="flex flex-col gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-2)' }}>
                  <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-muted)' }}>
                    Classificação
                  </p>
                  <p className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                    {resultado.classificacaoIa || resultado.classificacao || '—'}
                  </p>
                </div>

                {resultado.confianca != null && (
                  <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-2)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
                        Confiança
                      </p>
                      <p className={`text-sm font-bold ${confiancaCor(resultado.confianca)}`}>
                        {(resultado.confianca * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="h-2 w-full rounded-full" style={{ backgroundColor: 'var(--color-border)' }}>
                      <motion.div
                        className={`h-2 rounded-full ${confiancaBarra(resultado.confianca)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${resultado.confianca * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                )}

                {resultado.modeloUtilizado && (
                  <div className="flex items-center justify-between rounded-xl border px-4 py-3" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-2)' }}>
                    <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>Modelo</p>
                    <p className="text-sm" style={{ color: 'var(--color-text)' }}>{resultado.modeloUtilizado}</p>
                  </div>
                )}
              </motion.div>
            )}

            <button
              onClick={onFechar}
              className="mt-5 w-full rounded-xl border py-2.5 text-sm transition hover:opacity-80"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
            >
              Fechar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}