<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-sm bg-white p-6 rounded shadow">
      <h1 class="text-2xl font-bold mb-4 text-center">Login</h1>
      
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full border p-2 mb-3 rounded"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Senha"
        class="w-full border p-2 mb-4 rounded"
      />

      <button
        @click="login"
        class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Entrar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')

const auth = useAuthStore()
const router = useRouter()

async function login() {
  try {
    await auth.login({
      email: email.value,
      password: password.value,
    })

    router.push('/menu')
  } catch (error) {
    alert('Login inválido')
  }
}
</script>