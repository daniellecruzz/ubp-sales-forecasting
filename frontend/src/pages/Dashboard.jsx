import { useEffect, useState } from 'react'
import API from '../api/axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [products, setProducts] = useState([])

  useEffect(() => {
    API.get('/sales/summary/').then(res => setSummary(res.data))
    API.get('/products/').then(res => setProducts(res.data))
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-3xl font-bold text-orange-500">
            ₱{summary ? Number(summary.total_sales).toLocaleString() : '0'}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-sm text-gray-500">Weekly Sales</p>
          <p className="text-3xl font-bold text-green-500">
            ₱{summary ? Number(summary.weekly_sales).toLocaleString() : '0'}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-sm text-gray-500">Monthly Sales</p>
          <p className="text-3xl font-bold text-blue-500">
            ₱{summary ? Number(summary.monthly_sales).toLocaleString() : '0'}
          </p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Monthly Sales Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={summary ? summary.monthly_data : []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#f97316" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Products Overview</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Product</th>
              <th className="pb-2">Category</th>
              <th className="pb-2">Price</th>
              <th className="pb-2">Stock</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="py-3 font-medium">{p.name}</td>
                <td className="py-3 text-gray-500">{p.category}</td>
                <td className="py-3">₱{p.price}</td>
                <td className="py-3">{p.stock} units</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    p.stock <= p.low_stock_threshold
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {p.stock <= p.low_stock_threshold ? '⚠️ Low Stock' : '✅ In Stock'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard