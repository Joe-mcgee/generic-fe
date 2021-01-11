<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-if="showNavigation"
      v-model="drawer"
      mobile-breakpoint="500"
      bottom
      app
    >
      <!--  -->
      <v-img
        class="white--text align-end"
        height="64px"
        src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
      >
       <v-card-title>Generic Logo</v-card-title>
      </v-img>
      <v-divider></v-divider>      
      <v-list
        v-if="showNavigation"
        dense
        nav
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          @click="go(item.link)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      v-if="showNavigation"
      app
      >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Generic Front End</v-toolbar-title>
      <v-spacer></v-spacer>
      <p
        class="subtitle-1 d-none mb-0 pr-3 d-sm-inline"
        v-if="name"
      >
      {{name}}
      </p>
      <v-progress-linear
        v-else
        indeterminate
        color="green"
        style="width: 62px;"
        class="mr-3"
        >
      </v-progress-linear>
      <v-btn
        :loading="loading"
        icon
        large
        outlined
        @click="logout"
        >
        <v-icon>
          mdi-logout
        </v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <!--  -->
      <router-view :key="$route.fullPath"></router-view>
    </v-main>
  </v-app>
</template>

<script>
import authService from '@/services/auth-service.js'
import { bus } from '@/main.js'
import VueCookies from 'vue-cookies'
export default {
  name: 'App',
  async created() {
    bus.$on('cookie-set', () => {
      console.log('caught cookie event')
      this.hasCookie = true
    })
    if (VueCookies.get('token')) {
      this.hasCookie = true
    }
  },
  computed: {
    showNavigation() {
      switch (this.$route.name) {
        case 'home':
          return false
        case 'register':
          return false
        case 'login':
          return false
        case 'forgotpassword':
          return false
        case 'resendconfirmemail':
          return false
        case 'registersuccess':
          return false
        case 'confirmemail':
          return false
        case 'forgotpasswordsuccess':
          return false
        case 'resetpasswordsuccess':
          return false
        case 'resetpassword':
          return false
        case 'oauth login error':
          return false
        case '404':
          return false
      }
      return true
    },
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
    drawer: null,
    name: '',
    loading: false,
    items: [
      { title: 'Dashboard', icon: 'mdi-view-dashboard', link: '/dashboard' },
      { title: 'Settings', icon: 'mdi-account-cog', link: '/settings' },
    ],
    //
  }),
  methods: {
    go(link) {
      if (this.$router.currentRoute.name !== link) {
        this.$router.replace(link)
      }
    },
    async logout() {
      console.log('trigger')
      this.loading = true
      await authService.logout()
      this.loading = false
      this.$router.replace('/login')
    }
  }
};
</script>
