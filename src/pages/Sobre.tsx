import { motion } from 'framer-motion'

const tecnologias = [
  { nome: 'React', emoji: '⚛️', desc: 'Interface moderna e componentizada' },
  { nome: 'TypeScript', emoji: '🔷', desc: 'Tipagem estática e segurança no código' },
  { nome: 'Vite', emoji: '⚡', desc: 'Build ultra-rápido para desenvolvimento' },
  { nome: 'Tailwind CSS', emoji: '🎨', desc: 'Estilização utilitária e responsiva' },
  { nome: 'Java + Quarkus', emoji: '☕', desc: 'Backend robusto e de alta performance' },
  { nome: 'Oracle Database', emoji: '🗄️', desc: 'Banco de dados relacional empresarial' },
  { nome: 'Leaflet', emoji: '🗺️', desc: 'Mapas interativos com geolocalização' },
  { nome: 'Framer Motion', emoji: '✨', desc: 'Animações fluidas e modernas' },
]

const objetivos = [
  'Combater o descarte irregular de resíduos urbanos',
  'Melhorar a eficiência da coleta seletiva',
  'Facilitar a comunicação entre cidadãos e empresas',
  'Gerar dashboards ambientais para análise de dados urbanos',
  'Auxiliar órgãos públicos na identificação de regiões críticas',
  'Incentivar práticas sustentáveis e conscientização ambiental',
  'Aplicar conceitos de cidades inteligentes através da tecnologia',
]

const estatisticas = [
  { valor: '90M', label: 'toneladas de lixo/ano no Brasil', fonte: 'Embrapa' },
  { valor: '4%', label: 'do lixo é reciclado no Brasil', fonte: 'Embrapa' },
  { valor: '41%', label: 'dos resíduos têm destinação irregular', fonte: 'Min. Meio Ambiente' },
]

export default function Sobre() {
  return (
    <div className="bg-[var(--color-bg)]">

      <section className="py-20 px-4 text-center border-b border-[var(--color-border)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-xs font-medium text-[var(--color-primary)]">
            🌍 Sobre o Projeto
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-6">
            SpaceWaste Solutions
          </h1>
          <p className="text-[var(--color-text-muted)] leading-relaxed text-lg">
            Uma startup de tecnologia sustentável criada para desenvolver soluções inteligentes
            para problemas urbanos e ambientais, utilizando tecnologias inspiradas no setor espacial.
          </p>
        </motion.div>
      </section>

      <section className="py-16 px-4 border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">
              Visão Geral
            </h2>
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-4">
                Nosso primeiro produto, o SpaceWaste, foi desenvolvido para auxiliar no gerenciamento
                sustentável de resíduos urbanos, promovendo maior eficiência na coleta seletiva e
                contribuindo para cidades mais inteligentes e organizadas.
              </p>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                A plataforma conecta cidadãos, empresas de reciclagem e órgãos públicos em um único
                ecossistema digital, permitindo monitoramento inteligente, otimização operacional e
                geração de métricas ambientais em tempo real.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4 border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">
              O Problema
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {estatisticas.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center"
                >
                  <p className="text-3xl font-bold text-[var(--color-primary)] mb-2">{stat.valor}</p>
                  <p className="text-sm text-[var(--color-text-muted)] mb-1">{stat.label}</p>
                  <p className="text-xs text-[var(--color-text-muted)]/60">Fonte: {stat.fonte}</p>
                </motion.div>
              ))}
            </div>
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-4">
                Muitas cidades enfrentam problemas relacionados ao descarte incorreto de resíduos,
                acúmulo de lixo em áreas urbanas e dificuldades na fiscalização ambiental.
              </p>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                O descarte inadequado contribui para a contaminação do solo e da água, aumento das
                enchentes urbanas, proliferação de doenças e crescimento da poluição nas cidades.
                A ausência de integração tecnológica entre população, empresas de coleta e órgãos
                públicos dificulta o gerenciamento eficiente das coletas.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4 border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">
              Objetivos do Projeto
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {objetivos.map((obj, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                >
                  <span className="text-[var(--color-primary)] mt-0.5 shrink-0">✓</span>
                  <p className="text-sm text-[var(--color-text-muted)]">{obj}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">
              Tecnologias Utilizadas
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {tecnologias.map((tec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex items-start gap-3"
                >
                  <span className="text-2xl shrink-0">{tec.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">{tec.nome}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{tec.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}