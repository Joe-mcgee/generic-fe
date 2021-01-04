<template>
  <v-container>
    <v-form
      @keyup.native.enter="validate"
      ref="form"
      v-model="valid"
      lazy-validation
      >
    <v-text-field
      v-model="password"
      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[passwordRules.required, passwordRules.min]"
      :type="show1 ? 'text' : 'password'"
      name="input-10-1"
      label="Password"
      hint="At least 8 characters"
      counter
      @click:append="show1 = !show1"
      ></v-text-field>
    

    <v-text-field
      v-model="rePassword"
      :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[passwordRules.required, passwordRules.min, passwordMatch]"
      :type="show2 ? 'text' : 'password'"
      name="input-10-2"
      label="Repeat Password"
      hint="At least 8 characters"
      class="input-group--focused"
      counter
      @click:append="show2 = !show2"
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
    v-model="resetPasswordSuccess"
    top
    color="green"
    >
    Reset Password Success!
  </v-snackbar>
  <v-snackbar
    color="red"
    top
    v-model="resetPasswordFailure"
    >
    Opps! Something went wrong
  </v-snackbar>
  </v-container>
</template>
<script>

import authService from '@/services/auth-service.js'
import { bus } from '@/main.js'
export default {
  data: () => ({
    password: '',
    rePassword: '',
    show1: false,
    show2: false,
    resetPasswordSuccess: false,
    resetPasswordFailure: false,
    passwordRules: {
      required: value => !!value || 'Required.',
      min: v => v.length >= 6 || 'Min 6 characters',
    },
    valid: true,
  }),
  async created() {
    bus.$on('resetPasswordSuccess', (event) => {
      this.resetPasswordSuccess = true
      console.log(event)
    }) 
    bus.$on('resetPasswordFailure', (event) => {
      console.log(event)
      this.resetPasswordFailure = true
    })
    console.log(this.$router.currentRoute)
  },
  computed: {
    passwordMatch() {
      return () => (this.password === this.rePassword) || 'Password must match'
    }
  },
  methods: {
    async validate() {
      if (this.$refs.form.validate()) {
        const data = {
          resettoken: this.$route.params.resettoken,
          password: this.password
        }
        let response
        try {
          response = await authService.resetPassword(data)
          if (response.success) {
            bus.$emit('resetPasswordSuccess', response)
          } else {
            bus.$emit('resetPasswordFailure', response)
          }
        } catch (e) {
          bus.$emit('resetPasswordFailure', response)
        }
      }
    }
  }
}

</script>
