<script setup>
import api from "../services/api";
import { ref, onMounted, onUnmounted } from "vue"
import { useRouter } from "vue-router"

const orders = ref([]);
const loading = ref(true);
const opened = ref(null);
const finalizando = ref(null);
let interval = null;

// Função para buscar os pedidos
async function fetchOrders(showLoader = false) {
  if (showLoader) loading.value = true;

  try {
    const { data } = await api.get("/orders");
    orders.value = data.data ?? [];
  } catch (err) {
    console.error("Erro ao buscar pedidos", err);
    orders.value = [];
  } finally {
    loading.value = false;
  }
}

// Atualiza os pedidos a cada 10 segundos
onMounted(() => {
  fetchOrders(true);
  interval = setInterval(fetchOrders, 10000); // Atualiza a cada 10 segundos
});

// Limpa o intervalo ao sair da página
onUnmounted(() => {
  if (interval) clearInterval(interval);
});

function toggle(id) {
  opened.value = opened.value === id ? null : id;
}

function formatDate(date) {
  if (!date) return "Data inválida";
  const formattedDate = new Date(date);
  if (isNaN(formattedDate)) return "Data inválida";
  return formattedDate.toLocaleString("pt-BR");
}

function formatPrice(value) {
  return Number(value || 0)
    .toFixed(2)
    .replace(".", ",");
}

function statusClass(status) {
  return (
    {
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      delivered: "bg-green-100 text-green-700",
      canceled: "bg-red-100 text-red-700",
    }[status] || "bg-gray-100 text-gray-700"
  );
}

async function finalizarPedido(orderId) {
  finalizando.value = orderId;

  try {
    await api.put(`/orders/${orderId}`, {
      status: "delivered",
    });

    await fetchOrders();
    alert("Pedido finalizado com sucesso ✅");
  } catch (err) {
    if (err.response?.status === 422) {
      alert("Pedido não pode mais ser finalizado.");
    } else {
      alert("Erro ao finalizar pedido");
    }
    console.error(err);
  } finally {
    finalizando.value = null;
  }
}

function statusLabel(status) {
  return {
    pending: 'Pendente',
    processing: 'Em preparo',
    delivered: 'Concluído',
    canceled: 'Cancelado',
  }[status] || 'Desconhecido'
}

const router = useRouter()

function editarPedido(orderId) {
  router.push(`/checkout/${orderId}`)
}

async function excluirPedido(orderId) {
  if (!confirm('Tem certeza que deseja excluir este pedido?')) return

  try {
    await api.delete(`/orders/${orderId}`)
    await fetchOrders()
  } catch (err) {
    alert('Erro ao excluir pedido')
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Meus Pedidos</h1>

    <div v-if="loading" class="text-center text-gray-500 animate-pulse">
      Carregando pedidos...
    </div>

    <div v-else-if="orders.length === 0" class="text-center text-gray-500">
      Você ainda não fez nenhum pedido 🍔
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="border rounded-lg p-4 bg-white"
      >
        <!-- Cabeçalho -->
        <div
          class="flex justify-between items-center cursor-pointer"
          @click="toggle(order.id)"
        >
          <div>
            <p class="font-semibold">Pedido #{{ order.id }}</p>
            <p class="text-sm text-gray-500">
              {{ formatDate(order.created_at) }}
            </p>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <span
              class="text-xs px-2 py-1 rounded font-semibold capitalize"
              :class="statusClass(order.status)"
            >
              {{ statusLabel(order.status) }}
            </span>
          </div>

          <div class="text-right">
            <p class="font-bold mt-1">R$ {{ formatPrice(order.total) }}</p>
          </div>
        </div>

        <!-- Itens -->
        <div v-if="opened === order.id" class="mt-4 border-t pt-4">
          <div
            v-for="item in order.items ?? []"
            :key="item.id"
            class="flex justify-between text-sm mb-2"
          >
            <span>
              {{ item.product?.name ?? 'Produto' }} x {{ item.quantity }}
            </span>
            <span>
              R$ {{ formatPrice((item.price ?? 0) * item.quantity) }}
            </span>
          </div>
        </div>

        <!-- Finalizar -->
        <button
          v-if="order.status === 'pending'"
          @click.stop="finalizarPedido(order.id)"
          :disabled="finalizando === order.id"
          class="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ finalizando === order.id ? "Finalizando..." : "Finalizar Pedido" }}
        </button>

        <div v-if="order.status === 'pending'" class="mt-3 flex gap-2">
          <button
            @click.stop="editarPedido(order.id)"
            class="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Editar
          </button>

          <button
            @click.stop="excluirPedido(order.id)"
            class="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>