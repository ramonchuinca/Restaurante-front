import { createRouter, createWebHistory } from "vue-router"
import Menu from "../views/Menu.vue"
import Checkout from "../views/Checkout.vue"
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
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
    path: "/register",
    name: "register",
    component: Register,
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

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // 🔒 Se precisa de login
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ name: "login" })
  }

  // 🔁 Evita login duplicado
  if ((to.name === "login" || to.name === "register") && auth.isAuthenticated) {
    return next({ name: "menu" })
  }

  next()
})

export default router