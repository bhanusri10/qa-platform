import { NavLink, useNavigate } from 'react-router-dom'

const links = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/projects', label: 'Projects' },
  { path: '/testcases', label: 'Test Cases' },
  { path: '/defects', label: 'Defects' },
  { path: '/executions', label: 'Executions' },
]

function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">QA Platform</h1>
        <p className="text-gray-400 text-sm mt-1">Management System</p>
      </div>

      <nav className="flex-1 p-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block px-4 py-3 rounded mb-1 text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-600 rounded text-sm font-medium hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar