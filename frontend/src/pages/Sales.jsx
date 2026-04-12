import { useEffect, useState } from 'react'
import API from '../api/axios'

function Sales() {
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    product: '', quantity: '', total_amount: '', date: new Date().toISOString().split('T')[0]
  })

  const fetchSales = () => {
    API.get('/sales/').then(res => setSales(res.data))
  }

  useEffect(() => {
    fetchSales()
    API.get('/products/').then(res => setProducts(res.data))
  }, [])

  const handleProductChange = (e) => {
    const productId = e.target.value
    const selected = products.find(p => p.id === parseInt(productId))
    setForm({
      ...form,
      product: productId,
      total_amount: selected && form.quantity
        ? (selected.price * form.quantity).toFixed(2)
        : ''
    })
  }

  const handleQuantityChange = (e) => {
    const qty = e.target.value
    const selected = products.find(p => p.id === parseInt(form.product))
    setForm({
      ...form,
      quantity: qty,
      total_amount: selected && qty
        ? (selected.price * qty).toFixed(2)
        : ''
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await API.post('/sales/', form)
      setForm({
        product: '',
        quantity: '',
        total_amount: '',
        date: new Date().toISOString().split('T')[0]
      })
      fetchSales()
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else {
        setError('Something went wrong. Please try again.')
      }
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this record?')) {
      await API.delete(`/sales/${id}/`)
      fetchSales()
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Sales Records</h2>

      {/* Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-base font-semibold text-gray-700 mb-4">Add Sales Record</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <select
            className="border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
            value={form.product} onChange={handleProductChange} required>
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name} — ₱{p.price}</option>
            ))}
          </select>

          <input
            className="border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
            placeholder="Quantity" type="number"
            value={form.quantity} onChange={handleQuantityChange} required />

          <input
            className="border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
            placeholder="Total Amount (auto-computed)" type="number"
            value={form.total_amount} readOnly />

          <input
            className="border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
            type="date" value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })} required />

          {error && (
            <div className="col-span-2 bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm text-center">
              ❌ {error}
            </div>
          )}

          <button type="submit"
            className="col-span-2 bg-orange-500 text-white rounded-lg p-2.5 text-sm font-semibold hover:bg-orange-600 transition-colors">
            Add Record
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-base font-semibold text-gray-700 mb-4">Sales History</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2 font-medium">Product</th>
              <th className="pb-2 font-medium">Quantity</th>
              <th className="pb-2 font-medium">Total Amount</th>
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-400">No sales records yet.</td>
              </tr>
            ) : (
              sales.map(s => (
                <tr key={s.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-3 font-medium text-gray-800">{s.product_name}</td>
                  <td className="py-3 text-gray-600">{s.quantity}</td>
                  <td className="py-3 text-gray-600">₱{Number(s.total_amount).toLocaleString()}</td>
                  <td className="py-3 text-gray-600">{s.date}</td>
                  <td className="py-3">
                    <button onClick={() => handleDelete(s.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Sales