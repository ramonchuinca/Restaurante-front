<script setup>
import { ref, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import CartSidebar from '../components/CartSidebar.vue'
import { useCartStore } from '../stores/cart'
import api from '../services/api'

const products = ref([])
const cart = useCartStore()

onMounted(async () => {
  const { data } = await api.get('/products')
  products.value = data.data ?? data
})

function addToCart(product) {
  cart.add(product)
}
</script>




<template>
  <div class="flex">
    <!-- PRODUTOS -->
    <div class="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @add-to-cart="addToCart"
      />
    </div>
     
    <!-- CARRINHO -->
    <CartSidebar />
  </div>
</template>