import { motion, AnimatePresence } from 'framer-motion'

interface ModalConfirmacaoProps {
  aberto: boolean
  onFechar: () => void
  onConfirmar: () => void
  mensagem?: string
}

export default function ModalConfirmacao({ aberto, onFechar, onConfirmar, mensagem }: ModalConfirmacaoProps) {  return (
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500/10 text-2xl">
                ⚠️
              </div>

              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                Confirmar ação
              </h2>

              <p className="text-sm text-[var(--color-text-muted)]">
                {mensagem || 'Tem certeza que deseja continuar?'}
              </p>

              <div className="flex w-full gap-3 mt-2">
                <button
                  onClick={onFechar}
                  className="flex-1 rounded-xl border border-[var(--color-border)] bg-transparent py-2.5 text-sm text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-2)]"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => { onConfirmar(); onFechar() }}
                  className="flex-1 rounded-xl bg-[var(--color-primary)] py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}