import axios from 'axios'

const API = axios.create({
  baseURL: 'https://ubp-sales-forecasting.onrender.com/api',
})

export default API