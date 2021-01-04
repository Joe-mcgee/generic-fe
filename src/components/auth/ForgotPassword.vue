<template>
  <v-container
    fluid
    fill-height>

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
              <v-card-title>Forgot Password</v-card-title>
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
              block
              :disabled="!valid"
              color="success"
              class="mr-4"
              @click="validate"
            >
              Reset Password
            </v-btn>
          </v-form>
        </v-sheet>
      </v-col>
    </v-row>
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
    {{ errorMessage }}
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
          const response = await authService.forgotPassword(data)
          if (response.success) {
            bus.$emit('forgotPasswordSuccess', response)
          } else {
            this.errormessage = response.error
            bus.$emit('forgotPasswordFailure', {})
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
