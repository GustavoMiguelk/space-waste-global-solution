import { motion, AnimatePresence } from 'framer-motion'

export default function ModalErro({ aberto, onFechar, mensagem }) {
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
            className="relative z-10 w-full max-w-md mx-4 rounded-2xl border border-red-500/20 bg-[var(--color-surface)] p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-2xl">
                ✕
              </div>

              <h2 className="text-lg font-semibold text-red-400">
                Ocorreu um erro
              </h2>

              <p className="text-sm text-[var(--color-text-muted)]">
                {mensagem || 'Algo deu errado. Tente novamente.'}
              </p>

              <button
                onClick={onFechar}
                className="w-full rounded-xl bg-red-500/10 border border-red-500/20 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}