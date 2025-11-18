import axios from 'axios'

const isDevFrontend = typeof window !== 'undefined' && window.location && (window.location.port === '5173' || window.location.port === '5174')
const baseURL = isDevFrontend ? 'http://localhost:3000' : '/'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    
    const headers: Record<string,string> = (config.headers as any) || {}
    headers['Authorization'] = `Bearer ${token}`
    config.headers = headers as any
  }
  return config
})

export default api
