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
    <AppBar
      v-if="showNavigation"
      />
    <v-main>
      <!--  -->
      <router-view :key="$route.fullPath"></router-view>
    </v-main>
  </v-app>
</template>

<script>
import AppBar from '@/components/AppBar.vue'
import { bus } from '@/main.js'
export default {
  name: 'App',
  components: {
    AppBar
  },
  data: () => ({
    hasCookie: false,
    drawer: null,
    items: [
      { title: 'Dashboard', icon: 'mdi-view-dashboard', link: '/dashboard' },
      { title: 'Settings', icon: 'mdi-account-cog', link: '/settings' },
    ],
    //
  }),
  created() {
    bus.$on('toggle-drawer', () => {
      this.drawer = !this.drawer
    })
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
  methods: {
    go(link) {
      if (this.$router.currentRoute.name !== link) {
        this.$router.replace(link)
      }
    },
  }
};
</script>
