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
        <input id="grant-input" type="number" value={scenario.grant_percent} onChange={e => setScenario({ grant_percent: Number(e.target.value) })} aria-describedby="grant-help" />
        <span className="muted">%</span>
      </div>
      <div id="grant-help" className="muted">Percentage of fully diluted shares to grant.</div>

      <label htmlFor="valuation-input">Company valuation (USD)</label>
      <div className="row">
        <input id="valuation-input" type="number" value={scenario.valuation} onChange={e => setScenario({ valuation: Number(e.target.value) })} />
      </div>

      <button onClick={runSimulation} disabled={loading} aria-busy={loading}>{loading ? 'Simulating…' : 'Run Simulation'}</button>
    </div>
  )
}


