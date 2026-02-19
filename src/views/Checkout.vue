<script setup>
import { useCartStore } from "../stores/cart";
import { useRouter, useRoute } from "vue-router";
import api from "../services/api";
import { ref, computed, onMounted } from "vue";

// Pegando o estado do carrinho e do roteador
const cart = useCartStore();
const router = useRouter();
const route = useRoute();

// Definindo variáveis reativas
const loading = ref(false);
const address = ref("");
const paymentMethod = ref("");
const addressError = ref(false);

// Verifica se estamos editando o pedido
const orderId = route.params.orderId;
const isEditing = !!orderId;

// Computed para calcular o total do carrinho
const total = computed(() =>
  cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

// Função para validar o endereço
function validateAddress() {
  const regex = /[A-Za-z0-9\s]+,?\s?[0-9]+/; // Verifica se o endereço contém números e pelo menos um texto
  if (!address.value || !regex.test(address.value)) {
    addressError.value = true;
    return false;
  }
  addressError.value = false;
  return true;
}

// Funções para manipular o carrinho
function incrementItem(itemId) {
  cart.increment(itemId);
}

function decrementItem(itemId) {
  cart.decrement(itemId);
}

function removeItem(itemId) {
  cart.remove(itemId);
}

// Função para enviar o pedido
async function submitOrder() {
  if (cart.items.length === 0) return;

  if (!address.value || !paymentMethod.value || !validateAddress()) {
    alert("Informe um endereço válido e a forma de pagamento");
    return;
  }

  loading.value = true;

  try {
    if (isEditing) {
      // Atualiza os itens do pedido se estiver editando
      await api.put(`/orders/${orderId}/items`, {
        items: cart.items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      });
    } else {
      // Cria um novo pedido
      await api.post("/orders", {
        items: cart.items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        address: address.value,
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

// Função para carregar dados do pedido quando estamos editando
onMounted(async () => {
  if (isEditing) {
    const { data } = await api.get(`/orders/${orderId}`);

    // Atualiza os itens do carrinho com os itens do pedido
    cart.setItems(
      data.data.items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
      }))
    );

    address.value = data.data.address;
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
        <label class="block font-semibold mb-1">Endereço de entrega</label>
        <textarea
          v-model="address"
          class="w-full border rounded-lg p-2"
          placeholder="Rua, número, bairro, complemento..."
        ></textarea>
         <p v-if="addressError" class="text-red-500 text-sm">Por favor, informe um endereço válido.</p>
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