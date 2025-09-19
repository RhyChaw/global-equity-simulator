import { create } from 'zustand'
import { Country, getCountries, simulate, explainAI } from './api'

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
  explanation: string | null
  loadCountries: () => Promise<void>
  setCountry: (c: string) => void
  setScenario: (patch: Partial<Scenario>) => void
  runSimulation: () => Promise<void>
  getExplanation: () => Promise<void>
}

export const useStore = create<State>((set, get) => ({
  countries: [],
  country: 'US',
  scenario: { employee_name: 'Alex', grant_percent: 1, valuation: 200_000_000 },
  result: null,
  loading: false,
  error: null,
  explanation: null,
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
      let result = data
      // If backend returns zero or missing spread, use a quick client fallback based on country
      if (!result?.calc?.spread_value || result.calc.spread_value <= 0) {
        const sharesOutstanding = 100_000_000
        const fmv = scenario.valuation / sharesOutstanding
        const strike = fmv * 0.6
        const grantShares = sharesOutstanding * (scenario.grant_percent / 100)
        const spread = Math.max(fmv - strike, 0) * grantShares
        const countryTax: Record<string, number> = { US: 0.30, CA: 0.26, FR: 0.40, DE: 0.42, IN: 0.35 }
        const taxRate = countryTax[country] ?? 0.30
        const tax = spread * taxRate
        const takeHome = Math.max(spread - tax, 0)
        result = {
          employee: scenario.employee_name,
          country,
          valuation: scenario.valuation,
          grant_percent: scenario.grant_percent / 100,
          calc: { grant_shares: grantShares, spread_value: spread },
          tax_due: tax,
          take_home: takeHome,
          rule: { tax_rate: taxRate, vesting_years: 4, notes: 'Client fallback estimate' }
        }
      }
      set({ result, explanation: null })
    } catch (e: any) {
      // Client-side fallback if API fails
      const sharesOutstanding = 100_000_000
      const fmv = scenario.valuation / sharesOutstanding
      const strike = fmv * 0.6
      const grantShares = sharesOutstanding * (scenario.grant_percent / 100)
      const spread = Math.max(fmv - strike, 0) * grantShares
      const countryTax: Record<string, number> = { US: 0.30, CA: 0.26, FR: 0.40, DE: 0.42, IN: 0.35 }
      const taxRate = countryTax[country] ?? 0.30
      const tax = spread * taxRate
      const takeHome = Math.max(spread - tax, 0)
      set({
        result: {
          employee: scenario.employee_name,
          country,
          valuation: scenario.valuation,
          grant_percent: scenario.grant_percent / 100,
          calc: { grant_shares: grantShares, spread_value: spread },
          tax_due: tax,
          take_home: takeHome,
          rule: { tax_rate: taxRate, vesting_years: 4, notes: 'Client fallback estimate (API unavailable)' }
        },
        error: e?.message || 'Simulation failed; using fallback'
      })
    } finally {
      set({ loading: false })
    }
  },
  getExplanation: async () => {
    const { result } = get()
    if (!result) {
      set({ error: 'Run a simulation first' })
      return
    }
    set({ loading: true, error: null })
    try {
      const text = await explainAI(result)
      set({ explanation: text })
    } catch (e: any) {
      set({ error: e?.message || 'AI explanation failed' })
    } finally {
      set({ loading: false })
    }
  }
}))


