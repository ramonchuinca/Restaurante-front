<script setup>
import { useCartStore } from '../stores/cart'
import { useUIStore } from '../stores/ui'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const ui = useUIStore()
const router = useRouter()

function goCheckout() {
  ui.closeCart()
  router.push('/checkout')
}
</script>

<template>
  <!-- Overlay -->
  <transition name="fade">
    <div
      v-if="ui.cartOpen"
      class="fixed inset-0 bg-black/50 z-40"
      @click="ui.closeCart"
    />
  </transition>

  <!-- Drawer -->
  <transition name="slide">
    <aside
      v-if="ui.cartOpen"
      class="fixed right-0 top-0 h-full w-80 bg-white p-4 shadow-lg z-50"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">🛒 Carrinho</h2>
        <button @click="ui.closeCart">❌</button>
      </div>

      <div v-if="cart.items.length === 0" class="text-gray-500 text-sm">
        Carrinho vazio
      </div>

      <div v-else>
        <div
          v-for="item in cart.items"
          :key="item.id"
          class="flex justify-between items-center mb-3"
        >
          <div>
            <p class="font-semibold text-sm">{{ item.name }}</p>
            <p class="text-xs text-gray-500">
              R$ {{ Number(item.price).toFixed(2) }}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="cart.decrement(item.id)"
              class="w-7 h-7 bg-gray-200 rounded"
            >
              −
            </button>

            <span class="font-bold w-6 text-center">
              {{ item.quantity }}
            </span>

            <button
              @click="cart.increment(item.id)"
              class="w-7 h-7 bg-gray-200 rounded"
            >
              +
            </button>
          </div>
        </div>

        <div class="border-t mt-4 pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>R$ {{ cart.total.toFixed(2) }}</span>
        </div>

        <button
          @click="goCheckout"
          class="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Finalizar pedido
        </button>
      </div>
    </aside>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>