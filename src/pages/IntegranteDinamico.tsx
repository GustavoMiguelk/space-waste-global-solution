import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Rodape from '../components/layout/Rodape'

interface Integrante {
  id: number
  nome: string
  rm: string
  turma: string
  papel: string
  foto: string
  github: string
  linkedin: string
  descricao: string
}

const integrantes: Integrante[] = [
  {
    id: 1,
    nome: 'Manuella Rinaldi',
    rm: 'RM567915',
    turma: '1TDSPH',
    papel: 'Java & Backend',
    foto: '/manuella.jpg',
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/in/',
    descricao: 'Responsável pelo desenvolvimento do backend em Java com Quarkus e integração com banco Oracle.',
  },
  {
    id: 2,
    nome: 'Gustavo Miguel Martins de Oliveira',
    rm: 'RM566666',
    turma: '1TDSPH',
    papel: 'Front-end',
    foto: '/gustavo.jpg',
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/in/',
    descricao: 'Responsável pelo desenvolvimento do frontend em React + Vite + TypeScript com integração à API.',
  },
  {
    id: 3,
    nome: 'Mariana de Paula Aguiar',
    rm: 'RM566850',
    turma: '1TDSPH',
    papel: 'Python & IA',
    foto: '/mariana.jpg',
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/in/',
    descricao: 'Responsável pelo módulo de inteligência artificial em Python/Flask para classificação de resíduos.',
  },
]

export default function IntegranteDinamico() {
  const { id } = useParams<{ id: string }>()
  const integrante = integrantes.find(i => i.id === Number(id))

  if (!integrante) return <Navigate to="/integrantes" replace />

  const outros = integrantes.filter(i => i.id !== integrante.id)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>

      <div className="mx-auto max-w-2xl px-4 pt-28 pb-16">
        <Link
          to="/integrantes"
          className="flex items-center gap-2 text-sm mb-8 transition hover:opacity-80"
          style={{ color: 'var(--color-text-muted)' }}
        >
          ← Voltar para integrantes
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border p-8 text-center mb-8"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        >
          <img
            src={integrante.foto}
            alt={integrante.nome}
            className="w-28 h-28 rounded-full object-cover mx-auto mb-6"
            style={{ border: '3px solid var(--color-primary)' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/112x112?text=Foto'
            }}
          />
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
            {integrante.nome}
          </h1>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-primary)' }}>
            {integrante.papel}
          </p>
          <p className="text-xs mb-6" style={{ color: 'var(--color-text-muted)' }}>
            {integrante.rm} · {integrante.turma}
          </p>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--color-text-muted)' }}>
            {integrante.descricao}
          </p>
          <div className="flex justify-center gap-4">
           <a href={integrante.github} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-[var(--color-border)] px-5 py-2.5 text-sm text-[var(--color-text)]">GitHub</a>
           <a href={integrante.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white bg-[var(--color-primary)]">LinkedIn</a>
            </div>
        </motion.div>
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-muted)' }}>
          OUTROS INTEGRANTES
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {outros.map((outro, i) => (
            <motion.div
                key={outro.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
            >
                <Link
                    to={`/integrantes/${outro.id}`}
                    className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition hover:opacity-80"
                    >
                    <img
                        src={outro.foto}
                        alt={outro.nome}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                        onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/40x40?text=Foto'
                        }}
                    />
                    <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
                        {outro.nome.split(' ')[0]}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--color-primary)' }}>
                        {outro.papel}
                        </p>
                    </div>
                    </Link>
            </motion.div>
            ))}
        </div>
      </div>
    </div>
  )
}