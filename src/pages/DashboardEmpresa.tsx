import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import ModalAceitarColeta from '../components/modais/ModalAceitarColeta'
import ModalAtualizarStatus from '../components/modais/ModalAtualizarStatus'
import ModalPerfil from '../components/modais/ModalPerfil'

// Fix ícone padrão do Leaflet no Vite
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, shadowUrl: markerShadow })

const iconePendente = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface Descarte {
  idDescarte: number
  idUsuario: number
  idCategoria: number
  descricao: string
  pesoEstimado: number
  latitude: number | null
  longitude: number | null
  imagemUrl?: string
  status: string
  dataDescarte?: string
}

interface Coleta {
  idColeta: number
  idEmpresa: number
  idDescarte: number
  statusColeta: string
  dataAceite?: string
  dataConclusao?: string
}

type Aba = 'mapa' | 'coletas'

const badges: Record<string, string> = {
  PENDENTE: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40',
  EM_COLETA: 'bg-blue-500/20 text-blue-300 border border-blue-500/40',
  CONCLUIDO: 'bg-green-500/20 text-green-300 border border-green-500/40',
}

export default function DashboardEmpresa() {
  const { empresa, logout } = useAuth()
  const [descartesPendentes, setDescartesPendentes] = useState<Descarte[]>([])
  const [coletas, setColetas] = useState<Coleta[]>([])
  const [carregando, setCarregando] = useState<boolean>(true)
  const [abaPrincipal, setAbaPrincipal] = useState<Aba>('mapa')
  const [modalAceitarColeta, setModalAceitarColeta] = useState<Descarte | null>(null)
  const [modalAtualizarStatus, setModalAtualizarStatus] = useState<Coleta | null>(null)
  const [modalPerfil, setModalPerfil] = useState<boolean>(false)

  const metricas = {
    total: coletas.length,
    emAndamento: coletas.filter(c => c.statusColeta === 'EM_COLETA').length,
    concluidas: coletas.filter(c => c.statusColeta === 'CONCLUIDO').length,
    pendentes: coletas.filter(c => c.statusColeta === 'PENDENTE').length,
  }

  async function carregarDados(): Promise<void> {
    setCarregando(true)
    try {
      const [todasColetas, pendentes] = await Promise.all([
        api.get('/coletas') as Promise<Coleta[]>,
        api.get('/descartes/status/PENDENTE') as Promise<Descarte[]>,
      ])
      const coletasDaEmpresa = todasColetas.filter(c => c.idEmpresa === empresa?.idEmpresa)
      setColetas(coletasDaEmpresa)
      setDescartesPendentes(pendentes)
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [empresa])

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Navbar */}
      <nav
        className="flex items-center justify-between px-6 py-4 sticky top-0 z-50"
        style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg"
            style={{ background: 'var(--color-secondary)', color: '#fff' }}
          >
            SW
          </div>
          <span className="font-semibold tracking-wide" style={{ color: 'var(--color-primary)' }}>
            SpaceWaste
          </span>
          <span className="hidden sm:block text-sm" style={{ color: 'var(--color-text-muted)' }}>
            — Painel da Empresa
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalPerfil(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all hover:opacity-80"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'var(--color-secondary)' }}
            >
              {empresa?.nomeFantasia?.[0] ?? 'E'}
            </span>
            <span className="hidden sm:block">{empresa?.nomeFantasia ?? 'Empresa'}</span>
          </button>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-lg text-sm transition-all hover:opacity-80"
            style={{ background: '#dc2626', color: '#fff' }}
          >
            Sair
          </button>
        </div>
      </nav>

      {/* Métricas */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total de Coletas', valor: metricas.total, cor: 'var(--color-primary)' },
            { label: 'Em Andamento', valor: metricas.emAndamento, cor: '#3b82f6' },
            { label: 'Concluídas', valor: metricas.concluidas, cor: '#22c55e' },
            { label: 'Pendentes na Fila', valor: descartesPendentes.length, cor: '#eab308' },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl p-4"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>{m.label}</p>
              <p className="text-3xl font-bold" style={{ color: m.cor }}>{m.valor}</p>
            </motion.div>
          ))}
        </div>

        {/* Abas */}
        <div
          className="flex gap-2 mb-4 p-1 rounded-lg w-fit"
          style={{ background: 'var(--color-surface)' }}
        >
          {(['mapa', 'coletas'] as Aba[]).map(aba => (
            <button
              key={aba}
              onClick={() => setAbaPrincipal(aba)}
              className="px-4 py-2 rounded-md text-sm font-medium capitalize transition-all"
              style={
                abaPrincipal === aba
                  ? { background: 'var(--color-secondary)', color: '#fff' }
                  : { color: 'var(--color-text-muted)' }
              }
            >
              {aba === 'mapa' ? '🗺️ Descartes Pendentes' : '📦 Minhas Coletas'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {abaPrincipal === 'mapa' && (
            <motion.div
              key="mapa"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              {/* Mapa */}
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: '1px solid var(--color-border)', height: '420px' }}
              >
                {!carregando && (
                  <MapContainer
                    center={[-23.5505, -46.6333]}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap"
                    />
                    {descartesPendentes.map(d =>
                      d.latitude && d.longitude ? (
                        <Marker
                          key={d.idDescarte}
                          position={[d.latitude, d.longitude]}
                          icon={iconePendente}
                        >
                          <Popup>
                            <div className="text-sm">
                              <strong>{d.descricao}</strong>
                              <br />
                              Peso: {d.pesoEstimado} kg
                              <br />
                              Status: {d.status}
                              <br />
                              <button
                                onClick={() => setModalAceitarColeta(d)}
                                className="mt-2 px-3 py-1 rounded text-white text-xs"
                                style={{ background: '#16a34a' }}
                              >
                                Aceitar Coleta
                              </button>
                            </div>
                          </Popup>
                        </Marker>
                      ) : null
                    )}
                  </MapContainer>
                )}
              </div>

              {/* Lista de descartes pendentes */}
              <div
                className="rounded-xl flex flex-col gap-3 overflow-y-auto"
                style={{
                  maxHeight: '420px',
                  border: '1px solid var(--color-border)',
                  padding: '16px',
                  background: 'var(--color-surface)',
                }}
              >
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                  {descartesPendentes.length} descartes aguardando coleta
                </p>
                {descartesPendentes.map(d => (
                  <div
                    key={d.idDescarte}
                    className="rounded-lg p-3 flex items-center justify-between"
                    style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
                  >
                    <div>
                      <p className="text-sm font-medium">{d.descricao}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {d.pesoEstimado} kg · lat {d.latitude?.toFixed(3)}, lon {d.longitude?.toFixed(3)}
                      </p>
                    </div>
                    <button
                      onClick={() => setModalAceitarColeta(d)}
                      className="text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80 font-medium"
                      style={{ background: 'var(--color-primary)', color: '#000' }}
                    >
                      Aceitar
                    </button>
                  </div>
                ))}
                {descartesPendentes.length === 0 && !carregando && (
                  <p className="text-sm text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
                    Nenhum descarte pendente no momento.
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {abaPrincipal === 'coletas' && (
            <motion.div
              key="coletas"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {carregando ? (
                <p className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
                  Carregando coletas...
                </p>
              ) : coletas.length === 0 ? (
                <div
                  className="rounded-xl p-12 text-center"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                >
                  <p className="text-4xl mb-3">📦</p>
                  <p style={{ color: 'var(--color-text-muted)' }}>Nenhuma coleta registrada ainda.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {coletas.map((c, i) => (
                    <motion.div
                      key={c.idColeta}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-xl p-4 flex flex-col gap-3"
                      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Coleta #{c.idColeta}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${badges[c.statusColeta] ?? ''}`}>
                          {c.statusColeta}
                        </span>
                      </div>
                      <div className="text-xs space-y-1" style={{ color: 'var(--color-text-muted)' }}>
                        <p>Descarte: #{c.idDescarte}</p>
                        {c.dataAceite && (
                          <p>Aceito em: {new Date(c.dataAceite).toLocaleDateString('pt-BR')}</p>
                        )}
                        {c.dataConclusao && (
                          <p>Concluído: {new Date(c.dataConclusao).toLocaleDateString('pt-BR')}</p>
                        )}
                      </div>
                      <button
                        onClick={() => setModalAtualizarStatus(c)}
                        className="text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80 font-medium mt-auto"
                        style={{ background: 'var(--color-secondary)', color: '#fff' }}
                      >
                        Atualizar Status
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modais */}
      <AnimatePresence>
        {modalAceitarColeta && (
          <ModalAceitarColeta
            descarte={modalAceitarColeta}
            onFechar={() => setModalAceitarColeta(null)}
            onSucesso={() => { setModalAceitarColeta(null); carregarDados() }}
          />
        )}
        {modalAtualizarStatus && (
          <ModalAtualizarStatus
            coleta={modalAtualizarStatus}
            onFechar={() => setModalAtualizarStatus(null)}
            onSucesso={() => { setModalAtualizarStatus(null); carregarDados() }}
          />
        )}
        {modalPerfil && <ModalPerfil onFechar={() => setModalPerfil(false)} />}
      </AnimatePresence>
    </div>
  )
}