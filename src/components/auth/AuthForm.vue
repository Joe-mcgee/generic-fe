<template>
  <v-form
      @keyup.native.enter="validate"
      class="pa-3"
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-text-field
        v-if="showName"
        v-model="name"
        :counter="100"
        :rules="nameRules"
        label="Name"
        required
        >{{name.length >= 1 ? name : '' }}</v-text-field>

      <v-text-field
        v-if="showEmail"
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        counter
        required
        >{{email.length >= 1 ? email : ''}}</v-text-field>


      <v-text-field
        v-if="showCurrentPassword"
        v-model="currentPassword"
        :rules="[passwordRules.required, passwordRules.min]"
        :type="eyeShow0 ? 'text' : 'password'"
        name="input-10-1"
        label="Current Password"
        >
        <template
          v-slot:append
          >
            <v-icon
              tabindex="-1"
              @click="eyeShow0 = !eyeShow0"
              >
              {{eyeShow0 ? 'mdi-eye' : 'mdi-eye-off'}}
            </v-icon>
        </template>
      </v-text-field>

      <v-text-field
        v-if="showPassword"
        v-model="password"
        :rules="[passwordRules.required, passwordRules.min]"
        :type="eyeShow1 ? 'text' : 'password'"
        name="input-10-1"
        label="Password"
        hint="At least 6 characters"
        counter
        >
        <template
          v-slot:append
          >
            <v-icon
              tabindex="-1"
              @click="eyeShow1 = !eyeShow1"
              >
              {{eyeShow1 ? 'mdi-eye' : 'mdi-eye-off'}}
            </v-icon>
        </template>
      </v-text-field>
      

      <v-text-field
        v-if="showRePassword"
        v-model="rePassword"
        :rules="[passwordRules.required, passwordRules.min, passwordMatch]"
        :type="eyeShow2 ? 'text' : 'password'"
        name="input-10-2"
        label="Repeat Password"
        hint="At least 6 characters"
        class="input-group--focused"
        counter
      >
        <template
          v-slot:append
          >
            <v-icon
              tabindex="-1"
              @click="eyeShow2 = !eyeShow2"
              >
              {{eyeShow2 ? 'mdi-eye' : 'mdi-eye-off'}}
            </v-icon>
        </template>

      </v-text-field>


      <v-checkbox
        v-if="showCheckbox"
        v-model="checkbox"
        :rules="[v => !!v || 'You must agree to continue!']"
        required
        >
        <span slot="label">
          <a
            tabindex="-1"
            @click.stop
            target="_blank"
            href="#">Terms and Conditions</a></span>
      </v-checkbox>

      <v-btn
        block
        :disabled="!valid"
        color="success"
        class="mr-4"
        @click="validate"
      >
      {{title}}
      </v-btn>
      <v-snackbar
        v-model="registerSuccess"
        top
        color="green"
        >
        {{ successMessage }}
      </v-snackbar>
      <v-snackbar
        color="red"
        top
        v-model="registerFailure"
        >
        {{ errorMessage }}
      </v-snackbar>
    </v-form>
</template>
<script>
import authService from '@/services/auth-service.js'
import { bus } from '@/main.js'
  export default {
    props: {
      mode: String
    },
    data: () => ({
      title: '',
      modeOptions: {
        REGISTER: 'register',
        EDITPROFILE: 'me',
        EDITPROFILEOAUTH: 'oauth-me',
        EDITPASSWORD: 'updatepassword'
      },
      registerSuccess: false,
      registerFailure: false,
      eyeShow0: false,
      eyeShow1: false,
      eyeShow2: false,
      currentPassword: '',
      showCurrentPassword: false,
      password: '',
      showPassword: false,
      rePassword: '',
      showRePassword: false,
      passwordRules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 6 || 'Min 6 characters',
      },
      valid: true,
      name: '',
      showName: false,
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 100) || 'Name must be less than 100 characters',
      ],
      email: '',
      showEmail: false,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      checkbox: false,
      showCheckbox: false,
      userId: null,
      errorMessage: '',
      successMessage: '',
    }),
    async created() {
      bus.$on('registerSuccess', () => {
        this.registerSuccess = true
      }) 
      bus.$on('registerFailure', () => {
        this.registerFailure = true
      })
      
      let response;

      let modeSwitch = this.$props.mode ? this.$props.mode : this.$router.currentRoute.name
      switch (modeSwitch) {
        case 'register':
          this.showName = true
          this.showEmail = true
          this.showPassword = true
          this.showRePassword = true
          this.showCheckbox = true
          this.title = 'Register'
          break
        case 'me':
          this.showName = true
          this.showEmail = true
          this.title = 'Update Profile'
          response = await authService.getMe()
          if (response.success == true) {
              this.name = response.data.name
              this.email = response.data.email
              this.userId = response.data['_id']
          }
          break
        case 'oauth-me':
          this.showName = true
          this.title = 'Update Profile'
          response = await authService.getMe()
          if (response.success == true) {
            this.name = response.data.name
            this.email = response.data.email

          }
          break
        case 'updatepassword':
          this.title = 'Update Password'
          this.showCurrentPassword = true
          this.showPassword = true
          this.showRePassword = true
          break
      }
    },
    computed: {
      passwordMatch() {
        return () => (this.password === this.rePassword) || 'Password must match'
      }
    },
    methods: {
      async validate () {
        if (this.$refs.form.validate()) {
          
          let response
          let data
            switch (this.$props.mode) {
              case this.modeOptions.REGISTER:
                data = {
                  name: this.$data.name,
                  email: this.$data.email,
                  password: this.$data.password,
                  role: 'user'
                }
                response = await authService.register(data)
                if (response.success) {
                  this.successMessage = 'Registration Successful'
                  bus.$emit('registerSuccess', response)
                  this.$router.replace('/registersuccess')
                } else {
                  this.errorMessage = response.error
                  bus.$emit('registerFailure', {})
                  this.$data.valid = !this.valid
                  this.$refs.form.resetValidation()
                }
                return
              case this.modeOptions.EDITPROFILE:
                data = {
                  name: this.name,
                  email: this.email
                }
                response = await authService.updateDetails(data)
                if (response.success) {

                  this.successMessage = 'Profile Update Successful'
                  this.registerSuccess = true
                  bus.$emit('update-profile', response.data)
                } else {
                  this.errorMessage = response.error
                  bus.$emit('registerFailure', {})
                  this.valid = !this.valid
                  this.$refs.form.resetValidation()
                }
                return
              case this.modeOptions.EDITPROFILEOAUTH:
                data = {
                  name: this.name,
                  email: this.email
                }
                response = await authService.updateDetails(data)
                if (response.success) {

                  this.successMessage = 'Profile Update Successful'
                  this.registerSuccess = true
                  bus.$emit('update-profile', response.data)
                } else {
                  this.errorMessage = response.error
                  bus.$emit('registerFailure', {})
                  this.$data.valid = !this.valid
                  this.$refs.form.resetValidation()
                }
                return
              case this.modeOptions.EDITPASSWORD:
                data = {
                  currentPassword: this.$data.currentPassword,
                  newPassword: this.$data.password
                }
                response = await authService.updatePassword(data)
                this.successMessage = 'Update Password Successful'
                if (response.success) {
                  this.registerSuccess = true
                } else {
                  this.errorMessage = response.error
                  bus.$emit('registerFailure', {})
                  this.$data.valid = !this.valid
                  this.$refs.form.resetValidation()
                }
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
