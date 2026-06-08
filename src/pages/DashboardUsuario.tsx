import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import logo from '../public/logo.png'
import ModalRegistroDescarte from '../components/modais/ModalRegistroDescarte'
import ModalResultadoIA from '../components/modais/ModalResultadoIA'
import ModalDetalhesDescarte from '../components/modais/ModalDetalheDescarte'
import ModalPerfil from '../components/modais/ModalPerfil'

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

interface Notificacao {
  id: number
  idUsuario: number
  mensagem: string
  lida: 'S' | 'N'
  dataEnvio?: string
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
  const [abaAtiva, setAbaAtiva] = useState<'descartes' | 'notificacoes'>('descartes')
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
  const [modalRegistro, setModalRegistro] = useState(false)
  const [modalIA, setModalIA] = useState({ aberto: false, imagemUrl: '', descricao: '' })
  const [modalDetalhes, setModalDetalhes] = useState<{ aberto: boolean; descarte: any }>({ aberto: false, descarte: null })
  const [modalPerfil, setModalPerfil] = useState(false)
  const metricas: Metricas = {
    total: descartes.length,
    pendentes: descartes.filter(d => d.status === 'PENDENTE').length,
    emColeta: descartes.filter(d => d.status === 'EM_COLETA').length,
    concluidos: descartes.filter(d => d.status === 'CONCLUIDO').length,
  }

  const centroMapa: [number, number] = localizacao
    ? [localizacao.lat, localizacao.lon]
    : [-23.550520, -46.633308]

  const [filtroStatus, setFiltroStatus] = useState<'TODOS' | 'PENDENTE' | 'EM_COLETA' | 'CONCLUIDO'>('TODOS')

  const descartesFiltrados = filtroStatus === 'TODOS'
  ? descartes
  : descartes.filter(d => d.status === filtroStatus)

  useEffect(() => {
    obterLocalizacao()
    api.get('/descartes')
      .then((todos: Descarte[]) => {
        const meus = todos.filter(d => d.idUsuario === usuario?.id)
        setDescartes(meus)
      })
      .catch(() => {})
      .finally(() => setCarregando(false))
      api.get('/notificacoes')
      .then((todas: Notificacao[]) => {
            const minhas = todas.filter(n => n.idUsuario === usuario?.id)
            setNotificacoes(minhas)
        })
        .catch(() => {})
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

 function formatarData(data?: string): string {
  if (!data) return '—'
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
 }

async function marcarLida(id: number) {
  try {
    await api.put(`/notificacoes/${id}/ler`, {})
    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: 'S' } : n))
  } catch {}
}

const notificacoesNaoLidas = notificacoes.filter(n => n.lida === 'N').length

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>

        <nav
        className="sticky top-0 z-40 h-20 border-b"
        style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
        }}
        >
        <div className="mx-auto max-w-7xl h-full flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
        <img src="/logo.png" alt="SpaceWaste" className="h-30 w-auto object-contain" />
         </div>
          <div className="flex items-center gap-2">
            <button
                onClick={() => setModalPerfil(true)}
                className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition hover:opacity-80"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                <span>👤</span>
                <span className="hidden sm:inline">{usuario?.nome?.split(' ')[0]}</span>
                </button>
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

    {/* Lista de descartes */}
<motion.div
  className="mt-6 rounded-2xl border"
  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.15 }}
