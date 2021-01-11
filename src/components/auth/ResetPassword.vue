<template>
  <Card
    title="Reset Password"
    >
    <v-form
      @keyup.native.enter="validate"
      class="pa-3"
      ref="form"
      v-model="valid"
      lazy-validation
      >

      <v-text-field
        v-model="password"
        :type="show1 ? 'text' : 'password'"
        :rules="[passwordRules.required]"
        name="input-10-1"
        label="Password"
        >
        <template
          v-slot:append
          >
            <v-icon
              tabindex="-1"
              @click="show1 = !show1"
              >
              {{show1 ? 'mdi-eye' : 'mdi-eye-off'}}
            </v-icon>
        </template>
      </v-text-field>

      <v-text-field
        v-model="rePassword"
        :type="show2 ? 'text' : 'password'"
        :rules="[passwordRules.required, passwordRules.min, passwordMatch]"
        name="input-10-2"
        label="Repeat Password"
        >
        <template
          v-slot:append
          >
            <v-icon
              tabindex="-1"
              @click="show2 = !show2"
              >
              {{show2 ? 'mdi-eye' : 'mdi-eye-off'}}
            </v-icon>
        </template>
      </v-text-field>
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

    <v-divider>
    </v-divider>
      <p class="text-center pa-3">
        <router-link to="/login">
          Login
        </router-link>
      </p>
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
    {{errorMessage}}
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
    errorMessage: '',
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
        const response = await authService.resetPassword(data)
          if (response.success) {
            bus.$emit('resetPasswordSuccess', response)
            this.$router.push('/resetpasswordsuccess')
            
          } else {
            this.errorMessage = response.error
            bus.$emit('resetPasswordFailure', response)

          }
          bus.$emit('resetPasswordFailure', response)
      }
    }
  }
}

</script>
