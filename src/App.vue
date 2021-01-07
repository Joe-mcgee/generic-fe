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
      <Logout />
    </v-app-bar>

    <v-main>
      <!--  -->
      <router-view :key="$route.fullPath"></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Logout from '@/components/auth/Logout.vue'
export default {
  name: 'App',
  components: {
    Logout,
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
      }
      return true
    }
  },
  data: () => ({
    drawer: null,
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
    }
  }
};
</script>
