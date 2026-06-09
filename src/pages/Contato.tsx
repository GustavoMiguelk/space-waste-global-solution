import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Contato() {
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
          <Link to="/faq"         className="hover:text-[var(--color-primary)] transition">FAQ</Link>
          <Link to="/contato"     className="text-[var(--color-primary)] font-semibold transition">Contato</Link>
        </div>
      </nav>

      {/* CONTEÚDO — mesmo da seção #contato da home */}
      <section className="py-24 px-4 pt-40">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              Contato
            </h1>
            <p className="text-[var(--color-text-muted)] mb-8">
              Dúvidas ou sugestões? Entre em contato com a equipe SpaceWaste.
            </p>
            <a
              href="mailto:contato@spacewaste.com"
              className="inline-block px-8 py-3.5 rounded-xl bg-[var(--color-primary)] text-white font-semibold text-sm hover:bg-[var(--color-primary-dark)] transition"
            >
              contato@spacewaste.com
            </a>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 border-t border-[var(--color-border)] text-center text-sm text-[var(--color-text-muted)]">
        © 2026 SpaceWaste — FIAP. Todos os direitos reservados.
      </footer>

    </div>
  )
}
