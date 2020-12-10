<template>
  <v-container>
    <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="validate"
    >
      Submit
    </v-btn>
  <v-snackbar
    v-model="logoutSuccess"
    top
    color="green"
    >
    Logout Success
  </v-snackbar>
  <v-snackbar
    color="red"
    top
    v-model="logoutFailure"
    >
    Oops! Something went wrong
  </v-snackbar>
  </v-container>
</template>
<script>
import authService from '@/services/auth-service.js'
import { bus } from '@/main.js'
  export default {
    data: () => ({
      logoutSuccess: false,
      logoutFailure: false,
      show1: false,
      password: '',
      passwordRules: {
        required: value => !!value || 'Required.',
      },
      valid: true,
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
    }),
    created() {
      bus.$on('logoutSuccess', (event) => {
        this.logoutSuccess = true
        console.log(event)
      }) 
      bus.$on('logoutFailure', (event) => {
        console.log(event)
        this.logoutFailure = true
      }) 
    },
    methods: {
      async validate () {
          let response
          try {
            response = await authService.logout()
          } catch (e) {

            bus.$emit('logoutFailure', {})
            this.$data.valid = !this.valid
            this.$refs.form.resetValidation()
            console.log(e)
            return
          }

          if (response.success) {
            bus.$emit('logoutSuccess', response)
          }
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      },
    },
  }
</script>
