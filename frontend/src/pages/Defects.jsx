import { getRole } from '../utils/api'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import API from '../utils/api'

function Defects() {
  const role = getRole()
  const [defects, setDefects] = useState([])
  const [testcases, setTestcases] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState('medium')
  const [testCaseId, setTestCaseId] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    API.get('/defects/').then(res => setDefects(res.data))
    API.get('/testcases/').then(res => setTestcases(res.data))
  }, [])

  const handleCreate = async () => {
    try {
      const res = await API.post('/defects/', {
        title,
        description,
        severity,
        status: 'open',
        test_case_id: parseInt(testCaseId)
      })
      setDefects([...defects, res.data])
      setTitle('')
      setDescription('')
      setSeverity('medium')
      setTestCaseId('')
      setMessage('Defect logged successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to log defect')
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await API.put(`/defects/${id}`, { status: newStatus })
      setDefects(defects.map(d => d.id === id ? res.data : d))
    } catch (err) {
      console.error('Failed to update status', err)
    }
  }

  const severityColor = (s) => {
    if (s === 'critical') return 'bg-red-100 text-red-700'
    if (s === 'high') return 'bg-orange-100 text-orange-700'
    if (s === 'medium') return 'bg-yellow-100 text-yellow-700'
    return 'bg-green-100 text-green-700'
  }

  const statusColor = (s) => {
    if (s === 'open') return 'bg-red-100 text-red-700'
    if (s === 'in_progress') return 'bg-yellow-100 text-yellow-700'
    if (s === 'resolved') return 'bg-blue-100 text-blue-700'
    return 'bg-green-100 text-green-700'
  }

  return (
    <Layout title="Defects">
      {(role === 'admin' || role === 'manager') && (
        <div className="bg-white rounded shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Log New Defect</h3>
          {message && (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{message}</div>
          )}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Defect title"
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
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
            <input
              type="text"
              placeholder="Description"
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <button
            onClick={handleCreate}
            className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700"
          >
            Log Defect
          </button>
        </div>
      )}

      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-gray-600">ID</th>
              <th className="text-left px-6 py-3 text-gray-600">Title</th>
              <th className="text-left px-6 py-3 text-gray-600">Severity</th>
              <th className="text-left px-6 py-3 text-gray-600">Status</th>
              <th className="text-left px-6 py-3 text-gray-600">Test Case</th>
              {(role === 'admin' || role === 'manager') && (
                <th className="text-left px-6 py-3 text-gray-600">Update Status</th>
              )}
            </tr>
          </thead>
          <tbody>
            {defects.map(d => (
              <tr key={d.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-gray-500">{d.id}</td>
                <td className="px-6 py-3 font-medium text-gray-800">{d.title}</td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${severityColor(d.severity)}`}>
                    {d.severity}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor(d.status)}`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-500">{d.test_case_id}</td>
                {(role === 'admin' || role === 'manager') && (
                  <td className="px-6 py-3">
                    <select
                      className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={d.status}
                      onChange={(e) => handleStatusUpdate(d.id, e.target.value)}
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                )}
              </tr>
            ))}
            {defects.length === 0 && (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">No defects logged</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default Defects