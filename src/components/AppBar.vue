<template>
  <v-app-bar
    app
    >
    <v-app-bar-nav-icon
      v-if="!errorOverlay"
      @click="toggleDrawer"
      >
    </v-app-bar-nav-icon>
    <v-toolbar-title
      v-if="!errorOverlay"
      >Generic Front End
    </v-toolbar-title>
    <v-spacer></v-spacer>
    
    <v-list-item
      style="max-width:250px"
      >
      <v-list-item-content>
        <v-list-item-title
          class="title text-right">
          <span
            v-if="!nameLoading"
            >{{name}}</span> 
          <v-progress-linear
            v-else
            indeterminate
            color="green"
            class="mr-3"
            >
          </v-progress-linear>

        </v-list-item-title>
      <v-list-item-subtitle
        class="text-right"
        >
        <span v-if="!emailLoading">{{email}}</span>
        <v-progress-linear
          v-else
          indeterminate
          color="green"
          class="mr-3"
          >
        </v-progress-linear>
      </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-btn
      v-if="!errorOverlay"
      :loading="logoutLoading"
      icon
      large
      outlined
      @click="logout"
      >
      <v-icon>
        mdi-logout
      </v-icon>
    </v-btn>
    <v-fade-transition>
      <v-overlay
        v-if="errorOverlay"
        color="error"
      >
      <span class="pr-3 black--text">
        Session Expired,
        <router-link
          to="/login"
          >Login</router-link>
      </span>
      </v-overlay>
    </v-fade-transition>
  </v-app-bar>
</template>

<script>
import authService from '@/services/auth-service.js'
import { bus } from '@/main.js'
import VueCookies from 'vue-cookies'
export default {
  name: 'App',
  async created() {
    await this.getMe()
    bus.$on('update-profile', async () => {
        await this.getMe()
      }) 
    bus.$on('cookie-set', () => {
      console.log('caught cookie event')
      this.hasCookie = true
    })
    if (VueCookies.get('token')) {
      this.hasCookie = true
    }
  },
  watch: {
    hasCookie: async function (val) {
      console.log(val)
      const response = await authService.getMe()
      if (response.success == true) {
        this.name = response.data.name
      } else {
        this.name = ''
      }
    },
  },
  data: () => ({
    hasCookie: false,
    name: '',
    nameLoading: true,
    email: '',
    emailLoading: true,
    logoutLoading: false,
    errorOverlay: false,
  }),
  methods: {
    async logout() {
      this.logoutLoading = true
      await authService.logout()
      this.logoutLoading = false
      this.$router.replace('/login')
    },
    async getMe() {
      this.nameLoading = true
      this.emailLoading = true
      
      const response = await authService.getMe()
      console.log('reee', response)
      if (response.success) {
        this.name = response.data.name
        this.nameLoading = false
        this.email = response.data.email
        this.emailLoading = false
      } else {
        this.errorOverlay = true
      }
    },
    toggleDrawer() {
      bus.$emit('toggle-drawer', {})
    },
  },

  
}
</script>
