import { getRole } from '../utils/api'

function Navbar({ title }) {
  const role = getRole()
  const roleColor = {
    admin: 'bg-red-100 text-red-700',
    manager: 'bg-blue-100 text-blue-700',
    tester: 'bg-green-100 text-green-700'
  }

  return (
    <div className="bg-white shadow px-6 py-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <div className="flex items-center gap-3">
        {role && (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColor[role] || 'bg-gray-100 text-gray-700'}`}>
            {role.toUpperCase()}
          </span>
        )}
        <span className="text-sm text-gray-500">QA Management Platform</span>
      </div>
    </div>
  )
}

export default Navbar