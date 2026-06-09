import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Rodape from '../components/layout/Rodape'

export default function Integrantes() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">

      <section className="py-24 px-4 pt-40">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              Integrantes
            </h1>
            <p className="text-[var(--color-text-muted)]">Time responsável pelo desenvolvimento.</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { id: 1, nome: 'Manuella Rinaldi',                   rm: 'RM567915', turma: '1TDSPH', papel: 'Java & Backend', foto: '/manuella.jpg', github: 'https://github.com/', linkedin: 'https://linkedin.com/in/' },
              { id: 2, nome: 'Gustavo Miguel Martins de Oliveira', rm: 'RM566666', turma: '1TDSPH', papel: 'Front-end',      foto: '/gustavo.jpg',  github: 'https://github.com/', linkedin: 'https://linkedin.com/in/' },
              { id: 3, nome: 'Mariana de Paula Aguiar',            rm: 'RM566850', turma: '1TDSPH', papel: 'Python & IA',   foto: '/mariana.jpg',  github: 'https://github.com/', linkedin: 'https://linkedin.com/in/' },
            ].map((item, i) => (
            <Link to={`/integrantes/${item.id}`} key={i}>
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center"
              >
                <img
                  src={item.foto}
                  alt={item.nome}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                  style={{ border: '2px solid var(--color-primary)' }}
                />
                <p className="font-semibold text-[var(--color-text)]">{item.nome}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{item.rm}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{item.turma}</p>
                <p className="text-xs text-[var(--color-primary)] mt-1">{item.papel}</p>

                <div className="flex justify-center gap-3 mt-4">
                  <a
                    href={item.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition"
                  >
                    GitHub
                  </a>
                  <a
                    href={item.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition"
                  >
                    LinkedIn
                  </a>
                </div>
              </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
