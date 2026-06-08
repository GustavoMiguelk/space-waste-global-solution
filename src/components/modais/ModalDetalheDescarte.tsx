import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const markerIcon = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png'
const markerShadow = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, shadowUrl: markerShadow })

interface Descarte {
  id?: number
  descricao: string
  status: 'PENDENTE' | 'EM_COLETA' | 'CONCLUIDO'
  pesoEstimado?: number
  dataDescarte?: string
  latitude?: number
  longitude?: number
  imagemUrl?: string
  idCategoria?: number
  nomeCategoria?: string
}

interface ModalDetalhesDescarteProps {
  aberto: boolean
  onFechar: () => void
  descarte: Descarte | null
}

const STATUS_CONFIG: Record<string, { cor: string; label: string }> = {
  PENDENTE: { cor: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20', label: 'Pendente' },
  EM_COLETA: { cor: 'bg-blue-400/10 text-blue-400 border-blue-400/20', label: 'Em Coleta' },
  CONCLUIDO: { cor: 'bg-green-400/10 text-green-400 border-green-400/20', label: 'Concluído' },
}

function formatarData(dataString?: string): string {
  if (!dataString) return '—'
  return new Date(dataString).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

interface InfoItemProps {
  label: string
  valor: string
  full?: boolean
}

function InfoItem({ label, valor, full }: InfoItemProps) {
  return (
    <div
      className={`rounded-xl border p-3 ${full ? 'col-span-2' : ''}`}
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-2)' }}
    >
      <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-muted)' }}>
        {label}
      </p>
      <p className="text-sm" style={{ color: 'var(--color-text)' }}>{valor || '—'}</p>
    </div>
  )
}

export default function ModalDetalhesDescarte({ aberto, onFechar, descarte }: ModalDetalhesDescarteProps) {
  if (!descarte) return null

  const statusInfo = STATUS_CONFIG[descarte.status] || { cor: '', label: descarte.status }
  const temCoordenadas = descarte.latitude && descarte.longitude

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onFechar} />

          <motion.div
            className="relative z-10 w-full max-w-lg mx-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  📋
                </div>
                <div>
                  <h2 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
                    Detalhes do Descarte
                  </h2>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    ID #{descarte.id}
                  </p>
                </div>
              </div>
              <button
                onClick={onFechar}
                className="flex h-8 w-8 items-center justify-center rounded-lg border transition hover:opacity-80"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
                  Status
                </span>
                <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusInfo.cor}`}>
                  {statusInfo.label}
                </span>
              </div>

              <div className="border-t" style={{ borderColor: 'var(--color-border)' }} />

              {/* Informações */}
              <div className="grid grid-cols-2 gap-3">
                <InfoItem label="Descrição" valor={descarte.descricao} full />
                <InfoItem label="Categoria" valor={descarte.nomeCategoria || `Categoria #${descarte.idCategoria}`} />
                <InfoItem label="Peso estimado" valor={descarte.pesoEstimado ? `${descarte.pesoEstimado} kg` : '—'} />
                <InfoItem label="Data" valor={formatarData(descarte.dataDescarte)} full />
              </div>

              {/* Imagem */}
              {descarte.imagemUrl && (
                <div>
                  <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-muted)' }}>
                    Imagem
                  </p>
                  <img
                    src={descarte.imagemUrl}
                    alt="Imagem do descarte"
                    className="w-full rounded-xl object-cover max-h-40 border"
                    style={{ borderColor: 'var(--color-border)' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              )}

              {/* Mapa */}
              {temCoordenadas && (
                <div>
                  <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--color-text-muted)' }}>
                    Localização
                  </p>
                  <div className="h-48 w-full rounded-xl overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
                    <MapContainer
                      center={[descarte.latitude!, descarte.longitude!]}
                      zoom={15}
                      style={{ height: '100%', width: '100%' }}
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[descarte.latitude!, descarte.longitude!]}>
                        <Popup>{descarte.descricao}</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                  <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {descarte.latitude}, {descarte.longitude}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={onFechar}
              className="mt-5 w-full rounded-xl border py-2.5 text-sm transition hover:opacity-80"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
            >
              Fechar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}