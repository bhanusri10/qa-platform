import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Layout from '../components/Layout'
import API from '../utils/api'

function Dashboard() {
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    API.get('/executions/metrics')
      .then(res => setMetrics(res.data))
      .catch(err => console.error(err))
  }, [])

  const chartData = metrics ? [
    { name: 'Passed', value: metrics.passed },
    { name: 'Failed', value: metrics.failed },
    { name: 'Blocked', value: metrics.blocked },
    { name: 'Skipped', value: metrics.skipped },
  ] : []

  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Total Executions</p>
          <p className="text-3xl font-bold text-gray-800">{metrics?.total ?? '--'}</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Passed</p>
          <p className="text-3xl font-bold text-green-600">{metrics?.passed ?? '--'}</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Failed</p>
          <p className="text-3xl font-bold text-red-600">{metrics?.failed ?? '--'}</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Pass Rate</p>
          <p className="text-3xl font-bold text-blue-600">{metrics?.pass_rate ?? '--'}%</p>
        </div>
      </div>

      <div className="bg-white rounded shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Execution Results</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Layout>
  )
}

export default Dashboard