import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import TestCases from './pages/TestCases'
import Defects from './pages/Defects'
import Executions from './pages/Executions'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
      <Route path="/testcases" element={<PrivateRoute><TestCases /></PrivateRoute>} />
      <Route path="/defects" element={<PrivateRoute><Defects /></PrivateRoute>} />
      <Route path="/executions" element={<PrivateRoute><Executions /></PrivateRoute>} />
    </Routes>
  )
}

export default App