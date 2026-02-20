<template>
  <div
    class="border rounded-lg p-3 flex flex-col items-center 
    bg-white shadow hover:shadow-md
     transition cursor-pointer "
  >
    <!-- IMAGEM -->
    <img
      :src="imageSrc"
      :alt="product.name"
      class="w-24 h-24 object-cover rounded mb-2"
    />

    <!-- NOME -->
    <h3 class="text-sm font-bold text-center leading-tight">
      {{ product.name }}
    </h3>

    <!-- DESCRIÇÃO -->
    <p class="text-gray-500 text-xs text-center line-clamp-2">
      {{ product.description || 'Sem descrição' }}
    </p>

    <!-- PREÇO -->
    <p class="mt-1 font-semibold text-green-600 text-sm">
      R$ {{ price }}
    </p>

    <!-- BOTÃO COM BADGE -->
    <button
      @click="$emit('add-to-cart', product)"
      class="relative mt-3 w-full bg-blue-600 text-white py-1.5 rounded text-sm hover:bg-blue-700 transition cursor-pointer"
    >
      🛒 Adicionar

      <!-- BADGE DE QUANTIDADE -->
      <span
        v-if="quantity > 0"
        class="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
      >
        {{ quantity }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cart = useCartStore()

/* 💰 preço formatado */
const price = computed(() =>
  Number(props.product.price).toFixed(2)
)

/* 🧮 quantidade no carrinho (NÃO quebra nada) */
const quantity = computed(() => {
  const item = cart.items.find(i => i.id === props.product.id)
  return item ? item.quantity : 0
})

/* 🖼️ imagem com fallback automático */
const imageSrc = computed(() => {
  if (props.product.image_url) {
    return props.product.image_url
  }

  return `https://picsum.photos/seed/${encodeURIComponent(
    props.product.name
  )}/300/300`
})
</script>