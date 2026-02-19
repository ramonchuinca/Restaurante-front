// cart store
import { defineStore } from 'pinia'

const STORAGE_KEY = 'cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem(STORAGE_KEY)) || [],
  }),

  getters: {
    total(state) {
      return state.items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      )
    },
  },

  actions: {
    save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
    },

    add(product) {
      const item = this.items.find(i => i.id === product.id)

      if (item) {
        item.quantity++
      } else {
        this.items.push({
          ...product,
          price: Number(product.price),
          quantity: 1,
        })
      }

      this.save()
    },

    increment(productId) {
      const item = this.items.find(i => i.id === productId)
      if (item) {
        item.quantity++
        this.save()
      }
    },

    decrement(productId) {
      const item = this.items.find(i => i.id === productId)
      if (!item) return

      if (item.quantity > 1) {
        item.quantity--
      } else {
        this.items = this.items.filter(i => i.id !== productId)
      }

      this.save()
    },

    remove(productId) {
      this.items = this.items.filter(i => i.id !== productId)
      this.save()
    },

    clear() {
      this.items = []
      localStorage.removeItem(STORAGE_KEY)
    },

    // Função que vai ser usada para configurar os itens diretamente
    setItems(newItems) {
      this.items = newItems
      this.save()
    }
  },
})