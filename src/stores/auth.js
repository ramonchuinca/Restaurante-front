import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')),
    token: localStorage.getItem('token') ?? '',
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials) {
      const response = await axios.post(
        'http://localhost:8000/api/login',
        credentials
      )

      const user = response.data?.user || {};
      const token = response.data?.access_token || '';

      this.user = user
      this.token = token

      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)

      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token}`
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.clear()
    },
  },
})