import { useEffect, useState } from 'react'
import API from '../api/axios'

function Products() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({
    name: '', price: '', category: '', stock: '', low_stock_threshold: ''
  })
  const [editing, setEditing] = useState(null)

  const fetchProducts = () => {
    API.get('/products/').then(res => setProducts(res.data))
  }

  useEffect(() => { fetchProducts() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) {
      await API.put(`/products/${editing}/`, form)
      setEditing(null)
    } else {
      await API.post('/products/', form)
    }
    setForm({ name: '', price: '', category: '', stock: '', low_stock_threshold: '' })
    fetchProducts()
  }

  const handleEdit = (p) => {
    setEditing(p.id)
    setForm({ name: p.name, price: p.price, category: p.category, 
               stock: p.stock, low_stock_threshold: p.low_stock_threshold })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await API.delete(`/products/${id}/`)
      fetchProducts()
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Products</h2>

      {/* Form */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          {editing ? 'Edit Product' : 'Add New Product'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input className="border rounded-lg p-2 text-sm" placeholder="Product Name"
            value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input className="border rounded-lg p-2 text-sm" placeholder="Category"
            value={form.category} onChange={e => setForm({...form, category: e.target.value})} required />
          <input className="border rounded-lg p-2 text-sm" placeholder="Price" type="number"
            value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
          <input className="border rounded-lg p-2 text-sm" placeholder="Stock" type="number"
            value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
          <input className="border rounded-lg p-2 text-sm" placeholder="Low Stock Threshold" type="number"
            value={form.low_stock_threshold} onChange={e => setForm({...form, low_stock_threshold: e.target.value})} required />
          <button type="submit"
            className="bg-orange-500 text-white rounded-lg p-2 text-sm font-semibold hover:bg-orange-600">
            {editing ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl p-6 shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Product</th>
              <th className="pb-2">Category</th>
              <th className="pb-2">Price</th>
              <th className="pb-2">Stock</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="py-3 font-medium">{p.name}</td>
                <td className="py-3 text-gray-500">{p.category}</td>
                <td className="py-3">₱{p.price}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    p.stock <= p.low_stock_threshold
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {p.stock} units
                  </span>
                </td>
                <td className="py-3 space-x-2">
                  <button onClick={() => handleEdit(p)}
                    className="text-blue-500 hover:underline text-xs">Edit</button>
                  <button onClick={() => handleDelete(p.id)}
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

export default Products