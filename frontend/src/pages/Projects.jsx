import { getRole } from '../utils/api'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import API from '../utils/api'

function Projects() {
  const role = getRole()
  const [projects, setProjects] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    API.get('/projects/').then(res => setProjects(res.data))
  }, [])

  const handleCreate = async () => {
    try {
      const res = await API.post('/projects/', { name, description })
      setProjects([...projects, res.data])
      setName('')
      setDescription('')
      setMessage('Project created successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to create project')
    }
  }

  return (
    <Layout title="Projects">
      {(role === 'admin' || role === 'manager') && (
        <div className="bg-white rounded shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Create New Project</h3>
          {message && (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{message}</div>
          )}
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Project name"
              className="border rounded px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              className="border rounded px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-gray-600">ID</th>
              <th className="text-left px-6 py-3 text-gray-600">Name</th>
              <th className="text-left px-6 py-3 text-gray-600">Description</th>
              <th className="text-left px-6 py-3 text-gray-600">Created</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-gray-500">{p.id}</td>
                <td className="px-6 py-3 font-medium text-gray-800">{p.name}</td>
                <td className="px-6 py-3 text-gray-500">{p.description || '—'}</td>
                <td className="px-6 py-3 text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-400">No projects yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default Projects