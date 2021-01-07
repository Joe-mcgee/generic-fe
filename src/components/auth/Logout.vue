<template>
  <div class="text-center">
    <span class="subtitle-1 pr-5"><i>Welcome, </i>{{name}}</span>
      <v-btn
        icon
        large
        outlined
        @click="logout"
        >
        <v-icon>
          mdi-logout
        </v-icon>
      </v-btn>
  </div>
</template>
<script>

import { bus } from '@/main.js'
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
      bus.$on('update-profile', (data) => {
        this.name = data.name
      }) 
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
