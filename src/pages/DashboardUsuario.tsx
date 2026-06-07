import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, shadowUrl: markerShadow })

interface ModalState {
  logout: boolean
}

interface Descarte {
  id: number
  idUsuario: number
  descricao: string
  status: 'PENDENTE' | 'EM_COLETA' | 'CONCLUIDO'
  pesoEstimado?: number
  dataDescarte?: string
  latitude?: number
  longitude?: number
  imagemUrl?: string
  idCategoria?: number
}

interface Metricas {
  total: number
  pendentes: number
  emColeta: number
  concluidos: number
}

interface CardMetricaProps {
  emoji: string
  label: string
  valor: number
  cor: string
  carregando: boolean
}

interface Localizacao {
  lat: number
  lon: number
}

function CardMetrica({ emoji, label, valor, cor, carregando }: CardMetricaProps) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{emoji}</span>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
      </div>
      {carregando ? (
        <div className="h-7 w-10 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--color-surface-2)' }} />
      ) : (
        <p className={`text-2xl font-bold ${cor}`}>{valor}</p>
      )}
    </div>
  )
}

export default function DashboardUsuario() {
  const { usuario, logout } = useAuth()
  const [modais, setModais] = useState<ModalState>({ logout: false })
  const [descartes, setDescartes] = useState<Descarte[]>([])
  const [carregando, setCarregando] = useState(true)
  const [localizacao, setLocalizacao] = useState<Localizacao | null>(null)
  const [descartesProximos, setDescartesProximos] = useState<Descarte[]>([])

  const metricas: Metricas = {
    total: descartes.length,
    pendentes: descartes.filter(d => d.status === 'PENDENTE').length,
    emColeta: descartes.filter(d => d.status === 'EM_COLETA').length,
    concluidos: descartes.filter(d => d.status === 'CONCLUIDO').length,
  }

  const centroMapa: [number, number] = localizacao
    ? [localizacao.lat, localizacao.lon]
    : [-23.550520, -46.633308]

  useEffect(() => {
    obterLocalizacao()
    api.get('/descartes')
      .then((todos: Descarte[]) => {
        const meus = todos.filter(d => d.idUsuario === usuario?.id)
        setDescartes(meus)
      })
      .catch(() => {})
      .finally(() => setCarregando(false))
  }, [])

  function obterLocalizacao() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((pos) => {
      const loc = { lat: pos.coords.latitude, lon: pos.coords.longitude }
      setLocalizacao(loc)
      api.get(`/descartes/proximos?lat=${loc.lat}&lon=${loc.lon}&raio=5000`)
        .then((dados: Descarte[]) => setDescartesProximos(dados))
        .catch(() => {})
    })
  }

  function abrirModal(modal: keyof ModalState) {
    setModais(prev => ({ ...prev, [modal]: true }))
  }

  function fecharModal(modal: keyof ModalState) {
    setModais(prev => ({ ...prev, [modal]: false }))
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>

      {/* Navbar */}
      <nav
        className="sticky top-0 z-40 border-b"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-lg">
              🌍
            </div>
            <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
              SpaceWaste
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              <span>👤</span>
              <span className="hidden sm:inline">{usuario?.nome?.split(' ')[0]}</span>
            </div>

            <button
              onClick={() => abrirModal('logout')}
              className="flex h-9 w-9 items-center justify-center rounded-lg border transition hover:opacity-80"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
              title="Sair"
            >
              ⏻
            </button>
          </div>
        </div>
      </nav>

      {/* Conteúdo */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
            Olá, {usuario?.nome?.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Gerencie seus descartes e acompanhe as coletas
          </p>
        </motion.div>

        {/* Cards de métricas */}
        <motion.div
          className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <CardMetrica emoji="📦" label="Total" valor={metricas.total} cor="text-white" carregando={carregando} />
          <CardMetrica emoji="⏳" label="Pendentes" valor={metricas.pendentes} cor="text-yellow-400" carregando={carregando} />
          <CardMetrica emoji="🚛" label="Em coleta" valor={metricas.emColeta} cor="text-blue-400" carregando={carregando} />
          <CardMetrica emoji="✅" label="Concluídos" valor={metricas.concluidos} cor="text-green-400" carregando={carregando} />
        </motion.div>

        {/* Mapa */}
        <motion.div
          className="mt-6 rounded-2xl border overflow-hidden"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              📍 Descartes próximos
            </p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-400/10 text-green-400">
              {descartesProximos.length} encontrados
            </span>
          </div>

          <div className="h-72">
            <MapContainer
              center={centroMapa}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {descartesProximos.map(d =>
                d.latitude && d.longitude ? (
                  <Marker key={d.id} position={[d.latitude, d.longitude]}>
                    <Popup>{d.descricao}</Popup>
                  </Marker>
                ) : null
              )}
              {localizacao && (
                <Marker position={[localizacao.lat, localizacao.lon]}>
                  <Popup>Você está aqui</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </motion.div>
      </div>

      {/* Modal logout */}
      {modais.logout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div
            className="rounded-2xl border p-6 w-80"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <p className="text-sm mb-4" style={{ color: 'var(--color-text)' }}>
              Tem certeza que deseja sair?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => fecharModal('logout')}
                className="flex-1 rounded-xl border py-2 text-sm"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
              >
                Cancelar
              </button>
              <button
                onClick={logout}
                className="flex-1 rounded-xl py-2 text-sm font-semibold text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}