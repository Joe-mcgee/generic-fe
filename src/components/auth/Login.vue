<template>
  <Card
    title="Login"
    >
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
        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="validate"
        >
          Sign In
        </v-btn>
          <span>
            <router-link to="/register">Register</router-link>
          </span>
      </v-form>
    <v-divider>
    </v-divider>
    <OAuth
      id="google"
      name="Google"
      icon="mdi-google"
    />
    <OAuth
      id="facebook"
      name="Facebook"
      icon="mdi-facebook"
    />
    <v-divider>
    </v-divider>
    <router-link to="/forgotpassword">
      <p class="text-center pa-3">
          Forgot Password?
      </p>
    </router-link>
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
    </Card>
</template>
<script>
import Card from '@/components/Card.vue'
import authService from '@/services/auth-service.js'

import OAuth from '@/components/auth/OAuth.vue'

import { bus } from '@/main.js'

export default {
    components: {
      Card,
      OAuth,
    },
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
      bus.$on('loginSuccess', () => {
        this.loginSuccess = true
      }) 
      bus.$on('loginFailure', () => {
        this.loginFailure = true
      })

      console.log(this.$route.query)
      if (this.$route.query) {
        if ('success' in this.$route.query) {
          if (this.$route.query.success === 'false') {
            this.errorMessage = this.$route.query.error
            this.loginFailure = true
          }
        }
      }
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
            this.$router.push({name: 'dashboard', params: {'token':response.token}})
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
