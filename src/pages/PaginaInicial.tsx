import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ModalLogin from '../components/modais/ModalLogin'
import ModalCadastro from '../components/modais/ModalCadastro'
import Navbar from '../components/layout/Navbar'
import Rodape from '../components/layout/Rodape'

export default function PaginaInicial() {
  const [loginAberto, setLoginAberto] = useState(false)
  const [cadastroAberto, setCadastroAberto] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">

    <Navbar
      acoes={
        <>
          <button
            onClick={() => setLoginAberto(true)}
            className="px-4 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition"
          >
            Entrar
          </button>
          <button
            onClick={() => setCadastroAberto(true)}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition"
          >
            Cadastrar
          </button>
        </>
      }
    />

      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-xs font-medium text-[var(--color-primary)]">
            🌱 Gestão Inteligente de Resíduos Urbanos
          </span>

          <h1 className="text-5xl md:text-6xl font-bold text-[var(--color-text)] leading-tight mb-6">
            Cidades mais limpas
            <span className="text-[var(--color-primary)]"> começam aqui</span>
          </h1>

          <p className="text-lg text-[var(--color-text-muted)] mb-10 max-w-xl mx-auto">
            O SpaceWaste conecta cidadãos, empresas de coleta e órgãos responsáveis
            em um ecossistema digital inteligente para combater o descarte irregular de resíduos.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl"
        >
          {[
            { valor: '12.4t', label: 'Resíduos coletados' },
            { valor: '1.2k',  label: 'Descartes registrados' },
            { valor: '340',   label: 'Empresas parceiras' },
            { valor: '98%',   label: 'Taxa de resolução' },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-center"
            >
              <p className="text-2xl font-bold text-[var(--color-primary)]">{item.valor}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">{item.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      <section id="solucao" className="py-24 px-4 border-t border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              Como o SpaceWaste funciona
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-xl mx-auto">
              Uma plataforma completa que conecta todas as partes do processo
              de gestão de resíduos urbanos.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icone: '📍',
                titulo: 'Registre o descarte',
                descricao: 'Cidadãos registram descartes irregulares com localização, foto e categoria do resíduo.',
              },
              {
                icone: '🔔',
                titulo: 'Empresa é notificada',
                descricao: 'Empresas parceiras visualizam os descartes disponíveis no mapa e aceitam as coletas em tempo real.',
              },
              {
                icone: '🚛',
                titulo: 'Empresa realiza a coleta',
                descricao: 'Empresas parceiras visualizam os descartes próximos e gerenciam as coletas em tempo real.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
              >
                <div className="text-3xl mb-4">{item.icone}</div>
                <h3 className="text-base font-semibold text-[var(--color-text)] mb-2">{item.titulo}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{item.descricao}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ModalLogin
        aberto={loginAberto}
        onFechar={() => setLoginAberto(false)}
        onAbrirCadastro={() => setCadastroAberto(true)}
      />
      <ModalCadastro
        aberto={cadastroAberto}
        onFechar={() => setCadastroAberto(false)}
        onAbrirLogin={() => setLoginAberto(true)}
      />
    </div>
  )
}
