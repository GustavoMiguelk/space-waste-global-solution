import { useState } from 'react'
import { motion } from 'framer-motion'
import ModalLogin from '../components/modais/ModalLogin'
import ModalCadastro from '../components/modais/ModalCadastro'
import logo from '../assets/logo.png'

export default function PaginaInicial() {
  const [loginAberto, setLoginAberto] = useState(false)
  const [cadastroAberto, setCadastroAberto] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img src={logo} alt="SpaceWaste" className="h-10" />
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-[var(--color-text-muted)]">
          <a href="#solucao" className="hover:text-[var(--color-primary)] transition">Solução</a>
          <a href="#sobre" className="hover:text-[var(--color-primary)] transition">Sobre</a>
          <a href="#integrantes" className="hover:text-[var(--color-primary)] transition">Integrantes</a>
          <a href="#faq" className="hover:text-[var(--color-primary)] transition">FAQ</a>
          <a href="#contato" className="hover:text-[var(--color-primary)] transition">Contato</a>
        </div>

        <div className="flex items-center gap-3">
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
        </div>
      </nav>

      {/* HERO */}
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

          <div className="flex items-center gap-3">
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
</div>
        </motion.div>

        {/* Métricas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl"
        >
          {[
            { valor: '12.4t', label: 'Resíduos coletados' },
            { valor: '1.2k', label: 'Descartes registrados' },
            { valor: '340', label: 'Empresas parceiras' },
            { valor: '98%', label: 'Taxa de resolução' },
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

      {/* SOLUÇÃO */}
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
                icone: '🤖',
                titulo: 'IA classifica o resíduo',
                descricao: 'Nossa inteligência artificial identifica automaticamente o tipo de material e sugere o descarte correto.',
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

      {/* SOBRE */}
      <section id="sobre" className="py-24 px-4 border-t border-[var(--color-border)]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-6">
              Sobre o projeto
            </h2>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              O SpaceWaste é um projeto acadêmico desenvolvido na FIAP que une tecnologia,
              sustentabilidade e inovação. Inspirado em tecnologias do setor espacial como
              rastreamento geográfico e análise de dados em tempo real, a plataforma traz
              o conceito de cidades inteligentes para a gestão de resíduos urbanos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* INTEGRANTES */}
      <section id="integrantes" className="py-24 px-4 border-t border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              Integrantes
            </h2>
            <p className="text-[var(--color-text-muted)]">Time responsável pelo desenvolvimento.</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { nome: 'Integrante 1', rm: 'RM000000', papel: 'Java & Backend' },
              { nome: 'Integrante 2', rm: 'RM000000', papel: 'Front-end' },
              { nome: 'Integrante 3', rm: 'RM000000', papel: 'Python & IA' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-[var(--color-secondary)]/20 flex items-center justify-center text-2xl mx-auto mb-4">
                  👤
                </div>
                <p className="font-semibold text-[var(--color-text)]">{item.nome}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{item.rm}</p>
                <p className="text-xs text-[var(--color-primary)] mt-1">{item.papel}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 border-t border-[var(--color-border)]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              Perguntas frequentes
            </h2>
          </motion.div>

          <div className="flex flex-col gap-4">
            {[
              {
                pergunta: 'Como faço para registrar um descarte?',
                resposta: 'Após criar sua conta como cidadão, acesse o Dashboard e clique em "Registrar Descarte". Informe a localização, categoria e foto do resíduo.',
              },
              {
                pergunta: 'Como uma empresa pode participar?',
                resposta: 'Empresas e cooperativas podem se cadastrar e visualizar os descartes disponíveis próximos à sua área de atuação.',
              },
              {
                pergunta: 'A classificação por IA é automática?',
                resposta: 'Sim. Ao enviar a foto do resíduo, nossa IA analisa a imagem e sugere automaticamente a categoria correta do material.',
              },
              {
                pergunta: 'O sistema é gratuito?',
                resposta: 'Sim, o SpaceWaste é uma plataforma acadêmica de acesso livre desenvolvida na FIAP.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
              >
                <p className="font-semibold text-[var(--color-text)] mb-2">{item.pergunta}</p>
                <p className="text-sm text-[var(--color-text-muted)]">{item.resposta}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="py-24 px-4 border-t border-[var(--color-border)]">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
              Contato
            </h2>
            <p className="text-[var(--color-text-muted)] mb-8">
              Dúvidas ou sugestões? Entre em contato com a equipe SpaceWaste.
            </p>
            
              <a  href="mailto:contato@spacewaste.com"
  className="inline-block px-8 py-3.5 rounded-xl bg-[var(--color-primary)] text-white font-semibold text-sm hover:bg-[var(--color-primary-dark)] transition">
    contato@spacewaste.com
  </a>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 border-t border-[var(--color-border)] text-center text-sm text-[var(--color-text-muted)]">
        © 2026 SpaceWaste — FIAP. Todos os direitos reservados.
      </footer>

      {/* MODAIS */}
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