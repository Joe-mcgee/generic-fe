<template>
  <Card
    title="Forgot Password"
  >
    <v-form
      @keyup.native.enter="validate"
      @submit.prevent
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
        :loading="loading"
        :disabled="!valid"
        color="success"
        class="mr-4"
        @click="validate"
      >
        Reset Password
      </v-btn>
    </v-form>
    <v-divider>
    </v-divider>
      <p class="text-center pa-3">
        <router-link to="/login">
          Login
        </router-link>
      </p>
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
  </Card>
</template>
<script>
import Card from '@/components/Card.vue'
import authService from '@/services/auth-service.js'
import { bus } from '@/main.js'
  export default {
    components: {
      Card,
    },
    data: () => ({
      loading: false,
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
          this.loading = true
          const data = {
            email: this.$data.email,
          }
          const response = await authService.forgotPassword(data)
          if (response.success) {
            this.loading = false
            bus.$emit('forgotPasswordSuccess', response)
            this.$router.push('/forgotpasswordsuccess')
          } else {
            this.loading = false
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
