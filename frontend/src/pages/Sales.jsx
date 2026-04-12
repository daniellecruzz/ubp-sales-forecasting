import { useEffect, useState } from 'react'
import API from '../api/axios'

function Sales() {
  const [sales, setSales] = useState([])
  const [products, setProducts] = useState([])
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
    await API.post('/sales/', form)
    setForm({ 
      product: '', 
      quantity: '', 
      total_amount: '', 
      date: new Date().toISOString().split('T')[0]  // ← today's date after reset
    })
    fetchSales()
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
      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Add Sales Record</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <select className="border rounded-lg p-2 text-sm"
            value={form.product} onChange={handleProductChange} required>
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} — ₱{p.price}
              </option>
            ))}
          </select>
          <input className="border rounded-lg p-2 text-sm" placeholder="Quantity" type="number"
            value={form.quantity} onChange={handleQuantityChange} required />
          <input className="border rounded-lg p-2 text-sm bg-gray-50" 
            placeholder="Total Amount (auto-computed)" type="number"
            value={form.total_amount} readOnly />
          <input className="border rounded-lg p-2 text-sm" type="date"
            value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
          <button type="submit"
            className="col-span-2 bg-orange-500 text-white rounded-lg p-2 text-sm font-semibold hover:bg-orange-600">
            Add Record
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl p-6 shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Product</th>
              <th className="pb-2">Quantity</th>
              <th className="pb-2">Total Amount</th>
              <th className="pb-2">Date</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(s => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="py-3 font-medium">{s.product_name}</td>
                <td className="py-3">{s.quantity}</td>
                <td className="py-3">₱{Number(s.total_amount).toLocaleString()}</td>
                <td className="py-3">{s.date}</td>
                <td className="py-3">
                  <button onClick={() => handleDelete(s.id)}
                    className="text-red-500 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Sales