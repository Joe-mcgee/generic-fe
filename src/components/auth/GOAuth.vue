<template>
  <v-container>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-btn
        :disabled="!valid"
        color="success"
        class="mr-4"
        @click="validate"
      >
        Login with Google
      </v-btn>
    </v-form>

    <v-snackbar
      v-model="registerSuccess"
      top
      color="green"
      >
      Google Auth Success
    </v-snackbar>
    <v-snackbar
      color="red"
      top
      v-model="registerFailure"
      >
      Google Auth fail
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
      if (this.$refs.form.validate()) {
        
        let response
        let data
        try {
            response = await authService.googleLogin(data)
            console.log(response)
        } catch (e) {

          bus.$emit('registerFailure', {})
          this.$data.valid = !this.valid
          this.$refs.form.resetValidation()
          console.log(e)
          return
        }

        if (response.success) {
          bus.$emit('registerSuccess', response)
        }
      }
    },
  }

}
</script>
