import axios from 'axios'

const API_BASE = (import.meta.env.VITE_API_BASE && import.meta.env.VITE_API_BASE.replace(/\/$/, '')) || ''

export const api = axios.create({
  baseURL: `${API_BASE}/api`
})

export type Country = { code: string; name: string }

export const getCountries = async (): Promise<Country[]> => {
  const { data } = await api.get('/countries')
  return data.countries
}

export type SimulationRequest = {
  country: string
  valuation: number
  grant_percent: number
  employee_name: string
}

export const simulate = async (payload: SimulationRequest) => {
  const { data } = await api.post('/simulate', payload)
  return data
}

export const pdfUrl = (params: { employee: string; country: string }) => {
  const q = new URLSearchParams(params as any).toString()
  return `${API_BASE}/api/reports/pdf?${q}`
}

export const explainAI = async (result: any): Promise<string> => {
  const { data } = await api.post('/ai/explain', { result })
  return data.explanation as string
}