>
{/* Cabeçalho com abas */}
    <div
    className="flex items-center justify-between px-4 py-3 border-b"
    style={{ borderColor: 'var(--color-border)' }}
    >
    <div className="flex gap-1">
        <button
        onClick={() => setAbaAtiva('descartes')}
        className="rounded-lg px-3 py-1.5 text-xs font-medium transition"
        style={{
            backgroundColor: abaAtiva === 'descartes' ? 'var(--color-surface-2)' : 'transparent',
            color: abaAtiva === 'descartes' ? 'var(--color-text)' : 'var(--color-text-muted)',
        }}
        >
        🗑️ Meus Descartes
        </button>
        <button
        onClick={() => setAbaAtiva('notificacoes')}
        className="rounded-lg px-3 py-1.5 text-xs font-medium transition"
        style={{
            backgroundColor: abaAtiva === 'notificacoes' ? 'var(--color-surface-2)' : 'transparent',
            color: abaAtiva === 'notificacoes' ? 'var(--color-text)' : 'var(--color-text-muted)',
        }}
        >
        🔔 Notificações {notificacoesNaoLidas > 0 && `(${notificacoesNaoLidas})`}
        </button>
    </div>

    <button
    onClick={() => setModalRegistro(true)}
        className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
        style={{ backgroundColor: 'var(--color-primary)' }}>
        + Registrar
    </button>
    </div>

 {abaAtiva === 'notificacoes' && (
  <div className="max-h-80 overflow-y-auto">
    {notificacoes.length === 0 ? (
      <div className="flex flex-col items-center gap-2 py-10">
        <span className="text-3xl">🔕</span>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Sem notificações
        </p>
      </div>
    ) : (
      notificacoes.map((notif, idx) => (
        <motion.div
          key={notif.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.03 }}
          className="flex items-start justify-between gap-3 px-4 py-3 border-b"
          style={{
            borderColor: 'var(--color-border)',
            backgroundColor: notif.lida === 'N' ? 'rgba(34,197,94,0.04)' : 'transparent',
          }}
        >
          <div className="flex items-start gap-3 min-w-0">
            <span className="mt-0.5 text-base shrink-0">
              {notif.lida === 'N' ? '🔔' : '🔕'}
            </span>
            <div className="min-w-0">
              <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                {notif.mensagem}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {formatarData(notif.dataEnvio)}
              </p>
            </div>
          </div>
          {notif.lida === 'N' && (
            <button
              onClick={() => marcarLida(notif.id)}
              className="shrink-0 rounded-lg px-2 py-1 text-xs transition hover:opacity-80"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                color: 'var(--color-text-muted)',
              }}
            >
              Lida
            </button>
          )}
        </motion.div>
      ))
    )}
  </div>
 )}

 {abaAtiva === 'descartes' && (
  <>
    {/* Filtros */}
    <div
      className="flex gap-2 overflow-x-auto px-4 py-3 border-b"
      style={{ borderColor: 'var(--color-border)' }}
    >
      {(['TODOS', 'PENDENTE', 'EM_COLETA', 'CONCLUIDO'] as const).map(status => (
        <button
          key={status}
          onClick={() => setFiltroStatus(status)}
          className="shrink-0 rounded-lg px-3 py-1 text-xs font-medium transition"
          style={{
            backgroundColor: filtroStatus === status ? 'var(--color-primary)' : 'var(--color-surface-2)',
            color: filtroStatus === status ? 'white' : 'var(--color-text-muted)',
          }}
        >
          {status === 'TODOS' ? 'Todos' : status === 'EM_COLETA' ? 'Em Coleta' : status.charAt(0) + status.slice(1).toLowerCase()}
        </button>
      ))}
    </div>

    {/* Itens */}
    <div className="max-h-80 overflow-y-auto">
      {carregando ? (
        <div className="flex items-center justify-center py-10">
          <motion.div
            className="w-8 h-8 rounded-full border-2 border-green-400/30 border-t-green-400"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      ) : descartesFiltrados.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10">
          <span className="text-3xl">📭</span>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Nenhum descarte encontrado
          </p>
        </div>
      ) : (
        descartesFiltrados.map((descarte, idx) => (
          <motion.div
            key={descarte.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
            className="flex items-center justify-between px-4 py-3 border-b cursor-pointer transition hover:opacity-80"
            style={{ borderColor: 'var(--color-border)' }}
              onClick={() => setModalDetalhes({ aberto: true, descarte })}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              >
                🗑️
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  {descarte.descricao}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {formatarData(descarte.dataDescarte)} · {descarte.pesoEstimado ? `${descarte.pesoEstimado}kg` : '—'}
                </p>
              </div>
            </div>
            <span
              className="shrink-0 ml-2 rounded-full border px-2 py-0.5 text-[10px] font-medium"
              style={{
                backgroundColor: descarte.status === 'CONCLUIDO' ? 'rgba(34,197,94,0.1)' : descarte.status === 'EM_COLETA' ? 'rgba(96,165,250,0.1)' : 'rgba(250,204,21,0.1)',
                color: descarte.status === 'CONCLUIDO' ? '#4ade80' : descarte.status === 'EM_COLETA' ? '#60a5fa' : '#facc15',
                borderColor: descarte.status === 'CONCLUIDO' ? 'rgba(34,197,94,0.2)' : descarte.status === 'EM_COLETA' ? 'rgba(96,165,250,0.2)' : 'rgba(250,204,21,0.2)',
              }}
            >
              {descarte.status === 'EM_COLETA' ? 'Em Coleta' : descarte.status.charAt(0) + descarte.status.slice(1).toLowerCase()}
            </span>
          </motion.div>
        ))
      )}
    </div>
  </>
 )}

</motion.div>
    <ModalRegistroDescarte
        aberto={modalRegistro}
        onFechar={() => setModalRegistro(false)}
        onDescarteRegistrado={(descarte, imagemUrl, descricao) => {
        setDescartes(prev => [descarte, ...prev])
        setModalIA({ aberto: true, imagemUrl, descricao })
        }}
        />
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
       <ModalResultadoIA
        aberto={modalIA.aberto}
        imagemUrl={modalIA.imagemUrl}
        descricao={modalIA.descricao}
        onFechar={() => setModalIA({ aberto: false, imagemUrl: '', descricao: '' })}
        />
        <ModalDetalhesDescarte
        aberto={modalDetalhes.aberto}
        descarte={modalDetalhes.descarte}
        onFechar={() => setModalDetalhes({ aberto: false, descarte: null })}
        />
        <ModalPerfil
        aberto={modalPerfil}
        onFechar={() => setModalPerfil(false)}
        />
    </div>
  )
}