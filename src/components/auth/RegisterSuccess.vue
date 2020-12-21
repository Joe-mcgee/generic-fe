<template>
  <v-container
    fluid
    fill-height
    >
    <v-row
      align="center"
      justify="center"
      height="100vh"
      >
      <v-col
        cols="12"
        sm="6"
        md="4"
        lg="3"
        >
        <v-sheet
          color="grey lighten-5"
          elevation="6"
          >
          <v-card>
            <v-img
              src="@/assets/Flower-Life.jpg"
              class="white--text align-end"
              >
              <v-card-title>Registration Success!</v-card-title>
            </v-img>
          </v-card>
          <p class="text-center ma-1 pa-3">
            Thank you for registering! Please find a comfirmation link in your provided email
          </p>
          <v-divider>
          </v-divider>
          <p class="text-center ma-1 pa-3">
          <router-link to="/resendconfirmemail">
            Resend Confirmation Email
          </router-link>
          </p>
        </v-sheet>
      </v-col>
    </v-row>
  <v-snackbar
    v-model="loginSuccess"
    top
    color="green"
    >
    Login Success
  </v-snackbar>
  <v-snackbar
    color="red"
    top
    v-model="loginFailure"
    >
    {{errorMessage}}
  </v-snackbar>
  </v-container>
</template>
<script>
import authService from '@/services/auth-service.js'
import { bus } from '@/main.js'
  export default {
    data: () => ({
      loginSuccess: false,
      loginFailure: false,
      show1: false,
      valid: true,
      password: '',
      passwordRules: {
        required: value => !!value || 'Required.',
      },
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      errorMessage: '',
    }),
    created() {
      bus.$on('loginSuccess', (event) => {
        this.loginSuccess = true
        console.log(event)
      }) 
      bus.$on('loginFailure', (event) => {
        console.log(event)
        this.loginFailure = true
      }) 
    },
    methods: {
      async validate () {
        if (this.$refs.form.validate()) {
          
          const data = {
            email: this.$data.email,
            password: this.$data.password,
          }
          const response = await authService.login(data)
          if (response.success) {
            bus.$emit('loginSuccess', response)
            this.$router.replace('/dashboard')
          } else {
            this.errorMessage = response.error
            bus.$emit('loginFailure', {})
            this.$data.valid = !this.valid
            this.$refs.form.resetValidation()
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
