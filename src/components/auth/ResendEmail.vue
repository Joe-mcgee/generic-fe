<template>
  <Card title="Resend Confirmation Email">
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
        :loading="loading"
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
    <p class="text-center pa-3">
      <router-link to="/login">
        Login
      </router-link>
    </p>
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
  </Card>
</template>
<script>
import Card from '@/components/Card.vue'
import authService from '@/services/auth-service.js'
import { bus } from '@/main.js'
  export default {
    components: {
      Card
    },
    data: () => ({
      loading: false,
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
          this.loading = true
          const data = {
            email: this.$data.email,
          }
          const response = await authService.resendEmail(data)
          if (response.success) {
            this.loading = false
            bus.$emit('resendEmailSuccess', response)
          } else {
            this.loading = false
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
