<!-- src/components/SkeletonProductCard.vue -->
<template>
  <div class="skeleton-card relative overflow-hidden bg-gray-200 rounded-lg p-4 flex flex-col gap-2">
    <!-- Imagem -->
    <div class="bg-gray-300 h-32 w-full rounded-lg"></div>
    <!-- Título -->
    <div class="bg-gray-300 h-5 w-3/4 rounded"></div>
    <!-- Descrição -->
    <div class="bg-gray-300 h-4 w-full rounded"></div>
    <div class="bg-gray-300 h-4 w-5/6 rounded"></div>
    <!-- Botão -->
    <div class="bg-gray-300 h-8 w-1/2 rounded mt-2"></div>

    <!-- Shimmer Effect -->
    <div class="absolute inset-0 shimmer"></div>
  </div>
</template>

<script setup>
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.skeleton-card {
  position: relative;
  overflow: hidden;
}

.skeleton-card .shimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 1.5s infinite;
}
</style>