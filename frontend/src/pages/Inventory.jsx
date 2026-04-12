import { useEffect, useState } from 'react'
import API from '../api/axios'

function Inventory() {
  const [inventory, setInventory] = useState([])

  const fetchInventory = () => {
    API.get('/inventory/').then(res => setInventory(res.data))
  }

  useEffect(() => { fetchInventory() }, [])

  const handleUpdate = async (id, quantity) => {
    await API.patch(`/inventory/${id}/`, { quantity: parseInt(quantity) })
    await fetchInventory()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Inventory</h2>

      <div className="bg-white rounded-xl p-6 shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Product</th>
              <th className="pb-2">Price</th>
              <th className="pb-2">Quantity</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-3 font-medium">{item.product_name}</td>
                <td className="py-3">₱{item.product_price}</td>
                <td className="py-3">{item.quantity} units</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.quantity <= item.low_stock_threshold
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {item.quantity <= item.low_stock_threshold ? '⚠️ Low Stock' : '✅ In Stock'}
                  </span>
                </td>
                <td className="py-3 flex items-center gap-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={e => {
                      const updated = inventory.map(i =>
                        i.id === item.id ? {...i, quantity: parseInt(e.target.value)} : i
                      )
                      setInventory(updated)
                    }}
                    className="border rounded-lg p-1 w-20 text-sm"
                  />
                  <button
                    onClick={() => handleUpdate(item.id, item.quantity)}
                    className="bg-orange-500 text-white rounded-lg px-3 py-1 text-xs font-semibold hover:bg-orange-600">
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Inventory