import { Link, useLocation } from 'react-router-dom'

const links = [
  { path: '/', label: '📊 Dashboard' },
  { path: '/products', label: '🍔 Products' },
  { path: '/sales', label: '💰 Sales' },
  { path: '/inventory', label: '📦 Inventory' },
  { path: '/forecasting', label: '📈 Forecasting' },
]

function Sidebar({ onLogout }) {
  const location = useLocation()

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-lg font-bold leading-tight">
          Ultimate Burger
        </h1>
        <p className="text-xs text-gray-400 mt-1">& Pizza Management</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`block px-4 py-3 rounded-lg text-sm transition-colors ${
              location.pathname === link.path
                ? 'bg-orange-500 text-white font-semibold'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700 space-y-2">
        <p className="text-xs text-gray-500">Logged in as Admin</p>
        <button
          onClick={onLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors">
          🚪 Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar