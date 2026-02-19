<template>
  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
    <!-- Skeletons shimmer -->
    <div v-if="loading">
      <SkeletonProductCard v-for="n in 6" :key="n" />
    </div>

    <!-- Produtos reais -->
    <div v-else v-for="produto in produtos" :key="produto.id" class="border rounded-lg p-4 flex flex-col gap-2 shadow-sm bg-white">
      <img :src="produto.imagem" class="h-32 w-full rounded-lg object-cover" />
      <h3 class="font-bold text-lg">{{ produto.nome }}</h3>
      <p class="text-gray-600">{{ produto.descricao }}</p>
      <button class="mt-2 bg-green-500 text-white py-2 rounded w-1/2">Adicionar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SkeletonProductCard from '@/components/SkeletonProductCard.vue'

const produtos = ref([])
const loading = ref(true)

onMounted(() => {
  setTimeout(() => {
    produtos.value = [
      { id: 1, nome: 'Feijoada', descricao: 'Feijoada completa', imagem: '/assets/feijoada.jpg' },
      { id: 2, nome: 'X-Tudo', descricao: 'Hambúrguer completo', imagem: '/assets/xtudo.jpg' },
      { id: 3, nome: 'Pizza', descricao: 'Massa fina com muito recheio', imagem: '/assets/pizza.jpg' },
    ]
    loading.value = false
  }, 2000) // simula carregamento
})
</script>