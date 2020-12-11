<template>
  <v-container fluid>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      required
    ></v-text-field>

    <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="validate"
    >
      Submit
    </v-btn>

  </v-form>
  <v-snackbar
    v-model="forgotPasswordSuccess"
    top
    color="green"
    >
    Email Sent!
  </v-snackbar>
  <v-snackbar
    color="red"
    top
    v-model="forgotPasswordFailure"
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
      forgotPasswordSuccess: false,
      forgotPasswordFailure: false,
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
      bus.$on('forgotPasswordSuccess', (event) => {
        this.forgotPasswordSuccess = true
        console.log(event)
      }) 
      bus.$on('forgotPasswordFailure', (event) => {
        console.log(event)
        this.forgotPasswordFailure = true
      }) 
    },
    methods: {
      async validate () {
        if (this.$refs.form.validate()) {
          
          const data = {
            email: this.$data.email,
          }
          let response
          try {
            response = await authService.forgotPassword(data)
          } catch (e) {

            bus.$emit('forgotPasswordFailure', {})
            this.$data.valid = !this.valid
            this.$refs.form.resetValidation()
            console.log(e)
            return
          }
          console.log(response)
          if (response.success) {
            bus.$emit('forgotPasswordSuccess', response)
          }
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
