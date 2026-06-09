// src/pages/DashboardEmpresa.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import ModalAceitarColeta from '../components/modais/ModalAceitarColeta'
import ModalAtualizarStatus from '../components/modais/ModalAtualizarStatus'
import ModalPerfil from '../components/modais/ModalPerfil'
import ModalErro from '../components/modais/ModalErro'

// ─── Fix do ícone padrão do Leaflet no Vite ──────────────────────────────────
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, shadowUrl: markerShadow })
// ─────────────────────────────────────────────────────────────────────────────

// Tipos
interface Descarte {
  idDescarte: number
  idUsuario: number
  idCategoria: number
  descricao: string
  pesoEstimado: number
  latitude: number
  longitude: number
  imagemUrl: string
  status: 'PENDENTE' | 'EM_COLETA' | 'CONCLUIDO'
  dataDescarte: string
}

interface Coleta {
  idColeta: number
  idEmpresa: number
  idDescarte: number
  statusColeta: 'PENDENTE' | 'EM_COLETA' | 'CONCLUIDO'
  dataAceite: string | null
  dataConclusao: string | null
}

interface Categoria {
  idCategoria: number
  nomeCategoria: string
}

export default function DashboardEmpresa() {
  const { empresa, logout } = useAuth()
  const navigate = useNavigate()

  const [descartesPendentes, setDescartesPendentes] = useState<Descarte[]>([])
  const [coletas, setColetas] = useState<Coleta[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erroMsg, setErroMsg] = useState('')

  // Modais
  const [modalAceitar, setModalAceitar] = useState<Descarte | null>(null)
  const [modalStatus, setModalStatus] = useState<Coleta | null>(null)
  const [modalPerfil, setModalPerfil] = useState(false)
  const [modalErro, setModalErro] = useState(false)

  // Proteção de rota — só empresa logada acessa
  useEffect(() => {
    if (!empresa) navigate('/')
  }, [empresa, navigate])

  // Carrega dados ao montar
  useEffect(() => {
    if (!empresa) return
    carregarDados()
  }, [empresa])

  async function carregarDados() {
    try {
      setCarregando(true)
      const [descartesData, coletasData, categoriasData] = await Promise.all([
        api.get('/descartes/status/PENDENTE'),
        api.get('/coletas'),
        api.get('/categorias'),
      ])
      setDescartesPendentes(descartesData ?? [])
      // Filtra apenas coletas desta empresa
      const coletasDaEmpresa = (coletasData ?? []).filter(
        (c: Coleta) => c.idEmpresa === empresa?.idEmpresa
      )
      setColetas(coletasDaEmpresa)
      setCategorias(categoriasData ?? [])
    } catch (err) {
      setErroMsg('Não foi possível carregar os dados. Verifique a conexão com a API.')
      setModalErro(true)
    } finally {
      setCarregando(false)
    }
  }

  function nomeDaCategoria(idCategoria: number) {
    return categorias.find((c) => c.idCategoria === idCategoria)?.nomeCategoria ?? '—'
  }

  // Métricas
  const totalColetas = coletas.length
  const emAndamento = coletas.filter((c) => c.statusColeta === 'EM_COLETA').length
  const concluidas = coletas.filter((c) => c.statusColeta === 'CONCLUIDO').length

  // Centro do mapa — SP como fallback
  const centroMapa: [number, number] = [-23.55052, -46.633308]

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
      <div className="flex items-center gap-3">
  <div style={{ background: '#fff', borderRadius: '10px', padding: '2px 6px' }}>
    <img 
      src="/logo.png" 
      alt="SpaceWaste" 
      style={{ height: '32px', width: 'auto', display: 'block' }}
    />
  </div>
  <span className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
    SpaceWaste
  </span>
</div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/relatorios')}
            className="text-sm px-4 py-2 rounded-lg border transition-colors hover:bg-white/5"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
          >
            📊 Relatórios
          </button>

          <button
            onClick={() => setModalPerfil(true)}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-colors hover:bg-white/5"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            🏢 {empresa?.nomeFantasia ?? 'Empresa'}
          </button>

          <button
            onClick={logout}
            className="text-sm px-4 py-2 rounded-lg font-semibold transition-colors"
            style={{ background: '#7f1d1d', color: '#fca5a5' }}
          >
            Sair
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Cards de Métricas ───────────────────────────────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total de Coletas', valor: totalColetas, cor: 'var(--color-secondary)', emoji: '📦' },
            { label: 'Em Andamento', valor: emAndamento, cor: '#d97706', emoji: '🚛' },
            { label: 'Concluídas', valor: concluidas, cor: 'var(--color-primary)', emoji: '✅' },
          ].map((card) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl p-6 border"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <div className="text-3xl mb-2">{card.emoji}</div>
              <div className="text-3xl font-bold" style={{ color: card.cor }}>
                {carregando ? '…' : card.valor}
              </div>
              <div className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                {card.label}
              </div>
            </motion.div>
          ))}
        </section>

        {/* ── Mapa de Descartes Pendentes ─────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>
            🗺️ Descartes Disponíveis para Coleta
          </h2>
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--color-border)', height: '380px' }}>
            <MapContainer center={centroMapa} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              />
              {descartesPendentes.map((d) => (
                <Marker key={d.idDescarte} position={[d.latitude, d.longitude]}>
                  <Popup>
                    <div className="text-sm space-y-1">
                      <strong>{d.descricao}</strong><br />
                      Categoria: {nomeDaCategoria(d.idCategoria)}<br />
                      Peso: {d.pesoEstimado} kg<br />
                      <button
                        onClick={() => setModalAceitar(d)}
                        className="mt-2 px-3 py-1 rounded text-xs font-bold"
                        style={{ background: 'var(--color-primary)', color: '#000' }}
                      >
                        Aceitar Coleta
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </section>

        {/* ── Lista de Descartes Pendentes ────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>
            📋 Descartes Pendentes
          </h2>

          {carregando ? (
            <p style={{ color: 'var(--color-text-muted)' }}>Carregando…</p>
          ) : descartesPendentes.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>Nenhum descarte pendente no momento.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {descartesPendentes.map((descarte, i) => (
                <motion.div
                  key={descarte.idDescarte}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl p-5 border flex justify-between items-start gap-4"
                  style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                >
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                      {descarte.descricao}
                    </p>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                      Categoria: {nomeDaCategoria(descarte.idCategoria)}
                    </p>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                      Peso: {descarte.pesoEstimado} kg
                    </p>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                      📍 {descarte.latitude.toFixed(4)}, {descarte.longitude.toFixed(4)}
                    </p>
                  </div>
                  <button
                    onClick={() => setModalAceitar(descarte)}
                    className="shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-opacity hover:opacity-90"
                    style={{ background: 'var(--color-primary)', color: '#000' }}
                  >
                    Aceitar
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* ── Coletas da Empresa ──────────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-secondary)' }}>
            🚛 Minhas Coletas
          </h2>

          {carregando ? (
            <p style={{ color: 'var(--color-text-muted)' }}>Carregando…</p>
          ) : coletas.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>Você ainda não possui coletas registradas.</p>
          ) : (
            <div className="space-y-3">
              {coletas.map((coleta, i) => (
                <motion.div
                  key={coleta.idColeta}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl px-5 py-4 border flex justify-between items-center gap-4"
                  style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                >
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold">Coleta #{coleta.idColeta}</p>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                      Descarte #{coleta.idDescarte}
                    </p>
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs font-bold"
                      style={{
                        background:
                          coleta.statusColeta === 'CONCLUIDO'
                            ? '#14532d'
                            : coleta.statusColeta === 'EM_COLETA'
                            ? '#78350f'
                            : '#1e3a5f',
                        color:
                          coleta.statusColeta === 'CONCLUIDO'
                            ? '#86efac'
                            : coleta.statusColeta === 'EM_COLETA'
                            ? '#fcd34d'
                            : '#93c5fd',
                      }}
                    >
                      {coleta.statusColeta.replace('_', ' ')}
                    </span>
                  </div>
                  <button
                    onClick={() => setModalStatus(coleta)}
                    className="shrink-0 px-4 py-2 rounded-lg text-sm font-bold border transition-colors hover:bg-white/5"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
                  >
                    Atualizar Status
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* ── Modais ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {modalAceitar && (
          <ModalAceitarColeta
            descarte={modalAceitar}
            onFechar={() => setModalAceitar(null)}
            onSucesso={() => { setModalAceitar(null); carregarDados() }}
          />
        )}
        {modalStatus && (
          <ModalAtualizarStatus
            coleta={modalStatus}
            onFechar={() => setModalStatus(null)}
            onSucesso={() => { setModalStatus(null); carregarDados() }}
          />
        )}
        {modalPerfil && (
  <ModalPerfil
    aberto={modalPerfil}
    onFechar={() => setModalPerfil(false)}
  />
)}
        {modalErro && (
  <ModalErro
    aberto={modalErro}
    mensagem={erroMsg}
    onFechar={() => setModalErro(false)}
  />
)}
      </AnimatePresence>
    </div>
  )
}