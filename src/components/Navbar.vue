<script setup>
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useUIStore } from '../stores/ui'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const cart = useCartStore()
const ui = useUIStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <nav class="bg-gray-800 text-white p-4 flex justify-between items-center">
    <span class="font-bold text-lg">Restaurant</span>

    <div class="flex gap-6 items-center">
      <RouterLink to="/menu">Menu</RouterLink>
      <RouterLink to="/orders">Pedidos</RouterLink>
      <RouterLink to="/checkout">Checkout</RouterLink>

      <!-- 🛒 Carrinho -->
      <div class="relative cursor-pointer" @click="ui.toggleCart">
        🛒
        <span
          v-if="cart.totalItems > 0"
          class="absolute -top-2 -right-3 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
        >
          {{ cart.totalItems }}
        </span>
      </div>

      <button
        v-if="auth.isAuthenticated"
        @click="logout"
        class="bg-red-500 px-3 py-1 rounded"
      >
        Logout
      </button>
    </div>
  </nav>
</template>