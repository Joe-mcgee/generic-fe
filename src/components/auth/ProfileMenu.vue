<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          fab
          small
          outlined
          dark
          v-bind="attrs"
          v-on="on"
        >
        <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <img
                src="https://cdn.vuetifyjs.com/images/john.jpg"
                alt="John"
              >
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{name}}</v-list-item-title>
              <v-list-item-subtitle>{{email}}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn
                :class="fav ? 'red--text' : ''"
                icon
                @click="fav = !fav"
              >
                <v-icon>mdi-heart</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>
    <v-list>
          <v-list-item
            v-for="(options, i) in options"
            :key="i"
            link
            @click="go(options.link)"
          >
            <v-list-item-title v-text="options.title"></v-list-item-title>

            <v-list-item-icon>
              <v-icon v-text="options.icon"></v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item
            link
            @click="logout()"
          >
            <v-list-item-title v-text="'Logout'"></v-list-item-title>

            <v-list-item-icon>
              <v-icon v-text="'mdi-logout'"></v-icon>
            </v-list-item-icon>
          </v-list-item>
    </v-list>

      </v-card>
    </v-menu>
  </div>
</template>
<script>

import authService from '@/services/auth-service.js'

//import Logout from '@/components/auth/Logout.vue'
  export default {
    components: {
      //Logout
    },
    data: () => ({
      fav: true,
      menu: false,
      message: false,
      hints: true,
      name: '',
      email: '',
      role: '',
      options: [
        { title: 'Update Profile', icon: 'mdi-account', link: '/me' },
        { title: 'Update Password', icon: 'mdi-lock-plus', link: '/updatepassword' },
      ]    
    }),
    async created() {
      const response = await authService.getMe()
      console.log(response)
      if (response.success == true) {
        this.name = response.data.name
        this.email = response.data.email
        this.role = response.data.role
      } else {
        this.name = "no user detected"
      }
    },
    methods: {
      go(link) {
        if (this.$router.currentRoute.name !== link) {
          this.$router.replace(link)
        }
      },
      async logout() {
        await authService.logout()
        this.$router.replace('/login')
      }
    }
  }
</script>
