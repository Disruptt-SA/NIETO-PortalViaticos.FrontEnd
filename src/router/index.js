import { createRouter, createWebHistory } from 'vue-router'
import LoginApi from '../api/LoginApi'
import { useLoginStore } from '../stores/login'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import NewExpenseView from '../views/NewExpense.vue'
import SyncView from '../views/SyncView.vue'
import ExpenseView from '../views/ViewExpense.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/new-expense',
      name: 'newexpense',
      component: NewExpenseView,
      meta: { requiresAuth: true }
    },
    {
      path: '/sync',
      name: 'sync',
      component: SyncView,
      meta: { requiresAuth: true }
    },
    {
      path: '/expense/:id',
      name: 'viewexpense',
      component: ExpenseView,
      props: true,
      meta: { requiresAuth: true }
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(url => url.meta.requiresAuth)
  const loginStore = useLoginStore()
  if (requiresAuth) {
    try {
      /* const response = await LoginApi.getEmployeeById()

      if (response.data.Employee === null) {
        next({ name: 'login' })
      } else {
        next()
      } */
      if (loginStore.user === null || loginStore.user === '') {
        next({ name: 'login' })
      } else {
        next()
      }
    } catch (error) {
      next({ name: 'login' })
    }
  } else {
    next()
  }

  next({ name: 'login' })
})

export default router
