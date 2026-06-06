const BASE_URL = 'https://space-waste-api.onrender.com/api'

async function requisitar(endpoint, opcoes = {}) {
  const resposta = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...opcoes.headers,
    },
    ...opcoes,
  })

  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`)
  }

  const texto = await resposta.text()
  return texto ? JSON.parse(texto) : null
}

export const api = {
  get: (endpoint) => requisitar(endpoint),
  post: (endpoint, corpo) => requisitar(endpoint, {
    method: 'POST',
    body: JSON.stringify(corpo),
  }),
  put: (endpoint, corpo) => requisitar(endpoint, {
    method: 'PUT',
    body: JSON.stringify(corpo),
  }),
  delete: (endpoint) => requisitar(endpoint, {
    method: 'DELETE',
  }),
}