import { getRole } from '../utils/api'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import API from '../utils/api'

function TestCases() {
  const role = getRole()
  const [testcases, setTestcases] = useState([])
  const [projects, setProjects] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [projectId, setProjectId] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    API.get('/testcases/').then(res => setTestcases(res.data))
    API.get('/projects/').then(res => setProjects(res.data))
  }, [])

  const handleCreate = async () => {
    try {
      const res = await API.post('/testcases/', {
        title,
        description,
        priority,
        status: 'active',
        project_id: parseInt(projectId)
      })
      setTestcases([...testcases, res.data])
      setTitle('')
      setDescription('')
      setPriority('medium')
      setProjectId('')
      setMessage('Test case created successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to create test case')
    }
  }

  const priorityColor = (p) => {
    if (p === 'high' || p === 'critical') return 'text-red-600'
    if (p === 'medium') return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <Layout title="Test Cases">
      {(role === 'admin' || role === 'manager') && (
        <div className="bg-white rounded shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Create Test Case</h3>
          {message && (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{message}</div>
          )}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Title"
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <select
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">Select Project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
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
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      )}

      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-gray-600">ID</th>
              <th className="text-left px-6 py-3 text-gray-600">Title</th>
              <th className="text-left px-6 py-3 text-gray-600">Priority</th>
              <th className="text-left px-6 py-3 text-gray-600">Status</th>
              <th className="text-left px-6 py-3 text-gray-600">Project</th>
            </tr>
          </thead>
          <tbody>
            {testcases.map(tc => (
              <tr key={tc.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-gray-500">{tc.id}</td>
                <td className="px-6 py-3 font-medium text-gray-800">{tc.title}</td>
                <td className={`px-6 py-3 font-medium ${priorityColor(tc.priority)}`}>{tc.priority}</td>
                <td className="px-6 py-3 text-gray-500">{tc.status}</td>
                <td className="px-6 py-3 text-gray-500">{tc.project_id}</td>
              </tr>
            ))}
            {testcases.length === 0 && (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">No test cases yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default TestCases