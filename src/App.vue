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
    </v-app-bar>

    <v-main>
      <!--  -->
      <router-view :key="$route.fullPath"></router-view>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
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
      }
      return true
    }
  },
  data: () => ({
    drawer: null,
    items: [
      { title: 'Register', icon: 'mdi-account-plus', link: '/register' },
      { title: 'Resend Email', icon: 'mdi-email-receive', link: '/resendconfirmemail' },
      { title: 'Login', icon: 'mdi-login', link: '/login' },
      { title: 'Forgot Password', icon: 'mdi-lock-alert', link: '/forgotpassword' },
      { title: 'Logout', icon: 'mdi-logout', link: '/logout' },
      { title: 'Profile', icon: 'mdi-account', link: '/me' },
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
