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
              <v-card-title>Resend Confirmation Email</v-card-title>
            </v-img>
          </v-card>
          <v-form
            @keyup.native.enter="validate"
            class="pa-3"
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
              Resend Confirmation Email
            </v-btn>
          </v-form>

          <v-divider>
          </v-divider>
          <router-link to="/login">
            <p class="text-center pa-3">
                Login
            </p>
          </router-link>
        </v-sheet>
      </v-col>
    </v-row>
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
    {{ errorMessage }}
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
      errorMessage: '',
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
          const response = await authService.resendEmail(data)
          if (response.success) {
            bus.$emit('resendEmailSuccess', response)
          } else {
            this.errorMessage = response.error
            bus.$emit('resendEmailFailure', {})
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
