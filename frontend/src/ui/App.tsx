import React from 'react'
import { CountrySelector } from './CountrySelector'
import { ScenarioBuilder } from './ScenarioBuilder'
import { CapTableChart } from './CapTableChart'
import { useStore } from '../lib/store'
import { pdfUrl } from '../lib/api'

export const App: React.FC = () => {
  return (
    <>
      <header className="header" role="banner">
        <div className="header-inner">
          <div className="brand" aria-label="Global Equity Simulator">
            <div className="brand-mark" aria-hidden="true" />
            Global Equity Simulator
          </div>
          <div className="tagline">Model international grants, taxes, vesting—instantly</div>
        </div>
      </header>
      <div className="layout">
        <aside className="sidebar" aria-label="Controls">
          <div className="card" role="region" aria-labelledby="country-title">
            <h3 id="country-title" className="title">Country</h3>
            <CountrySelector />
          </div>
          <div className="card" role="region" aria-labelledby="scenario-title">
            <h3 id="scenario-title" className="title">Scenario</h3>
            <ScenarioBuilder />
          </div>
          <HowItWorks />
        </aside>
        <main className="content" role="main">
          <div className="grid two">
            <div className="card" role="region" aria-labelledby="cap-table-title">
              <h3 id="cap-table-title" className="title">Cap Table</h3>
              <CapTableChart />
            </div>
            <div className="card" role="region" aria-labelledby="summary-title">
              <h3 id="summary-title" className="title">Summary</h3>
              <SummaryPanel />
            </div>
          </div>
          <MetricsStrip />
        </main>
      </div>
    </>
  )
}

const SummaryPanel: React.FC = () => {
  const result = useStore(s => s.result)
  const country = useStore(s => s.country)
  const scenario = useStore(s => s.scenario)
  return (
    <div className="grid" aria-live="polite">
      <p className="muted">Run a simulation to estimate spread value, taxes, and take-home under country-specific rules. Export a PDF for compliance reporting.</p>
      {result ? (
        <div className="grid">
          <div className="stats">
            <div className="stat">
              <div className="label">Grant Shares</div>
              <div className="value">{Intl.NumberFormat().format(Math.round(result.calc?.grant_shares || 0))}</div>
            </div>
            <div className="stat">
              <div className="label">Spread Value</div>
              <div className="value">${Intl.NumberFormat().format(Math.round(result.calc?.spread_value || 0))}</div>
            </div>
            <div className="stat">
              <div className="label">Tax Due</div>
              <div className="value">${Intl.NumberFormat().format(Math.round(result.tax_due || 0))}</div>
            </div>
            <div className="stat">
              <div className="label">Take Home</div>
              <div className="value">${Intl.NumberFormat().format(Math.round(result.take_home || 0))}</div>
            </div>
          </div>
          <details>
            <summary className="muted">Technical details</summary>
            <pre className="card" aria-label="Raw JSON">{JSON.stringify(result, null, 2)}</pre>
          </details>
        </div>
      ) : (
        <div className="muted">No simulation yet. Configure a scenario and click Run Simulation.</div>
      )}
      <div className="panel-actions">
        <button onClick={() => window.open(pdfUrl({ employee: scenario.employee_name, country }), '_blank')}>Export PDF</button>
        <button className="secondary" onClick={() => alert('LLM explainer coming soon')}>Explain with AI</button>
      </div>
    </div>
  )
}

const MetricsStrip: React.FC = () => {
  const scenario = useStore(s => s.scenario)
  const country = useStore(s => s.country)
  return (
    <div className="grid">
      <div className="card" role="region" aria-label="Scenario context">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="muted">Context</div>
          <div>{scenario.employee_name} · {country} · {scenario.grant_percent}% · ${Intl.NumberFormat().format(scenario.valuation)}</div>
        </div>
      </div>
    </div>
  )
}

const HowItWorks: React.FC = () => (
  <div className="card" role="region" aria-labelledby="how-title">
    <h3 id="how-title" className="title">How it works</h3>
    <div className="grid">
      <p className="muted">This simulator shows how equity grants behave across countries:</p>
      <ul>
        <li><strong>Country rules</strong>: Different tax rates and vesting norms are applied.</li>
        <li><strong>Cap table math</strong>: A high-throughput microservice estimates shares and spread.</li>
        <li><strong>Compliance</strong>: Export a PDF summary for record-keeping.</li>
      </ul>
      <p className="muted">Under the hood: React (UI) → Django (rules, PDFs) → Spring (calculations). All container-ready and deployable to Kubernetes.</p>
    </div>
  </div>
)


