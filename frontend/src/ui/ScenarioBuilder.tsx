import React from 'react'
import { useStore } from '../lib/store'

export const ScenarioBuilder: React.FC = () => {
  const scenario = useStore(s => s.scenario)
  const setScenario = useStore(s => s.setScenario)
  const runSimulation = useStore(s => s.runSimulation)
  const loading = useStore(s => s.loading)

  return (
    <div className="grid">
      <label htmlFor="employee-input">Employee name</label>
      <input id="employee-input" value={scenario.employee_name} onChange={e => setScenario({ employee_name: e.target.value })} placeholder="Employee" />

      <label htmlFor="grant-input">Grant percentage</label>
      <div className="row">
        <input id="grant-input" type="number" min={0} max={20} step={0.01} value={scenario.grant_percent} onChange={e => setScenario({ grant_percent: Math.max(0, Math.min(20, Number(e.target.value))) })} aria-describedby="grant-help" />
        <span className="muted">%</span>
      </div>
      <div id="grant-help" className="muted">Percentage of fully diluted shares to grant.</div>

      <label htmlFor="valuation-input">Company valuation (USD)</label>
      <div className="row">
        <input id="valuation-input" type="number" min={1_000_000} step={100_000} value={scenario.valuation} onChange={e => setScenario({ valuation: Math.max(1_000_000, Number(e.target.value)) })} aria-describedby="valuation-help" />
      </div>
      <div id="valuation-help" className="muted">Minimum $1M valuation, adjust in $100k steps.</div>

      <button onClick={runSimulation} disabled={loading} aria-busy={loading}>{loading ? 'Simulating…' : 'Run Simulation'}</button>
    </div>
  )
}


