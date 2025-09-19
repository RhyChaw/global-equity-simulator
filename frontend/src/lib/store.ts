import { create } from 'zustand'
import { Country, getCountries, simulate } from './api'

type Scenario = {
  employee_name: string
  grant_percent: number
  valuation: number
}

type State = {
  countries: Country[]
  country: string
  scenario: Scenario
  result: any | null
  loading: boolean
  error: string | null
  loadCountries: () => Promise<void>
  setCountry: (c: string) => void
  setScenario: (patch: Partial<Scenario>) => void
  runSimulation: () => Promise<void>
}

export const useStore = create<State>((set, get) => ({
  countries: [],
  country: 'US',
  scenario: { employee_name: 'Alex', grant_percent: 1, valuation: 200_000_000 },
  result: null,
  loading: false,
  error: null,
  loadCountries: async () => {
    try {
      const countries = await getCountries()
      set({ countries })
    } catch (e: any) {
      set({ error: e?.message || 'Failed to load countries' })
    }
  },
  setCountry: (c) => set({ country: c }),
  setScenario: (patch) => set({ scenario: { ...get().scenario, ...patch } }),
  runSimulation: async () => {
    const { country, scenario } = get()
    set({ loading: true, error: null })
    try {
      const data = await simulate({
        country,
        valuation: scenario.valuation,
        grant_percent: scenario.grant_percent,
        employee_name: scenario.employee_name
      })
      set({ result: data })
    } catch (e: any) {
      set({ error: e?.message || 'Simulation failed' })
    } finally {
      set({ loading: false })
    }
  }
}))


