<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-sm bg-white p-6 rounded shadow">
      <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>

      <form @submit.prevent="login">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full border p-2 mb-3 rounded focus:outline-none focus:ring focus:ring-blue-200"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Senha"
          class="w-full border p-2 mb-4 rounded focus:outline-none focus:ring focus:ring-blue-200"
        />

        <button
          type="submit"
          class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Entrar
        </button>
      </form>

      <!-- 🔗 LINK PARA REGISTRO -->
      <div class="text-center mt-4">
        <p class="text-sm text-gray-600">
          Ainda não tem conta?
          <router-link
            to="/register"
            class="text-blue-600 font-semibold hover:underline"
          >
            Criar conta
          </router-link>
        </p>
      </div>
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
    alert('Email ou senha inválidos')
  }
}
</script>