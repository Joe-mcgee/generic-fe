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
    v-model="resendEmailSuccess"
    top
    color="green"
    >
    Email Sent!
  </v-snackbar>
  <v-snackbar
    color="red"
    top
    v-model="resendEmailFailure"
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
      resendEmailSuccess: false,
      resendEmailFailure: false,
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
      bus.$on('resendEmailSuccess', (event) => {
        this.resendEmailSuccess = true
        console.log(event)
      }) 
      bus.$on('resendEmailFailure', (event) => {
        console.log(event)
        this.resendEmailFailure = true
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
            response = await authService.resendEmail(data)
          } catch (e) {

            bus.$emit('resendEmailFailure', {})
            this.$data.valid = !this.valid
            this.$refs.form.resetValidation()
            console.log(e)
            return
          }
          console.log(response)
          if (response.success) {
            bus.$emit('resendEmailSuccess', response)
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
