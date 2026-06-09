import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Rodape from '../components/layout/Rodape'

export default function Contato() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
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
    </div>
  )
}
