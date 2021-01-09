<template>
  <v-form
      @keyup.native.enter="validate"
      class="pa-3"
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-text-field
        v-if="mode !== modeOptions.EDITPASSWORD"
        v-model="name"
        :counter="100"
        :rules="nameRules"
        label="Name"
        required
        >{{name.length >= 1 ? name : '' }}</v-text-field>

      <v-text-field
        v-if="mode !== modeOptions.EDITPASSWORD"
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        counter
        required
        >{{email.length >= 1 ? email : ''}}</v-text-field>


      <v-text-field
        v-if="mode === modeOptions.EDITPASSWORD"
        v-model="currentPassword"
        :rules="[passwordRules.required, passwordRules.min]"
        :type="show0 ? 'text' : 'password'"
        name="input-10-1"
        label="Current Password"
        >
        <template
          v-slot:append
          >
            <v-icon
              tabindex="-1"
              @click="show0 = !show0"
              >
              {{show0 ? 'mdi-eye' : 'mdi-eye-off'}}
            </v-icon>
        </template>
      </v-text-field>

      <v-text-field
        v-if="mode !== modeOptions.EDITPROFILE"
        v-model="password"
        :rules="[passwordRules.required, passwordRules.min]"
        :type="show1 ? 'text' : 'password'"
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
              @click="show1 = !show1"
              >
              {{show1 ? 'mdi-eye' : 'mdi-eye-off'}}
            </v-icon>
        </template>
      </v-text-field>
      

      <v-text-field
        v-if="mode !== modeOptions.EDITPROFILE"
        v-model="rePassword"
        :rules="[passwordRules.required, passwordRules.min, passwordMatch]"
        :type="show2 ? 'text' : 'password'"
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
              @click="show2 = !show2"
              >
              {{show2 ? 'mdi-eye' : 'mdi-eye-off'}}
            </v-icon>
        </template>

      </v-text-field>


      <v-checkbox
        v-if="mode === modeOptions.REGISTER"
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
      <DeleteUser
        :id="userId"
        v-if="mode === modeOptions.EDITPROFILE"/>
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
import DeleteUser from '@/components/auth/DeleteUser.vue'
import authService from '@/services/auth-service.js'
import { bus } from '@/main.js'
  export default {
    components: {
      DeleteUser,
    },
    props: {
      mode: String
    },
    data: () => ({
      title: '',
      modeOptions: {
        REGISTER: 'register',
        EDITPROFILE: 'me',
        EDITPASSWORD: 'updatepassword'
      },
      registerSuccess: false,
      registerFailure: false,
      show0: false,
      show1: false,
      show2: false,
      currentPassword: '',
      password: '',
      rePassword: '',
      passwordRules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 6 || 'Min 6 characters',
      },
      valid: true,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 100) || 'Name must be less than 100 characters',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      checkbox: false,
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
          this.$props.mode = this.modeOptions.REGISTER
          this.title = 'Register'
          break
        case 'me':
          this.title = 'Update Profile'
          this.$props.mode = this.modeOptions.EDITPROFILE
          response = await authService.getMe()
          if (response.success == true) {
              this.name = response.data.name
              this.email = response.data.email
              this.userId = response.data['_id']
          }
          break
        case 'updatepassword':
          this.title = 'Update Password'
          this.$props.mode = this.modeOptions.EDITPASSWORD
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
                  name: this.$data.name,
                  email: this.$data.email
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