import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    cartOpen: false,
  }),

  actions: {
    openCart() {
      this.cartOpen = true
    },
    closeCart() {
      this.cartOpen = false
    },
    toggleCart() {
      this.cartOpen = !this.cartOpen
    },
  },
})