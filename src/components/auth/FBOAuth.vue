<template>
  <v-container>
      <v-btn
        block
        :disabled="!valid"
        color="indigo"
        outlined
        class="mr-4"
        @click="validate"
      >
        <v-icon
          left
          dark
          >
          mdi-facebook
        </v-icon>
        Login with Facebook
      </v-btn>

    <v-snackbar
      v-model="registerSuccess"
      top
      color="green"
      >
      Facebook Auth Success
    </v-snackbar>
    <v-snackbar
      color="red"
      top
      v-model="registerFailure"
      >
      Facebook Auth fail
    </v-snackbar>
  </v-container>
</template>
<script>
import authService from '@/services/auth-service.js'
import { bus } from '@/main.js'
export default {
  data: () => ({
    valid: true,
    registerSuccess: false,
    registerFailure: false,
  }),
    created() {
      bus.$on('registerSuccess', (event) => {
        this.loginSuccess = true
        console.log(event)
      }) 
      bus.$on('registerFailure', (event) => {
        console.log(event)
        this.loginFailure = true
      }) 
    },
  methods: {
    async validate () {
        let response
        let data
        try {
            response = await authService.facebookLogin(data)
            console.log(response)
        } catch (e) {

          bus.$emit('registerFailure', {})
          this.$data.valid = !this.valid
          console.log(e)
          return
        }

        if (response.success) {
          bus.$emit('registerSuccess', response)
        }
    },
  }

}
</script>
