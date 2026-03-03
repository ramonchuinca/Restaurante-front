import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    Accept: 'application/json',
  },
})

// 🔑 Token automático
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 🔒 Token inválido ou expirado
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const auth = useAuthStore()

      auth.logout() // limpa store
      localStorage.removeItem('token') // limpa token

      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api