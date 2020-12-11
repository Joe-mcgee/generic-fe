<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      mobile-breakpoint="500"
      bottom
      app
    >
      <!--  -->
      <v-list
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

    <v-app-bar app>
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

  data: () => ({
    drawer: null,
    items: [
      { title: 'Register', icon: 'mdi-account-plus', link: 'register' },
      { title: 'Login', icon: 'mdi-login', link: 'login' },
      { title: 'Logout', icon: 'mdi-logout', link: 'logout' },
      { title: 'Profile', icon: 'mdi-account', link: 'me' },
      { title: 'Reset Password', icon: 'mdi-account-key', link:'updatepassword' }
    ],
    //
  }),
  methods: {
    go(link) {
      if (this.$router.currentRoute.name !== link) {
        this.$router.push(link)
      }
    }
  }
};
</script>
