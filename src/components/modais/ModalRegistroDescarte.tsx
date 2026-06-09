import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import ModalErro from './ModalErro'

interface Categoria {
  idCategoria: number
  nomeCategoria: string
  descricao?: string
}

interface ModalRegistroDescarteProps {
  aberto: boolean
  onFechar: () => void
  onDescarteRegistrado: (descarte: any, imagemUrl: string, descricao: string) => void
}

export default function ModalRegistroDescarte({ aberto, onFechar, onDescarteRegistrado }: ModalRegistroDescarteProps) {
  const { usuario } = useAuth()

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [enviando, setEnviando] = useState(false)
  const [buscandoLocalizacao, setBuscandoLocalizacao] = useState(false)
  const [erroModal, setErroModal] = useState({ aberto: false, mensagem: '' })

  const [form, setForm] = useState({
    descricao: '',
    idCategoria: '',
    pesoEstimado: '',
    latitude: '',
    longitude: '',
    imagemUrl: '',
  })

  useEffect(() => {
    if (aberto) {
      api.get('/categorias')
        .then((dados: Categoria[]) => setCategorias(dados))
        .catch(() => setErroModal({ aberto: true, mensagem: 'Não foi possível carregar as categorias.' }))
    }
  }, [aberto])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function obterLocalizacao() {
    if (!navigator.geolocation) {
      setErroModal({ aberto: true, mensagem: 'Geolocalização não suportada neste navegador.' })
      return
    }
    setBuscandoLocalizacao(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(prev => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }))
        setBuscandoLocalizacao(false)
      },
      () => {
        setErroModal({ aberto: true, mensagem: 'Não foi possível obter sua localização.' })
        setBuscandoLocalizacao(false)
      }
    )
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!form.descricao || !form.idCategoria || !form.pesoEstimado || !form.latitude || !form.longitude) {
      setErroModal({ aberto: true, mensagem: 'Preencha todos os campos obrigatórios.' })
      return
    }
    setEnviando(true)
    try {
      const payload = {
        idUsuario: (usuario as any)?.idUsuario,
        idCategoria: Number(form.idCategoria),
        descricao: form.descricao,
        pesoEstimado: parseFloat(form.pesoEstimado),
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        imagemUrl: form.imagemUrl || 'https://placehold.co/400x300?text=Sem+Imagem',
      }
      const descarteCriado = await api.post('/descartes', payload)
      onDescarteRegistrado(descarteCriado, form.imagemUrl, form.descricao)
      setForm({ descricao: '', idCategoria: '', pesoEstimado: '', latitude: '', longitude: '', imagemUrl: '' })
      onFechar()
    } catch {
      setErroModal({ aberto: true, mensagem: 'Erro ao registrar descarte. Tente novamente.' })
    } finally {
      setEnviando(false)
    }
  }

  const inputClass = `
    w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)]
    px-4 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)]
    focus:border-[var(--color-primary)] focus:outline-none transition
  `
  const labelClass = 'block text-xs font-medium text-[var(--color-text-muted)] mb-1.5 uppercase tracking-wide'

  return (
    <>
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
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-xl">
                    🗑️
                  </div>
                  <div>
                    <h2 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
                      Registrar Descarte
                    </h2>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      Informe os dados do resíduo
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

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className={labelClass}>Descrição *</label>
                  <textarea
                    name="descricao"
                    value={form.descricao}
                    onChange={handleChange}
                    placeholder="Ex: Garrafas PET, papelão, eletrônicos..."
                    rows={3}
                    className={inputClass + ' resize-none'}
                  />
                </div>

                <div>
                  <label className={labelClass}>Categoria *</label>
                  <select
                    name="idCategoria"
                    value={form.idCategoria}
                    onChange={handleChange}
                    className={inputClass + ' cursor-pointer'}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map(cat => (
                      <option key={String(cat.idCategoria)} value={cat.idCategoria}> {cat.nomeCategoria}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Peso estimado (kg) *</label>
                  <input
                    type="number"
                    name="pesoEstimado"
                    value={form.pesoEstimado}
                    onChange={handleChange}
                    placeholder="Ex: 3.5"
                    min="0"
                    step="0.1"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Localização *</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="number"
                      name="latitude"
                      value={form.latitude}
                      onChange={handleChange}
                      placeholder="Latitude"
                      step="any"
                      className={inputClass}
                    />
                    <input
                      type="number"
                      name="longitude"
                      value={form.longitude}
                      onChange={handleChange}
                      placeholder="Longitude"
                      step="any"
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={obterLocalizacao}
                    disabled={buscandoLocalizacao}
                    className="flex items-center gap-2 text-xs transition disabled:opacity-50"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {buscandoLocalizacao ? '⟳ Obtendo localização...' : '📍 Usar minha localização atual'}
                  </button>
                </div>

                <div>
                  <label className={labelClass}>URL da imagem</label>
                  <input
                    type="text"
                    name="imagemUrl"
                    value={form.imagemUrl}
                    onChange={handleChange}
                    placeholder="https://... (opcional)"
                    className={inputClass}
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={onFechar}
                    className="flex-1 rounded-xl border py-2.5 text-sm transition hover:opacity-80"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={enviando}
                    className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {enviando ? 'Registrando...' : 'Registrar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ModalErro
        aberto={erroModal.aberto}
        mensagem={erroModal.mensagem}
        onFechar={() => setErroModal({ aberto: false, mensagem: '' })}
      />
    </>
  )
}