import { defineStore } from 'pinia'
import api from '../services/api'


export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')),
    token: localStorage.getItem('token'),
  }),

  getters: {
    isAuthenticated: state => !!state.token,
  },

  actions: {
    async login(credentials) {
      const response = await api.post('/login', credentials)

      const { user, access_token } = response.data

      this.user = user
      this.token = access_token

      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', access_token)
    },

    logout() {
      this.user = null
      this.token = null

      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
  },
})