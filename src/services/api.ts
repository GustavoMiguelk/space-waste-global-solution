const BASE_URL = 'https://space-waste-api.onrender.com/api'

async function requisitar(endpoint: string, opcoes: any = {}) {
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
  get: (endpoint: string) => requisitar(endpoint),
  post: (endpoint: string, corpo: any) => requisitar(endpoint, {
    method: 'POST',
    body: JSON.stringify(corpo),
  }),
  put: (endpoint: string, corpo: any) => requisitar(endpoint, {
    method: 'PUT',
    body: JSON.stringify(corpo),
  }),
  delete: (endpoint: string) => requisitar(endpoint, {
    method: 'DELETE',
  }),
}