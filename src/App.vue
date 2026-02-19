<script setup>
import Navbar from './components/Navbar.vue'
import CartSidebar from './components/CartSidebar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- Navbar global -->
    <Navbar />
    <!-- Conteúdo das páginas -->
    <main class="flex-1">
      <router-view />
      <CartSidebar />
    </main>
  </div>
</template>