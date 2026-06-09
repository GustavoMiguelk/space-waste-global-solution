import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const perguntas = [
  {
    id: 1,
    pergunta: 'Como faço para registrar um descarte?',
    resposta: 'Após criar sua conta como cidadão, acesse o Dashboard e clique em "Registrar Descarte". Informe a localização, categoria e foto do resíduo.',
  },
  {
    id: 2,
    pergunta: 'Como uma empresa pode participar?',
    resposta: 'Empresas e cooperativas podem se cadastrar e visualizar os descartes disponíveis próximos à sua área de atuação.',
  },
  {
    id: 3,
    pergunta: 'A classificação por IA é automática?',
    resposta: 'Sim. Ao enviar a foto do resíduo, nossa IA analisa a imagem e sugere automaticamente a categoria correta do material.',
  },
  {
    id: 4,
    pergunta: 'O sistema é gratuito?',
    resposta: 'Sim, o SpaceWaste é uma plataforma acadêmica de acesso livre desenvolvida na FIAP.',
  },
]

export default function FAQ() {
  // controla qual pergunta está aberta (null = nenhuma)
  const [aberta, setAberta] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-40 h-27 flex items-center justify-between px-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md">
        <Link to="/">
          <img src="/logo.png" alt="SpaceWaste" className="h-35 w-auto object-contain" />
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-[var(--color-text-muted)]">
          <Link to="/"            className="hover:text-[var(--color-primary)] transition">Início</Link>
          <Link to="/sobre"       className="hover:text-[var(--color-primary)] transition">Sobre</Link>
          <Link to="/integrantes" className="hover:text-[var(--color-primary)] transition">Integrantes</Link>
          <Link to="/faq"         className="text-[var(--color-primary)] font-semibold transition">FAQ</Link>
          <a href="/#contato"     className="hover:text-[var(--color-primary)] transition">Contato</a>
        </div>
      </nav>

      {/* CONTEÚDO */}
      <section className="py-24 px-4 pt-40">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              Perguntas frequentes
            </h1>
          </motion.div>

          <div className="flex flex-col gap-4">
            {perguntas.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden"
              >
                {/* cabeçalho clicável — abre/fecha a resposta */}
                <button
                  onClick={() => setAberta(aberta === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-[var(--color-surface-2)] transition"
                >
                  <span className="font-semibold text-[var(--color-text)] text-sm">{item.pergunta}</span>
                  <span className={`text-[var(--color-primary)] transition-transform flex-shrink-0 ${aberta === item.id ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {/* resposta com animação de abrir/fechar */}
                <AnimatePresence initial={false}>
                  {aberta === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-4">
                        {item.resposta}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 border-t border-[var(--color-border)] text-center text-sm text-[var(--color-text-muted)]">
        © 2026 SpaceWaste — FIAP. Todos os direitos reservados.
      </footer>

    </div>
  )
}
