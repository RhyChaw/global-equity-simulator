import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useStore } from '../lib/store'

const COLORS = ['#ffffff', '#d9d9d9', '#a6a6a6', '#7f7f7f', '#595959']

const demoData = [
  { name: 'Founders', value: 55 },
  { name: 'Investors', value: 30 },
  { name: 'ESOP', value: 10 },
  { name: 'Employees', value: 5 }
]

export const CapTableChart: React.FC = () => {
  const result = useStore(s => s.result)
  const data = React.useMemo(() => {
    if (!result?.calc?.grant_shares) return demoData
    const grant = result.calc.grant_shares
    const esop = Math.max(10 - Math.min(grant / 1_000_000, 5), 3)
    const founders = Math.max(55 - Math.min(grant / 2_000_000, 10), 30)
    const employees = Math.min(5 + Math.min(grant / 2_000_000, 10), 20)
    const investors = Math.max(100 - (esop + founders + employees), 5)
    return [
      { name: 'Founders', value: Math.round(founders) },
      { name: 'Investors', value: Math.round(investors) },
      { name: 'ESOP', value: Math.round(esop) },
      { name: 'Employees', value: Math.round(employees) }
    ]
  }, [result])
  return (
    <div style={{ width: '100%', height: 360 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#1f1f1f" />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: '#111', border: '1px solid #1f1f1f', color: '#fff' }} />
          <Legend wrapperStyle={{ color: '#9a9a9a' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}


