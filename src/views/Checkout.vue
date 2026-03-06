<script setup>
import { useCartStore } from "../stores/cart";
import { useRouter, useRoute } from "vue-router";
import api from "../services/api";
import axios from "axios";
import { ref, computed, onMounted } from "vue";

// Pegando o estado do carrinho e do roteador
const cart = useCartStore();
const router = useRouter();
const route = useRoute();

// Estados
const loading = ref(false);
const paymentMethod = ref("");
const addressError = ref(false);

// Campos de endereço
const cep = ref("");
const rua = ref("");
const numero = ref("");
const bairro = ref("");
const cidade = ref("");
const estado = ref("");

// Verifica se estamos editando o pedido
const orderId = route.params.orderId;
const isEditing = !!orderId;

// Total do carrinho
const total = computed(() =>
  cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

// Buscar endereço pelo CEP
async function buscarCep() {
  if (cep.value.length < 8) return;

  try {
    const { data } = await axios.get(`https://viacep.com.br/ws/${cep.value}/json/`);

    rua.value = data.logradouro;
    bairro.value = data.bairro;
    cidade.value = data.localidade;
    estado.value = data.uf;

  } catch (error) {
    console.error("Erro ao buscar CEP");
  }
}

// Validar endereço
function validateAddress() {
  if (!rua.value || !numero.value || !bairro.value || !cidade.value || !estado.value) {
    addressError.value = true;
    return false;
  }

  addressError.value = false;
  return true;
}

// Manipulação do carrinho
function incrementItem(itemId) {
  cart.increment(itemId);
}

function decrementItem(itemId) {
  cart.decrement(itemId);
}

function removeItem(itemId) {
  cart.remove(itemId);
}

// Enviar pedido
async function submitOrder() {
  if (cart.items.length === 0) return;

  if (!paymentMethod.value || !validateAddress()) {
    alert("Informe endereço e forma de pagamento");
    return;
  }

  loading.value = true;

  // Monta endereço completo
  const fullAddress = `${rua.value}, ${numero.value} - ${bairro.value}, ${cidade.value} - ${estado.value}, CEP: ${cep.value}`;

  try {
    if (isEditing) {

      await api.put(`/orders/${orderId}/items`, {
        items: cart.items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      });

    } else {

      await api.post("/orders", {
        items: cart.items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        address: fullAddress,
        payment_method: paymentMethod.value,
      });

    }

    cart.clear();
    router.push("/orders");

  } catch (err) {
    console.error(err);
    alert("Erro ao finalizar pedido 😢");
  } finally {
    loading.value = false;
  }
}

// Carregar pedido se estiver editando
onMounted(async () => {
  if (isEditing) {
    const { data } = await api.get(`/orders/${orderId}`);

    cart.setItems(
      data.data.items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
      }))
    );

    paymentMethod.value = data.data.payment_method;
  }
});
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Checkout</h1>

    <div v-if="cart.items.length === 0" class="text-center text-gray-500">
      Carrinho vazio 😢
    </div>

    <div v-else>
      <!-- ITENS -->
      <div
        v-for="item in cart.items"
        :key="item.id"
        class="flex justify-between items-center border-b py-4"
      >
        <div class="flex items-center gap-4">
          <!-- AUMENTAR QUANTIDADE -->
          <button
            @click="incrementItem(item.id)"
            class="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                d="M12 5v14m7-7H5"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </button>

          <!-- Nome e Quantidade -->
          <span class="font-semibold"
            >{{ item.name }} (x{{ item.quantity }})</span
          >

          <!-- DIMINUIR QUANTIDADE -->
          <button
            @click="decrementItem(item.id)"
            class="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                d="M20 12H4"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </button>
        </div>

        <!-- Preço -->
        <span class="text-lg font-semibold text-gray-800">
          R$ {{ (item.price * item.quantity).toFixed(2) }}
        </span>

        <!-- REMOVE ITEM -->
        <button
          @click="removeItem(item.id)"
          class="bg-red-500 text-white hover:bg-red-600 font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
        >
          Remover
        </button>
      </div>

      <!-- TOTAL -->
      <div class="flex justify-between font-bold mt-4 text-lg">
        <span>Total</span>
        <span>R$ {{ total.toFixed(2) }}</span>
      </div>

      <!-- ENDEREÇO -->
   <div class="mt-6">
  <label class="block font-semibold mb-2">Endereço de entrega</label>

  <div class="grid grid-cols-2 gap-3">

    <input
      v-model="cep"
      @blur="buscarCep"
      placeholder="CEP"
      class="border rounded-lg p-2"
    />

    <input
      v-model="rua"
      placeholder="Rua"
      class="border rounded-lg p-2"
    />

    <input
      v-model="numero"
      placeholder="Número"
      class="border rounded-lg p-2"
    />

    <input
      v-model="bairro"
      placeholder="Bairro"
      class="border rounded-lg p-2"
    />

    <input
      v-model="cidade"
      placeholder="Cidade"
      class="border rounded-lg p-2"
    />

    <input
      v-model="estado"
      placeholder="Estado"
      class="border rounded-lg p-2"
    />

  </div>

  <p v-if="addressError" class="text-red-500 text-sm mt-2">
    Preencha todos os campos do endereço
  </p>
</div>

      <!-- PAGAMENTO -->
      <div class="mt-4">
        <label class="block font-semibold mb-1">Forma de pagamento</label>
        <select v-model="paymentMethod" class="w-full border rounded-lg p-2">
          <option value="">Selecione</option>
          <option value="pix">PIX</option>
          <option value="card">Cartão</option>
          <option value="cash">Dinheiro</option>
        </select>
      </div>

      <!-- BOTÃO -->
      <button
        @click="submitOrder"
        :disabled="loading"
        class="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors cursor-pointer"
      >
        {{ loading ? "Enviando..." : "Confirmar Pedido" }}
      </button>
    </div>
  </div>
</template>