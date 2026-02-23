import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import PublicView from './views/PublicView.vue'
import AdminView from './views/AdminView.vue'
import AdminTicketsView from './views/AdminTicketsView.vue'
import AdminPointConfigView from './views/AdminPointConfigView.vue'
import AdminPlayersView from './views/AdminPlayersView.vue'
import AdminRejectionReasonsView from './views/AdminRejectionReasonsView.vue'
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import DashboardView from './views/DashboardView.vue'
import TicketListView from './views/TicketListView.vue'
import TicketCreateView from './views/TicketCreateView.vue'
import TicketEditView from './views/TicketEditView.vue'
import TicketDetailView from './views/TicketDetailView.vue'
import CompareView from './views/CompareView.vue'
import { initAuth, isAuthenticated, isAdmin } from './composables/useAuth.js'

const routes = [
  {
    path: '/',
    name: 'public',
    component: PublicView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/tickets',
    name: 'tickets',
    component: TicketListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/tickets/create',
    name: 'ticket-create',
    component: TicketCreateView,
    meta: { requiresAuth: true }
  },
  {
    path: '/tickets/:id',
    name: 'ticket-detail',
    component: TicketDetailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/tickets/:id/edit',
    name: 'ticket-edit',
    component: TicketEditView,
    meta: { requiresAuth: true }
  },
  {
    path: '/compare',
    name: 'compare',
    component: CompareView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/tickets',
    name: 'admin-tickets',
    component: AdminTicketsView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/point-config',
    name: 'admin-point-config',
    component: AdminPointConfigView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/players',
    name: 'admin-players',
    component: AdminPlayersView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/rejection-reasons',
    name: 'admin-rejection-reasons',
    component: AdminRejectionReasonsView,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated.value) {
    next('/dashboard')
  } else if (to.meta.requiresAdmin && !isAdmin.value) {
    next('/dashboard')
  } else {
    next()
  }
})

const app = createApp(App)
app.use(router)

initAuth().then(() => {
  app.mount('#app')
})
