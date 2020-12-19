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
          <v-form
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
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[passwordRules.required]"
              :type="show1 ? 'text' : 'password'"
              name="input-10-1"
              label="Password"
              @click:append="show1 = !show1"
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
          <GOAuth />
          <FBOAuth />
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
    Oops! Something went wrong
  </v-snackbar>
  </v-container>
</template>
<script>
import authService from '@/services/auth-service.js'
import GOAuth from '@/components/auth/GOAuth.vue'
import FBOAuth from '@/components/auth/FBOAuth.vue'
import { bus } from '@/main.js'
  export default {
    components: {
      GOAuth,
      FBOAuth,

    },
    data: () => ({
      loginSuccess: false,
      loginFailure: false,
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
          let response
          try {
            response = await authService.login(data)
          } catch (e) {

            bus.$emit('loginFailure', {})
            this.$data.valid = !this.valid
            this.$refs.form.resetValidation()
            console.log(e)
            return
          }

          if (response.success) {
            bus.$emit('loginSuccess', response)
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
