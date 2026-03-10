import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">QA Platform</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-700">Welcome to the Dashboard!</h2>
        <p className="text-gray-500 mt-2">You are successfully logged in.</p>
      </div>
    </div>
  )
}

export default Dashboard