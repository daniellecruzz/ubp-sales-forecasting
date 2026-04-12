import { useState } from 'react'
import API from '../api/axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function Forecasting() {
  const [model, setModel] = useState('prophet')
  const [period, setPeriod] = useState('weekly')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleForecast = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await API.get(`/forecasting/forecast/?model=${model}&period=${period}`)
      setResult(res.data)
    } catch (err) {
      setError('Not enough sales data to forecast. Please add more sales records first.')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Sales Forecasting</h2>

      {/* Helper text */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start gap-4">
        <span className="text-2xl">📌</span>
        <div className="text-sm text-gray-600 space-y-1">
          <p className="font-semibold text-gray-800">Before Generating a Forecast</p>
          <p>• Minimum of <span className="font-semibold text-orange-500">3 weeks</span> of sales data is required</p>
          <p>• For best results, use <span className="font-semibold text-orange-500">8 or more weeks</span> of data</p>
          <p>• Add sales records in the <span className="font-semibold text-orange-500">💰 Sales</span> page</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Forecast Settings</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Forecasting Model</label>
            <select className="border rounded-lg p-2 text-sm w-full"
              value={model} onChange={e => setModel(e.target.value)}>
              <option value="prophet">Prophet</option>
              <option value="ets">ETS (Holt-Winters)</option>
              <option value="sarima">SARIMA</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Period</label>
            <select className="border rounded-lg p-2 text-sm w-full"
              value={period} onChange={e => setPeriod(e.target.value)}>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={handleForecast}
              className="w-full bg-orange-500 text-white rounded-lg p-2 text-sm font-semibold hover:bg-orange-600">
              {loading ? 'Forecasting...' : '📈 Generate Forecast'}
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 shadow">
              <p className="text-sm text-gray-500">Model Used</p>
              <p className="text-2xl font-bold text-orange-500 uppercase">{result.model}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow">
              <p className="text-sm text-gray-500">MAPE</p>
              <p className="text-2xl font-bold text-blue-500">{result.mape}%</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow">
              <p className="text-sm text-gray-500">RMSE</p>
              <p className="text-2xl font-bold text-green-500">{result.rmse}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Forecast vs Actual Sales
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={result.chart_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#f97316" strokeWidth={2} name="Actual" />
                <Line type="monotone" dataKey="forecast" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Forecast" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Forecast Table */}
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Forecast Data</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Forecasted Sales</th>
                </tr>
              </thead>
              <tbody>
                {result.forecast_data.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-3">{row.date}</td>
                    <td className="py-3 font-semibold text-orange-500">
                      ₱{Number(row.forecast).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default Forecasting