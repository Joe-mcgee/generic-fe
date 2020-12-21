import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'

import Home from '@/views/Home.vue'
import Dashboard from '@/views/Dashboard.vue'
import Admin from '@/views/Admin.vue'

import Register from '@/components/auth/Register.vue'
import RegisterSuccess from '@/components/auth/RegisterSuccess.vue'
import Login from '@/components/auth/Login.vue'
import Logout from '@/components/auth/Logout.vue'
import Me from '@/components/auth/Me.vue'
import ForgotPassword from '@/components/auth/ForgotPassword.vue'
import ResetPassword from '@/components/auth/ResetPassword.vue'
import ResendEmail from '@/components/auth/ResendEmail.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      guest: true
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      guest: true
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/registersuccess',
    name: 'registersuccess',
    component: RegisterSuccess,
  },
  {
    path: '/forgotpassword',
    name: 'forgotpassword',
    component: ForgotPassword,
  },
  {
    path: '/resendconfirmemail',
    name: 'resendconfirmemail',
    component: ResendEmail,
  },
  {
    path: '/resetpassword/:resettoken',
    name: 'resetpassword',
    component: ResetPassword
  },
  {
    path: '/logout',
    name: 'logout',
    component: Logout,
    meta: {
      guest: false,
    }
  },
  {
    path: '/me',
    name: 'me',
    component: Me,
    meta: {
      requiresAuth: true,
      guest: false,
    }
  },
  {
    path: '/updatepassword',
    name: 'updatepassword',
    component: Register,
    meta: {
      requiresAuth: true,
      guest: false,
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    meta: {
      requiresAuth: true,
      is_admin: true,
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})



router.beforeEach((to, from, next) => {
  // save home page for potential landing page, redirect to login or dashboard
  if (to.name === "Home" ) {
    if (!VueCookies.get('token')) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath },
      })
    } else {
      
      next({
        path: '/dashboard',
        params: { nextUrl: to.fullPath },
      })
    }
  }
  // Reroute based on auth
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!VueCookies.get('token')) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath },
      })
    } else {
      next()
    }
  } else {
    next()
  }

})

export default router
