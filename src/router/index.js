import { createRouter, createWebHistory } from "vue-router"
import Menu from "../views/Menu.vue"
import Checkout from "../views/Checkout.vue"
import Login from "../views/Login.vue"
import { useAuthStore } from "../stores/auth"

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/menu",
    name: "menu",
    component: Menu,
    meta: { requiresAuth: true },
  },
  {
    path: "/checkout",
    name: "checkout",
    component: Checkout,
    meta: { requiresAuth: true },
  },
  // ✅ ROTA PARA EDITAR PEDIDO
  {
    path: "/checkout/:orderId",
    name: "checkout-edit",
    component: Checkout,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/orders",
    name: "orders",
    component: () => import("../views/MeusPedidos.vue"),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ name: "login" })
  }

  if (to.name === "login" && auth.isAuthenticated) {
    return next({ name: "menu" })
  }

  next()
})

export default router