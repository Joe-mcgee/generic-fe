import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Register from '@/components/auth/Register.vue'
import Login from '@/components/auth/Login.vue'
import Logout from '@/components/auth/Logout.vue'
import Me from '@/components/auth/Me.vue'
import ForgotPassword from '@/components/auth/ForgotPassword.vue'
import ResetPassword from '@/components/auth/ResetPassword.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/forgotpassword',
    name: 'forgotpassword',
    component: ForgotPassword
  },
  {
    path: '/resetpassword/:resettoken',
    name: 'resetpassword',
    component: ResetPassword
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/logout',
    name: 'logout',
    component: Logout
  },
  {
    path: '/me',
    name: 'me',
    component: Me
  },
  {
    path: '/updatepassword',
    name: 'updatepassword',
    component: Register
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

export default router
