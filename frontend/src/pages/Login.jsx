import { useState } from 'react'
import API from '../api/axios'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await API.post('/auth/login/', { username, password })
      localStorage.setItem('token', res.data.token)
      onLogin()
    } catch (err) {
      setError('Invalid username or password. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url('/bg.jpeg')`,
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Card */}
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-10 w-full max-w-lg">
        
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <span className="text-8xl">🍔</span>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">Ultimate Burger & Pizza</h1>
          <p className="text-gray-500 text-sm mt-2">Management System</p>
          <div className="w-16 h-1 bg-orange-500 rounded-full mx-auto mt-3"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-600 mb-1 block font-medium">Username</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block font-medium">Password</label>
            <input
              type="password"
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm text-center">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-orange-500 text-white rounded-xl p-3 font-semibold hover:bg-orange-600 transition-colors text-base mt-2">
            {loading ? '⏳ Logging in...' : '🔐 Login'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8">
          © 2026 Ultimate Burger & Pizza Management System
        </p>
      </div>
    </div>
  )
}

export default Login