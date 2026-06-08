// src/pages/PaginaRelatorios.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface Categoria  { idCategoria: number; nomeCategoria: string }
interface Descarte   { idDescarte: number; idCategoria: number; status: string; latitude: number; longitude: number }
interface Coleta     { idColeta: number; idEmpresa: number; statusColeta: string }
interface Empresa    { idEmpresa: number; nomeFantasia: string }
// ─────────────────────────────────────────────────────────────────────────────

// Paleta de cores para os gráficos
const CORES = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316']

export default function PaginaRelatorios() {
  const { empresa, usuario } = useAuth()
  const navigate = useNavigate()

  const [categorias,  setCategorias]  = useState<Categoria[]>([])
  const [descartes,   setDescartes]   = useState<Descarte[]>([])
  const [coletas,     setColetas]     = useState<Coleta[]>([])
  const [empresas,    setEmpresas]    = useState<Empresa[]>([])
  const [carregando,  setCarregando]  = useState(true)

  // Protege a rota
  useEffect(() => {
    if (!empresa && !usuario) navigate('/')
  }, [empresa, usuario, navigate])

  useEffect(() => {
    async function carregar() {
      try {
        const [cat, des, col, emp] = await Promise.all([
          api.get('/categorias'),
          api.get('/descartes'),
          api.get('/coletas'),
          api.get('/empresas'),
        ])
        setCategorias(cat ?? [])
        setDescartes(des ?? [])
        setColetas(col ?? [])
        setEmpresas(emp ?? [])
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  // ── Dados derivados ────────────────────────────────────────────────────────

  // 1. Resíduos por categoria
  const porCategoria = categorias.map((cat) => ({
    nome: cat.nomeCategoria,
    total: descartes.filter((d) => d.idCategoria === cat.idCategoria).length,
  })).sort((a, b) => b.total - a.total)

  // 2. Coletas por status
  const porStatus = [
    { label: 'Pendente',   valor: coletas.filter((c) => c.statusColeta === 'PENDENTE').length,  cor: '#3b82f6' },
    { label: 'Em Coleta',  valor: coletas.filter((c) => c.statusColeta === 'EM_COLETA').length, cor: '#f59e0b' },
    { label: 'Concluído',  valor: coletas.filter((c) => c.statusColeta === 'CONCLUIDO').length, cor: '#22c55e' },
  ]

  // 3. Ranking de empresas
  const rankingEmpresas = empresas
    .map((emp) => ({
      nome: emp.nomeFantasia,
      total: coletas.filter((c) => c.idEmpresa === emp.idEmpresa).length,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  const maxBarras = Math.max(...porCategoria.map((c) => c.total), 1)
  const maxRanking = Math.max(...rankingEmpresas.map((e) => e.total), 1)

  // ── Gráfico de pizza SVG (coletas por status) ──────────────────────────────
  function GraficoPizza() {
    const total = porStatus.reduce((s, i) => s + i.valor, 0) || 1
    const cx = 100; const cy = 100; const r = 80
    let angulo = -Math.PI / 2

    const fatias = porStatus.map((item) => {
      const frac = item.valor / total
      const inicio = angulo
      angulo += frac * 2 * Math.PI
      const x1 = cx + r * Math.cos(inicio)
      const y1 = cy + r * Math.sin(inicio)
      const x2 = cx + r * Math.cos(angulo)
      const y2 = cy + r * Math.sin(angulo)
      const large = frac > 0.5 ? 1 : 0
      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`
      return { ...item, path, frac }
    })

    return (
      <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
        {fatias.map((f) => (
          <path key={f.label} d={f.path} fill={f.cor} stroke="var(--color-surface)" strokeWidth="2" />
        ))}
      </svg>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Carregando relatórios…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>

      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-3">
          <img src="/src/assets/logo.png" alt="SpaceWaste" className="h-8 w-8" />
          <span className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
            SpaceWaste — Relatórios
          </span>
        </div>
        <button
          onClick={() => navigate(empresa ? '/empresa' : '/dashboard')}
          className="text-sm px-4 py-2 rounded-lg border transition-colors hover:bg-white/5"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
        >
          ← Voltar
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-10">

        {/* ── 1. Resíduos por Categoria (barras horizontais) ────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 border"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-lg font-bold mb-5" style={{ color: 'var(--color-primary)' }}>
            ♻️ Total de Resíduos por Categoria
          </h2>

          {porCategoria.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>Nenhum dado disponível.</p>
          ) : (
            <div className="space-y-3">
              {porCategoria.map((item, i) => (
                <div key={item.nome} className="flex items-center gap-3 text-sm">
                  <span className="w-36 shrink-0 truncate" style={{ color: 'var(--color-text-muted)' }}>
                    {item.nome}
                  </span>
                  <div className="flex-1 rounded-full overflow-hidden h-5" style={{ background: 'var(--color-surface-2)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.total / maxBarras) * 100}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                      className="h-full rounded-full"
                      style={{ background: CORES[i % CORES.length] }}
                    />
                  </div>
                  <span className="w-8 text-right font-bold" style={{ color: CORES[i % CORES.length] }}>
                    {item.total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* ── 2. Coletas por Status (pizza SVG + legenda) ───────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-6 border"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-lg font-bold mb-5" style={{ color: 'var(--color-secondary)' }}>
            🚛 Total de Coletas por Status
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            <GraficoPizza />

            {/* Legenda */}
            <div className="space-y-3 flex-1">
              {porStatus.map((item) => {
                const total = porStatus.reduce((s, i) => s + i.valor, 0) || 1
                const pct = ((item.valor / total) * 100).toFixed(1)
                return (
                  <div key={item.label} className="flex items-center gap-3 text-sm">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: item.cor }} />
                    <span style={{ color: 'var(--color-text-muted)' }}>{item.label}</span>
                    <span className="ml-auto font-bold" style={{ color: item.cor }}>
                      {item.valor} <span className="font-normal text-xs">({pct}%)</span>
                    </span>
                  </div>
                )
              })}
              <div
                className="pt-2 mt-2 border-t text-sm font-bold"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                Total: {coletas.length} coletas
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── 3. Ranking de Empresas (barras verticais SVG) ─────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-6 border"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-lg font-bold mb-5" style={{ color: '#f59e0b' }}>
            🏆 Ranking de Empresas Mais Ativas
          </h2>

          {rankingEmpresas.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>Nenhuma empresa com coletas registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <svg
                viewBox={`0 0 ${rankingEmpresas.length * 90} 180`}
                className="w-full"
                style={{ minWidth: `${rankingEmpresas.length * 90}px` }}
              >
                {rankingEmpresas.map((emp, i) => {
                  const altBarra = (emp.total / maxRanking) * 120
                  const x = i * 90 + 15
                  const y = 140 - altBarra
                  return (
                    <g key={emp.nome}>
                      <rect
                        x={x}
                        y={y}
                        width={60}
                        height={altBarra}
                        rx={6}
                        fill={CORES[i % CORES.length]}
                        opacity={0.9}
                      />
                      <text
                        x={x + 30}
                        y={y - 6}
                        textAnchor="middle"
                        fontSize="13"
                        fontWeight="bold"
                        fill={CORES[i % CORES.length]}
                      >
                        {emp.total}
                      </text>
                      <text
                        x={x + 30}
                        y={160}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#7aadce"
                      >
                        {emp.nome.length > 10 ? emp.nome.slice(0, 9) + '…' : emp.nome}
                      </text>
                    </g>
                  )
                })}
                {/* Linha base */}
                <line
                  x1={0}
                  y1={140}
                  x2={rankingEmpresas.length * 90}
                  y2={140}
                  stroke="#1e3a5f"
                  strokeWidth={1}
                />
              </svg>
            </div>
          )}
        </motion.section>

        {/* ── 4. Regiões com Maior Concentração (mapa de calor simplificado) ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-6 border"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-lg font-bold mb-5" style={{ color: '#ef4444' }}>
            📍 Regiões com Maior Concentração de Descartes
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
            As coordenadas são arredondadas para 2 casas decimais para agrupar descartes próximos.
          </p>

          {descartes.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>Nenhum descarte registrado.</p>
          ) : (() => {
            // Agrupa por região (lat/lon arredondados)
            const mapa: Record<string, number> = {}
            descartes.forEach((d) => {
              const chave = `${d.latitude.toFixed(2)}, ${d.longitude.toFixed(2)}`
              mapa[chave] = (mapa[chave] ?? 0) + 1
            })
            const regioes = Object.entries(mapa)
              .map(([coord, total]) => ({ coord, total }))
              .sort((a, b) => b.total - a.total)
              .slice(0, 8)
            const maxReg = Math.max(...regioes.map((r) => r.total), 1)

            return (
              <div className="space-y-3">
                {regioes.map((reg, i) => (
                  <div key={reg.coord} className="flex items-center gap-3 text-sm">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: '#7f1d1d', color: '#fca5a5' }}
                    >
                      {i + 1}
                    </span>
                    <span className="w-40 font-mono text-xs shrink-0" style={{ color: 'var(--color-text-muted)' }}>
                      {reg.coord}
                    </span>
                    <div className="flex-1 rounded-full h-4 overflow-hidden" style={{ background: 'var(--color-surface-2)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(reg.total / maxReg) * 100}%` }}
                        transition={{ duration: 0.5, delay: i * 0.06 }}
                        className="h-full rounded-full"
                        style={{ background: `rgba(239,68,68,${0.4 + (reg.total / maxReg) * 0.6})` }}
                      />
                    </div>
                    <span className="w-8 text-right font-bold" style={{ color: '#f87171' }}>
                      {reg.total}
                    </span>
                  </div>
                ))}
              </div>
            )
          })()}
        </motion.section>

      </main>
    </div>
  )
}