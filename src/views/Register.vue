<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-sm bg-white p-6 rounded shadow">
      <h1 class="text-2xl font-bold mb-4 text-center">Criar conta</h1>

      <input
        v-model="name"
        type="text"
        placeholder="Nome"
        class="w-full border p-2 mb-3 rounded"
      />

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
        class="w-full border p-2 mb-3 rounded"
      />

      <input
        v-model="password_confirmation"
        type="password"
        placeholder="Confirmar senha"
        class="w-full border p-2 mb-4 rounded"
      />

      <button
        @click="register"
        class="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        Registrar
      </button>

      <p class="text-center text-sm mt-4">
        Já tem conta?
        <router-link to="/login" class="text-blue-600">
          Entrar
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')

async function register() {
  try {
    await axios.post('http://localhost:8000/api/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    })

    alert('Conta criada com sucesso!')
    router.push('/login')
  } catch (error) {
    alert('Erro ao registrar')
  }
}
</script>