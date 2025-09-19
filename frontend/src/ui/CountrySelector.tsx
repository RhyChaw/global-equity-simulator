import React from 'react'
import { useStore } from '../lib/store'

export const CountrySelector: React.FC = () => {
  const country = useStore(s => s.country)
  const setCountry = useStore(s => s.setCountry)
  const countries = useStore(s => s.countries) ?? []
  const loadCountries = useStore(s => s.loadCountries)

  React.useEffect(() => { loadCountries() }, [loadCountries])

  return (
    <div className="grid">
      <label htmlFor="country-select">Select a country</label>
      <select id="country-select" value={country} onChange={e => setCountry(e.target.value)} aria-describedby="country-help">
        {(countries && countries.length ? countries : [
          { code: 'US', name: 'United States' }
        ]).map(c => (
          <option key={c.code} value={c.code}>{c.name}</option>
        ))}
      </select>
      <div id="country-help" className="muted">Applies country-specific tax and vesting rules to your scenario.</div>
    </div>
  )
}


