import { getRole } from '../utils/api'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import API from '../utils/api'

function Executions() {
  const role = getRole()
  const [executions, setExecutions] = useState([])
  const [testcases, setTestcases] = useState([])
  const [testCaseId, setTestCaseId] = useState('')
  const [status, setStatus] = useState('pass')
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    API.get('/executions/').then(res => setExecutions(res.data))
    API.get('/testcases/').then(res => setTestcases(res.data))
  }, [])

  const handleCreate = async () => {
    try {
      const res = await API.post('/executions/', {
        test_case_id: parseInt(testCaseId),
        status,
        notes
      })
      setExecutions([...executions, res.data])
      setTestCaseId('')
      setStatus('pass')
      setNotes('')
      setMessage('Execution logged successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to log execution')
    }
  }

  const statusColor = (s) => {
    if (s === 'pass') return 'bg-green-100 text-green-700'
    if (s === 'fail') return 'bg-red-100 text-red-700'
    if (s === 'blocked') return 'bg-orange-100 text-orange-700'
    return 'bg-gray-100 text-gray-700'
  }

  return (
    <Layout title="Executions">
      {(role === 'admin' || role === 'manager' || role === 'tester') && (
        <div className="bg-white rounded shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Log Test Execution</h3>
          {message && (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{message}</div>
          )}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={testCaseId}
              onChange={(e) => setTestCaseId(e.target.value)}
            >
              <option value="">Select Test Case</option>
              {testcases.map(tc => (
                <option key={tc.id} value={tc.id}>{tc.title}</option>
              ))}
            </select>
            <select
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pass">Pass</option>
              <option value="fail">Fail</option>
              <option value="blocked">Blocked</option>
              <option value="skipped">Skipped</option>
            </select>
            <input
              type="text"
              placeholder="Notes (optional)"
              className="border rounded px-3 py-2 text-sm col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700"
          >
            Log Execution
          </button>
        </div>
      )}

      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-gray-600">ID</th>
              <th className="text-left px-6 py-3 text-gray-600">Test Case</th>
              <th className="text-left px-6 py-3 text-gray-600">Status</th>
              <th className="text-left px-6 py-3 text-gray-600">Notes</th>
              <th className="text-left px-6 py-3 text-gray-600">Executed At</th>
            </tr>
          </thead>
          <tbody>
            {executions.map(e => (
              <tr key={e.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-gray-500">{e.id}</td>
                <td className="px-6 py-3 text-gray-800">{e.test_case_id}</td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor(e.status)}`}>
                    {e.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-500">{e.notes || '—'}</td>
                <td className="px-6 py-3 text-gray-500">
                  {new Date(e.executed_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {executions.length === 0 && (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">No executions yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default Executions