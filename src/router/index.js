import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCookies from 'vue-cookies'

import Home from '@/views/Home.vue'
import Dashboard from '@/views/Dashboard.vue'
import Settings from '@/views/Settings.vue'
import Admin from '@/views/Admin.vue'

import Register from '@/views/Register.vue'
import RegisterSuccess from '@/components/auth/RegisterSuccess.vue'
import ConfirmEmail from '@/components/auth/ConfirmEmail.vue'
import Login from '@/components/auth/Login.vue'
import ForgotPassword from '@/components/auth/ForgotPassword.vue'
import ResetPassword from '@/components/auth/ResetPassword.vue'
import ForgotPasswordSuccess from '@/components/auth/ForgotPasswordSuccess.vue'
import ResetPasswordSuccess from '@/components/auth/ResetPasswordSuccess.vue'
import ResendEmail from '@/components/auth/ResendEmail.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
     requiresAuth: true 
    }
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
      requiresAuth: true,
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/api/v1/auth/confirmemail/:confirmtoken',
    name: 'confirmemail',
    component: ConfirmEmail,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/api/v1/auth/login',
    name: 'oauth',
    component: Dashboard,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/api/v1/auth/:provider/login/error',
    name: 'oauth login error',
    component: Login,
    meta: {
      requiresAuth: false,
    }
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
    path: '/forgotpasswordsuccess',
    name: 'forgotpasswordsuccess',
    component: ForgotPasswordSuccess,
    meta: {guest: true}
  },
  {
    path: '/resendconfirmemail',
    name: 'resendconfirmemail',
    component: ResendEmail,
  },
  {
    path: '/api/v1/auth/resetpassword/:resettoken',
    name: 'resetpassword',
    component: ResetPassword
  },
  {
    path: '/resetpasswordsuccess',
    name: 'resetpasswordsuccess',
    component: ResetPasswordSuccess,
    meta: {guest: true}
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
      isAdmin: true,
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '*',
    name: '404',
    component: Login,
    meta: {
      requiresAuth: false
    }
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})



router.beforeEach( (to, from, next) => {
  if (to.name === 'oauth') {
    VueCookies.set('oauth', true, "12h")
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {

    if (VueCookies.get('token') || to.params.token) {
      next()
    } else {
      // async cookie fast workaround
      next({
        path: '/login',
        params: { nextUrl: to.fullPath },
      })
    }
  } else {
    next()
  }
  /*
  if (to.name === "Home" || to.name == "404" ) {
    console.log('home or 404')
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
    if (!VueCookies.get('token')) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath },
      })
    } else {
      console.log('token')
      next()
    }
  } else {
    next()
  }

*/
})
export default router
